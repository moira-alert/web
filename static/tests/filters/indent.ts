import {patterns} from '../jsons/patterns';
import {IndentFilter} from '../../app/filters/indent';

describe("Indentation", () => {
  var filter: any;

  beforeEach(() => {
      inject(($filter) => {
          filter = IndentFilter();
      });
  });

  it("should produce correct result on all test cases", () => {
      for(var i=0; i<patterns.length; i++) {
        var pattern = patterns[i];
        expect(filter(pattern.in)).toEqual(pattern.out);
      }
  });
});
