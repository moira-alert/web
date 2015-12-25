import {IApiStatusScope} from '../../app/directives/apistatus';
import {Api} from '../../app/services/api';

describe("directive: api-status", () => {
    var element: ng.IAugmentedJQuery;
    var scope:IApiStatusScope;
    var api: Api;
    var $httpBackend;

    beforeEach(angular.mock.module('moira'));
    beforeEach(angular.mock.inject(function(_$rootScope_, _$httpBackend_, _api_) {
        $httpBackend = _$httpBackend_;
        api = _api_;
        $httpBackend.whenGET("config.json").respond(() => {
            return [500, "Bad news", {}];
        });
    }));

    beforeEach(inject(function($rootScope: ng.IRootScopeService, $compile: ng.ICompileService) {
        scope = <IApiStatusScope>$rootScope.$new();
        element = $compile('<moira-api-status></moira-api-status>')(scope);
        scope.$digest();
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe("http service returns error", () => {
        beforeEach(() => {
            api.user.get();
            $httpBackend.flush();
            scope.$digest();
        });
        it("api status has error", () => {
            expect(scope.api_status.response_error).toBe("Bad news");
        });
    });

});