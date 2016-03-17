import {NumDictionary} from '../../app/models/core';

describe("NumDictionary", () => {

	var dict: NumDictionary;

	beforeEach(() => {
		dict = new NumDictionary();
	});

	it('count', () => {
		expect(dict.count).toBe(0);
		dict.set('a', 1);
		expect(dict.count).toBe(1);
		dict.getOrCreate('a', 2);
		expect(dict.count).toBe(1);
		dict.set('b', 1);
		expect(dict.count).toBe(2);
		dict.remove('a');
		expect(dict.count).toBe(1);
	});

	it ('get', () => {
		expect(dict.get('a')).toBeUndefined();
		expect(dict.get('a', 1)).toBe(1);
		expect(dict.get('a')).toBeUndefined();
	});

	it ('getOrCreate', () => {
		expect(dict.getOrCreate('a', 1)).toBe(1);
		expect(dict.get('a', 1)).toBe(1);
	});

	it ('has', () => {
		expect(dict.has('a')).toBeFalsy;
		dict.set('a', 1);
		expect(dict.has('a')).toBeTruthy;
	});

	it ('increment', () => {
		dict.set('a', 1);
		dict.increment('a');
		expect(dict.get('a')).toBe(2);
		dict.increment('a', 3);
		expect(dict.get('a')).toBe(5);
	});

	it ('keys', () => {
		dict.set('a', 1);
		dict.set('b', 2);
		expect(dict.keys).toEqual(['a', 'b']);
	});

});