import {Number} from './core';

export interface ISchedDay {
	enabled: boolean;
	name: string;
}

export interface IScheduleJson {
	startOffset: number;
	endOffset: number;
	days: Array<ISchedDay>;
	tzOffset:number;
}

export class Schedule {

	startTime: string;
	endTime: string;
	description: string;
	everyday: boolean;
	all_day: boolean;

	constructor(public json: IScheduleJson) {
		var days: Array<ISchedDay> = [];
		var names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
		for (var day = 0; day < 7; day++) {
			days.push({ enabled: true, name: names[day] });
		}
		json.days = json.days || days;
		var now = new Date();
		now.setHours(0, 0, 0, 0);
		this.json.startOffset = this.json.startOffset || 0;
		this.json.endOffset = this.json.endOffset || (23 * 60 + 59);
		var startTime = new Date(now.getTime() + (json.startOffset || 0) * 60000);
		var endTime = new Date(now.getTime() + (json.endOffset || (23 * 60 + 59)) * 60000);
		this.startTime = Number.ZeroLeadString(startTime.getHours()) + ":" + Number.ZeroLeadString(startTime.getMinutes());
		this.endTime = Number.ZeroLeadString(endTime.getHours()) + ":" + Number.ZeroLeadString(endTime.getMinutes());
		this.check_days();
	}

	check_days() {
		this.description = "Everyday";
		this.everyday = true;
		if (this.json.days.filter((day) => { return !day.enabled }).length) {
			this.everyday = false;
			this.description = "";
			this.json.days.map((day) => {
				if (day.enabled)
					this.description += ", " + day.name;
			});
			this.description = this.description.substring(2);
		}
		this.description += " " + this.startTime + "-" + this.endTime;
		this.all_day = Math.abs(this.json.endOffset - this.json.startOffset) == (23 * 60 + 59);
	}

	data(): IScheduleJson {
		var offsets = this.getOffsets();
		return {
			days: this.json.days,
			startOffset: offsets.start,
			endOffset: offsets.end,
			tzOffset: offsets.tz
		};
	}

	private getOffsets() {
		var tzOffset = (new Date()).getTimezoneOffset();
		var startOffset = Schedule.GetTimeOffset(this.startTime);
		var endOffset = Schedule.GetTimeOffset(this.endTime);
		if(endOffset < startOffset)
			endOffset = 1440 + endOffset;
		return { start: startOffset, end: endOffset, tz: tzOffset };
	}

	private static GetTimeOffset(time: string): number {
		var parts = time.split(':');
		return parseInt(parts[0]) * 60 + parseInt(parts[1]);
	}

}