declare function require(string): any;

export interface IDropDownListScope extends ng.IScope{
		target:string;
		chooseItem:(item: any) => void;
		filterFn:(target: string) => (item: any) => boolean;
		itemsList: Array<string>;
}

export function DropDownList($timeout): ng.IDirective {
	return {
    restrict: 'E',
    scope: {
      itemsList: '=',
      placeholder: '@'
    },
	template: require("./templates/drop_down_list.html"),
	replace: true,
    link: function(scope:IDropDownListScope, el:JQuery, attr:ng.IAttributes){
        var $listContainer = angular.element( el[0].querySelectorAll('.search-item-list')[0] );
        el.find('input').bind('focus',function(){
          $listContainer.addClass('show');
        });
        el.find('input').bind('blur',function(){
          /*
             * 'blur' реагирует быстрее чем ng-click,
             * поэтому без $timeout chooseItem не успеет поймать item до того, как лист исчезнет
             */
          $timeout(function(){ $listContainer.removeClass('show') }, 200);
        });

		scope.filterFn = function(target) {
			return function(item) { 
			if (typeof(target) == 'undefined') { return false ;}
			
			if (target.length < 1) {
				return false;
			}
			else {
				return item.match(target);	
			}
			};
		};
			
      	scope.chooseItem = function( item ) {
		   this.$parent.$parent.target.value = item;
           $listContainer.removeClass('show');
		};
    }
  }
};