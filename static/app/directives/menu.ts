import {Api} from '../services/api';

declare function require(string): any;

export interface IMenuScope extends ng.IScope{
	login:string;
	trigger_active: boolean;
	settings_active: boolean;
}

export function Menu($location:ng.ILocationService, api:Api, $timeout): ng.IDirective {

	return {
		restrict: 'E',
		transclude: true,
		template: require("./templates/menu.html"),
		replace: true,
		link: function (scope:IMenuScope) {
			api.user.get().then((data) => {
				scope.login = data.login || "anonymous";
			});
			scope.$root.$on('$locationChangeSuccess', () => {
				scope.trigger_active = $location.path() == '/trigger/';
				scope.settings_active = $location.path() == '/settings/';
			});
			$timeout(() => {
				(<any>$(".button-collapse")).sideNav({
					closeOnClick: true
				});
			}, 0);
		}
	};
}

Menu.$inject = ['$location', 'api', '$timeout'];
