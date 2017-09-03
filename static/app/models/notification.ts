import {Timestamp} from './timestamp';

export interface INotificationContact{
	id:string;
	type:string;
	value:string;
}

export interface INotificationEvent{
	trigger_id:string;
	sub_id:string;
}

export interface INotification {
	contact: INotificationContact;
	event: INotificationEvent;
	throttled: boolean;
	send_fail: number;
	timestamp: number;
}

export class Notification {
	idstr:     string;
	throttled: boolean;
	timestamp: Timestamp;
	send_fail: number;
	trigger:   string;
	contact: INotificationContact;

	constructor(public json: INotification){
		var notification = json;
		this.idstr = notification.timestamp + notification.contact.id + notification.event.sub_id
		this.trigger = notification.event.trigger_id;
		this.timestamp = new Timestamp(notification.timestamp);
		this.send_fail = notification.send_fail;
		this.throttled = notification.throttled;
		this.contact = notification.contact;
	}

	id():string{
		return this.idstr;
	}

}
