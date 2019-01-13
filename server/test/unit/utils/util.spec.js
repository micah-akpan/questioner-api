import 'chai/register-should';
import {
  omitProps,
  getFutureDate,
  isBoolean,
  hasProp,
  getProp,
  getIndex,
  createTestToken,
  arrayHasValues,
  objectHasProps,
  parseStr
} from '../../../utils';

describe.only('Utils', () => {
  describe('omitProps()', () => {
    it('should omit some props from an obj', () => {
      const obj = { a: 1, b: 2, c: 3 };
      omitProps(obj, ['a', 'b']).should.deep.equal({ c: 3 });
    });

    it('should omit some props from an obj', () => {
      const obj = { a: 1, b: 2, c: 3 };
      omitProps(obj, ['a', 'b'], false).should.deep.equal({ c: 3 });
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

  describe('getIndex()', () => {
    it('should return the index of an object in an array', () => {
      const arr = [
        { a: 1 }, { a: 3 }, { a: 2 }
      ];

      getIndex(arr, 'a', 3).should.equal(1);
    });

    it('should return the index of an object in an array', () => {
      const arr = [
        { a: 1 }, { a: 3 }, { a: 2 }
      ];

      getIndex(arr, 'a', 1).should.equal(0);
    });

    it('should return -1 if no object can be found', () => {
      const arr = [
        { a: 1 }, { a: 3 }, { a: 2 }
      ];

      getIndex(arr, 'a', 4).should.equal(-1);
    });
  });

  describe('createTestToken()', () => {
    it('should return a JWT token', () => {
      const token = createTestToken({
        admin: true
      });

      token.should.be.a('string');
      token.split('.').length.should.equal(3);
    });
  });

  describe('arrayHasValues()', () => {
    it('should return true', () => {
      arrayHasValues([1, 2, 3]).should.equal(true);
    });

    it('should return false', () => {
      arrayHasValues([]).should.equal(false);
    });
  });

  describe('objectHasProps()', () => {
    it('should return true', () => {
      objectHasProps({ a: 1 }).should.equal(true);
    });

    it('should return false', () => {
      arrayHasValues({}).should.equal(false);
    });
  });

  describe('parseStr()', () => {
    it('should parse a string into an array of strings', () => {
      parseStr('andela,tia,epic').should.deep.equal(['andela', 'tia', 'epic']);
    })
  })
});
