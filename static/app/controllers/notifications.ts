import {Api} from '../services/api';
import {UniqList} from '../models/core';
import {Timestamp} from '../models/timestamp';

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
	trigger:   string
	contact: INotificationContact;

	constructor(public json: string){
		var notification = <INotification>JSON.parse(json);
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

export interface INotificationsScope extends ng.IScope {
	total: number;
	list: UniqList<Notification>;
}

export class NotificationsController {

	static $inject = ['$scope', 'api'];

	constructor(private $scope: INotificationsScope, private api: Api) {
		api.config().then((config) => {
			return api.notification.list()
				.then((data) => {
					$scope.total = data.total;
					$scope.list = new UniqList<Notification>([]);
					angular.forEach(data.list, (json) => {
						$scope.list.push(new Notification(json));
					});
				});
		});
	}

	remove(notification: Notification){
		this.api.notification.remove(notification.id()).then((data) => {
			if(data.result > 0){
				this.$scope.list.remove(notification);
			}
		});
	}
}
