import {UniqList, IStringId} from './core';

declare var require: { (string):any; context: any}

var imgs = require.context(
  "../../css/img", 
  true,
  /.*/
);

export class Config {
	paging: {
		size: number
	};
	api_url: string;
	contacts: UniqList<ContactConfig>;
	
	constructor(json: IConfigJson){
		this.paging = json.paging;
		this.api_url = json.api_url;
		this.contacts = new UniqList(json.contacts.map((contact) => {return new ContactConfig(contact);}));
	}
}

export class ContactConfig implements IStringId{
	pattern: RegExp;
	img: string;
	
	constructor(public json: IContactConfigJson){
		this.pattern = new RegExp(json.validation || ".*");
		if(json.img){
			this.img = imgs("./"+json.img);
		}
	}
	id(): string{
		return this.json.type;
	}
}

export interface IContactConfigJson {
	type: string;
	validation: string;
	title: string;
	img: string;
	icon: string;
}

export interface IConfigJson {
	api_url: string;
	contacts: Array<IContactConfigJson>;
	paging: {
		size: number
	}
}