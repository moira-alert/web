import {Api} from '../services/api';
import {Trigger, MetricCheck} from '../models/trigger';
import * as moment from 'moment';

declare function require(string): any;

export interface IRemoveMetricCheckScope extends ng.IScope{
	trigger: Trigger;
	check: MetricCheck;
	remove();	
}

export function RemoveMetricCheck(api: Api): ng.IDirective {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			check: "=check",
			trigger: "=trigger"
		},
		template: require("./templates/remove-metric-check.html"),
		replace: true,
		link: (scope: IRemoveMetricCheckScope) => {
			scope.remove = () => {
				api.trigger.remove_metric(scope.trigger.json.id, scope.check.metric).then(() => {
					if(scope.trigger.check.metrics_checks.remove(scope.check) !== undefined){
						scope.trigger.check.metric_states.get(scope.check.state.name).count -= 1;
						scope.trigger.check.state_checks.get(scope.check.state.name).remove(scope.check);
					}
				});
			};
		}
	};
}

RemoveMetricCheck.$inject = ['api'];