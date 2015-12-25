import {IStringId, UniqList, Dictionary} from './core';
import {Schedule, IScheduleJson} from './schedule';
import {IContactJson, Contact} from './contact';
import {Tag, TagList} from './tag';

export var pseudo_tags = new UniqList<string>(['WARN', 'ERROR', 'NODATA', 'EXCEPTION']);

export interface ISubscriptionJson {
	id: string;
	tags: Array<string>;
	contacts: Array<string>;
	enabled: boolean;
	user: string;
	sched: IScheduleJson;
	throttling: boolean
}

export class Subscription implements IStringId {
	sched: Schedule;
	contacts = new UniqList<Contact>([]);
	tags: TagList;

	constructor(public json: ISubscriptionJson, contacts: Dictionary<Contact>) {
		json.tags = json.tags || [];
		json.contacts = json.contacts || [];
		json.enabled = json.enabled == true;
		if (json.throttling == undefined)
			json.throttling = true;
		this.sched = new Schedule(json.sched || <IScheduleJson>{});
		angular.forEach(json.contacts, (id) => {
			var contact = contacts.get(id);
			if(contact)
				this.contacts.push(contact);
		});
		this.tags = new TagList(json.tags);
	}

	id(): string {
		return this.json.id;
	}

	add_tag(tag: Tag) {
		if (pseudo_tags.indexOf(tag.value) > -1) {
			angular.forEach(this.tags, (t) => {
				if (pseudo_tags.indexOf(t.value) > -1) {
					this.tags.remove(t);
				}
			});
		}
		this.tags.push(tag);
	}

	remove_contact(contact:Contact, $event:ng.IAngularEvent){
		this.contacts.remove(contact);
		$event.stopPropagation();
	}

	data():ISubscriptionJson{
		return <ISubscriptionJson>{
			id: this.json.id,
			contacts: this.contacts.map((contact) => {return contact.id();}),
			tags: this.tags.to_string(),
			sched: this.sched.data(),
			enabled: this.json.enabled,
			throttling: this.json.throttling
		};
	}
}
