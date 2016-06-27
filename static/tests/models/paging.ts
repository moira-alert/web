import {IPagingScope, InitPagesList} from '../../app/models/paging';

describe("Paging", () => {
	var scope: IPagingScope;

	it("list should be limited to 10", () => {
		scope = {
			total: 100,
			size: 4,
			page: 0,
			pages: []
		};
		InitPagesList(scope);
		expect(scope.pages).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
	});

	it("list should be limited to total pages", () => {
		scope = {
			total: 16,
			size: 4,
			page: 0,
			pages: []
		};
		InitPagesList(scope);
		expect(scope.pages).toEqual([0, 1, 2, 3]);
	});

	it("current page should be in the middle of the list", () => {
		scope = {
			total: 100,
			size: 4,
			page: 20,
			pages: []
		};
		InitPagesList(scope);
		expect(scope.pages).toEqual([15, 16, 17, 18, 19, 20, 21, 22, 23, 24]);
	});
});
