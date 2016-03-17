import {Api} from '../../app/services/api';
import {SettingsController, ISettingsScope} from '../../app/controllers/settings';
import {settings} from '../jsons/settings';
import {config} from '../jsons/config';
import {tags} from '../jsons/tags';

declare function require(string): any;
declare function dump(any): any;

describe("SettingsController", () => {
	var $httpBackend: ng.IHttpBackendService;
	var $controller: ng.IControllerService;
	var $rootScope: ng.IRootScopeService;
	var $location: ng.ILocationService;
	var api: Api;
	var newContactId = 0;
	var controller: SettingsController;
	var scope: ISettingsScope;

	beforeEach(angular.mock.module('moira'));
	beforeEach(angular.mock.inject(function(_$rootScope_, _$controller_, _$httpBackend_,
		_$location_, _api_) {
		newContactId = 0;
		$rootScope = _$rootScope_;
		$httpBackend = _$httpBackend_;
		$controller = _$controller_;
		$location = _$location_;
		api = _api_;

		$httpBackend.whenGET("config.json").respond(config);
		$httpBackend.whenGET("/user/settings").respond(settings);
		$httpBackend.whenGET("/tag").respond(tags);
		$httpBackend.whenPUT("/contact").respond(() => {
			newContactId++;
			return [200, {
				type: "email",
				user: "username",
				value: "new@company.com",
				id: newContactId
			}, {}];
		});
		$httpBackend.whenDELETE("/contact/7ac7189c-5250-4e2d-8b4a-241198da1ba5").respond({});
		scope = <ISettingsScope>$rootScope.$new();
		controller = $controller("SettingsController", {
			$scope: scope,
			$location: $location,
			api: api,
		});
		$httpBackend.flush();

	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	it("scope.settings initialized correctly", () => {
		expect(scope.settings.subscriptions.length).toBe(2);
		expect(scope.settings.sub_tags.to_string().sort()).toEqual(['DevOps']);
		expect(scope.settings.all_contacts.count).toBe(2);
	});

	describe("add contact", () => {
		beforeEach(() => {
			scope.new_contacts['email'] = "new@company.com"
			controller.add_contact('email');
			$httpBackend.flush();
		});
		it("existing contacts contains new contact", () => {
			expect(scope.existing_contacts['email'].to_string()).toEqual(['7ac7189c-5250-4e2d-8b4a-241198da1ba5', 1])
		});
		it("settings all contacts contains new contact", () => {
			expect(scope.settings.all_contacts.get('1').json.value).toBe("new@company.com");
		});
	});

	describe("delete contact", () => {
		beforeEach(() => {
			var event = $rootScope.$broadcast('mock');
			event.stopPropagation = () => { };
			controller.delete_contact(scope.settings.all_contacts.get("7ac7189c-5250-4e2d-8b4a-241198da1ba5"), event);
			$httpBackend.flush();
		});
		it("removed from existing contacts", () => {
			expect(scope.existing_contacts['email'].length).toEqual(0);
		});
		it("removed from settings all contacts", () => {
			expect(scope.settings.all_contacts.get('7ac7189c-5250-4e2d-8b4a-241198da1ba5')).toBeUndefined();
		});
		it("removed from subscription", () => {
			expect(scope.settings.subscriptions.get('a3581005-c289-4dea-bd8e-77b8fc23a3e3').contacts.contains_id("7ac7189c-5250-4e2d-8b4a-241198da1ba5")).toBeFalsy();
		});
	});


	describe("add contact twice i.g. double-click", () => {
		beforeEach(() => {
			scope.new_contacts['email'] = "new@company.com"
			controller.add_contact('email');
			controller.add_contact('email');
			$httpBackend.flush();
		});
		it("added only once", () => {
			expect(scope.existing_contacts['email'].to_string()).toEqual(['7ac7189c-5250-4e2d-8b4a-241198da1ba5', 1])
		});
	});

	describe("create subscription and save", () => {
		beforeEach(() => {
			controller.create_subscription();
			scope.subscription.add_tag(scope.tags.get('DevOps'));
			controller.add_sub_contact(scope.existing_contacts['email'][0]);
			controller.add_sub_contact(scope.existing_contacts['phone'][0]);
			var json = scope.subscription.data();
			json.id = "new";
			$httpBackend.whenPUT("/subscription").respond(json);
			controller.save_subscription();
			$httpBackend.flush();
		});
		it("editor closed", () => {
			expect(scope.subscription).toBeNull();
		});
		it("added to settings list", () => {
			var lastSub = scope.settings.subscriptions.last();
			expect(lastSub.json.id).toBe("new");
			expect(lastSub.sched.all_day).toBeTruthy();
			expect(lastSub.sched.everyday).toBeTruthy();
			expect(lastSub.tags.length).toBe(1);
			expect(lastSub.tags[0].value).toBe('DevOps');
		});
	});

	describe("subscription edit", () => {
		beforeEach(() => {
			controller.edit_subscription(scope.settings.subscriptions[0]);
		});
		it("editor open", () => {
			expect(scope.subscription).toBe(scope.settings.subscriptions[0]);
		});
		describe("edit canceled", () => {
			beforeEach(() => {
				controller.cancel_subscription();
			});
			it("editor closed", () => {
				expect(scope.subscription).toBeNull;
			});
		});
		describe("subscription deleted", () => {
			beforeEach(() => {
				$httpBackend.whenDELETE("/subscription/a3581005-c289-4dea-bd8e-77b8fc23a3e3").respond({});
				controller.delete_subscription(scope.subscription);
				$httpBackend.flush();
			});
			it("editor closed", () => {
				expect(scope.subscription).toBeNull;
			});
			it("removed from settings", () => {
				expect(scope.settings.subscriptions.length).toBe(1);
				expect(scope.settings.subscriptions[0].json.id).not.toBe("a3581005-c289-4dea-bd8e-77b8fc23a3e3");
			});
		});
	});
	
	describe("test subscription", () => {
		beforeEach(() => {
			$httpBackend.whenPUT("/subscription").respond(scope.settings.subscriptions[0].json);
			spyOn(api.subscription, 'test');
			scope.subscription = scope.settings.subscriptions[0];
			controller.test_subscription(scope.settings.subscriptions[0]);
			$httpBackend.flush();
		})
		it("http request sended", () => {
			expect(api.subscription.test).toHaveBeenCalled();
		});
	});
})