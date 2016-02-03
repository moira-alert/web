import {ExtArray} from '../models/core';
import {Event, IEventJson} from '../models/event';
import {State} from '../models/state';
import {Dictionary, NumDictionary, UniqList, IStringId} from '../models/core';
import {Api} from '../services/api';
import {TimeProvider} from '../services/time';
import {Trigger, LastCheck, MetricCheck} from '../models/trigger';
import {GoTo} from './goto';
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

class MetricSummary {
	total: number = 0;
	states = new Dictionary<StateSummary>();
	last: StateSummary;
	list: Array<StateSummary> = [];

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

export interface IEventsScope extends ng.IScope {
	metrics_history: UniqList<MetricEvents>
	metrics_summary: Dictionary<MetricSummary>;
	trigger: Trigger;
	check: LastCheck;
	tab: Tab;
	now: number;
	show_maintenance_check: MetricCheck;
}

interface ITabExtension extends JQuery {
	tabs();
}

export class EventsController extends GoTo {

	private triggerId: string;
	static $inject = ['$scope', 'api', 'time', '$routeParams', '$location', '$route'];

	constructor(private $scope: IEventsScope,
		private api: Api,
		private timeProvider: TimeProvider,
		private $routeParams: ng.route.IRouteParamsService,
		$location: ng.ILocationService,
		private $route: ng.route.IRouteService) {
		super($location);
		$scope.now = moment.utc().unix();
		$scope.metrics_summary = new Dictionary<MetricSummary>();
		$scope.tab = parseInt($routeParams['tab'] || "0");
		var lastRoute = $route.current;
		$scope.$on('$locationChangeSuccess', function(event) {
			if (lastRoute && $route.current && $route.current['controller'] == lastRoute['controller'])
				$route.current = lastRoute;
		});
		this.triggerId = $routeParams['triggerId'];
		api.tag.list().then((tags) => {
			api.trigger.get(this.triggerId).then((json) => {
				$scope.trigger = new Trigger(json, tags);
				return api.trigger.state(this.triggerId);
			}).then((json) => {
				$scope.check = new LastCheck(json);
				return api.event.list(this.triggerId);
			}).then((json) => {
				$scope.metrics_history = new UniqList<MetricEvents>([]);
				json.list.sort((a, b) => { return a.timestamp - b.timestamp; });
				angular.forEach(json.list, (json: IEventJson, index: number) => {
					var event = new Event(json);
					if (!json.metric) {
						return;
					}
					$scope.metrics_summary.getOrCreate(json.metric, new MetricSummary()).add(event);
					var metricEvents = $scope.metrics_history.get(event.metric);
					if (!metricEvents) {
						metricEvents = new MetricEvents(event.metric);
						$scope.metrics_history.push(metricEvents);
					}
					metricEvents.events.push(event);
				});
				angular.forEach($scope.metrics_summary.dict, (summary, metric) => {
					summary.commit(timeProvider.now());
				});
				angular.forEach($scope.metrics_history, (metricEvents) => {
					metricEvents.events.sort((a, b) => { return b.timestamp.value - a.timestamp.value; });
				});
				$scope.metrics_history.sort((a, b) => { return b.events[0].timestamp.value - a.events[0].timestamp.value; });
				(<ITabExtension>$('ul.tabs')).tabs();
			});
		});
	}

	reset_throttling(trigger: Trigger) {
		this.api.trigger.reset_throttling(trigger.json.id).then(() => {
			trigger.json.throttling = 0;
		});
	}

	set_tab(tab: number) {
		this.$scope.tab = tab;
		this.$location.path("/events/" + this.triggerId + "/" + tab);
	}

	trigger_maintenance_menu(check: MetricCheck) {
		if (check == this.$scope.show_maintenance_check) {
			this.$scope.show_maintenance_check = null;
			return;
		}
		this.$scope.show_maintenance_check = check;
	}

}
