import {Schedule} from '../models/schedule';

declare function require(string): any;

export interface IScheduleScope extends ng.IScope{
	time_re:RegExp;
	sched: Schedule;
} 

export function Schedule(): ng.IDirective {
	return {
		restrict: 'E',
		transclude: true,
		template: require('./templates/schedule.html'),
		replace: true,
		scope: {
			sched: "=model",
		},
		compile: function(){
			return {
				pre: function(scope:IScheduleScope){
					scope.time_re = /^([01]\d|2[0-3]):?([0-5]\d)$/;
					scope.$watch('sched.everyday', (newValue:boolean) => {
						if(newValue)
							angular.forEach(scope.sched.json.days, (d) => {
								d.enabled = true;
							});
					});
					scope.$watch('sched.all_day', (newValue:boolean) => {
						if(newValue){
							scope.sched.startTime = '00:00';
							scope.sched.endTime = '23:59';
						}
					});
				}
			};
		}
	};
}
