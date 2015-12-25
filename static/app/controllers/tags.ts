import {Api} from '../services/api';
import {Tag, ITagData} from '../models/tag';
import {ITagStat} from '../models/tag_stat';
import {Dictionary} from '../models/core';
import {Contact} from '../models/contact';
import {ContactConfig} from '../models/config';
import {Subscription} from '../models/subscription';

export class TagStat {
	tag: Tag;
	subscriptions: Array<Subscription>;
	constructor(public json: ITagStat, contacts: Dictionary<Contact>) {
		this.tag = new Tag(json.name);
		this.subscriptions = json.subscriptions.map((s) => { return new Subscription(s, contacts); })
	}
}

export interface ITagsScope extends ng.IScope {
	tags: Array<TagStat>;
	show_tag: TagStat;
}

export class TagsController {

	static $inject = ['$scope', 'api'];

	constructor(private $scope: ITagsScope, private api: Api) {
		api.config().then((config) => {
			return api.contact.list()
				.then((data) => {
					var contacts = new Dictionary<Contact>();
					angular.forEach(data.list, (json) => {
						contacts.set(json.id, new Contact(json, config.contacts.get(json.type)));
					});
					api.tag.stats().then((data) => {
						$scope.tags = data.list.map((json) => { return new TagStat(json, contacts); });
					});
				});
		});
	}
	delete_tag(tag: string, index: number) {
				this.api.tag.delete(tag).then(() => {
					this.$scope.tags.splice(index, 1);
				});
			};

		delete_sub(tag: TagStat, sub_id, index) {
			this.api.subscription.delete(sub_id).then(() => {
				tag.subscriptions.splice(index, 1);
			});
		};

		show_tag(tag: TagStat) {
			if (this.$scope.show_tag == tag)
				this.$scope.show_tag = null;
			else
				this.$scope.show_tag = tag;
		}
	}

