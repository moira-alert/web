import {Api} from '../services/api';
import {UniqList} from '../models/core';
import {Notification} from '../models/notification';

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
