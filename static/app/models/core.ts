interface IDictionary<T> {
	[key: string]: T;
}

export interface IStringId {
	id?():string;
}

export class Dictionary<T>{
	dict: IDictionary<T>;
	count: number = 0;

	constructor() {
		this.dict = {};
	}

	set(key: string, value: T): T {
		if (this.dict[key] == undefined)
			this.count++;
		this.dict[key] = value;
		return value;
	}

	get(key: string, default_value?: T): T {
		return this.dict[key] || <T>default_value;
	}

	has(key: string): boolean {
		return this.dict[key] != undefined;
	}

	getOrCreate(key: string, default_value: T) {
		var result = this.dict[key];
		if (result == undefined) {
			result = default_value;
			this.dict[key] = result;
			this.count++;
		}
		return result;
	}

	get keys(): Array<string> {
		return Object.keys(this.dict);
	}

	remove(key: string): T {
		var item = this.dict[key];
		if(item != undefined){
			delete this.dict[key];
			this.count --;
		}
		return item;
	}

}

export class NumDictionary extends Dictionary<number>{

	increment(key: string, inc = 1) {
		var count = this.getOrCreate(key, 0);
		this.set(key, count + inc);
	}
}

export class Number {
	public static ZeroLeadString(num: number): string {
		var s = num.toString();
		if (s.length < 2)
			return "0" + s;
		return s;
	}
}

export class ExtArray<T> extends Array<T>{
	last(): T{
		if(this.length == 0)
			return undefined;
		return this[this.length - 1];
	}
	
	remove(item:T):boolean{
		var index = this.indexOf(item);
		if(index > -1){
			this.splice(index, 1);
			return true;
		}
		return false;
	}
}

function GetStringId(o: IStringId): string{
	if(o.id)
		return o.id();
	return o.toString();
}

export class UniqList<T extends IStringId> extends ExtArray<T>{
	
	private dict = new Dictionary<T>();
	
	constructor(items:Array<T>){
		super();
		items.forEach((item) => {
			this.push(item);
		});
	}
	
	push(item:T):number{
		if(!this.dict.has(GetStringId(item))){
			this.dict.set(GetStringId(item), item);
			return super.push(item);
		}
	}
	
	pop():T{
		var item = super.pop();
		if(item)
			this.dict.remove(GetStringId(item));
		return item;
	}
	
	remove(item:T):boolean{
		if(this.dict.remove(GetStringId(item)) != undefined){
			var index = this.indexOf(item);
			if(index > -1){
				this.splice(index, 1);
				return true;
			}
		}
		return false;
	}
	
	get(id:string){
		return this.dict.get(id);
	}

	contains(item:T):boolean{
		return this.contains_id(GetStringId(item));
	}

	contains_id(id:string):boolean{
		return this.dict.has(id);
	}
	
	contains_by(filter: (item:T) => boolean){
		for(var i=0; i<this.length; i++){
			if(filter(this[i])){
				return true;
			}
		}
		return false;
	}
	
	include(list:Array<T>):boolean{
		for(var i=0; i < list.length; i++){
			if(!this.contains(list[i]))
				return false;
		}
		return true;
	}
	
	to_string():Array<string>{
		return this.map((item) => {return GetStringId(item)});
	}
}
