import {Api} from '../services/api';
import {Timestamp} from '../models/timestamp';
var moment = require('moment');

declare function require(string): any;

interface ITimestampScope extends ng.IScope{
	timestamp:Timestamp;
	ago:string;
}

export function Timestamp(): ng.IDirective{
	return {
		restrict: 'E',
		transclude: true,
		scope:{
			timestamp: "=timestamp",
		},
		template: require("./templates/timestamp.html"),
		replace: true,
		link: function(scope:ITimestampScope){
			if(scope.timestamp)
				scope.ago = moment(scope.timestamp.date).fromNow();
		}
	};
}
