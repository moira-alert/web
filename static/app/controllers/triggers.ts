import {IAltKeyEvent} from '../models/events';
import {UniqList} from '../models/core';
import {Trigger, MetricCheck} from '../models/trigger';
import {Config} from '../models/config'; 
import {Settings} from '../models/settings'; 
import {ITagsData, Tag, TagList, TagFilter, ITagData} from '../models/tag'; 
import {Api} from '../services/api';
import {GoTo} from './goto';
import * as moment from "moment";

export interface ITriggersScope extends ng.IScope{
	tags_filter: TagFilter;
	ok_filter:boolean;
	metric_values: any;
	tags:TagList;
	config: Config;
	settings:Settings;
	triggers:Array<Trigger>;
	filter_trigger:(trigger:Trigger) => boolean;
	show_trigger_state:string;
	show_trigger_metrics:Array<MetricCheck>;
	show_trigger:Trigger;
	show_maintenance_check: MetricCheck;
	now: number;
}

export class TriggersController extends GoTo{
	
	static $inject = ['$scope', '$cookies', '$location', 'api'];
	
	static CookieLiveSpan = 365 * 24 * 3600 * 1000;
	static TagsFilterCookie = "moira_filter_tags";
	static TagsOkFilterCookie = "moira_filter_ok";
	
	constructor(private $scope: ITriggersScope, private $cookies:ng.cookies.ICookiesService,
		$location:ng.ILocationService, private api:Api){
		super($location);

		var saved_tags = ($cookies.get(TriggersController.TagsFilterCookie) || "").split(',').filter(function(tag:string){
			return tag != "";});
		$scope.tags_filter = new TagFilter(new TagList(saved_tags));
		$scope.ok_filter = $cookies.get(TriggersController.TagsOkFilterCookie) == "true";
		$scope.now = moment.utc().unix();
	
		$scope.metric_values = {};
	
		this.load_tags().then(() => {
			return api.config();
		}).then((config) => {
			$scope.config = config;
			return api.settings.get();
		})
		.then((json) => {
			$scope.settings = new Settings(json, $scope.config);
			return api.trigger.list();
		}).then((data) => {
			$scope.triggers = [];
			angular.forEach(data.list, (json) => {
				$scope.triggers.push(new Trigger(json, $scope.tags));
			});
		});
		
		$scope.filter_trigger = (trigger:Trigger) => {
			return trigger.tags.include($scope.tags_filter.selection) && 
					(!$scope.ok_filter || trigger.has_state_except("OK"));
		}
		
		$scope.$watch('tags_filter.selection.length', (newValue:number, oldValue:number) => {
			if(newValue != oldValue){
				$cookies.put(TriggersController.TagsFilterCookie, $scope.tags_filter.selection.to_string().join(),
					{ expires: new Date((new Date()).getTime() + TriggersController.CookieLiveSpan) });
			}
		});
		
		$scope.$watch('ok_filter', (newValue:number, oldValue:number) => {
			if(newValue != oldValue){
				$cookies.put(TriggersController.TagsOkFilterCookie, "" + $scope.ok_filter,
					{ expires: new Date((new Date()).getTime() + TriggersController.CookieLiveSpan) });
			}
		});
		
	}
	
	open_trigger(trigger:Trigger, $event:IAltKeyEvent){
		$event.stopPropagation();
		$event.preventDefault();
		if($event.altKey)
			this.go('/trigger/'+trigger.json.id);
		else
			this.go('/events/'+trigger.json.id);
	}

	toggle_trigger_metrics(state:string, trigger:Trigger) {
		if (this.$scope.show_trigger == trigger && this.$scope.show_trigger_state == state){
			this.$scope.show_trigger = null;
		}
		else{
			this.$scope.show_trigger_state = state;
			this.$scope.show_trigger = trigger;
			this.$scope.show_trigger_metrics = trigger.check.state_checks.get(state);
		}
	};
	
	trigger_maintenance_menu(check: MetricCheck) {
		if(check == this.$scope.show_maintenance_check){
			this.$scope.show_maintenance_check = null;
			return;
		}
		this.$scope.show_maintenance_check = check;	
	}

	load_tags() {
		return this.api.tag.list().then((tags) => {
			this.$scope.tags = tags;
			this.$scope.tags.sort((a, b) => {
				return a.value.toLowerCase().localeCompare(b.value.toLowerCase());
			});
		});
	};

	remove_filter_tag (tag:Tag) {
		this.$scope.tags_filter.selection.remove(tag);
	};

	tag_click(tag:Tag, $event:IAltKeyEvent) {
		if($event.altKey){
			var data:ITagData = {
				maintenance: 0
			};
			if((tag.data.maintenance || 0) === 0){
				data.maintenance = moment.utc().add(1, "days").unix();
			}
			this.api.tag.data(tag.value, data).then(() => {
				tag.data = data;
			}); 
		}else{
			if (!this.$scope.tags_filter.selection.contains(tag) && this.$scope.tags.contains(tag)) {
				this.$scope.tags_filter.selection.push(tag);
			}
		}
	};

	filter_suggestion_tag(tag:Tag) {
		return !this.$scope.tags_filter.selection.contains(tag) && this.$scope.tags.contains(tag);
	};
	
	remove_metric_check(trigger:Trigger, check:MetricCheck){
		this.api.trigger.remove_metric(trigger.json.id, check.metric).then(() => {
			if(trigger.check.metrics_checks.remove(check.metric) !== undefined){
				trigger.check.metric_states.get(check.state.name).count -= 1;
				trigger.check.state_checks.get(check.state.name).remove(check);
			}
		});
	};
	
	export(trigger: Trigger, $event){
		$event.currentTarget.href = trigger.get_json_content();
	}
}
