import {Trigger, ITriggerJson, ILastCheckJson} from '../models/trigger';
import {ITagData, ITagsData, TagList} from '../models/tag';
import {IEventJson} from '../models/event';
import {ITagStat} from '../models/tag_stat';
import {IContactJson} from '../models/contact';
import {IPatternJson} from '../models/pattern';
import {ISettingsJson} from '../models/settings';
import {INotification} from '../models/notification';
import {ISubscriptionJson, Subscription} from '../models/subscription';
import {Config, IConfigJson} from '../models/config';

export interface INotificationsList{
	total: number;
	list: Array<INotification>;
}

export interface IContactsList {
	list: Array<IContactJson>;
}

export interface IEventsList {
	list: Array<IEventJson>;
	page: number;
	total: number;
}

export interface ITriggersList {
	list: Array<ITriggerJson>;
	page: number;
	total: number;
}

export interface IPatternsList {
	list: Array<IPatternJson>;
}

export interface ITagsList {
	list: Array<string>;
}

export interface ITagStatsList {
	list: Array<ITagStat>;
}

export interface ApiStatus {
	response_result: any;
	response_error: any;
}

export class Api {

	private d: ng.IDeferred<Config>;
	private p: ng.IPromise<void>;

	status: ApiStatus;

	static $inject = ['$http', '$q'];

	constructor(private $http: ng.IHttpService, $q: ng.IQService) {

		this.d = $q.defer<Config>();
		this.p = $q.when();
		this.status = {
			response_result: null,
			response_error: null
		};

		$http.get('config.json').success((config: IConfigJson) => {
			var api_url = config.api_url;
			if (!(api_url[api_url.length - 1] == '/'))
				config.api_url += '/';
			this.d.resolve(new Config(config));
		}).error((message) => {
			this.status.response_error = message;
		});;
	}

	chain(callback: () => void) {
		this.p = this.p.then(callback);
	}

	private _query(query, method, data?): ng.IPromise<any> {
		this.status.response_result = null;
		this.status.response_error = null;
		var that = this;
		return this.config().then((config) => {
			return this.$http({
				url: config.api_url + query,
				method: method,
				data: data,
				headers: obj,
			}).success((data) => {
				this.status.response_result = data;
			}).error((message) => {
				this.status.response_error = message;
			});
		}).then((response: any) => {
			return response.data;
		}, (response) => {
			that.status.response_error = that.status.response_error || (response.statusText || "no response");
		});
	}

	config(): ng.IPromise<Config> {
		return this.d.promise;
	}

	event = {
		page: (triggerId: string, num: number, size: number): ng.IPromise<IEventsList> => {
			return this._query(`event/${triggerId}?p=${num}&size=${size}`, "GET");
		}
	};

	trigger = {
		save: (trigger: Trigger) => {
			var id = trigger.json.id ? "/" + trigger.json.id : "";
			return this._query("trigger" + (id), "PUT", trigger.data()).then((data) => {
				trigger.json.id = data.id;
			});

		},
		remove_metric: (trigger_id, metric) => {
			return this._query("trigger/" + trigger_id + "/metrics?" + $.param({
				name: metric
			}), "DELETE");
		},
		delete: (trigger_id: string) => {
			return this._query("trigger/" + trigger_id, "DELETE");
		},
		page: (num: number, size: number): ng.IPromise<ITriggersList> => {
			return this._query(`trigger/page?p=${num}&size=${size}`, "GET");
		},
		get: (trigger_id: string): ng.IPromise<ITriggerJson> => {
			return this._query("trigger/" + trigger_id, "GET")
		},
		reset_throttling: (trigger_id: string) => {
			return this._query("trigger/" + trigger_id + "/throttling", "DELETE");
		},
		state: (trigger_id: string): ng.IPromise<ILastCheckJson> => {
			return this._query("trigger/" + trigger_id + "/state", "GET");
		},
		maintenance: (trigger_id: string, data) => {
			return this._query("trigger/" + trigger_id + "/maintenance", "PUT", data);
		}
	};

	pattern = {
		delete: (pattern: string) => {
			return this._query("pattern/" + pattern, "DELETE");
		},
		list: ():ng.IPromise<IPatternsList> => {
			return this._query("pattern", "GET");
		}
	};

	tag = {
		list: (): ng.IPromise<TagList> => {
			return this._query("tag", "GET").then((data:ITagsList) => {
				return new TagList(data.list);
			});
		},
		delete: (tag:string) => {
			return this._query("tag/" + tag, "DELETE");
		},
		stats: (): ng.IPromise<ITagStatsList> => {
			return this._query("tag/stats", "GET");
		},
		data: (tag: string, data: ITagData) => {
			return this._query("tag/" + tag + "/data", "PUT", data);
		}
	};

	settings = {
		get: ():ng.IPromise<ISettingsJson> => {
			return this._query("user/settings", "GET");
		}
	};

	notification = {
		list: ():ng.IPromise<INotificationsList> => {
			return this._query("notification?start=0&end=-1", "GET");
		},
		remove: (id: string) => {
			return this._query("notification?id=" + id, "DELETE");
		}
	};

	contact = {
		save: (data): ng.IPromise<IContactJson> => {
			return this._query("contact", "PUT", data);
		},
		delete: (id) => {
			return this._query("contact/" + id, "DELETE");
		},
		list: ():ng.IPromise<IContactsList> => {
			return this._query("contact", "GET");
		}
	};

	user = {
		get: () => {
			return this._query("user", "GET");
		}
	};

	subscription = {
		delete: (id: string) => {
			return this._query("subscription/" + id, "DELETE");
		},
		test: (id: string) => {
			return this._query("subscription/" + id + "/test", "PUT");
		},
		save: (sub: Subscription): ng.IPromise<ISubscriptionJson> => {
			return this._query("subscription", "PUT", sub.data());
		},
		get: () => {
			return this._query("subscription", "GET");
		}
	};

	metric = {
		get: (trigger_id, start, end) => {
			return this._query("metrics?" + $.param({
				from: start,
				to: end,
				trigger: trigger_id
			}), "GET");
		}
	};
}
