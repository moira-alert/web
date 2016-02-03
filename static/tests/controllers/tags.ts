import {Api} from '../../app/services/api';
import {TagsController, ITagsScope} from '../../app/controllers/tags';
import {config} from '../jsons/config';

declare function require(string): any;
declare function dump(any): any;

describe("TagsController", () => {
	var $httpBackend: ng.IHttpBackendService;
	var $controller: ng.IControllerService;
	var $rootScope: ng.IRootScopeService;
	var api: Api;

	beforeEach(angular.mock.module('moira'));

	beforeEach(angular.mock.inject(function(_$rootScope_, _$controller_, _$httpBackend_, _api_) {
			$httpBackend = _$httpBackend_;
			$controller = _$controller_;
			$rootScope = _$rootScope_;
			api = _api_;
			$httpBackend.whenGET("config.json").respond(config);
		})
	);

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	describe("$scope.tags", () => {
		var scope, controller;
		
		beforeEach(() => {
			scope = $rootScope.$new();
			controller = $controller("TagsController", { $scope: scope, api:api });
		});

		it('tags has been initialized', function() {
			$httpBackend.expectGET("/contact").respond({
				list: []
			});
			$httpBackend.expectGET("/tag/stats").respond(
				{
					"list":[
						{
							"subscriptions":[],
							"data":{"maintenance":0},
							"name":"dtrace",
							"triggers":["e84ef103-85ea-41d6-9ec8-ac17c6d696ed"]
						}
					]
				});
			$httpBackend.flush();
			expect(scope.tags).toBeDefined();
		});
	});
})