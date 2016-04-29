declare function require(string): any;

export interface IDropDownListScope extends ng.IScope{
		target:string;
		chooseItem:(item: any) => void;
		filterFn:(target: string) => (item: any) => boolean;
		itemsList: Array<string>;
		messagesVisible: boolean;
}

export function DropDownList($timeout): ng.IDirective {
	return {
    restrict: 'E',
    scope: {
      itemsList: '=',
      placeholder: '@',
    },
	template: require("./templates/drop_down_list.html"),
	replace: false,
    link: function(scope:IDropDownListScope, el:JQuery, attr:ng.IAttributes){
		scope.messagesVisible = true;
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

      	scope.chooseItem = function( item ) {
			this.$parent.$parent.target.value = item;
			scope.messagesVisible = false;
		}
    }
	}
}