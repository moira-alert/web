import {IMaintenanceScope} from '../../app/directives/maintenance';
import {Api} from '../../app/services/api';
import {MetricCheck, IMetricCheckJson} from '../../app/models/trigger';
import {config} from '../jsons/config';
import * as moment from 'moment';

describe("directive: moira-maintenance", () => {
    var element: ng.IAugmentedJQuery;
    var scope:IMaintenanceScope;
    var api: Api;
    var $httpBackend;

    beforeEach(angular.mock.module('moira'));

    beforeEach(inject(function($rootScope: ng.IRootScopeService, _$httpBackend_, $compile: ng.ICompileService) {
        $httpBackend = _$httpBackend_;
		$httpBackend.expectGET("config.json").respond(config);
        
        var rootScope = <any>$rootScope.$new();
        rootScope.triggerid = "triggerid";
        rootScope.check = new MetricCheck("metric", <IMetricCheckJson>{})
        element = $compile('<moira-maintenance check="check" triggerid="triggerid"></moira-maintenance>')(rootScope);
        rootScope.$digest();
        scope = <IMaintenanceScope>element.isolateScope();
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe("maintenance compilation", () => {
        var now = moment.utc().unix();
        beforeEach(() => {
            $httpBackend.expectPUT("/trigger/triggerid/maintenance").respond({});
            scope.set_metric_maintenance(15);
            $httpBackend.flush();
        });
        it("check maintenance must set to non-zero", () => {
            expect(scope.check.json.maintenance >= now + 15 * 60 && scope.check.json.maintenance < now + 16 * 60).toBeTruthy();
        });
    });

});