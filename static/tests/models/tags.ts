import {TagList} from '../../app/models/tag';

describe("TagList", () => {
	var list1: TagList;
	var list2: TagList;
	var list3: TagList;

	beforeEach(() => {
		list1 = new TagList(["1", "2", "3"]);
		list2 = new TagList(["2", "3", "4"]);
		list3 = new TagList(["2", "3"]);
	});
	
	it("list1 not includes list 2", () => {
		expect(list1.include(list2)).toBeFalsy();
	});
	
	it("list1 includes list 3", () => {
		expect(list1.include(list3)).toBeTruthy();
	});

	it("list1 includes empty list", () => {
		expect(list1.include(new TagList([]))).toBeTruthy();
	});

});