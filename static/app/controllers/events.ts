import {ExtArray} from '../models/core';
import {Event, IEventJson} from '../models/event';
import {State} from '../models/state';
import {Dictionary, NumDictionary, UniqList, IStringId} from '../models/core';
import {Api} from '../services/api';
import {TimeProvider} from '../services/time';
import {Trigger, LastCheck, MetricCheck} from '../models/trigger';
import {IPagingScope, InitPagesList} from '../models/paging';
import * as moment from 'moment';

enum Tab { Current = 0, Total = 1 };

class StateSummary {
	sum: number = 0;
	percent: number;
	width: number;
	text: string;
	constructor(public state: State, public timestamp: number) {
		this.sum = 0;
	}
}

class MetricEvents implements IStringId {
	events: ExtArray<Event>;

	constructor(public metric: string) {
		this.events = new ExtArray<Event>();
	}

	id(): string {
		return this.metric;
	}
}

class MetricSummary implements IStringId {
	total: number = 0;
	states = new Dictionary<StateSummary>();
	last: StateSummary;
	list: Array<StateSummary> = [];

	constructor(public metric: string) { }

	id(): string {
		return this.metric;
	}

	add(event: Event) {
		var json = event.json;
		var old_state_summary = this.states.getOrCreate(json.old_state, new StateSummary(event.old_state, json.timestamp));
		var state_summary = this.states.getOrCreate(json.state, new StateSummary(event.state, json.timestamp));
		this.last = state_summary;
		state_summary.timestamp = json.timestamp;
		var delta = state_summary.timestamp - old_state_summary.timestamp;
		old_state_summary.sum += delta;
		this.total += delta;
	}

	commit(now: number) {
		this.total += now - this.last.timestamp;
		this.states.get(this.last.state.name).sum += now - this.last.timestamp;
		angular.forEach(this.states.dict, (summary, name) => {
			summary.percent = Math.floor(summary.sum / this.total * 1000) / 10;
			summary.text = summary.percent < 1 ? "" : ("" + Math.round(summary.percent) + "%");
		});
		angular.forEach(this.states.dict, (summary, name) => {
			if (summary.percent > 0) {
				this.list.push(summary);
				if (summary.percent < 3) {
					this.total -= summary.sum;
					summary.sum = 0.03 * this.total;
					this.total += summary.sum;
				}
			}
		});
		angular.forEach(this.states.dict, (summary, name) => {
			summary.width = summary.sum / this.total * 90;
		});
		this.list.sort((summary) => { return summary.state.weight; })
	}
}

export interface IEventsScope extends ng.IScope, IPagingScope {
	metrics_history: UniqList<MetricEvents>
	metrics_summary: UniqList<MetricSummary>;
	trigger: Trigger;
	tab: Tab;
	show_maintenance_check: MetricCheck;
	current_state_sort: string;
}

interface ITabExtension extends JQuery {
	tabs();
}

export class EventsController {

	private triggerId: string;
	static $inject = ['$scope', 'api', 'time', '$routeParams', '$location', '$route'];

	constructor(private $scope: IEventsScope,
		private api: Api,
		private timeProvider: TimeProvider,
		private $routeParams: ng.route.IRouteParamsService,
		private $location: ng.ILocationService,
		private $route: ng.route.IRouteService) {
		$scope.tab = parseInt($routeParams['tab'] || 0);
		$scope.page = parseInt($location.search()['page'] || 0);
		$scope.current_state_sort = '-event_timestamp.date';
		var lastRoute = $route.current;
		$scope.$on('$routeUpdate', (scope, next: ng.route.ICurrentRoute) => {
			$scope.tab = parseInt(next.params['tab'] || 0);
			if ($scope.page === parseInt(next.params['page'] || 0))
				return;
			$scope.page = parseInt(next.params['page'] || 0);
			this.load_events();
		});
		this.triggerId = $routeParams['triggerId'] || '';
		api.config().then((config) => {
			$scope.size = (config.event_history || { paging: { size: 100 } }).paging.size;
			return api.tag.list();
		}).then((tags) => {
			return api.trigger.get(this.triggerId).then((json) => {
				$scope.trigger = new Trigger(json, tags);
				return api.trigger.state(this.triggerId);
			}).then((json) => {
				var check = new LastCheck(json);
				$scope.trigger.check = check;
				this.load_events();
			});
		});
	}

	load_events() {
		var scope = this.$scope;
		this.api.event.page(this.triggerId, scope.page, scope.size).then((json) => {
			scope.total = json.total;
			InitPagesList(scope);
			scope.metrics_history = new UniqList<MetricEvents>([]);
			scope.metrics_summary = new UniqList<MetricSummary>([]);
			json.list.sort((a, b) => { return a.timestamp - b.timestamp; });
			angular.forEach(json.list, (json: IEventJson, index: number) => {
				var event = new Event(json);
				if (!json.metric) {
					return;
				}
				if (event.state.name === event.old_state.name) {
					return;
				}
				var metricSummary = scope.metrics_summary.get(json.metric);
				if(!metricSummary){
					metricSummary = new MetricSummary(json.metric);
					scope.metrics_summary.push(metricSummary);
				}
				metricSummary.add(event);
				var metricEvents = scope.metrics_history.get(event.metric);
				if (!metricEvents) {
					metricEvents = new MetricEvents(event.metric);
					scope.metrics_history.push(metricEvents);
				}
				metricEvents.events.push(event);
			});
			angular.forEach(scope.metrics_summary, (summary) => {
				summary.commit(this.timeProvider.now());
			});
			angular.forEach(scope.metrics_history, (metricEvents) => {
				metricEvents.events.sort((a, b) => { return b.timestamp.value - a.timestamp.value; });
			});
			scope.metrics_history.sort((a, b) => { return b.events[0].timestamp.value - a.events[0].timestamp.value; });
			(<ITabExtension>$('ul.tabs')).tabs();
		});
	}

	reset_throttling(trigger: Trigger) {
		this.api.trigger.reset_throttling(trigger.json.id).then(() => {
			trigger.json.throttling = 0;
		});
	}

	set_tab(tab: number) {
		this.$scope.tab = tab;
		this.$location.search({
			page: this.$scope.page,
			tab: this.$scope.tab
		});
	}
}
