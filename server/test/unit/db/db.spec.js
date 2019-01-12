import 'chai/register-should';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Db from '../../../db';

chai.use(chaiAsPromised);

describe.only('DB', () => {
  describe('Drop table', () => {
    it('can drop tables', () => {
      Db.dropTable({
        tableName: '"User"',
        force: false
      }).should.eventually.be.true;
    });
  });
});
