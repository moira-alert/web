declare function require(string): any;

export function Trigger(): ng.IDirective{
	return {
		restrict: 'E',
		transclude: true,
		scope:{
			trigger: "=trigger",
			tags: "=tags",
			_save: "&save"
		},
		template: require("./templates/trigger-editor.html"),
		replace: true,
		link: function(scope:any){
			scope.selected_tag = "";
			scope.save = function(){
				var badInput:HTMLInputElement = (<HTMLInputElement>$("input.ng-invalid").get(0));
				if(badInput){
					var elemLen = badInput.value.length;
					badInput.selectionStart = elemLen;
					badInput.selectionEnd = elemLen;
					badInput.focus();
				}else{
					scope._save();
				}
			};
			scope.float_re = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/;
			scope.time_re = /^([01]\d|2[0-3]):?([0-5]\d)$/;
			$("input[name='target']").focus();
			scope.add_tag = function(tag){
				scope.trigger.add_tag(tag);
				scope.selected_tag = "";
			}
		}
	};	
	
}
