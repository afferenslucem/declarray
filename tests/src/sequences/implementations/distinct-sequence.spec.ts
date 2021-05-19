import { expect } from 'chai';
import { Sequence } from '../../../../src/sequences/sequence';
import { DefaultComparator } from '../../../../src/utils/default-comparator';
import { books } from '../../../models/fixtures';
import { AuthorComparator } from '../../../utils/author-comparator';
import { DistinctSequence } from '../../../../src/sequences/implementations/distinct-sequence';

describe('DistinctSequence', () => {
    describe('Creation', () => {
        it('from other seq', () => {
            const temp = new Sequence<number>([1, 2, 2, 3, 3, 3, 4, 4, 4, 4]);
            const result = new DistinctSequence(temp, new DefaultComparator());

            expect(result).not.equal(undefined);
            expect(result.toArray()).deep.equal([1, 2, 3, 4]);
        });

        it('from other seq with comparator', () => {
            const temp = new Sequence(books.map(item => item.authors));
            const result = new DistinctSequence(temp, new AuthorComparator());

            expect(result).not.equal(undefined);
            expect(result.toArray()).deep.equal([['Михаил Булгаков'], ['Дмитрий Глуховский'], ['Федор Достоевский']]);
        });
    });
});
