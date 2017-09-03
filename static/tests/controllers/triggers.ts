import {IAltKeyEvent} from '../../app/models/events';
import {ITagData} from '../../app/models/tag';
import {Api} from '../../app/services/api';
import {TriggersController, ITriggersScope} from '../../app/controllers/triggers';
import {settings} from '../jsons/settings';
import {config} from '../jsons/config';
import {triggers} from '../jsons/triggers';
import {tags} from '../jsons/tags';

declare function require(string): any;

describe("TriggersController", () => {
	var $httpBackend: ng.IHttpBackendService;
	var $controller: ng.IControllerService;
	var $cookies: ng.cookies.ICookiesService;
	var $rootScope: ng.IRootScopeService;
	var $location: ng.ILocationService;
	var api: Api;
	var scope: ITriggersScope;
	var controller: TriggersController;
	var $compile: ng.ICompileService;

	beforeEach(angular.mock.module('moira'));

	beforeEach(angular.mock.inject(function(_$rootScope_, _$controller_, _$httpBackend_, _$cookies_,
		_$location_, _api_, _$compile_: ng.ICompileService) {
		$rootScope = _$rootScope_;
		$httpBackend = _$httpBackend_;
		$controller = _$controller_;
		$cookies = _$cookies_;
		$location = _$location_;
		$compile = _$compile_;
		api = _api_;

		$cookies.remove(TriggersController.TagsFilterCookie);
		$cookies.remove(TriggersController.TagsOkFilterCookie);
		$httpBackend.whenGET("config.json").respond(config);
		$httpBackend.whenGET("/user/settings").respond(settings);
		$httpBackend.whenGET("/trigger/page?p=0&size=20").respond((method, url, data, headers, params) => {
			if($cookies.get('moira_filter_ok') === 'true'){
				return [200, {list: [triggers.list[1]]}];
			}
			return [200, triggers];
		});
		$httpBackend.whenGET("/tag").respond(tags);
		scope = <ITriggersScope>$rootScope.$new();
		controller = $controller("TriggersController", {
			$scope: scope,
			$cookies: $cookies,
			$location: $location,
			api: api
		});
		$httpBackend.flush();
	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	it("scope.triggers list initialized correctly", () => {
		expect(scope.triggers.length).toEqual(2);
		expect(scope.triggers[0].check.json.score).toBe(0);
		expect(scope.triggers[1].check.json.score).toBe(1000);
	});

	describe("filter by not ok state", () => {
		var element: ng.IAugmentedJQuery;
		beforeEach(() => {
			scope.ok_filter = true;
			element = $compile(require('../../triggers.html'))(scope);
			scope.$digest();
			$httpBackend.flush();
		});
		it("two trigger rows rendered", () => {
			expect(element.find(".trigger-row").length).toBe(1);
		});

	});

	describe("open trigger", () => {
		var event: IAltKeyEvent;
		beforeEach(() => {
			event = <IAltKeyEvent>$rootScope.$broadcast('mock');
			event.stopPropagation = () => { };
		});
		describe("without alt key", () => {
			beforeEach(() => {
				event.altKey = false;
				controller.open_trigger(scope.triggers[0], event);
			});
			it("location changed to events", () => {
				expect($location.path()).toBe("/events/c681cf70-9336-4be5-a175-fb9f6044e284");
			});
		});
		describe("with alt key", () => {
			beforeEach(() => {
				event.altKey = true;
				controller.open_trigger(scope.triggers[0], event);
			});
			it("location changed to trigger form", () => {
				expect($location.path()).toBe("/trigger/c681cf70-9336-4be5-a175-fb9f6044e284");
			});
		});
	});

	describe("show trigger metrics", () => {
		beforeEach(() => {
			controller.toggle_trigger_metrics('WARN', scope.triggers[0]);
		});
		it("scope.show_trigger_metrics initialized correctly", () => {
			expect(scope.show_trigger_metrics).toBeDefined();
			expect(scope.show_trigger_metrics.length).toBe(1);
			expect(scope.show_trigger_metrics[0].metric).toBe("DevOps.systemd.moira-cache.running");
			expect(scope.show_trigger_metrics[0].value.num).toBe(1);
		});
	});
})
