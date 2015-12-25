import {Schedule, IScheduleJson} from '../../app/models/schedule';

describe("Schedule", () => {
	var sched: Schedule;

	beforeAll(() => {
		sched = new Schedule(<IScheduleJson>{});
	});

	it("default time interval is all day", () => {
		expect(sched.all_day).toBeTruthy();
	});
	
	describe("set interval across day", () => {
		beforeAll(() => {
			sched.startTime = "23:00";
			sched.endTime = "01:00"
		});
		it("interval length is two hour", () => {
			var json = sched.data();
			expect(json.endOffset - json.startOffset).toBe(2 * 60);
		});
	});
});
