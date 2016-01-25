import {ContactConfig} from '../models/config';

declare function require(string): any;

export interface IContacts extends ng.IScope {
	config: ContactConfig;
}

export function NewContact($timeout): ng.IDirective {

	return {
		restrict: 'E',
		template: require('./templates/new-contact.html'),
		replace: true,
		scope: {
			model: "=model",
			add: "&add",
			config: "=config"
		},
		link: function() {
			$timeout(() => {
				(<any>$('.tooltipped')).tooltip({ delay: 50 });
			}, 0);
		}
	};
}

NewContact.$inject = ['$timeout'];