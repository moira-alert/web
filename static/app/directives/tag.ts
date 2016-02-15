import {Tag} from '../models/tag';
import {Api} from '../services/api';
import * as moment from "moment";

declare function require(string): any;

interface ITagScope extends ng.IScope{
	remove:() => void;
	hasRemove:boolean;
	item:Tag;
	disabled:boolean;
	now:number;
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
			scope.now = moment.utc().unix();
		}
	};
}
