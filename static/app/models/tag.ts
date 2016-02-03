import {IStringId, Dictionary, UniqList} from './core';
import {IFilter} from './filter';

export interface ITagData{
	maintenance:number;
}

export interface ITagsData{
	[tag:string]: ITagData;
}

export class Tag implements IStringId{
	data:ITagData;
	color:string;
	
	static Colors:Array<string> = ["#FFEBEE","#FCE4EC","#EDE7F6","#E8EAF6","#E1F5FE","#E0F7FA", "#E8F5E9", "#F1F8E9", "#FFFDE7", "#FFF8E1", "#FBE9E7", "#EFEBE9", "#ECEFF1"];
	
	constructor(public value:string){
		this.color = Tag.GetColor(value);
	}
	
	id():string{
		return this.value;
	}
	
	private static GetColor(value: string): string {
		if(value == 'WARN')
			return "#cccc32";
		if(value == 'ERROR')
			return "#cc0032";
		if(value == 'OK')
			return "#33cc99";
		if(value == 'EXCEPTION')
			return "#e14f4f";
		if(value == 'NODATA')
			return "lightgray";
		var hash = 0, i, chr, len;
		if (value.length == 0) return Tag.Colors[0];
		for (i = 0, len = value.length; i < len; i++) {
			chr   = value.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return Tag.Colors[Math.abs(hash) % Tag.Colors.length];
	}
}

export class TagList extends UniqList<Tag>{
	
	constructor(tags:Array<string>){
		super(tags.map((t) => {return new Tag(t);}));
	}
}

export class TagFilter implements IFilter<Tag>{
	value:string = "";
	open = false;
	filtered = new UniqList<Tag>([]);
	items_hidden = 0;
	
	constructor(public selection:TagList){
		
	}
}
