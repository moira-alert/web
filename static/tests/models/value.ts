import {Value} from '../../app/models/value';

describe("Value", () => {
	it('toUnits', () => {
		expect(new Value(1068.05).units).toBe("1.07 K");
		expect(new Value(10).units).toBe("10");
		expect(new Value(-10).units).toBe("-10");
		expect(new Value(-2000).units).toBe("-2 K");
		expect(new Value(1500000).units).toBe("1.5 M");
	});
});