import {UniqList, Dictionary} from './core';
import {Schedule} from './schedule';
import {Subscription, ISubscriptionJson, pseudo_tags} from './subscription';
import {TagList, Tag} from './tag';
import {Contact, IContactJson} from './contact';
import {Config} from './config';

export interface ISettingsJson{
	login:string;
	contacts:Array<IContactJson>;
	subscriptions:Array<ISubscriptionJson>;
	
}

export class Settings{
	login:string;
	sub_tags = new TagList([]);
	subscriptions:UniqList<Subscription>;
	contacts = new Dictionary<UniqList<Contact>>();
	all_contacts = new Dictionary<Contact>();
	
	constructor(public json:ISettingsJson, public config: Config){
		this.login = json.login || "anonymous";
		
		angular.forEach(json.contacts, (json) => {
			this.all_contacts.set(json.id, this.add_contact(json));
		});
		this.subscriptions = new UniqList(json.subscriptions.map((sub) => new Subscription(sub, this.all_contacts)));
		
		angular.forEach(this.subscriptions, (sub) => {
			this.process_subscription(sub);
		});
	}
	
	add_contact(json:IContactJson):Contact{
		var contact = new Contact(json, this.config.contacts.get(json.type));
		this.contacts.getOrCreate(json.type, new UniqList<Contact>([])).push(contact);
		this.all_contacts.set(contact.json.id, contact);
		return contact;
	}
	
	has_contact_value(type:string, value:string):boolean{
		var list = this.contacts.get(type);
		if(list == undefined)
			return false;
		return list.contains_by((c) => c.json.value == value);
	}
	
	remove_contact(contact:Contact){
		this.contacts.get(contact.json.type).remove(contact);
		this.all_contacts.remove(contact.json.id);
		angular.forEach(this.subscriptions, (sub) => {
			sub.contacts.remove(contact);
		});
	}
	
	add_subscription(json:ISubscriptionJson){
		var sub = new Subscription(json, this.all_contacts);
		this.subscriptions.push(sub);
		this.process_subscription(sub);
	}
	
	private process_subscription(sub:Subscription){
		angular.forEach(sub.json.tags, (tag) => {
			if(!pseudo_tags.contains(tag))
				this.sub_tags.push(new Tag(tag))
		});
	}
}
