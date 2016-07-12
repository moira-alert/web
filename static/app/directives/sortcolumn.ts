declare function require(string): any;

export interface ISortColumnScope extends ng.IScope {
    value: string;
    column: string;
    up: boolean;
    active: boolean;
    abs_column
}

export function SortColumn(): ng.IDirective {
    return {
        transclude: true,
        replace: true,
        restrict: 'E',
        template: require('./templates/sort-column.html'),
        scope: {
            value: "=value",
            column: "@column",
        },
        link: (scope: ISortColumnScope, element, attrs) => {
            scope.$watch('value', () => {
                scope.active = (scope.value === scope.column || '-' + scope.value === scope.column || scope.value === '-' + scope.column);
                scope.up = scope.value[0] !== '-';
            });
            element.bind('click', () => {
                scope.$apply(() => {
                    if (scope.value == scope.column) {
                        if (scope.value[0] === '-') {
                            scope.value = scope.value.substring(1);
                        }
                        else
                            scope.value = '-' + scope.value;
                    } else {
                        scope.value = scope.column;
                    }
                })
            });
        }
    }
}