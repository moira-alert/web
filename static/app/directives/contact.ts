import {Contact} from '../models/contact';

declare function require(string): any;

export interface IContactScope extends ng.IScope{
	contact:Contact;
	hasClick:boolean;
	hasDelete:boolean;
	clickEnabled:string;
	click:Function;
	delete:Function;
	img:string;
}

export function Contact():ng.IDirective{
	
	return {
		restrict: 'E',
		template: require('./templates/contact.html'),
		replace: true,
		scope: {
			contact: "=contact",
			click: "&click",
			delete: "&delete",
			clickEnabled: "@clickEnabled"
		},
		link: function(scope:IContactScope, element:JQuery, attrs:ng.IAttributes){
			scope.hasClick = attrs['click'] != undefined;
			scope.hasDelete = attrs['delete'] != undefined;
		}
	};
}
