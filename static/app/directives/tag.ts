import {Tag} from '../models/tag';
import {Api} from '../services/api';

declare function require(string): any;

interface ITagScope extends ng.IScope{
	remove:() => void;
	hasRemove:boolean;
	item:Tag;
	disabled:boolean;
}

export function Tag(): ng.IDirective {
	return {
		restrict: 'E',
		scope:{
			remove: "&",
			item: "=item",
			disabled:"@disabled"
		},
		template: require("./templates/tag.html"),
		replace: true,
		link: function(scope:ITagScope, element:JQuery, attrs:ng.IAttributes){
			scope.hasRemove = attrs['remove'] != undefined;
		}
	};
}
