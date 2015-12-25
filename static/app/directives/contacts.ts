import {ContactConfig} from '../models/config';

declare function require(string): any;

export interface IContacts extends ng.IScope{
	config: ContactConfig;
}

export function Contacts():ng.IDirective{
	
	return {
		restrict: 'E',
		template: require('./templates/contacts.html'),
		replace: true,
		scope: {
			model: "=model",
			add: "&add",
			config: "=config"
		},
	};
}
