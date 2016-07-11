import {Api} from '../../app/services/api';
import {TimeProvider} from '../../app/services/time';
import {EventsController, IEventsScope} from '../../app/controllers/events';
import {settings} from '../jsons/settings';
import {triggers} from '../jsons/triggers';
import {config} from '../jsons/config';
import {events} from '../jsons/events';
import {tags} from '../jsons/tags';

declare function require(string): any;
declare function dump(any): any;

const triggerId = "c681cf70-9336-4be5-a175-fb9f6044e284";

describe("EventsController", () => {
	var $httpBackend: ng.IHttpBackendService;
	var $controller: ng.IControllerService;
	var $rootScope: ng.IRootScopeService;
	var $location: ng.ILocationService;
	var $route:ng.route.IRouteService;
	var $routeParams:ng.route.IRouteParamsService;
	var api: Api;
	var time: TimeProvider;
	var scope: IEventsScope;
	var controller: EventsController;

	beforeEach(() => {
		angular.module('moira')
			.factory('$routeParams', function() {
				return {
					triggerId:triggerId
				};
			})
			.factory('time', function() {
				return {
					now: function(){
						return 1440192769;
					}
				};
			});
	});
	beforeEach(angular.mock.module('moira'));
	beforeEach(angular.mock.inject(function(_$rootScope_, _$controller_, _$httpBackend_,
		_$location_, _api_, _time_, _$route_, _$routeParams_) {
		$rootScope = _$rootScope_;
		$httpBackend = _$httpBackend_;
		$controller = _$controller_;
		$location = _$location_;
		$route = _$route_;
		$routeParams = _$routeParams_;
		api = _api_;
		time = _time_;

		$httpBackend.whenGET("config.json").respond(config);
		$httpBackend.whenGET("/user/settings").respond(settings);
		$httpBackend.whenGET("/trigger/" + triggerId).respond(triggers.list[0]);
		$httpBackend.whenGET("/trigger/" + triggerId + "/state").respond(triggers.list[0].last_check);
		$httpBackend.whenGET("/tag").respond(tags);
		$httpBackend.whenGET(`/event/${triggerId}?p=0&size=100`).respond(events);
		scope = <IEventsScope>$rootScope.$new();
		controller = $controller("EventsController", {
			$scope: scope,
			$location: $location,
			api: api,
			time: time,
			$route: $route,
			$routeParams: $routeParams
		});
		$httpBackend.flush();
	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	describe("events list loaded", () => {
		it("scope model initialized correctly", () => {
			expect(scope.metrics_summary.length).toBe(1);
			var states = scope.metrics_summary[0].states;
			expect(states.keys).toEqual(['NODATA', 'OK', 'WARN']);
			expect(states.get('OK').percent).toBe(50);
			expect(states.get('WARN').percent).toBe(50);
			expect(states.keys.map((k) => {return states.get(k).width;}).reduce((w1, w2) => {return w1 + w2}, 0)).toBe(90);
		});
		describe("reset trigger throttling", () => {
			beforeEach(() => {
				controller.reset_throttling(scope.trigger);
			});
			it("api method shoul be called", () => {
				$httpBackend.expectDELETE("/trigger/"+ triggerId + "/throttling").respond({});
				$httpBackend.flush();
			});
		});
	});

})