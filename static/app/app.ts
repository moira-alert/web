import * as angular from 'angular';

import {Api} from './services/api';
import {TimeProvider} from './services/time';

import {TriggersController} from './controllers/triggers';
import {TriggerController} from './controllers/trigger';
import {EventsController} from './controllers/events';
import {PatternsController} from './controllers/patterns';
import {SettingsController} from './controllers/settings';
import {TagsController} from './controllers/tags';
import {NotificationsController} from './controllers/notifications';

import {ApiStatus} from './directives/apistatus';
import {NewContact} from './directives/newcontact';
import {Contact} from './directives/contact';
import {Menu} from './directives/menu';
import {Selector} from './directives/selector';
import {Schedule} from './directives/schedule';
import {SubEditor} from './directives/subeditor';
import {Tag} from './directives/tag';
import {Timestamp} from './directives/timestamp';
import {FileRead} from './directives/fileread';
import {TriggerDownload} from './directives/triggerDownload';
import {TagsFilterList} from './directives/tags_filter_list';
import {Maintenance} from './directives/maintenance';
import {RemoveMetricCheck} from './directives/removeMetricCheck';

declare function require(string): any;

require('../css/moira.css');
require('material-design-icons.css');
require('materialize.scss');
require('materialize.js');
require('materialize-tabs.js');

var app = angular.module('moira', [require('angular-route'), require('angular-cookies')]);
app.service('time', TimeProvider);
app.service('api', Api);
app.directive('moiraApiStatus', ApiStatus);
app.directive('moiraNewContact', NewContact);
app.directive('moiraContact', Contact);
app.directive('moiraMenu', Menu);
app.directive('moiraSelector', Selector);
app.directive('moiraSubEditor', SubEditor);
app.directive('moiraSchedule', Schedule);
app.directive('moiraTag', Tag);
app.directive('moiraTagsFilterList', TagsFilterList);
app.directive('moiraTimestamp', Timestamp);
app.directive('moiraMaintenance', Maintenance);
app.directive('moiraRemoveMetricCheck', RemoveMetricCheck);
app.directive('fileRead', FileRead);
app.directive('triggerDownload', TriggerDownload);
app.controller('TriggersController', TriggersController);
app.controller('TriggerController', TriggerController);
app.controller('EventsController', EventsController);
app.controller('PatternsController', PatternsController);
app.controller('SettingsController', SettingsController);
app.controller('TagsController', TagsController);
app.controller('NotificationsController', NotificationsController);

app.config(['$routeProvider',
	function ($routeProvider:ng.route.IRouteProvider) {
		$routeProvider.when('/triggers/', {
			template: require('../triggers.html'),
			controller: 'TriggersController',
			controllerAs: 'ctrl',
			reloadOnSearch: false
		}).when('/trigger/:triggerId?', {
			template: require('../trigger.html'),
			controller: 'TriggerController',
			controllerAs: 'ctrl'
		}).when('/settings/', {
			template: require('../settings.html'),
			controller: 'SettingsController',
			controllerAs: 'ctrl'
		}).when('/events/:triggerId?/:tab?', {
			template: require('../events.html'),
			controller: 'EventsController',
			controllerAs: 'ctrl',
			reloadOnSearch: false
		}).when('/patterns/', {
			template: require('../patterns.html'),
			controller: 'PatternsController',
			controllerAs: 'ctrl'
		}).when('/tags/', {
			template: require('../tags.html'),
			controller: 'TagsController',
			controllerAs: 'ctrl'
		}).when('/notifications/', {
			template: require('../notifications.html'),
			controller: 'NotificationsController',
			controllerAs: 'ctrl'
		}).otherwise({
			redirectTo: '/triggers/'
		});
}]);
