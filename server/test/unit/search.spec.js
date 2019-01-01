import 'chai/register-should';
import Search from '../../controllers/helpers/search';

describe('Search', () => {
  describe('Search by topic and other criteria', () => {
    it('should return a list of matched data', () => {
      const data = [
        { topic: 'mars' },
        { topic: 'cryptoeconomics' }
      ];

      Search.search(data, 'topic', 'planet mars').length.should.be.greaterThan(0);
    });

    it('should an empty list for no match', () => {
      const data = [
        { title: 'mars' },
        { title: 'cryptoeconomics' }
      ];

      Search.search(data, 'title', 'cyptoeconomics').length.should.equal(0);
    });
  });

  describe('Search by tag', () => {
    it('should return a list of matched data', () => {
      const data = [
        { topic: 'mars', tags: ['mars', 'planet'] },
        { topic: 'cryptoeconomics', tags: ['crypto'] }
      ];

      Search.search(data, 'tags', 'mars').length.should.be.greaterThan(0);
    });
  });
});
