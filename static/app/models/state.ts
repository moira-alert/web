class Attribute{
	color:string;
	cls: string;
	weight:number;
}

class StaticAttributes{
	[name:string]: Attribute;
}

export class State {
	color:string;
	cls: string;
	weight:number;
	
	constructor(public name:string){
		var a = State.Attributes[name || 'NODATA'];
		this.color = a.color;
		this.cls = a.cls;
		this.weight = a.weight;
	}
	
	static Attributes:StaticAttributes = {
			"OK": {cls: "state-ok", color: "#4dd2c0", weight: 0},
			"WARN": {cls: "state-warn", color: "#ffc107", weight: 1},
			"ERROR": {cls: "state-error", color: "#ff5722", weight: 100},
			"NODATA": {cls: "state-nodata", color: "#9e9e9e", weight: 1000},
			"EXCEPTION": {cls: "state-exception", color: "#ff5722", weight: 100000}
		}
	
}