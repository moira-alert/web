import {Trigger, ITriggerJson} from './trigger';
import {TagList} from './tag';

export interface IPatternJson{
	metrics: Array<string>;
	pattern: string;
	triggers: Array<ITriggerJson>;
}

export class Pattern{
	triggers: Array<Trigger>;
	pattern:string;
	deleted:boolean = false;
	
	constructor(public json:IPatternJson, tags: TagList){
		this.triggers = json.triggers.map((t) => new Trigger(t, tags));
	}
}