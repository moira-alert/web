import {Settings, ISettingsJson} from '../../app/models/settings';
import {Config, IConfigJson} from '../../app/models/config';
import {Subscription} from '../../app/models/subscription';
import {ISubEditorScope} from '../../app/directives/subeditor';
import {Contact} from '../../app/models/contact';
import {TagList} from '../../app/models/tag';
import {Dictionary} from '../../app/models/core';
import {settings} from '../jsons/settings';
import {config} from '../jsons/config';
import {tags} from '../jsons/tags';

interface ISubEditorRootScope extends ng.IScope {
    sub: Subscription;
    tags: TagList;
    contacts: Dictionary<Contact>;
}

describe("directive: subeditor", () => {
    var element: ng.IAugmentedJQuery;
    var root: ISubEditorRootScope;

    beforeEach(angular.mock.module('moira'));

    beforeEach(inject(function($rootScope: ng.IRootScopeService, $compile: ng.ICompileService) {
        root = <ISubEditorRootScope>$rootScope.$new();
        var _settings = new Settings(<ISettingsJson>settings, new Config(config));
        root.sub = _settings.subscriptions[0];
        root.tags = new TagList(tags.list);
        root.contacts = _settings.all_contacts;
        element = $compile('<moira-sub-editor tags="tags" sub="sub" contacts="contacts"></moira-sub-editor>')(root);
        root.$digest();
    }));

    it("tags filter initialized", () => {
        var scope = <ISubEditorScope>element.isolateScope();
        expect(scope.tags_filter.selection.to_string()).toEqual(['EXCEPTION']);
    });
});