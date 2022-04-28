import { getHashCode } from '../../../src/utils/hash';
import { assert } from 'chai';

describe('Hash', () => {
    it('should return hash for string', () => {
        const text = 'qwerty';

        const hash = getHashCode(text);

        assert.equal(hash, 13260107);
    });

    it('should return hash for number', () => {
        const text = 123456;

        const hash = getHashCode(text);

        assert.equal(hash, 6307480);
    });
});
