export class Timestamp{
	date:Date;
	time_str:string;
	date_str:string;
	
	constructor(public value:number){
		this.date = new Date(value * 1000);
		this.time_str = this.date.toLocaleTimeString();
		this.date_str = this.date.toLocaleDateString() == new Date().toLocaleDateString() ? "Today" :
						(Timestamp.MonthNames[this.date.getMonth()] + " " + this.date.getDate());
	}
	
	static MonthNames = [
		"January", "February", "March",
		"April", "May", "June", "July",
		"August", "September", "October",
		"November", "December"
	];
}