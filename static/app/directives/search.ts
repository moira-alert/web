declare function require(string): any;

export interface ISearchScope extends ng.IScope{
	model:String;
	clear();
}

export function Search(): ng.IDirective {

	const max_items:number = 99;

	return {
		restrict: 'E',
		template: require('./templates/search.html'),

		replace: true,
		transclude: true,
		scope: {
			model:"=model",
			placeholder:"@placeholder",
		},
		link: function (scope:ISearchScope, element:JQuery, attrs:ng.IAttributes) {
			scope.clear = () => {
				scope.model = "";
			};
		}
	};
}
