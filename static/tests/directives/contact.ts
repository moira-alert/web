import {IContactScope} from '../../app/directives/contact';
import {Contact} from '../../app/models/contact';
import {IConfigJson, Config} from '../../app/models/config';
import {settings} from '../jsons/settings';
import {config} from '../jsons/config';

interface IContactRootScope extends ng.IScope {
    contact: Contact;
    clickEnabled: string;
    click: Function;
    delete: Function;
}

describe("directive: contact", () => {
    var element: ng.IAugmentedJQuery;
    var scope: IContactRootScope;
    var cfg = new Config(config);
    
    beforeEach(angular.mock.module('moira'));

    beforeEach(inject(function($rootScope: ng.IRootScopeService, $compile: ng.ICompileService) {
        scope = <IContactRootScope>$rootScope.$new();
        scope.click = () => { };
        scope.delete = () => { };
        scope.contact = new Contact(settings.contacts[0], cfg.contacts.get(settings.contacts[0].type));
        element = $compile('<moira-contact delete="delete()" contact="contact" click="click()"></moira-contact>')(scope);
        scope.$digest();
    }));

    it("initialized correctly", () => {
        expect((<IContactScope>element.isolateScope()).hasClick).toBeTruthy();
        expect((<IContactScope>element.isolateScope()).hasDelete).toBeTruthy();
    });

    describe("click", () => {
        beforeEach(() => {
            spyOn(scope, 'click');
            element.triggerHandler('click');
            scope.$digest();
        });
        it("click function called", () => {
            expect(scope.click).toHaveBeenCalled();
        });
    });

    describe("delete", () => {
        beforeEach(() => {
            spyOn(scope, 'delete');
            element.find('i:last').triggerHandler('click');
            scope.$digest();
        });
        it("delete function called", () => {
            expect(scope.delete).toHaveBeenCalled();
        });
    });
});