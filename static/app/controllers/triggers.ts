import {IAltKeyEvent} from '../models/events';
import {UniqList} from '../models/core';
import {Trigger, MetricCheck} from '../models/trigger';
import {Config} from '../models/config';
import {Settings} from '../models/settings';
import {ITagsData, Tag, TagList, TagFilter, ITagData} from '../models/tag';
import {Api} from '../services/api';
import {IPagingScope, InitPagesList} from '../models/paging';
import * as moment from "moment";

export interface ITriggersScope extends ng.IScope, IPagingScope {
	tags_filter: TagFilter;
	ok_filter: boolean;
	metric_values: any;
	tags: TagList;
	config: Config;
	settings: Settings;
	triggers: Array<Trigger>;
	show_trigger_state: string;
	show_trigger_metrics: Array<MetricCheck>;
	show_trigger: Trigger;
	show_maintenance_check: MetricCheck;
}

export class TriggersController {

	static $inject = ['$scope', '$cookies', '$location', 'api'];

	static CookieLiveSpan = 365 * 24 * 3600 * 1000;
	static TagsFilterCookie = "moira_filter_tags";
	static TagsOkFilterCookie = "moira_filter_ok";

	constructor(private $scope: ITriggersScope, $cookies: ng.cookies.ICookiesService,
		private $location: ng.ILocationService, private api: Api) {
		var saved_tags = ($cookies.get(TriggersController.TagsFilterCookie) || "").split(',').filter(function (tag: string) {
			return tag != "";
		});
		$scope.tags_filter = new TagFilter(new TagList(saved_tags));
		$scope.ok_filter = $cookies.get(TriggersController.TagsOkFilterCookie) == "true";

		$scope.metric_values = {};

		$scope.$watch('tags_filter.selection.length', (newValue: number, oldValue: number) => {
			if (newValue != oldValue) {
				$cookies.put(TriggersController.TagsFilterCookie, $scope.tags_filter.selection.to_string().join(),
					{ expires: new Date((new Date()).getTime() + TriggersController.CookieLiveSpan) });
				this.$location.search({page: 0});
				this.$scope.page = 0;
				this.load_triggers();
			}
		});

		$scope.$watch('ok_filter', (newValue: number, oldValue: number) => {
			if (newValue != oldValue) {
				$cookies.put(TriggersController.TagsOkFilterCookie, "" + $scope.ok_filter,
					{ expires: new Date((new Date()).getTime() + TriggersController.CookieLiveSpan) });
				this.$location.search({page: 0});
				this.$scope.page = 0;
				this.load_triggers();
			}
		});
		
		$scope.$on('$routeUpdate', (scope, next: ng.route.ICurrentRoute) => {
			if(this.$scope.page === parseInt(next.params['page']))
				return;
			this.$scope.page = parseInt(next.params['page']);
			this.load_triggers();
		});

		this.load_tags().then(() => {
			return api.config();
		}).then((config) => {
			$scope.config = config;
			$scope.size = (config.paging || {size : 20}).size;
			return api.settings.get();
		}).then((json) => {
			$scope.settings = new Settings(json, $scope.config);
			this.load_triggers();
		})
	}

	load_triggers() {
		var num = parseInt(this.$location.search()['page'] || 0);
		this.$scope.page = num;
		this.api.trigger.page(num, this.$scope.size).then((data) => {
			this.$scope.triggers = [];
			this.$scope.total = data.total;
			InitPagesList(this.$scope);
			angular.forEach(data.list, (json) => {
				this.$scope.triggers.push(new Trigger(json, this.$scope.tags));
			});
		});
	}

	open_trigger(trigger: Trigger, $event: IAltKeyEvent) {
		$event.stopPropagation();
		$event.preventDefault();
		this.$location.search({});
		if ($event.altKey)
			this.$location.path('/trigger/' + trigger.json.id);
		else
			this.$location.path('/events/' + trigger.json.id);
	}

	toggle_trigger_metrics(state: string, trigger: Trigger) {
		if (this.$scope.show_trigger == trigger && this.$scope.show_trigger_state == state) {
			this.$scope.show_trigger = null;
		}
		else {
			this.$scope.show_trigger_state = state;
			this.$scope.show_trigger = trigger;
			this.$scope.show_trigger_metrics = trigger.check.state_checks.get(state);
		}
	};

	load_tags() {
		return this.api.tag.list().then((tags) => {
			this.$scope.tags = tags;
			this.$scope.tags.sort((a, b) => {
				return a.value.toLowerCase().localeCompare(b.value.toLowerCase());
			});
		});
	};

	remove_filter_tag(tag: Tag) {
		this.$scope.tags_filter.selection.remove(tag);
	};

	tag_click(tag: Tag, $event: IAltKeyEvent) {
		if ($event.altKey) {
			var data: ITagData = {
				maintenance: 0
			};
			if ((tag.data.maintenance || 0) === 0) {
				data.maintenance = moment.utc().add(1, "days").unix();
			}
			this.api.tag.data(tag.value, data).then(() => {
				tag.data = data;
			});
		} else {
			if (!this.$scope.tags_filter.selection.contains(tag) && this.$scope.tags.contains(tag)) {
				this.$scope.tags_filter.selection.push(tag);
			}
		}
	};

	filter_suggestion_tag(tag: Tag) {
		return !this.$scope.tags_filter.selection.contains(tag) && this.$scope.tags.contains(tag);
	};

	export(trigger: Trigger, $event) {
		$event.currentTarget.href = trigger.get_json_content();
	}
}
