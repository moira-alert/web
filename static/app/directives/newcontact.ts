import {ContactConfig} from '../models/config';

declare function require(string): any;

export interface IContacts extends ng.IScope{
	config: ContactConfig;
}

export function NewContact():ng.IDirective{
	
	return {
		restrict: 'E',
		template: require('./templates/new-contact.html'),
		replace: true,
		scope: {
			model: "=model",
			add: "&add",
			config: "=config"
		},
	};
}
