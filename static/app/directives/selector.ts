import {IKeyEvent} from '../models/events';
import {IStringId, UniqList} from '../models/core';
import {IFilter} from '../models/filter';

declare function require(string): any;

export interface ISelectorScope extends ng.IScope{
	items:Array<IStringId>;
	model:IFilter<IStringId>;
	hide();
	keyPress($event:IKeyEvent);
	enterPress();
}

export function Selector(): ng.IDirective {

	const max_items:number = 99;

	return {
		restrict: 'E',
		transclude: true,
		template: require('./templates/selector.html'),
		replace: true,
		scope: {
			items:"=items",
			model:"=model",
			placeholder:"@placeholder",
			enterPress:"&enter"
		},
		link: function (scope:ISelectorScope, element:JQuery, attrs:ng.IAttributes) {
			scope.$watch('model', () => {
				scope.model.filtered = new UniqList<IStringId>([]);
			});
			scope.$watch('model.value', function(){
				filter();
				if(scope.model.value.length > 0)
					scope.model.open = true;
			});
			scope.$watch('model.open', function(){
				filter();
			});
			scope.$watch('model.selection.length', function(){
				filter();
				scope.model.value = '';
			});
			scope.keyPress = ($event:IKeyEvent) => {
				if($event.keyCode == 8 && scope.model.value == "" && scope.model.selection.length > 0){
					scope.model.selection.pop();
				}
				if($event.keyCode == 13){
					if(scope.model.filtered.length > 0){
						scope.model.selection.push(scope.model.filtered[0]);
						scope.model.value = "";
					}else{
						scope.enterPress();
					}
				}
				if($event.keyCode == 27 || $event.keyCode == 38){
					scope.model.open = false;
					scope.model.value = "";
				}
				if($event.keyCode == 40){
					scope.model.open = true;
				}
			};
			scope.hide = () => {
				scope.model.open = false;
			};
			function filter(){
				scope.model.filtered = new UniqList<IStringId>((scope.items || []).filter((item) => {
					return item.id().toLocaleLowerCase().indexOf(scope.model.value.toLocaleLowerCase()) >= 0 &&
						!scope.model.selection.contains_id(item.id());
				}));
				if(scope.model.filtered.length > max_items){
					scope.model.items_hidden = scope.model.filtered.length - max_items;
					scope.model.filtered = new UniqList<IStringId>(scope.model.filtered.slice(0, max_items));
				}
			}
		}
	};
}