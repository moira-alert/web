import {Api, ApiStatus as Status} from '../services/api';

declare function require(string): any;

export interface IApiStatusScope extends ng.IScope{
	api_status:Status;
}

export function ApiStatus(api:Api): ng.IDirective{
	return {
			restrict: 'E',
			transclude: true,
			template: require("./templates/api-status.html"),
			replace: true,
			link: function (scope:IApiStatusScope) {
				scope.api_status = api.status;
			}
		};
}

ApiStatus.$inject = ['api'];