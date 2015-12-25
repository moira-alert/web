import {IStringId, UniqList} from '../../app/models/core';
import {IFilter} from '../../app/models/filter';

class String implements IStringId {
    constructor(public value: string) {
    }
    static toArray(strings: Array<String>): Array<string> {
        return strings.map((s) => { return s.value; });
    }
    id(): string {
        return this.value;
    }
}

interface ISelectorRootScope extends ng.IScope {
    model: IFilter<String>;
    items: Array<String>;
    enter();
}

describe("directive: selector", () => {
    var element: ng.IAugmentedJQuery;
    var scope: ISelectorRootScope;

    beforeEach(angular.mock.module('moira'));

    beforeEach(inject(function($rootScope: ng.IRootScopeService, $compile: ng.ICompileService) {
        scope = <ISelectorRootScope>$rootScope.$new();
        scope.model = {
            value: "",
            open: false,
            filtered: new UniqList<String>([]),
            items_hidden: 0,
            selection: new UniqList<String>([])
        };
        scope.enter = () => {};
        scope.items = ["aaa", "aab", "bbb", "bbc"].map((s) => new String(s));
        element = $compile('<moira-selector model="model" placeholder="test" items="items" enter="enter()"></moira-selector>')(scope);
        scope.$digest();
    }));

    it("items list not filtered by default", () => {
        expect(String.toArray(scope.model.filtered)).toEqual(String.toArray(scope.items));
    });

    describe("model value changed", () => {
        beforeEach(() => {
            scope.model.value = "a";
            scope.$digest();
        });

        it("items list filtered by substring", () => {
            expect(String.toArray(scope.model.filtered)).toEqual(["aaa", "aab"]);
        });

        describe("some item selected", () => {
            beforeEach(() => {
                scope.model.selection.push(scope.items[0]);
                scope.$digest();
            });
            it("items filtered by selection also", () => {
                expect(String.toArray(scope.model.filtered)).toEqual(["aab", "bbb", "bbc"]);
            });
            it("model value cleaned", () => {
                expect(scope.model.value).toBe("");
            });
        });
    });

    describe("enter key pressed on input control", () => {
        beforeEach(() => {
            element.find("input").triggerHandler(<JQueryEventObject>{ type: 'keydown', keyCode: 13 })
            scope.$digest();
        });
        it("first item is selected", () => {
            expect(String.toArray(scope.model.selection)).toEqual(["aaa"]);
        });
    });

    describe("filtered list empty and enter key pressed", () => {
        beforeEach(() => {
            spyOn(scope, 'enter');
            scope.model.value = "x";
            scope.$digest();
            element.find("input").triggerHandler(<JQueryEventObject>{ type: 'keydown', keyCode: 13 })
            scope.$digest();
        });
        it("scope on enter function executed", () => {
            expect(scope.enter).toHaveBeenCalled();
        });
    });
    
    describe("model value changed and enter key pressed", () => {
        beforeEach(() => {
            scope.model.value = "b";
            scope.$digest();
            element.find("input").triggerHandler(<JQueryEventObject>{ type: 'keydown', keyCode: 13 })
            scope.$digest();
        });
        it("first filtered item is selected", () => {
            expect(String.toArray(scope.model.selection)).toEqual(["aab"]);
        });
        it("model value cleaned", () => {
            expect(scope.model.value).toBe("");
        });
    });
    
    describe("two items selected and backspace key pressed", () => {
        beforeEach(() => {
            scope.model.selection = new UniqList<String>(scope.items.slice(0, 2));
            scope.$digest();
            expect(String.toArray(scope.model.selection)).toEqual(["aaa", "aab"]);
            element.find("input").triggerHandler(<JQueryEventObject>{ type: 'keydown', keyCode: 8 })
            scope.$digest();
        });
        it("last item removed from selection", () => {
            expect(String.toArray(scope.model.selection)).toEqual(["aaa"]);
        });
    });

    describe("items count more than 100", () => {
        beforeEach(() => {
            var a = [];
            for(var i=0; i < 120; i++)
                a.push(i);
            scope.items = a.map((i) => {return new String("" + i);});
            scope.model.open = true;
            scope.$digest();
        });
        it("rest items hidden", () => {
            expect(scope.model.filtered.length).toEqual(99);
            expect(scope.model.items_hidden).toEqual(21);
        });
    });

});