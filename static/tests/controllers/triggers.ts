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

		$cookies.remove(TriggersController.SearchStringCookie);
		$cookies.remove(TriggersController.TagsOkFilterCookie);
		$httpBackend.whenGET("config.json").respond(config);
		$httpBackend.whenGET("/user/settings").respond(settings);
		$httpBackend.whenGET("/trigger/page?p=0&size=20").respond((method, url, data, headers, params) => {

			if($cookies.get('moira_filter_ok') === 'true'){
				return [200, {list: [triggers.list[1]]}];
			}
			if ($cookies.get('moira_search_string') == 'systemd #Moira') {
				return [200, {list: [triggers.list[0]]}];
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
		it("one trigger row rendered", () => {
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

	describe("add filter tag", () => {
		var event: IAltKeyEvent;
		beforeEach(() => {
			event = <IAltKeyEvent>$rootScope.$broadcast('mock');
			event.altKey = false;
			controller.tag_click(scope.tags[0], event);
			scope.$digest();
			$httpBackend.flush();
		});
		it("added to cookies", () => {
			expect($cookies.get("moira_search_string")).toBe(" #DevOps");
		});
	});

	describe("alt click on tag", () => {
		var event: IAltKeyEvent;
		beforeEach(() => {
			$httpBackend.whenPUT("/tag/DevOps/data", (data: string) => { return JSON.parse(data).maintenance > 0}).respond({maintenance: 1});
			$httpBackend.whenPUT("/tag/DevOps/data", (data: string) => { return JSON.parse(data).maintenance == 0}).respond({maintenance: 0});
			event = <IAltKeyEvent>$rootScope.$broadcast('mock');
			event.altKey = true;
			controller.tag_click(scope.tags[0], event);
			scope.$digest();
			$httpBackend.flush();
		});
		it("maintenance enabled", () => {
			expect(scope.tags[0].data.maintenance).toBeGreaterThan(0);
		});
		describe("alt click on tag again", () => {
			beforeEach(() => {
				controller.tag_click(scope.tags[0], event);
				scope.$digest();
				$httpBackend.flush();
			});
			it("maintenance disabled", () => {
				expect(scope.tags[0].data.maintenance).toEqual(0);
			});
		});
	});

	describe("search", () => {
		var element: ng.IAugmentedJQuery;
		beforeEach(() => {
			scope.search_string = "systemd #Moira";
			element = $compile(require('../../triggers.html'))(scope);
			scope.$digest();
			$httpBackend.flush();
		});
		it("by #tag and text", () => {
			expect(scope.triggers).toBeDefined();
			expect(scope.triggers.length).toBe(1);
			expect(scope.triggers[0].json.name).toBe("Moira service status");
			expect(scope.triggers[0].json.id).toBe("c681cf70-9336-4be5-a175-fb9f6044e284");
		});
		it("one trigger row rendered", () => {
			expect(element.find(".trigger-row").length).toBe(1);
		});
	});
})
