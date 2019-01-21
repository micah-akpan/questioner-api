import 'chai/register-should';
import Helpers from '../../../controllers/helpers';

const { RecordTransformer } = Helpers;

describe.only('RecordTransformer', () => {
  const testRecords = [
    {
      id: 1, name: 'my name', likes: null, dislikes: ['something', null, null]
    },
    {
      id: 2, name: 'my name', likes: null, dislikes: ['something', null, null]
    },
    {
      id: 3, name: 'my name', likes: null, dislikes: ['something']
    },
  ];

  before(() => {

  });

  describe('class', () => {
    it('should be a function', () => {
      RecordTransformer.should.be.a('Function');
    });

    it('should have a "transform" static method', () => {
      RecordTransformer.transform.should.be.a('function');
    });
  });

  describe('tranform()', () => {
    it('should remove nulls from records', () => {
      const records = [...testRecords];
      const newRecords = RecordTransformer.transform(records, 'likes', 'remove-nulls');

      newRecords[0].should.not.have.property('likes');
    });

    it('should replace nulls with empty array', () => {
      const records = [
        { title: 'hello', things: null },
        { title: 'hi', things: null },
      ];

      const newRecords = RecordTransformer.transform(records, 'things', 'nulls-to-empty-array');

      Array.isArray(newRecords[0].things).should.be.true;
      newRecords[0].things.length.should.equal(0);
    });

    it('should replace inner nulls with empty string', () => {
      const records = [
        { title: 'hello', things: [null, 'something'] },
        { title: 'hi', things: [null] },
      ];

      const newRecords = RecordTransformer.transform(records, 'things', 'inner-nulls-with-empty-string');

      newRecords[0].things[0].should.be.a('string');
      newRecords[0].things[0].length.should.equal(0);
    });

    it('should return the original array if an invalid or no action was specified', () => {
      const records = [
        { title: 'hello', things: [null, 'something'] },
        { title: 'hi', things: [null] },
      ];

      const newRecords = RecordTransformer.transform(records, 'things', '');

      newRecords[0].things.length.should.equal(2);
      newRecords[0].things.should.include(null);
    });
  });
});
