import 'chai/register-should';
import {
  omitProps,
  getFutureDate,
  isBoolean,
  hasProp,
  getIndex,
  createTestToken,
  arrayHasValues,
  objectHasProps,
  parseStr,
  uniq,
  replaceNullValue,
  wordToPosition,
  toCamelCase,
  getLastElement,
  stripPathName
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

    it('should return a JWT token', () => {
      const token = createTestToken({
        admin: true,
        userId: 10
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
      parseStr('andela,tia,epic', ',').should.deep.equal(['andela', 'tia', 'epic']);
    });

    it('should parse a string into an array of string', () => {
      parseStr('andela tia epic').should.deep.equal(['andela', 'tia', 'epic']);
    });
  });

  describe('uniq()', () => {
    it('should return only unique values in an array', () => {
      uniq(['a', 'b', 'b', 'a']).should.deep.equal(['a', 'b']);
    });
  });

  describe('replaceNullValue()', () => {
    it('should replace null object prop values with a replacer value', () => {
      replaceNullValue({ a: 1, b: null }, '').should.deep.equal({
        a: 1, b: ''
      });
    });

    it('should replace null object prop values with a replacer value', () => {
      replaceNullValue({ a: 1, b: null }, 0).should.deep.equal({
        a: 1, b: 0
      });
    });
  });

  describe('wordToPosition()', () => {
    it('should return a hash of words to position', () => {
      wordToPosition(['hello', 'bob'], 'hellobob').should.deep.equal({
        hello: 0,
        bob: 5
      });
    });

    it('should return a hash of words to position', () => {
      wordToPosition(['lorem', 'ipsum'], 'ipsum').should.deep.equal({
        ipsum: 0
      });
    });
  });

  describe('CaseChange', () => {
    it('should return a camelcased version of a word', () => {
      const words = ['hello', 'world', 'created', 'at'];
      toCamelCase(words, 'helloworld').should.equal('helloWorld');
    });

    it('should return a camelcased version of a word', () => {
      const words = ['happening', 'on', 'created', 'at'];
      toCamelCase(words, 'happeningon').should.equal('happeningOn');
    });

    it('should return a camelcased version of a word', () => {
      const words = ['happening', 'on', 'created', 'at'];
      toCamelCase(words, 'createdat').should.equal('createdAt');
    });
  });

  describe('getLastElement()', () => {
    it('should return the last element of an array', () => {
      const values = ['a', 'b'];
      getLastElement(values).should.equal('b');
    });

    it('should return the last element of an array', () => {
      const values = [{ a: 1 }, { a: 10 }];
      getLastElement(values).should.deep.equal({ a: 10 });
    });
  });

  describe('stripPathName()', () => {
    it('should strip path names', () => {
      stripPathName('/path/to/myfile.js').should.equal('myfile');
    });

    it('should strip path names', () => {
      stripPathName('/path/to/mypic.jpeg').should.equal('mypic');
    });
  });
});
