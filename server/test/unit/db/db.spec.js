import 'chai/register-should';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import db from '../../../db';

chai.use(chaiAsPromised);

describe.only('DB', () => {
  describe('Drop table', () => {
    before(async () => {
      await db.createTable('User');
    });
    it('can drop tables', () => {
      db.dropTable({
        tableName: '"User"',
        force: false
      }).should.eventually.have.property('rows');
    });
  });
});
