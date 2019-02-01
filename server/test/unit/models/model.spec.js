import 'chai/register-should';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Model from '../../../test-fixtures/model';
import db from '../../../test-fixtures/db';

chai.use(chaiAsPromised);

describe.only('Model Base class', () => {
  let appModel = null;

  before(() => {
    appModel = new Model('Meetup', db);
  });

  describe('Model instance', () => {
    it('should return a Model instance', () => {
      appModel._name.should.equal('Meetup');
      appModel._db.should.have.property('queryDb');
    });
  });
  describe.skip('create()', () => {
    it('should return a function', () => {
      appModel.create.should.be.a('function');
    });
    it('should return a Promise', () => {
      appModel.create({}).then.should.be.a('function');
    });

    it('should return a promise that rejects', () => {
      appModel.create().should.be.rejected;
    });
  });

  describe('findById()', () => {
    it('should return a function', () => {
      appModel.findById.should.be.a('function');
    });

    it('should reject if primary key value is not given', () => {
      appModel.findById().should.be.rejected;
    });

    it('should resolve to a record', async () => {
      const record = await appModel.findById(1);
      record.id.should.equal(1);
    });
  });

  after(() => {
    appModel = null;
  });
});
