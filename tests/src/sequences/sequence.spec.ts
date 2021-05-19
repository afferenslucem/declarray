import { expect } from 'chai';
import { Sequence } from '../../../src/sequences/sequence';
import { ICat } from '../../models/i-cat';
import { IPerson } from '../../models/i-person';
import { PersonComparator } from '../../utils/person-comparator';
import { CatComparator } from '../../utils/cat-comparator';
import { SelectSequence } from '../../../src/sequences/implementations/select-sequence';
import { WhereSequence } from '../../../src/sequences/implementations/where-sequence';
import { OrderBySequence } from '../../../src/sequences/implementations/order-by-sequence';
import { SkipSequence } from '../../../src/sequences/implementations/skip-sequence';
import { TakeSequence } from '../../../src/sequences/implementations/take-sequence';
import { AppendSequence } from '../../../src/sequences/implementations/append-sequence';
import { PrependSequence } from '../../../src/sequences/implementations/prepend-sequence';
import { ReverseSequence } from '../../../src/sequences/implementations/reverse-sequence';
import { DefaultSequence } from '../../../src/sequences/implementations/default-sequence';
import { GroupSequence } from '../../../src/sequences/implementations/group-sequence';
import { DistinctSequence } from '../../../src/sequences/implementations/distinct-sequence';
import { PromisifySequence } from '../../../src/sequences/implementations/promisify-sequence';

