import {Trigger} from '../../app/models/trigger';
import {TagList} from '../../app/models/tag';
import {triggers} from '../jsons/triggers';
import {tags} from '../jsons/tags';

describe("Trigger", () => {
	var trigger:Trigger;
	
	beforeEach(() => {
		trigger = new Trigger(<any>triggers.list[0], new TagList(tags.list));
	});
	
	it("it has state except OK", () => {
		expect(trigger.has_state_except("OK")).toBeTruthy();
	});
	
});