import {Api} from '../services/api';
import {MetricCheck} from '../models/trigger';
import * as moment from 'moment';

declare function require(string): any;

export interface IMaintenanceScope extends ng.IScope {
	check: MetricCheck;
	triggerid: string;
	set_metric_maintenance(time: number);
	show: boolean;
}

export function Maintenance(api: Api): ng.IDirective {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			check: "=check",
			triggerid: "@"
		},
		template: require("./templates/maintenance.html"),
		replace: true,
		link: function(scope: IMaintenanceScope) {
			scope.show = true;
			scope.set_metric_maintenance = (time: number) => {
				var data = {};
				data[scope.check.metric] = time;
				if (time > 0) {
					data[scope.check.metric] = moment.utc().add(time, "minutes").unix();
				}
				api.trigger.maintenance(scope.triggerid, data).then(() => {
					scope.check.json.maintenance = data[scope.check.metric];
				});
				scope.show = false;
			}
		}
	};
}

Maintenance.$inject = ['api'];