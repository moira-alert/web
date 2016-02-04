import {Dictionary, UniqList, IStringId} from '../models/core';
import {Api} from '../services/api';
import {Schedule, IScheduleJson} from './schedule';
import {State} from './state';
import {Tag, TagList} from './tag';
import {Timestamp} from './timestamp';
import {Value} from './value';

export interface IMetricCheckJson {
	state: string;
	timestamp: number;
	value?: number;
	event_timestamp?: number;
	maintenance: number;
}

export interface ILastCheckMetrics {
	[metric: string]: IMetricCheckJson;
}

export interface ILastCheckJson {
	state: string;
	timestamp: number;
	event_timestamp?: number;
	metrics: ILastCheckMetrics;
}

export interface ITriggerJson {
	id: string;
	name: string;
	expression: string;
	warn_value: string;
	error_value: string;
	last_check: ILastCheckJson;
	targets: Array<string>;
	ttl_state: string;
	patterns: Array<string>;
	tags: Array<string>;
	throttling: number;
	ttl: string;
	timestamp: number;
	sched: IScheduleJson;
	target: string;
}

export class MetricCheck {
	state: State;
	timestamp: Timestamp;
	value: Value;
	event_timestamp: Timestamp;

	constructor(public metric: string, public json: IMetricCheckJson) {
		this.state = new State(json.state)
		if (json.timestamp)
			this.timestamp = new Timestamp(json.timestamp)
		if (json.event_timestamp)
			this.event_timestamp = new Timestamp(json.event_timestamp)
		this.value = new Value(json.value);
	}

	id(): string {
		return this.metric;
	}
}

export class Target {
	constructor(public value = '') {
	}
}

export class MetricState implements IStringId {
	count: number = 0;
	min_value: Value;
	max_value: Value;

	constructor(public state: State) {
	}

	id(): string {
		return this.state.name;
	}

	add_value(value: number) {
		this.count++;
		if (value != undefined) {
			this.min_value = new Value(Math.min(this.min_value == undefined ? value : this.min_value.num, value));
			this.max_value = new Value(Math.max(this.max_value == undefined ? value : this.max_value.num, value));
		}
	}
}

export class LastCheck {
	state: State;
	private _metrics_checks = new Dictionary<MetricCheck>();
	private _state_checks = new Dictionary<UniqList<MetricCheck>>();
	private _metric_states = new UniqList<MetricState>([]);
	timestamp: Timestamp;
	event_timestamp: Timestamp;
	private _score: number;
	private _initialized: boolean;

	constructor(public json: ILastCheckJson) {
		this.state = new State(json.state || 'NODATA');
		this.timestamp = new Timestamp(json.timestamp || (Date.now() / 1000));
		if (json.event_timestamp)
			this.event_timestamp = new Timestamp(json.event_timestamp);
	}
	
	private init(){
		var metric_states = new Dictionary<MetricState>();
		angular.forEach(this.json.metrics, (json: IMetricCheckJson, metric: string) => {
			var metric_check = this._metrics_checks.set(metric, new MetricCheck(metric, json));
			var metric_state = metric_states.getOrCreate(json.state, new MetricState(new State(json.state)));
			metric_states.set(json.state, metric_state);
			metric_state.add_value(json.value);
			this._state_checks.getOrCreate(json.state, new UniqList<MetricCheck>([])).push(metric_check);

		});
		angular.forEach(metric_states.dict, (state) => {
			this._metric_states.push(state);
		});
		this._metric_states.sort((a, b) => { return b.state.weight - a.state.weight; });
		this._score = (this._metric_states
			.map((m_state) => { return m_state.state.weight })
			.reduce((p, c) => { return p + c; }, 0) + this.state.weight) / (this._metric_states.length + 1);
		this._initialized = true;
	}
	
	get metric_states(): UniqList<MetricState>{
		if(!this._initialized)
			this.init();
		return this._metric_states;
	} 
	
	get metrics_checks(): Dictionary<MetricCheck> {
		if(!this._initialized)
			this.init();
		return this._metrics_checks;
	}

	get state_checks(): Dictionary<UniqList<MetricCheck>> {
		if(!this._initialized)
			this.init();
		return this._state_checks;
	}
	
	get score(): number {
		if(!this._initialized)
			this.init();
		return this._score;		
	}
}

export class Trigger {

	sched: Schedule;
	targets: Array<Target>;
	check: LastCheck;
	tags: TagList;
	warn_value: Value;
	error_value: Value;
	ttl_state: State;
	throttle_timestamp: string

	constructor(public json: ITriggerJson, tags: TagList) {
		json.expression = json.expression || '';
		json.ttl_state = json.ttl_state || 'NODATA';
		json.throttling = json.throttling || 0;
		json.ttl = json.ttl || '';
		this.sched = new Schedule(json.sched || <IScheduleJson>{});
		this.targets = (json.targets || []).map((t) => { return new Target(t); });
		this.tags = new TagList([]);
		angular.forEach(json.tags, (tag_id) => {
			var tag = tags.get(tag_id);
			if (tag)
				this.tags.push(tag);
		});
		this.ttl_state = new State(json.ttl_state);
		if (json.target)
			this.targets.push(new Target(json.target));
		this.check = new LastCheck(json.last_check || <ILastCheckJson>{});
		this.warn_value = new Value(parseFloat(json.warn_value));
		this.error_value = new Value(parseFloat(json.error_value));
		if (json.throttling) {
			this.throttle_timestamp = new Date(json.throttling * 1000).toLocaleString();
		}
	}

	static states = ['NODATA', 'OK', 'WARN', 'ERROR'];

	data() {
		return {
			id: this.json.id,
			name: this.json.name,
			targets: this.targets.map((t) => { return t.value; }),
			warn_value: parseFloat(this.json.warn_value),
			error_value: parseFloat(this.json.error_value),
			ttl: this.json.ttl,
			ttl_state: this.ttl_state.name,
			tags: this.tags.to_string(),
			sched: this.sched.data(),
			expression: this.json.expression
		};
	}
	
	link_params() {
		var params = {
			name: this.json.name,
			warn_value: this.json.warn_value,
			error_value: this.json.error_value,
			ttl: this.json.ttl,
			ttl_state: this.ttl_state.name,
			expression: this.json.expression
		};
		angular.forEach((this.targets), (target, index) => {
			params["t" + (index + 1)] = target.value;
		});
		return params;
	}

	add_target() {
		if (this.targets[this.targets.length - 1].value)
			this.targets.push(new Target());
	};

	remove_target(index: number) {
		this.targets.splice(index, 1);
	};

	has_state_except(state: string) {
		if (this.check.state && this.check.state.name != state)
			return true;
		var states = this.check.metric_states;
		return states.length > 1 || (states.length == 1 && states[0].state.name != state);
	};

	set_ttl_state(state: string) {
		this.ttl_state = new State(state);
		this.json.ttl_state = this.ttl_state.name;
	}

	get_json_content(): string {
		return 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.data(), null, 2));
	}

}
