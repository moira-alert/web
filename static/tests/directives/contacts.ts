import {ContactConfig} from '../../app/models/config';
import {config} from '../jsons/config';
import {settings} from '../jsons/settings';

describe("directive: contacts", () => {
    var element: ng.IAugmentedJQuery;
    var root: ng.IScope;
    
    beforeEach(angular.mock.module('moira'));

    beforeEach(inject(function($rootScope: ng.IRootScopeService, $compile: ng.ICompileService) {
        root = $rootScope.$new();
        root['type'] = "email";
        root['model'] = "";
        root['add'] = () => {};
        root['config'] = new ContactConfig(config.contacts[0])
        element = $compile('<moira-new-contact model="model" type="{{type}}" config="config" add="add()"></moira-new-contact>')(root);
        root.$digest();
    }));

    describe("invalid email input", () => {
        beforeEach(() => {
            root['model'] = "a";
            root.$digest();
        });
        it("input has invalid class", () => {
            expect(element.find('input').hasClass('ng-invalid')).toBeTruthy();
        });
    });

    describe("enter valid email and press enter", () => {
        beforeEach(() => {
            root['model'] = "a@a.c";
            root.$digest();
            spyOn(root, 'add');
            element.find('a').triggerHandler('click');
            root.$digest();
        });
        it("form valid", () => {
            expect(element.isolateScope()['contact_form'].$valid).toBeTruthy();
        });
        it("add function called", () => {
            expect(root['add']).toHaveBeenCalled();
        });
    });
});