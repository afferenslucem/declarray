import { expect } from 'chai';
import { Sequence } from '../../../../src/sequences/sequence';
import { DefaultComparator } from '../../../../src/utils/default-comparator';
import { books } from '../../../models/fixtures';
import { IBookShort } from '../../../models/i-book';
import { AuthorComparator } from '../../../utils/author-comparator';
import { GroupSequence } from '../../../../src/sequences/implementations/group-sequence';

describe('GroupSequence', () => {
    describe('Creation', () => {
        it('from other seq with single element', () => {
            const temp = new Sequence([1, 2, 3, 4]);
            const result = new GroupSequence<number, number, Sequence<number>>(temp, item => item % 2, new DefaultComparator());

            expect(result).not.equal(undefined);
        });

        it('from other seq with group modifier', () => {
            const temp = new Sequence([1, 2, 3, 4]);
            const result = new GroupSequence<number, number, number[]>(
                temp,
                item => item % 2,
                new DefaultComparator(),
                group => group.toArray(),
            );

            expect(result).not.equal(undefined);
        });
    });

    describe('Computing', () => {
        it('should group by primitive key', () => {
            const temp = new Sequence([1, 2, 3, 4, 5, 6]);
            const seq = new GroupSequence<number, boolean, Sequence<number>>(temp, item => Boolean(item % 2), new DefaultComparator());

            const result = seq.toArray();

            expect(result).deep.equal([
                {
                    key: false,
                    group: new Sequence([2, 4, 6]),
                },
                {
                    key: true,
                    group: new Sequence([1, 3, 5]),
                },
            ]);
        });

        it('should group by primitive key with group modifier', () => {
            const temp = new Sequence([1, 2, 3, 4, 5, 6]);
            const seq = new GroupSequence<number, boolean, number[]>(
                temp,
                item => Boolean(item % 2),
                new DefaultComparator(),
                group => group.toArray(),
            );

            const result = seq.toArray();

            expect(result).deep.equal([
                {
                    key: false,
                    group: [2, 4, 6],
                },
                {
                    key: true,
                    group: [1, 3, 5],
                },
            ]);
        });

        it('should group by authorArray', () => {
            const temp = new Sequence(books).select<IBookShort>(item => ({
                name: item.name,
                authors: item.authors,
            }));

            const seq = new GroupSequence<IBookShort, string[], IBookShort>(temp, item => item.authors, new AuthorComparator());

            const result = seq.toArray();

            expect(result).deep.equal([
                {
                    key: ['???????????? ????????????????'],
                    group: new Sequence([
                        {
                            name: '???????????? ?? ??????????????????',
                            authors: ['???????????? ????????????????'],
                        },
                    ]),
                },
                {
                    key: ['?????????????? ????????????????????'],
                    group: new Sequence([
                        {
                            name: '?????????? 2034',
                            authors: ['?????????????? ????????????????????'],
                        },
                        {
                            name: '?????????? 2033',
                            authors: ['?????????????? ????????????????????'],
                        },
                    ]),
                },
                {
                    key: ['?????????? ??????????????????????'],
                    group: new Sequence([
                        {
                            name: '???????????????????????? ?? ??????????????????',
                            authors: ['?????????? ??????????????????????'],
                        },
                    ]),
                },
            ]);
        });

        it('should group by authorArray with group modifying', () => {
            const temp = new Sequence(books).select<IBookShort>(item => ({
                name: item.name,
                authors: item.authors,
            }));

            const seq = new GroupSequence<IBookShort, string[], string[]>(
                temp,
                item => item.authors,
                new AuthorComparator(),
                group => group.select(item => item.name).toArray(),
            );

            const result = seq.toArray();

            expect(result).deep.equal([
                {
                    key: ['???????????? ????????????????'],
                    group: ['???????????? ?? ??????????????????'],
                },
                {
                    key: ['?????????????? ????????????????????'],
                    group: ['?????????? 2034', '?????????? 2033'],
                },
                {
                    key: ['?????????? ??????????????????????'],
                    group: ['???????????????????????? ?? ??????????????????'],
                },
            ]);
        });
    });
});
