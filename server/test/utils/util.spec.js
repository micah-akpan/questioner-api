import 'chai/register-should';
import { omitProps } from '../../utils';

describe('Utils', () => {
  describe('#omitProps', () => {
    it('should omit some props from an obj', () => {
      const obj = { a: 1, b: 2, c: 3 };
      omitProps(obj, ['a', 'b']).should.deep.equal({ c: 3 });
    });
  });
});
