import {IStringId} from './core';
import {ContactConfig} from './config';

export interface IContactJson{
	id:string;
	type:string;
	user:string;
	value:string;
}

export class Contact implements IStringId{
	constructor(public json:IContactJson, public config: ContactConfig){
	}
	
	id():string{
		return this.json.id;
	}
}