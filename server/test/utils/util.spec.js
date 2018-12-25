import 'chai/register-should';
import { omitProps, getFutureDate } from '../../utils';

describe('Utils', () => {
  describe('#omitProps', () => {
    it('should omit some props from an obj', () => {
      const obj = { a: 1, b: 2, c: 3 };
      omitProps(obj, ['a', 'b']).should.deep.equal({ c: 3 });
    });
  });

  describe('#getFutureDate', () => {
    let today = null;

    before(() => {
      today = new Date().getTime();
    });
    it('should return a future date', () => {
      getFutureDate().getTime().should.be.greaterThan(today);
    });

    it('should return a future date', () => {
      today.should.be.lessThan(getFutureDate(4).getTime());
    });

    after(() => {
      today = null;
    });
  });
});
