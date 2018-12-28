import 'chai/register-should';
import {
  omitProps, getFutureDate, isBoolean, hasProp, getProp
} from '../../utils';

describe('Utils', () => {
  describe('omitProps()', () => {
    it('should omit some props from an obj', () => {
      const obj = { a: 1, b: 2, c: 3 };
      omitProps(obj, ['a', 'b']).should.deep.equal({ c: 3 });
    });
  });

  describe('getFutureDate()', () => {
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

  describe('isBoolean()', () => {
    it('should return true for a primitive boolean value check', () => {
      isBoolean(false).should.equal(true);
    });

    it('should return true for a reference boolean value check', () => {
      /* eslint-disable no-new-wrappers */
      const value = new Boolean(true);
      isBoolean(value).should.equal(true);
    });

    it('should return false for a non-boolean type', () => {
      isBoolean(1).should.equal(false);
    });

    it('should return false for a non-boolean type', () => {
      isBoolean([]).should.equal(false);
    });

    it('should return false for a non-boolean type', () => {
      isBoolean('').should.equal(false);
    });
  });

  describe('hasProp()', () => {
    it('should return true for an existing prop', () => {
      hasProp({
        a: 1,
        b: 2
      }, 'b').should.equal(true);
    });


    it('should return true for an existing prop', () => {
      hasProp({
        a: 1,
        b: 2
      }, 'a').should.equal(true);
    });

    it('should return false for a non-existing prop', () => {
      hasProp({
        a: 1,
        b: 2
      }, 'c').should.equal(false);
    });
  });

  describe('getProp()', () => {
    it('should return props value for an object', () => {
      getProp({
        a: 1,
        b: 2
      }, 'a').should.equal(1);
    });
  });
});
