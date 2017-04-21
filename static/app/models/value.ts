export class Value{
	units:string;
	str:string;
	
	constructor(public num:number = undefined){
		this.units = Value.ToUnits(num);
		this.str = this.units || '—';
	}
		
	static ToUnits(v: number): string {
		if(v == undefined)
			return undefined;
		var value = parseFloat(v.toString());
		var sizes = ['', ' K', ' M', ' G', ' T', ' P', ' E', ' Z', ' Y'];
		if (value == 0) return '0';
		var i = 0;
		while (Math.pow(1000, i + 1) < Math.abs(value))
			i++;
		var prefix = (value / Math.pow(1000, i)).toFixed(2).toString();
		if(i == 0)
			prefix = value.toFixed(2).toString();
		var tail_to_cut = 0;
		while (prefix[prefix.length - (tail_to_cut + 1)] == '0'){
			tail_to_cut ++;
		}
		if(prefix[prefix.length - (tail_to_cut + 1)] == '.')
			tail_to_cut ++;
		return prefix.substring(0, prefix.length - tail_to_cut) + (sizes[i] || '');
	}
}
