import {Dictionary, UniqList} from '../models/core';
import {Subscription} from '../models/subscription';
import {TagList, Tag, TagFilter} from '../models/tag';
import {Contact} from '../models/contact';

declare function require(string): any;

export interface ISubEditorScope extends ng.IScope {
	sub: Subscription;
	tags_filter: TagFilter;
}

export function SubEditor(): ng.IDirective {
	return {
		restrict: 'E',
		transclude: true,
		template: require('./templates/subeditor.html'),
		replace: true,
		scope: {
			sub: "=sub",
			contacts: "=contacts",
			tags: "=tags",
		},
		compile: function() {
			return {
				pre: function(scope: ISubEditorScope) {
					scope.$watch('sub', (sub: Subscription) => {
						scope.tags_filter = new TagFilter(sub.tags);
					});
				}
			};
		}
	};
}
