declare function require(string): any;

export interface IDropDownListScope extends ng.IScope{
		target:string;
		chooseItem:(item: any) => void;
		filterFn:(target: string) => (item: any) => boolean;
		targetsList: Array<string>;
		messagesVisible: boolean;
}

export function DropDownList($timeout): ng.IDirective {
	return {
    restrict: 'E',
    scope: {
      targetsList: '=',
      placeholder: '@',
    },
	template: require("./templates/drop_down_list.html"),
	replace: false,
    link: function(scope:IDropDownListScope, el:JQuery, attr:ng.IAttributes){
		scope.filterFn = function(target) {
			return function(item) { 
			if (typeof(target) == 'undefined') { return false; }
			if (target.length < 1) {
				return false;
			} else {
				return item.match(target);
			}
			};
		};
		scope.chooseItem = function(item) {
			this.$parent.$parent.target.value = item;
			this.$parent.$parent['messagesVisible'+this.$parent.$parent.$index] = false;
		}
    }
	}
}
