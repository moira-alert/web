import {IMaintenanceScope} from '../../app/directives/maintenance';
import {Api} from '../../app/services/api';
import {MetricCheck, IMetricCheckJson} from '../../app/models/trigger';

describe("directive: moira-maintenance", () => {
    var element: ng.IAugmentedJQuery;
    var scope:IMaintenanceScope;
    var api: Api;
    var $httpBackend;

    beforeEach(angular.mock.module('moira'));

    beforeEach(inject(function($rootScope: ng.IRootScopeService, $compile: ng.ICompileService) {
        scope = <IMaintenanceScope>$rootScope.$new();
        scope.triggerid = "triggerid";
        scope.check = new MetricCheck("metric", <IMetricCheckJson>{})
        element = $compile('<moira-maintenance check="check" triggerid="triggerid"></moira-maintenance>')(scope);
        scope.$digest();
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe("maintenance compilation", () => {
        beforeEach(() => {
            (<IMaintenanceScope>element.isolateScope()).set_metric_maintenance(15);
            scope.$digest();
        });
    });

});