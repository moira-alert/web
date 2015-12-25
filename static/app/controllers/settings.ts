import {Api} from '../services/api';
import {UniqList, Dictionary} from '../models/core';
import {Settings} from '../models/settings';
import {Config} from '../models/config';
import {Tag, TagList} from '../models/tag';
import {Contact} from '../models/contact';
import {Subscription, ISubscriptionJson, pseudo_tags} from '../models/subscription';
import {GoTo} from './goto';

class NewContacts {
	[type: string]: string;
}

class ExistingContacts {
	[type: string]: UniqList<Contact>;
}

export interface ISettingsScope extends ng.IScope {
	config: Config;
	settings: Settings;
	tags: TagList;
	new_contacts: NewContacts;
	existing_contacts: ExistingContacts;
	subscription: Subscription;
}

export class SettingsController extends GoTo {

	static $inject = ['$scope', 'api', '$location', '$q'];

	constructor(private $scope: ISettingsScope, private api: Api, $location: ng.ILocationService, private $q: ng.IQService) {
		super($location);

		$scope.new_contacts = {};
		$scope.existing_contacts = {};

		api.config().then((config) => {
			$scope.config = config;
			return api.settings.get()
		}).then((data) => {
			$scope.settings = new Settings(data, $scope.config);
			angular.forEach($scope.config.contacts, (contact) => {
				$scope.existing_contacts[contact.json.type] =
				$scope.settings.contacts.getOrCreate(contact.json.type, new UniqList<Contact>([]));
			});
			return api.tag.list();
		}).then((tags) => {
			$scope.tags = tags;
			angular.forEach(pseudo_tags, (t) => {
				$scope.tags.push(new Tag(t));
			});
		});
	}

	add_sub_contact(contact: Contact) {
		if (this.$scope.subscription) {
			this.$scope.subscription.contacts.push(contact);
		}
	}

	delete_contact(contact: Contact, $event: ng.IAngularEvent) {
		$event.stopPropagation();
		this.api.contact.delete(contact.json.id).then(() => {
			this.$scope.settings.remove_contact(contact);
			this.$scope.new_contacts[contact.json.type] = "";
		});
	}

	add_contact(contact_type: string) {
		this.api.chain(() => {
			var value = this.$scope.new_contacts[contact_type];
			if (!value)
				return;
			if (!this.$scope.settings.has_contact_value(contact_type, value)) {
				return this.api.contact.save({
					"value": value,
					"type": contact_type,
				}).then((new_contact) => {
					this.$scope.settings.add_contact(new_contact);
					this.$scope.new_contacts[contact_type] = "";
				});
			}
		});
	}

	save_subscription(): ng.IPromise<string> {
		if (this.$scope.subscription.tags.length == 0 || this.$scope.subscription.contacts.length == 0)
			return this.$q.when(undefined);
		return this.api.subscription.save(this.$scope.subscription).then((json: ISubscriptionJson) => {
			if (this.$scope.subscription.json.id == undefined) {
				this.$scope.settings.add_subscription(json);
			}
			this.$scope.subscription = null;
			return json.id;
		});
	}

	delete_subscription(sub: Subscription) {
		this.api.subscription.delete(sub.json.id).then(() => {
			this.$scope.settings.subscriptions.remove(sub);
			this.$scope.subscription = null;
		});
	}

	create_subscription() {
		if (this.$scope.subscription != null)
			return;
		this.$scope.subscription = new Subscription(<ISubscriptionJson>{ enabled: true, throttling: true }, new Dictionary<Contact>());
	}

	cancel_subscription() {
		this.$scope.subscription = null;
	}

	edit_subscription(sub: Subscription) {
		this.$scope.subscription = sub;
	}

	test_subscription(sub: Subscription) {
		this.save_subscription().then((id) => {
			if(id)
				this.api.subscription.test(id);
		});
	}
}