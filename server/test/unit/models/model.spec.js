import 'chai/register-should';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Model from '../../../models/all/Model';

chai.use(chaiAsPromised);

describe.only('Model Base class', () => {
  let appModel = null;

  before(() => {
    appModel = new Model('Meetup');
  });

  describe('Model instance', () => {
    it('should return a Model instance', () => {
      appModel._name.should.equal('Meetup');
      appModel._db.should.have.property('queryDb');
    });
  });
  describe('create()', () => {
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
    before(() => {

    });
    it('should return a function', () => {
      appModel.findById.should.be.a('function');
    });

    it('should reject if primary key value is not given', () => {
      appModel.findById().should.be.rejected;
    });

    it('should resolve to a record', () => {
      const record = appModel.findById(1);
      record.then.should.be.a('function');
    });
  });

  after(() => {
    appModel = null;
  });
});
