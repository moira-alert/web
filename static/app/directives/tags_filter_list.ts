declare function require(string): any;

export function TagsFilterList(): ng.IDirective {
	return {
		restrict: 'E',
		scope:{
			model: "=model",
			click: "&click",
			position: "@position",
			create: "&create",
		},
		template: require("./templates/tags-filter-list.html"),
		replace: true,
		link: function(scope, element:JQuery, attrs:ng.IAttributes){
			scope.hasCreate = attrs['create'] != undefined;
		}
	};
}
