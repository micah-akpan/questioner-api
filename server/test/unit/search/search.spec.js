import 'chai/register-should';
import { search } from '../../../controllers/helpers/search';

describe('search()', () => {
  describe('Search by topic and other criteria', () => {
    it('should return a list of matched data', () => {
      const data = [
        { topic: 'mars' },
        { topic: 'cryptoeconomics' }
      ];

      search(data, 'topic', 'planet mars').length.should.be.greaterThan(0);
    });

    it('should return an empty list for no match', () => {
      const data = [
        { title: 'mars' },
        { title: 'cryptoeconomics' }
      ];

      search(data, 'title', 'cyptoeconomics').length.should.equal(0);
    });

    it('should throw an error for wrong search criteria type', () => {
      const data = [
        { title: 'mars' },
        { title: 'cryptoeconomics' }
      ];

      (() => search(data, 1, 'cyptocryptoeconomics')).should.throw();
    });
  });

  describe('Search by tag', () => {
    it('should return a list of matched data', () => {
      const data = [
        { topic: 'mars', tags: ['mars', 'planet'] },
        { topic: 'cryptoeconomics', tags: ['crypto'] }
      ];

      search(data, 'tags', 'mars').length.should.be.greaterThan(0);
    });
  });
});
