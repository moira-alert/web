import {Api} from '../../app/services/api';
import {TriggerController, ITriggerScope} from '../../app/controllers/trigger';
import {settings} from '../jsons/settings';
import {triggers} from '../jsons/triggers';
import {config} from '../jsons/config';
import {tags} from '../jsons/tags';

declare function require(string): any;

const triggerId = "c681cf70-9336-4be5-a175-fb9f6044e284";

describe("TriggerController", () => {
	var $httpBackend: ng.IHttpBackendService;
	var $controller: ng.IControllerService;
	var $rootScope: ng.IRootScopeService;
	var $location: ng.ILocationService;
	var $q: ng.IQService;
	var $routeParams:ng.route.IRouteParamsService;
	var api: Api;
	var scope: ITriggerScope;
	var controller: TriggerController;

	beforeEach(angular.mock.module('moira'));
	beforeEach(() => {
		angular.module('moira')
			.factory('$routeParams', function() {
				return {
					triggerId:triggerId
				};
			});
	});
	beforeEach(angular.mock.inject(function(_$rootScope_, _$controller_, _$httpBackend_,
		_$location_, _$routeParams_, _api_, _$q_, $compile: ng.ICompileService) {
		$rootScope = _$rootScope_;
		$httpBackend = _$httpBackend_;
		$controller = _$controller_;
		$location = _$location_;
		$q = _$q_;
		$routeParams = _$routeParams_;
		api = _api_;

		$httpBackend.whenGET("config.json").respond(config);
		$httpBackend.whenGET("/user/settings").respond(settings);
		$httpBackend.whenGET("/tag").respond(tags);
		$httpBackend.whenGET("/trigger/" + triggerId).respond(triggers.list[0]);
		scope = <ITriggerScope>$rootScope.$new();
		var element = $compile(require('../../trigger.html'))(scope);
		controller = $controller("TriggerController", {
			$scope: scope,
			$location: $location,
			$routeParams:$routeParams,
			$q: $q,
			api: api
		});
		$httpBackend.flush();
	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	it("scope.trigger initialized correctly", () => {
		expect(scope.trigger).toBeDefined();
		expect(scope.trigger.json.id).toBe(triggerId);
	});

	it("triggers form valid", () => {
		expect(scope.trigger_form.$valid).toBeTruthy();
	});
	
	it("watch raising is false", () => {
		expect(scope.watch_raising).toBeFalsy();
	});

	describe("create new tag", () => {
		beforeEach(() => {
			scope.tags_filter.value = "aaa";
			scope.$digest();
			controller.create_tag();
		});
		it("added to trigger tags list", () => {
			expect(scope.trigger.tags.last().value).toBe("aaa");
		});
		it("tags filter value cleared", () => {
			expect(scope.tags_filter.value).toBe("");
		});
	});
	
	describe("invalid warn value", () => {
		beforeEach(() => {
			scope.trigger.json.warn_value = "a"; 
			scope.$digest();
		});
		it("form has invalid state", () => {
			expect(scope.trigger_form.$valid).toBeFalsy;
		});
		it("invalid warn float value message", () => {
			expect(scope.warn_invalid_message).toBe("Invalid float value");
		});
		it("invalid error value message absent", () => {
			expect(scope.error_invalid_message).toBe("");
		});
	});
	
	describe("invalid error value", () => {
		beforeEach(() => {
			scope.trigger.json.error_value = "a"; 
			scope.$digest();
		});
		it("form has invalid state", () => {
			expect(scope.trigger_form.$valid).toBeFalsy;
		});
		it("invalid warn float value message", () => {
			expect(scope.error_invalid_message).toBe("Invalid float value");
		});
		it("invalid error value message absent", () => {
			expect(scope.warn_invalid_message).toBe("");
		});
	});
	
	describe("error value more than warn", () => {
		beforeEach(() => {
			scope.trigger.json.error_value = "1"; 
			scope.$digest();
		});
		it("watch raising become true", () => {
			expect(scope.watch_raising).toBeTruthy();
		});
	});
	
});