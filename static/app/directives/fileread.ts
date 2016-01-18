export interface IFileReadScope extends ng.IScope{
    import: (string) => {};
}

export function FileRead($parse: ng.IParseService): ng.IDirective{
    return {
        restrict: 'A',
        scope: {
            import: "&fileRead"
        },
        link: function (scope: IFileReadScope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent: any) {
                    scope.$apply(function() {scope.import({json: loadEvent.target.result})});
                }
                reader.readAsText(changeEvent.target.files[0]);
            });
        }
    }
}

FileRead.$inject = ['$parse'];