describe('Sequence', () => {
    describe('Creation', () => {
        it('from array', () => {
            const result = new Sequence(['a', 'b', 'c', 'd']);

            expect(result).not.equal(undefined);

            expect(result.toArray()).deep.equal(['a', 'b', 'c', 'd']);
        });

        it('from other seq', () => {
            const temp = new Sequence(['a', 'b', 'c', 'd']);

            const result = new Sequence(temp);

            expect(result).not.equal(undefined);
            expect(result.toArray()).deep.equal(['a', 'b', 'c', 'd']);
        });
    });

    describe('Methods', () => {
        it('select', () => {
            const temp = new Sequence(['a', 'b', 'c', 'd']);

            const result = temp.select(item => item + '1');

            expect(result).not.equal(undefined);
            expect(result).instanceof(SelectSequence);
        });

        it('where', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.where(item => item % 2);

            expect(result).not.equal(undefined);
            expect(result).instanceof(WhereSequence);
        });

        it('orderBy', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.orderBy(item => -item);

            expect(result).not.equal(undefined);
            expect(result).instanceof(OrderBySequence);
        });

        it('orderByDescending', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.orderByDescending(item => -item);

            expect(result).not.equal(undefined);
            expect(result).instanceof(OrderBySequence);
        });

        it('thenBy', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.orderBy(item => -item).thenBy(item => item);

            expect(result).not.equal(undefined);
            expect(result).instanceof(OrderBySequence);
        });

        it('thenByDescending', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.orderByDescending(item => item).thenByDescending(item => item);

            expect(result).not.equal(undefined);
            expect(result).instanceof(OrderBySequence);
        });

        it('skip', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.skip(2);

            expect(result).not.equal(undefined);
            expect(result).instanceof(SkipSequence);
        });

        it('skipLast', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.skipLast(2);

            expect(result).not.equal(undefined);
            expect(result).instanceof(SkipSequence);
        });

        it('take', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.take(2);

            expect(result).not.equal(undefined);
            expect(result).instanceof(TakeSequence);
        });

        it('takeLast', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.takeLast(2);

            expect(result).not.equal(undefined);
            expect(result).instanceof(TakeSequence);
        });

        it('append', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.append(6);

            expect(result).not.equal(undefined);
            expect(result).instanceof(AppendSequence);
        });

        it('prepend', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.prepend(0);

            expect(result).not.equal(undefined);
            expect(result).instanceof(PrependSequence);
        });

        it('reverse', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.reverse();

            expect(result).not.equal(undefined);
            expect(result).instanceof(ReverseSequence);
        });

        it('defaultIfEmpty', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.defaultIfEmpty(0);

            expect(result).not.equal(undefined);
            expect(result).instanceof(DefaultSequence);
        });

        it('groupBy', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.groupBy(item => item % 2);

            expect(result).not.equal(undefined);
            expect(result).instanceof(GroupSequence);
        });

        it('distinct', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.distinct();

            expect(result).not.equal(undefined);
            expect(result).instanceof(DistinctSequence);
        });

        it('concat', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.concat([6, 7]).toArray();

            expect(result).deep.equal([1, 2, 3, 4, 5, 6, 7]);
        });

        it('except', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.except([3, 4, 5]).toArray();

            expect(result).deep.equal([1, 2]);
        });

        it('intersect', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.intersect([3, 4, 5, 6, 7]).toArray();

            expect(result).deep.equal([3, 4, 5]);
        });

        it('union', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.union([3, 4, 5, 6, 7]).toArray();

            expect(result).deep.equal([1, 2, 3, 4, 5, 6, 7]);
        });

        it('zip', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.zip([3, 4, 5, 6, 7]).toArray();

            expect(result).deep.equal([
                [1, 3],
                [2, 4],
                [3, 5],
                [4, 6],
                [5, 7],
            ]);
        });

        it('promisify', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.promisify();

            expect(result).instanceOf(PromisifySequence);
        });

        it('aggregate', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.aggregate<number>((a, b) => a + b);

            expect(result).equal(15);
        });

        it('average', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.average();

            expect(result).equal(3);
        });

        it('count', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.count();

            expect(result).equal(5);
        });

        it('elementAt', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.elementAt(3);

            expect(result).equal(4);
        });

        it('elementAtOrDefault', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.elementAtOrDefault(3);

            expect(result).equal(4);
        });

        it('first', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.first();

            expect(result).equal(1);
        });

        it('firstOrDefault', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.firstOrDefault();

            expect(result).equal(1);
        });

        it('last', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.last();

            expect(result).equal(5);
        });

        it('lastOrDefault', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.lastOrDefault();

            expect(result).equal(5);
        });

        it('max', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.max();

            expect(result).equal(5);
        });

        it('min', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.min();

            expect(result).equal(1);
        });

        it('sequenceEqual', () => {
            const first = new Sequence([1, 2, 3, 4, 5]);
            const second = [1, 2, 3, 4, 5];

            const result = first.sequenceEqual(second);

            expect(result).equal(true);
        });

        it('single', () => {
            const temp = new Sequence([9]);
            const result = temp.single();

            expect(result).equal(9);
        });

        it('singleOrDefault', () => {
            const temp = new Sequence([9]);
            const result = temp.singleOrDefault();

            expect(result).equal(9);
        });

        it('sum', () => {
            const temp = new Sequence([1, 2, 3, 4, 5]);

            const result = temp.sum();

            expect(result).equal(15);
        });
    });

    describe('Materializing', () => {
        it('ToArray', () => {
            const seq = new Sequence([0, 1, 2, 3, 4]);

            const result = seq.toArray();

            expect(result).deep.equal([0, 1, 2, 3, 4]);
        });

        describe('ToLookup', () => {
            it('with primitive key', () => {
                const seq = new Sequence<ICat>([
                    {
                        name: 'Lilly',
                        age: 1,
                    },
                    {
                        name: 'Kitty',
                        age: 7,
                    },
                    {
                        name: 'Jack',
                        age: 4,
                    },
                    {
                        name: 'Jack',
                        age: 7,
                    },
                ]);

                const result = seq.toLookup(item => item.name);

                expect(result.entries).deep.equal([
                    [
                        'Lilly',
                        [
                            {
                                name: 'Lilly',
                                age: 1,
                            },
                        ],
                    ],
                    [
                        'Kitty',
                        [
                            {
                                name: 'Kitty',
                                age: 7,
                            },
                        ],
                    ],
                    [
                        'Jack',
                        [
                            {
                                name: 'Jack',
                                age: 4,
                            },
                            {
                                name: 'Jack',
                                age: 7,
                            },
                        ],
                    ],
                ]);
            });
            it('with primitive key and value selector', () => {
                const seq = new Sequence<ICat>([
                    {
                        name: 'Lilly',
                        age: 1,
                    },
                    {
                        name: 'Kitty',
                        age: 7,
                    },
                    {
                        name: 'Jack',
                        age: 4,
                    },
                    {
                        name: 'Jack',
                        age: 7,
                    },
                ]);

                const result = seq.toLookup(
                    item => item.name,
                    item => item.age,
                );

                expect(result.entries).deep.equal([
                    ['Lilly', [1]],
                    ['Kitty', [7]],
                    ['Jack', [4, 7]],
                ]);
            });
            it('with object key', () => {
                const seq = new Sequence<ICat>([
                    {
                        name: 'Lilly',
                        age: 1,
                    },
                    {
                        name: 'Kitty',
                        age: 7,
                    },
                    {
                        name: 'Kitty',
                        age: 7,
                    },
                ]);

                const result = seq.toLookup(item => item, new CatComparator());

                expect(result.entries).deep.equal([
                    [
                        {
                            name: 'Lilly',
                            age: 1,
                        },
                        [
                            {
                                name: 'Lilly',
                                age: 1,
                            },
                        ],
                    ],
                    [
                        {
                            name: 'Kitty',
                            age: 7,
                        },
                        [
                            {
                                name: 'Kitty',
                                age: 7,
                            },
                            {
                                name: 'Kitty',
                                age: 7,
                            },
                        ],
                    ],
                ]);
            });
            it('with object key and value selector', () => {
                const seq = new Sequence<[IPerson, ICat]>([
                    [
                        {
                            name: 'Oleg',
                            age: 30,
                        },
                        {
                            name: 'Lilly',
                            age: 1,
                        },
                    ],
                    [
                        {
                            name: 'Alex',
                            age: 24,
                        },
                        {
                            name: 'Kitty',
                            age: 7,
                        },
                    ],
                    [
                        {
                            name: 'Alex',
                            age: 24,
                        },
                        {
                            name: 'Jack',
                            age: 4,
                        },
                    ],
                ]);

                const result = seq.toLookup(
                    item => item[0],
                    new PersonComparator(),
                    item => item[1],
                );

                expect(result.entries).deep.equal([
                    [{ name: 'Oleg', age: 30 }, [{ name: 'Lilly', age: 1 }]],
                    [
                        { name: 'Alex', age: 24 },
                        [
                            { name: 'Kitty', age: 7 },
                            { name: 'Jack', age: 4 },
                        ],
                    ],
                ]);
            });
        });

        describe('ToDictionary', () => {
            it('with primitive key', () => {
                const seq = new Sequence<ICat>([
                    {
                        name: 'Lilly',
                        age: 1,
                    },
                    {
                        name: 'Kitty',
                        age: 7,
                    },
                    {
                        name: 'Jack',
                        age: 4,
                    },
                    {
                        name: 'Jack',
                        age: 7,
                    },
                ]);

                const result = seq.toDictionary(item => item.name);

                expect(result.entries).deep.equal([
                    [
                        'Lilly',
                        {
                            name: 'Lilly',
                            age: 1,
                        },
                    ],
                    [
                        'Kitty',
                        {
                            name: 'Kitty',
                            age: 7,
                        },
                    ],
                    [
                        'Jack',
                        {
                            name: 'Jack',
                            age: 4,
                        },
                    ],
                ]);
            });
            it('with primitive key and value selector', () => {
                const seq = new Sequence<ICat>([
                    {
                        name: 'Lilly',
                        age: 1,
                    },
                    {
                        name: 'Kitty',
                        age: 7,
                    },
                    {
                        name: 'Jack',
                        age: 4,
                    },
                    {
                        name: 'Jack',
                        age: 7,
                    },
                ]);

                const result = seq.toDictionary(
                    item => item.name,
                    item => item.age,
                );

                expect(result.entries).deep.equal([
                    ['Lilly', 1],
                    ['Kitty', 7],
                    ['Jack', 4],
                ]);
            });
            it('with object key', () => {
                const seq = new Sequence<ICat>([
                    {
                        name: 'Lilly',
                        age: 1,
                    },
                    {
                        name: 'Kitty',
                        age: 7,
                    },
                    {
                        name: 'Kitty',
                        age: 7,
                    },
                ]);

                const result = seq.toDictionary(item => item, new CatComparator());

                expect(result.entries).deep.equal([
                    [
                        {
                            name: 'Lilly',
                            age: 1,
                        },
                        {
                            name: 'Lilly',
                            age: 1,
                        },
                    ],
                    [
                        {
                            name: 'Kitty',
                            age: 7,
                        },
                        {
                            name: 'Kitty',
                            age: 7,
                        },
                    ],
                ]);
            });
            it('with object key and value selector', () => {
                const seq = new Sequence<[IPerson, ICat]>([
                    [
                        {
                            name: 'Oleg',
                            age: 30,
                        },
                        {
                            name: 'Lilly',
                            age: 1,
                        },
                    ],
                    [
                        {
                            name: 'Alex',
                            age: 24,
                        },
                        {
                            name: 'Kitty',
                            age: 7,
                        },
                    ],
                    [
                        {
                            name: 'Alex',
                            age: 24,
                        },
                        {
                            name: 'Jack',
                            age: 4,
                        },
                    ],
                ]);

                const result = seq.toDictionary(
                    item => item[0],
                    new PersonComparator(),
                    item => item[1],
                );

                expect(result.entries).deep.equal([
                    [
                        { name: 'Oleg', age: 30 },
                        { name: 'Lilly', age: 1 },
                    ],
                    [
                        { name: 'Alex', age: 24 },
                        { name: 'Kitty', age: 7 },
                    ],
                ]);
            });
        });
    });
});
