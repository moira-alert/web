import {UniqList} from '../models/core';
import {Trigger, ITriggerJson} from '../models/trigger';
import {State} from '../models/state';
import {TagList, Tag, TagFilter} from '../models/tag';
import {Api} from '../services/api';
import {GoTo} from './goto';

export interface ITriggerScope extends ng.IScope {
	tags: TagList;
	trigger: Trigger;
	float_re: RegExp;
	watch_raising: boolean;
	tags_filter: TagFilter;
	trigger_form: ng.IFormController;
	warn_invalid_message: string;
	error_invalid_message: string;
	trigger_ttl_selection: boolean;
	advanced_mode: boolean;
	duplicate_link: string;
	itemsList: Array<string>;
	targetChange:() => void;
	targetFocus:() => void;
}

export class TriggerController extends GoTo {

	static $inject = ['$scope', 'api', '$routeParams', '$location', '$q'];

	constructor(private $scope: ITriggerScope, private api: Api, private $routeParams: ng.route.IRouteParamsService,
		$location: ng.ILocationService, private $q: ng.IQService) {
		super($location);
		$scope.float_re = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/;
		$scope.trigger_ttl_selection = false;
		$scope.$watch('trigger.targets.length', (value) => {
			$scope.advanced_mode = $scope.advanced_mode || value > 1
		});
		$scope.$watch('trigger.json.expression.length', (value) => {
			$scope.advanced_mode = $scope.advanced_mode || value > 0
		});
		api.tag.list().then((tags) => {
			$scope.tags = tags;
		});
		$scope.targetChange = function() {
			api.targets.list(this.target.value).then((value) => {
				if (value !== undefined) {
//					$scope.itemsList = value.list;
					this.itemsList = value.list;
				} else {
					this.itemsList = [];
				}
			});
		}
		$scope.targetFocus = function() {
			this['messagesVisible' + this.$index] = true;
		}
		$q.when().then(() => {
			if ($routeParams['triggerId']) {
				return api.tag.list().then((tags) => {
					return api.trigger.get($routeParams['triggerId']).then((json) => {
						$scope.trigger = new Trigger(json, tags);
					});
				});
			} else {
				var params = $location.search();
				var json = {
					name: params.name,
					targets: [],
					ttl: "600",
					ttl_state: 'NODATA',
					timestamp: Math.floor(Date.now() / 1000),
					tags: [],
					patterns: [],
					expression: params.expression || "",
					warn_value: params.warn_value || "",
					error_value: params.error_value || "",
				};
				if(params.target !== undefined){
					json.targets.push(params.target);
				}
				for(var i = 1; params["t" + i] !== undefined; i++){
					json.targets.push(params["t" + i]);
				}
				if(json.targets.length == 0){
					json.targets.push("");
				}
				$scope.trigger = new Trigger(<ITriggerJson>json, new TagList([]));
			}
		}).then(() => {
			$scope.tags_filter = new TagFilter($scope.trigger.tags);
			$scope.$watch('watch_raising', (newValue) => {
				this.check_values();
			});
			$scope.$watchGroup(['trigger.json.warn_value', 'trigger.json.error_value'], () => {
				$scope.trigger.warn_value.num = parseFloat($scope.trigger.json.warn_value);
				$scope.trigger.error_value.num = parseFloat($scope.trigger.json.error_value);
				$scope.watch_raising = $scope.trigger.warn_value.num <= $scope.trigger.error_value.num;
				this.check_values();
			});
			$scope.duplicate_link = "#/trigger/?" + $.param($scope.trigger.link_params());
		});
	}

	toggle_ttl_selection() {
		this.$scope.trigger_ttl_selection = !this.$scope.trigger_ttl_selection;
	}

	check_values() {
		this.$scope.warn_invalid_message = "";
		this.$scope.error_invalid_message = "";
		if (this.$scope.advanced_mode)
			return;
		if (!this.$scope.trigger_form['warn'].$valid)
			this.$scope.warn_invalid_message = "Invalid float value";
		if (!this.$scope.trigger_form['error'].$valid)
			this.$scope.error_invalid_message = "Invalid float value";
		if (this.$scope.trigger.warn_value.num <= this.$scope.trigger.error_value.num != this.$scope.watch_raising) {
			this.$scope.warn_invalid_message = this.$scope.warn_invalid_message || ("Must be " + (this.$scope.watch_raising ? "less" : "more") + " than error value");
			this.$scope.error_invalid_message = this.$scope.error_invalid_message || ("Must be " + (this.$scope.watch_raising ? "more" : "less") + " than warn value");
		}
	}

	create_tag() {
		if (this.$scope.tags_filter.value.length) {
			var tag = new Tag(this.$scope.tags_filter.value);
			this.add_tag(tag);
			this.$scope.tags.push(tag);
			this.$scope.tags_filter.value = "";
		}
	}

	add_tag(tag: Tag) {
		this.$scope.trigger.tags.push(tag);
	}

	save() {
		if (this.$scope.trigger_form.$valid && this.$scope.trigger.tags.length) {
			return this.api.trigger.save(this.$scope.trigger).then(() => {
				this.go("/");
			});
		}
	}

	set_mode(advanced: boolean) {
		if (!advanced && this.$scope.trigger.targets.length > 1)
			return;
		this.$scope.advanced_mode = advanced;
	}

	delete() {
		var trigger = this.$scope.trigger;
		return this.$q.when().then(() => {
			if (trigger.json.id == undefined) {
				return this.$q.when();
			}
			return this.api.trigger.delete(trigger.json.id);
		}).then(() => {
			this.go('/');
		});
	};

	reset_throttling(trigger: Trigger) {
		return this.api.trigger.reset_throttling(trigger.json.id).then(() => {
			trigger.json.throttling = 0;
		});
	};

	import(json: string) {
		var trigger = new Trigger(JSON.parse(json), this.$scope.tags);
		this.api.trigger.save(trigger).then(() => {
			this.go("/trigger/" + trigger.json.id);
		});
	}
}
