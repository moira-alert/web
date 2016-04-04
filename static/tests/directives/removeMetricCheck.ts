import {IRemoveMetricCheckScope} from '../../app/directives/removeMetricCheck';
import {Api} from '../../app/services/api';
import {MetricCheck, IMetricCheckJson, Trigger} from '../../app/models/trigger';
import {TagList} from '../../app/models/tag';
import {config} from '../jsons/config';
import {triggers} from '../jsons/triggers';
import {tags} from '../jsons/tags';
import * as moment from 'moment';

describe("directive: moira-remove-metric-check", () => {
    var element: ng.IAugmentedJQuery;
    var scope: IRemoveMetricCheckScope;
    var api: Api;
    var $httpBackend;

    beforeEach(angular.mock.module('moira'));

    beforeEach(inject(function($rootScope: ng.IRootScopeService, _$httpBackend_, $compile: ng.ICompileService) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET("config.json").respond(config);

        var rootScope = <any>$rootScope.$new();
        var trigger = new Trigger(<any>triggers.list[0], new TagList(tags.list));
        rootScope.trigger = trigger;
        rootScope.check = trigger.check.metrics_checks.get("DevOps.systemd.moira-notifier.running");
        element = $compile('<moira-remove-metric-check check="check" trigger="trigger"></moira-remove-metric-check>')(rootScope);
        rootScope.$digest();
        scope = <IRemoveMetricCheckScope>element.isolateScope();
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe("remove metric check", () => {
        beforeEach(() => {
            $httpBackend.whenDELETE("/trigger/c681cf70-9336-4be5-a175-fb9f6044e284/metrics?name=DevOps.systemd.moira-notifier.running").respond({});
            expect(scope.trigger.check.metrics_checks.get("DevOps.systemd.moira-notifier.running")).toBeDefined();
            scope.remove();
            $httpBackend.flush();
        });
        it("removed from check", () => {
            expect(scope.trigger.check.metrics_checks.get("DevOps.systemd.moira-notifier.running")).toBeUndefined();
        });
    });

});