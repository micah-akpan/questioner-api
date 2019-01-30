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

  after(() => {
    appModel = null;
  });
});
