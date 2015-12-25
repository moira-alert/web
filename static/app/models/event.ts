import {Timestamp} from './timestamp';
import {Value} from './value';
import {State} from './state';

export interface IEventJson {
	state:string;
	old_state:string;
	timestamp:number;
	value:number;
	metric: string;
}

export class Event {
	timestamp: Timestamp;
	value: Value;
	state:State;
	old_state:State;
	metric:string;
	
	constructor(public json: IEventJson){
		this.timestamp = new Timestamp(json.timestamp);
		this.value = new Value(json.value);
		this.state = new State(json.state);
		if(this.value.units == undefined)
			this.value.str = this.state.name;
		this.old_state = new State(json.old_state);
		this.metric = json.metric || 'No metric evaluated';
	}
}
