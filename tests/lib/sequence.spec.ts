import { expect } from 'chai';
import _, { DeclarrayError } from '../../dist';
import { books, persons } from '../models/fixtures';
import { AuthorComparator } from '../utils/author-comparator';
import { CatComparator } from '../utils/cat-comparator';
import { PersonComparator } from '../utils/person-comparator';
import { ICat } from '../models/i-cat';
import { IAge } from '../models/i-age';
import { DefaultComparator } from '../../src/utils/default-comparator';
import { IEqualityComparator } from '../../src/interfaces/i-equality-comparator';

describe('Sequence', () => {
    describe('Creation', () => {
        it('from array', () => {
            const result = _(['a', 'b', 'c', 'd']);

            expect(result).not.equal(undefined);
            expect(result.toArray()).deep.equal(['a', 'b', 'c', 'd']);
        });
    });

    describe('Methods', () => {
        describe('Querying Methods', () => {
            it('append', () => {
                const sequence = _([1, 2, 3, 4, 5]);

                const result = sequence.append(6).toArray();

                expect(result).deep.equal([1, 2, 3, 4, 5, 6]);
            });

            it('defaultIfEmpty', () => {
                const sequence = _([1, 2, 3, 4, 5]);

                const result = sequence
                    .where(item => item > 10)
                    .defaultIfEmpty(0)
                    .toArray();

                expect(result).deep.equal([0]);
            });

            describe('distinct', () => {
                it('distinct primitives', () => {
                    const sequence = _([1, 2, 2, 3, 3, 3, 4, 4, 4, 4]);

                    const result = sequence.distinct().toArray();

                    expect(result).deep.equal([1, 2, 3, 4]);
                });

                it('distinct objects', () => {
                    const cats = [
                        { name: 'Tom', age: 1 },
                        { name: 'Bonny', age: 3 },
                        { name: 'Feya', age: 2 },
                        { name: 'Cherry', age: 2 },
                    ];

                    const catByAgeComparator: IEqualityComparator<any> = {
                        equals: (first, second) => first.age === second.age,
                        getHashCode: object => object.age,
                        compare: (first, second) => first.age - second.age,
                    };

                    const distinctByAge = _(cats).distinct(catByAgeComparator).toArray();

                    expect(distinctByAge).deep.equal([
                        { name: 'Tom', age: 1 },
                        { name: 'Feya', age: 2 },
                        { name: 'Bonny', age: 3 },
                    ]);
                });
            });

            describe('groupBy', () => {
                it('groupBy by primitive key', () => {
                    const cats = [
                        { name: 'Tom', age: 1 },
                        { name: 'Bonny', age: 3 },
                        { name: 'Feya', age: 2 },
                        { name: 'Cherry', age: 2 },
                    ];

                    const catsByAge = _(cats)
                        .groupBy(item => item.age)
                        .toArray();

                    expect(catsByAge).deep.equal([
                        {
                            key: 1,
                            group: _([{ name: 'Tom', age: 1 }]),
                        },
                        {
                            key: 2,
                            group: _([
                                { name: 'Feya', age: 2 },
                                { name: 'Cherry', age: 2 },
                            ]),
                        },
                        {
                            key: 3,
                            group: _([{ name: 'Bonny', age: 3 }]),
                        },
                    ]);
                });

                it('groupBy primitive key and group modifying', () => {
                    const cats = [
                        { name: 'Tom', age: 1 },
                        { name: 'Bonny', age: 3 },
                        { name: 'Feya', age: 2 },
                        { name: 'Cherry', age: 2 },
                    ];

                    const catsCountByAge = _(cats)
                        .groupBy(
                            item => item.age,
                            group => group.count(),
                        )
                        .toArray();

                    expect(catsCountByAge).deep.equal([
                        { key: 1, group: 1 },
                        { key: 2, group: 2 },
                        { key: 3, group: 1 },
                    ]);
                });

                it('groupBy object key', () => {
                    const cats = [
                        {
                            name: 'Tom',
                            age: 1,
                            home: { street: 'Jones Street', apartment: 1 },
                        },
                        {
                            name: 'Bonny',
                            age: 3,
                            home: { street: 'Dekalb Avenue', apartment: 12 },
                        },
                        {
                            name: 'Feya',
                            age: 2,
                            home: { street: 'Bleecker Street', apartment: 10 },
                        },
                        {
                            name: 'Cherry',
                            age: 2,
                            home: { street: 'Dekalb Avenue', apartment: 12 },
                        },
                    ];

                    const homeComparator: IEqualityComparator<any> = {
                        equals(first: any, second: any): boolean {
                            return first.street === second.street && first.apartment === second.apartment;
                        },
                        compare(first: any, second: any): number {
                            const streetCompare = first.street.localeCompare(second.street);

                            if (streetCompare !== 0) return streetCompare;

                            return first.apartment - second.apartment;
                        },
                        getHashCode(entity: any): number {
                            return new DefaultComparator().getHashCode(entity.street + entity.apartment);
                        },
                    };

                    const catsCountByHome = _(cats)
                        .groupBy(
                            item => item.home,
                            homeComparator,
                            group => group.toArray(),
                        )
                        .toArray();

                    expect(catsCountByHome).deep.equal([
                        {
                            key: { street: 'Jones Street', apartment: 1 },
                            group: [
                                {
                                    name: 'Tom',
                                    age: 1,
                                    home: { street: 'Jones Street', apartment: 1 },
                                },
                            ],
                        },
                        {
                            key: { street: 'Bleecker Street', apartment: 10 },
                            group: [
                                {
                                    name: 'Feya',
                                    age: 2,
                                    home: { street: 'Bleecker Street', apartment: 10 },
                                },
                            ],
                        },
                        {
                            key: { street: 'Dekalb Avenue', apartment: 12 },
                            group: [
                                {
                                    name: 'Bonny',
                                    age: 3,
                                    home: { street: 'Dekalb Avenue', apartment: 12 },
                                },
                                {
                                    name: 'Cherry',
                                    age: 2,
                                    home: { street: 'Dekalb Avenue', apartment: 12 },
                                },
                            ],
                        },
                    ]);
                });

                it('groupBy object key with group modifying', () => {
                    const temp = _(books);

                    const result = temp
                        .groupBy(
                            item => item.authors,
                            new AuthorComparator(),
                            group => group.select(item => item.name).toArray(),
                        )
                        .toArray();

                    expect(result).deep.equal([
                        {
                            key: ['Михаил Булгаков'],
                            group: ['Мастер и Маргарита'],
                        },
                        {
                            key: ['Дмитрий Глуховский'],
                            group: ['Метро 2034', 'Метро 2033'],
                        },
                        {
                            key: ['Федор Достоевский'],
                            group: ['Преступление и наказание'],
                        },
                    ]);
                });
            });

            describe('orderBy', () => {
                it('should order by default comparing', () => {
                    const cats = [
                        { name: 'Tom', age: 3 },
                        { name: 'Bonny', age: 3 },
                        { name: 'Feya', age: 2 },
                        { name: 'Cherry', age: 2 },
                    ];

                    const catsOrderedByAge = _(cats)
                        .orderBy(item => item.age)
                        .toArray();

                    expect(catsOrderedByAge).deep.equal([
                        { name: 'Feya', age: 2 },
                        { name: 'Cherry', age: 2 },
                        { name: 'Tom', age: 3 },
                        { name: 'Bonny', age: 3 },
                    ]);
                });

                it('should order by comparator', () => {
                    const cats = [
                        {
                            name: 'Tom',
                            age: 1,
                            home: { street: 'Jones Street', apartment: 1 },
                        },
                        {
                            name: 'Bonny',
                            age: 3,
                            home: { street: 'Dekalb Avenue', apartment: 15 },
                        },
                        {
                            name: 'Feya',
                            age: 2,
                            home: { street: 'Bleecker Street', apartment: 10 },
                        },
                        {
                            name: 'Cherry',
                            age: 2,
                            home: { street: 'Dekalb Avenue', apartment: 12 },
                        },
                    ];

                    const homeComparator: IEqualityComparator<any> = {
                        equals(first: any, second: any): boolean {
                            return first.street === second.street && first.apartment === second.apartment;
                        },
                        compare(first: any, second: any): number {
                            const streetCompare = first.street.localeCompare(second.street);

                            if (streetCompare !== 0) return streetCompare;

                            return first.apartment - second.apartment;
                        },
                        getHashCode(entity: any): number {
                            return new DefaultComparator().getHashCode(entity.street + entity.apartment);
                        },
                    };

                    const catsOrderedByHome = _(cats)
                        .orderBy(item => item.home, homeComparator)
                        .toArray();

                    expect(catsOrderedByHome).deep.equal([
                        {
                            name: 'Feya',
                            age: 2,
                            home: { street: 'Bleecker Street', apartment: 10 },
                        },
                        {
                            name: 'Cherry',
                            age: 2,
                            home: { street: 'Dekalb Avenue', apartment: 12 },
                        },
                        {
                            name: 'Bonny',
                            age: 3,
                            home: { street: 'Dekalb Avenue', apartment: 15 },
                        },
                        {
                            name: 'Tom',
                            age: 1,
                            home: { street: 'Jones Street', apartment: 1 },
                        },
                    ]);
                });
            });

            describe('orderByDescending', () => {
                it('should order by default comparator', () => {
                    const temp = _([1, 2, 3, 4, 5]);

                    const result = temp.orderByDescending(item => item).toArray();

                    expect(result).not.equal(undefined);
                    expect(result).deep.equal([5, 4, 3, 2, 1]);
                });

                it('should order by specified comparator', () => {
                    const temp = _(persons);

                    const result = temp.orderByDescending(item => item, new PersonComparator()).toArray();

                    expect(result).deep.equal([
                        {
                            name: 'Simon',
                            age: 23,
                        },
                        {
                            name: 'Lola',
                            age: 32,
                        },
                        {
                            name: 'Jack',
                            age: 12,
                        },
                        {
                            name: 'Harry',
                            age: 35,
                        },
                        {
                            name: 'Emy',
                            age: 19,
                        },
                    ]);
                });
            });

            it('thenBy', () => {
                const temp = _(persons);

                const result = temp
                    .orderBy(item => (item.age / 10) | 0)
                    .thenBy(item => item.name)
                    .toArray();

                expect(result).deep.equal([
                    {
                        name: 'Emy',
                        age: 19,
                    },
                    {
                        name: 'Jack',
                        age: 12,
                    },
                    {
                        name: 'Simon',
                        age: 23,
                    },
                    {
                        name: 'Harry',
                        age: 35,
                    },
                    {
                        name: 'Lola',
                        age: 32,
                    },
                ]);
            });

            it('thenByDescending', () => {
                const temp = _(persons);

                const result = temp
                    .orderByDescending(item => (item.age / 10) | 0)
                    .thenByDescending(item => item.name)
                    .toArray();

                expect(result).deep.equal([
                    {
                        name: 'Lola',
                        age: 32,
                    },
                    {
                        name: 'Harry',
                        age: 35,
                    },
                    {
                        name: 'Simon',
                        age: 23,
                    },
                    {
                        name: 'Jack',
                        age: 12,
                    },
                    {
                        name: 'Emy',
                        age: 19,
                    },
                ]);
            });

            it('prepend', () => {
                const sequence = _([1, 2, 3, 4, 5]);

                const result = sequence.prepend(0).toArray();

                expect(result).deep.equal([0, 1, 2, 3, 4, 5]);
            });

            it('reverse', () => {
                const temp = _([1, 2, 3, 4, 5]);

                const result = temp.reverse().toArray();

                expect(result).deep.equal([5, 4, 3, 2, 1]);
            });

            it('select', () => {
                const sequence = _([1, 2, 3, 4, 5]);

                const result = sequence.select(item => item ** 2).toArray();

                expect(result).deep.equal([1, 4, 9, 16, 25]);
            });

            it('selectMany', () => {
                const cats = [
                    {
                        name: 'Feya',
                        kittens: ['Lory', 'Pussy'],
                    },
                    {
                        name: 'Cherry',
                        kittens: ['Browny', 'Tommy'],
                    },
                ];

                const allKittens = _(cats)
                    .selectMany(item => item.kittens)
                    .toArray();

                expect(allKittens).deep.equal(['Lory', 'Pussy', 'Browny', 'Tommy']);
            });

            it('skip', () => {
                const sequence = _([1, 2, 3, 4, 5]);

                const result = sequence.skip(2).toArray();

                expect(result).deep.equal([3, 4, 5]);
            });

            it('skipLast', () => {
                const sequence = _([1, 2, 3, 4, 5]);

                const result = sequence.skipLast(2).toArray();

                expect(result).deep.equal([1, 2, 3]);
            });

            it('take', () => {
                const sequence = _([1, 2, 3, 4, 5]);

                const result = sequence.take(3).toArray();

                expect(result).deep.equal([1, 2, 3]);
            });

            it('takeLast', () => {
                const sequence = _([1, 2, 3, 4, 5]);

                const result = sequence.takeLast(2).toArray();

                expect(result).deep.equal([4, 5]);
            });

            describe('where', () => {
                it('should return odd', () => {
                    const sequence = _([1, 2, 3, 4, 5]);

                    const result = sequence.where(item => item % 2).toArray();

                    expect(result).deep.equal([1, 3, 5]);
                });

                it('should use index', () => {
                    const sequence = _([0, 1, 2, 3, 4, 5]);

                    const result = sequence.where((item, index) => item === index).toArray();

                    expect(result).deep.equal([0, 1, 2, 3, 4, 5]);
                });
            });
        });

        describe('Aggregation Methods', () => {
            describe('aggregate', () => {
                it('should sum sequence', () => {
                    const sequence = _([0, 2, 4, 6, 8]);

                    const result = sequence.aggregate((a, b) => a + b);

                    expect(result).equal(20);
                });

                it('should aggregate with initial value', () => {
                    const sequence = _([0, 2, 4, 6, 8]);

                    const result = sequence.aggregate((a, b) => a + b, 10);

                    expect(result).equal(30);
                });

                it('should aggregate with accumulator', () => {
                    const sequence = _([0, 2, 4, 6, 8]);

                    const result = sequence.aggregate((a, b) => a + b, '');

                    expect(result).equal('02468');
                });
            });

            describe('all', () => {
                it('should return true', () => {
                    const sequence = _([0, 2, 4, 6, 8]);

                    const allIsEven = sequence.all(item => item % 2 === 0);

                    expect(allIsEven).equal(true);
                });

                it('should use index', () => {
                    const sequence = _([0, 1, 2, 3]);

                    const allEqIndex = sequence.all((item, index) => item === index);

                    expect(allEqIndex).equal(true);
                });
            });

            describe('any', () => {
                it('should return true', () => {
                    const sequence = _([0, 2, 4, 6, 7, 8]);

                    const hasAnyOdd = sequence.any(item => item % 2);

                    expect(hasAnyOdd).equal(true);
                });

                it('should use index', () => {
                    const sequence = _([1, 2, 3, 4, 4]);

                    const anyNotEqIndex = sequence.any((item, index) => item !== index);

                    expect(anyNotEqIndex).equal(true);
                });
            });

            describe('average', () => {
                it('should compute from numbers', () => {
                    const sequence = _([0, 2, 4, 6, 8]);

                    const result = sequence.average();

                    expect(result).equal(4);
                });

                it('should use select expression', () => {
                    const cats = [
                        {
                            name: 'Tom',
                            age: 1,
                        },
                        {
                            name: 'Bonny',
                            age: 3,
                        },
                        {
                            name: 'Feya',
                            age: 2,
                        },
                    ];

                    const middleAge = _(cats).average(item => item.age);

                    expect(middleAge).equal(2);
                });
            });

            describe('contains', () => {
                it('should check number', () => {
                    const sequence = _([0, 2, 4, 6, 8]);

                    const hasFour = sequence.contains(4);

                    expect(hasFour).equal(true);
                });

                it('should use comparator', () => {
                    const cats = [
                        { name: 'Barsik', age: 9 },
                        { name: 'Cherry', age: 4 },
                        { name: 'Feya', age: 4 },
                        { name: 'Lulya', age: 1 },
                    ];

                    const catByNameComparator: IEqualityComparator<any> = {
                        compare: (first: any, second: any) => first.name.localeCompare(second.name),
                        equals: (a, b) => a.name === b.name && a.age === b.age,
                        getHashCode: entity => new DefaultComparator().getHashCode(entity.name),
                    };

                    const cat = { name: 'Feya', age: 4 };

                    const result = _(cats).contains(cat, catByNameComparator);

                    expect(result).equal(true);
                });
            });

            it('count', () => {
                const result = _([1, 2, 3, 4, 5]).count();
                expect(result).equal(5);
            });

            describe('elementAt', () => {
                it('should return element', () => {
                    const sequence = _([0, 2, 4, 6, 8]);

                    const result = sequence.elementAt(3);

                    expect(result).equal(6);
                });

                it('should throw error', () => {
                    expect(() => {
                        const sequence = _([0, 2, 4, 6, 8]);

                        sequence.elementAt(6);
                    }).throws(DeclarrayError, 'Index out of bounds');
                });
            });

            describe('elementAtOrDefault', () => {
                it('should return element', () => {
                    const sequence = _([0, 2, 4, 6, 8]);

                    const result = sequence.elementAtOrDefault(3);

                    expect(result).equal(6);
                });

                it('should return null', () => {
                    const sequence = _([0, 2, 4, 6, 8]);

                    const result = sequence.elementAtOrDefault(6);

                    expect(result).equal(null);
                });

                it('should return default', () => {
                    const sequence = _([0, 2, 4, 6, 8]);

                    const result = sequence.elementAtOrDefault(6, 10);

                    expect(result).equal(10);
                });
            });

            describe('first', () => {
                it('should return first element', () => {
                    const sequence = _([0, 2, 4, 6, 8]);

                    const result = sequence.first();

                    expect(result).equal(0);
                });

                it('should throw error', () => {
                    expect(() => {
                        const sequence = _([]);

                        sequence.first();
                    }).throws(DeclarrayError, 'Sequence is empty');
                });

                it('should return first element for condition', () => {
                    const sequence = _([0, 2, 4, 6, 8]);

                    const result = sequence.first(item => item > 0);

                    expect(result).equal(2);
                });

                it('should throw error', () => {
                    expect(() => {
                        const sequence = _([0, 2, 4, 6, 8]);

                        sequence.first(item => item % 2);
                    }).throws(DeclarrayError, 'Sequence is empty');
                });
            });

            describe('firstOrDefault', () => {
                it('should return first element', () => {
                    const sequence = _([0, 2, 4, 6, 8]);

                    const result = sequence.firstOrDefault();

                    expect(result).equal(0);
                });

                it('should return null', () => {
                    const sequence = _([]);

                    const result = sequence.firstOrDefault();

                    expect(result).equal(null);
                });

                it('should return default', () => {
                    const sequence = _([]);

                    const result = sequence.firstOrDefault(10);

                    expect(result).equal(10);
                });

                it('should return first element for condition', () => {
                    const sequence = _([0, 2, 4, 6, 8]);

                    const result = sequence.firstOrDefault(item => item > 0);

                    expect(result).equal(2);
                });

                it('should return null for condition', () => {
                    const sequence = _([2, 4, 6, 8]);

                    const result = sequence.firstOrDefault(item => item % 2);

                    expect(result).equal(null);
                });

                it('should return default for condition', () => {
                    const sequence = _([2, 4, 6, 8]);

                    const result = sequence.firstOrDefault(item => item % 2, 9);

                    expect(result).equal(9);
                });
            });

            describe('last', () => {
                it('should return last element', () => {
                    const sequence = _([0, 2, 4, 6, 8]);

                    const result = sequence.last();

                    expect(result).equal(8);
                });

                it('should throw error', () => {
                    expect(() => {
                        const sequence = _([]);

                        sequence.last();
                    }).throws(DeclarrayError, 'Sequence is empty');
                });

                it('should return last element for condition', () => {
                    const sequence = _([0, 2, 4, 6, 8]);

                    const result = sequence.last(item => item < 8);

                    expect(result).equal(6);
                });

                it('should throw error', () => {
                    expect(() => {
                        const sequence = _([0, 2, 4, 6, 8]);

                        sequence.last(item => item % 2);
                    }).throws(DeclarrayError, 'Sequence is empty');
                });
            });

            describe('lastOrDefault', () => {
                it('should return last element', () => {
                    const sequence = _([0, 2, 4, 6, 8]);

                    const result = sequence.lastOrDefault();

                    expect(result).equal(8);
                });

                it('should return null', () => {
                    const sequence = _([]);

                    const result = sequence.lastOrDefault();

                    expect(result).equal(null);
                });

                it('should return default', () => {
                    const sequence = _([]);

                    const result = sequence.lastOrDefault(10);

                    expect(result).equal(10);
                });

                it('should return last element for condition', () => {
                    const sequence = _([0, 2, 4, 6, 8]);

                    const result = sequence.lastOrDefault(item => item < 8);

                    expect(result).equal(6);
                });

                it('should return null for condition', () => {
                    const sequence = _([2, 4, 6, 8]);

                    const result = sequence.lastOrDefault(item => item % 2);

                    expect(result).equal(null);
                });

                it('should return default for condition', () => {
                    const sequence = _([2, 4, 6, 8]);

                    const result = sequence.lastOrDefault(item => item % 2, 9);

                    expect(result).equal(9);
                });
            });

            describe('max', () => {
                it('should return max element', () => {
                    const sequence = _([0, 2, 4, 8, 6]);

                    const result = sequence.max();

                    expect(result).equal(8);
                });

                it('should return cat with max age', () => {
                    const cats = [
                        { name: 'Tom', age: 1 },
                        { name: 'Bonny', age: 3 },
                        { name: 'Feya', age: 2 },
                    ];

                    const result = _(cats).max(item => item.age);

                    expect(result).deep.equal({
                        name: 'Bonny',
                        age: 3,
                    });
                });

                it('should return cat with max age', () => {
                    const sequence = _([]);

                    expect(() => sequence.max(item => item.age)).throws(DeclarrayError, 'Sequence is empty');
                });
            });

            describe('min', () => {
                it('should return min element', () => {
                    const sequence = _([2, 0, 4, 6, 8]);

                    const result = sequence.min();

                    expect(result).equal(0);
                });

                it('should return cat with max age', () => {
                    const cats = [
                        {
                            name: 'Tom',
                            age: 1,
                        },
                        {
                            name: 'Bonny',
                            age: 3,
                        },
                        {
                            name: 'Feya',
                            age: 2,
                        },
                    ];

                    const result = _(cats).min(item => item.age);

                    expect(result).deep.equal({
                        name: 'Tom',
                        age: 1,
                    });
                });

                it('should return cat with max age', () => {
                    const sequence = _([]);

                    expect(() => sequence.min(item => item.age)).throws(DeclarrayError, 'Sequence is empty');
                });
            });

            describe('sequenceEqual', () => {
                it('should return false for different length', () => {
                    const first = _([0, 2, 4, 6, 8]);
                    const second = _([0, 2, 4, 6]);

                    const result = first.sequenceEqual(second);

                    expect(result).equal(false);
                });

                it('should return false for different arrays', () => {
                    const first = _([0, 2, 4, 6, 8]);
                    const second = _([1, 3, 5, 7, 9]);

                    const result = first.sequenceEqual(second);

                    expect(result).equal(false);
                });

                it('should return true', () => {
                    const first = _([0, 2, 4, 6, 8]);
                    const second = _([0, 2, 4, 6, 8]);

                    const result = first.sequenceEqual(second);

                    expect(result).equal(true);
                });

                it('should return true for array', () => {
                    const first = _([0, 2, 4, 6, 8]);
                    const second = [0, 2, 4, 6, 8];

                    const result = first.sequenceEqual(second);

                    expect(result).equal(true);
                });

                it('should compare with custom comparator', () => {
                    const first = [
                        { name: 'Tom', age: 1 },
                        { name: 'Bonny', age: 3 },
                        { name: 'Feya', age: 2 },
                    ];

                    const second = [
                        { name: 'Tom', age: 1 },
                        { name: 'Bonny', age: 3 },
                        { name: 'Feya', age: 2 },
                    ];

                    const catByNameComparator: IEqualityComparator<any> = {
                        compare: (first: any, second: any) => first.name.localeCompare(second.name),
                        equals: (a, b) => a.name === b.name && a.age === b.age,
                        getHashCode: entity => new DefaultComparator().getHashCode(entity.name),
                    };

                    const result = _(first).sequenceEqual(second, catByNameComparator);

                    expect(result).equal(true);
                });
            });

            describe('single', () => {
                it('should return single element', () => {
                    const sequence = _([9]);
                    const result = sequence.single();

                    expect(result).equal(9);
                });

                it('should throw error for long sequence', () => {
                    const sequence = _([9, 0, 1, 3]);

                    expect(() => sequence.single()).throws(DeclarrayError, 'Sequence length greater then 1');
                });

                it('should throw error for empty sequence', () => {
                    const sequence = _([]);

                    expect(() => sequence.single()).throws(DeclarrayError, 'Sequence is empty');
                });
            });

            describe('singleOrDefault', () => {
                it('should return single element', () => {
                    const sequence = _([9]);
                    const result = sequence.singleOrDefault();

                    expect(result).equal(9);
                });

                it('should throw error for long sequence', () => {
                    const sequence = _([9, 0, 1, 3]);

                    expect(() => sequence.singleOrDefault(null)).throws(DeclarrayError, 'Sequence length greater then 1');
                });

                it('should return null for empty sequence', () => {
                    const sequence = _([]);

                    const result = sequence.singleOrDefault();

                    expect(result).equal(null);
                });
            });

            describe('sum', () => {
                it('should compute from numbers', () => {
                    const sequence = _([0, 2, 4, 6, 8]);

                    const result = sequence.sum();

                    expect(result).equal(20);
                });

                it('should use select expression', () => {
                    const cats = [
                        { name: 'Tom', age: 1 },
                        { name: 'Bonny', age: 3 },
                        { name: 'Feya', age: 2 },
                    ];

                    const result = _(cats).sum(item => item.age);

                    expect(result).equal(6);
                });
            });
        });

        describe('Joining methods', () => {
            describe('concat', () => {
                it('with array', () => {
                    const sequence = _([1, 2, 3, 4]);

                    const result = sequence.concat([5, 6]).toArray();

                    expect(result).deep.equal([1, 2, 3, 4, 5, 6]);
                });

                it('with other sequence', () => {
                    const sequence = _([1, 2, 3, 4]);

                    const additional = _([5, 6]);

                    const result = sequence.concat(additional).toArray();

                    expect(result).deep.equal([1, 2, 3, 4, 5, 6]);
                });
            });

            describe('except', () => {
                describe('primitives', () => {
                    it('with array', () => {
                        const sequence = _([1, 2, 3, 4]);

                        const onlyInFirst = sequence.except([4, 5]).toArray();

                        expect(onlyInFirst).deep.equal([1, 2, 3]);
                    });

                    it('with other sequence', () => {
                        const sequence = _([1, 2, 3, 4]);

                        const additional = _([3, 4]);

                        const result = sequence.except(additional).toArray();

                        expect(result).deep.equal([1, 2]);
                    });
                });

                describe('objects', () => {
                    it('should use comparator', () => {
                        const first: ICat[] = [
                            {
                                name: 'Bella',
                                age: 2,
                            },
                            {
                                name: 'Kitty',
                                age: 5,
                            },
                            {
                                name: 'Lilly',
                                age: 11,
                            },
                            {
                                name: 'Charlie',
                                age: 10,
                            },
                        ];
                        const second: ICat[] = [
                            {
                                name: 'Lilly',
                                age: 11,
                            },
                            {
                                name: 'Charlie',
                                age: 10,
                            },
                        ];

                        const result = _(first).except(second, new CatComparator()).toArray();

                        expect(result).deep.equal([
                            {
                                name: 'Bella',
                                age: 2,
                            },
                            {
                                name: 'Kitty',
                                age: 5,
                            },
                        ]);
                    });
                });
            });

            describe('intersect', () => {
                describe('primitives', () => {
                    it('with array', () => {
                        const sequence = _([1, 2, 3, 4]);

                        const result = sequence.intersect([3, 4, 5]).toArray();

                        expect(result).deep.equal([3, 4]);
                    });

                    it('with other sequence', () => {
                        const sequence = _([1, 2, 3, 4]);

                        const additional = _([3, 4, 5]);

                        const result = sequence.intersect(additional).toArray();

                        expect(result).deep.equal([3, 4]);
                    });
                });

                describe('objects', () => {
                    it('should use comparator', () => {
                        const first: ICat[] = [
                            {
                                name: 'Bella',
                                age: 2,
                            },
                            {
                                name: 'Kitty',
                                age: 5,
                            },
                            {
                                name: 'Lilly',
                                age: 11,
                            },
                            {
                                name: 'Charlie',
                                age: 10,
                            },
                        ];
                        const second: ICat[] = [
                            {
                                name: 'Lilly',
                                age: 11,
                            },
                            {
                                name: 'Charlie',
                                age: 10,
                            },
                            {
                                name: 'Kitty',
                                age: 10,
                            },
                        ];

                        const result = _(first).intersect(second, new CatComparator()).toArray();

                        expect(result).not.equal(undefined);
                        expect(result).deep.equal([
                            {
                                name: 'Lilly',
                                age: 11,
                            },
                            {
                                name: 'Charlie',
                                age: 10,
                            },
                        ]);
                    });
                });
            });

            it('groupJoin', () => {
                const cats: ICat[] = [
                    {
                        name: 'Barsik',
                        age: 9,
                    },
                    {
                        name: 'Cherry',
                        age: 4,
                    },
                    {
                        name: 'Feya',
                        age: 4,
                    },
                    {
                        name: 'Lulya',
                        age: 1,
                    },
                ];

                const ages: IAge[] = [
                    {
                        years: 1,
                        name: 'Young',
                    },
                    {
                        years: 4,
                        name: 'Middle',
                    },
                    {
                        years: 9,
                        name: 'Old',
                    },
                ];

                const joined = _(ages)
                    .groupJoin(
                        cats,
                        age => age.years,
                        cat => cat.age,
                        (age, cats) => ({ age: age.name, cats: cats.select(cat => cat.name).toArray() }),
                        new DefaultComparator() as IEqualityComparator<number>,
                    )
                    .toArray();

                expect(joined).deep.equal([
                    { age: 'Young', cats: ['Lulya'] },
                    { age: 'Middle', cats: ['Cherry', 'Feya'] },
                    { age: 'Old', cats: ['Barsik'] },
                ]);
            });

            it('join', () => {
                const cats: ICat[] = [
                    {
                        name: 'Barsik',
                        age: 9,
                    },
                    {
                        name: 'Cherry',
                        age: 4,
                    },
                    {
                        name: 'Feya',
                        age: 4,
                    },
                    {
                        name: 'Lulya',
                        age: 1,
                    },
                ];

                const ages: IAge[] = [
                    {
                        years: 1,
                        name: 'Young',
                    },
                    {
                        years: 4,
                        name: 'Middle',
                    },
                    {
                        years: 9,
                        name: 'Old',
                    },
                ];

                const joined = _(cats)
                    .join(
                        ages,
                        cat => cat.age,
                        age => age.years,
                        (cat, age) => ({ name: cat.name, age: age.name }),
                    )
                    .toArray();

                expect(joined).deep.equal([
                    { name: 'Barsik', age: 'Old' },
                    { name: 'Cherry', age: 'Middle' },
                    { name: 'Feya', age: 'Middle' },
                    { name: 'Lulya', age: 'Young' },
                ]);
            });

            describe('union', () => {
                describe('primitives', () => {
                    it('with array', () => {
                        const sequence = _([1, 2, 3, 4]);

                        const result = sequence.union([3, 4, 5, 6]).toArray();

                        expect(result).deep.equal([1, 2, 3, 4, 5, 6]);
                    });

                    it('with other sequence', () => {
                        const sequence = _([1, 2, 3, 4]);

                        const additional = _([3, 4, 5, 6, 7]);

                        const result = sequence.union(additional).toArray();

                        expect(result).deep.equal([1, 2, 3, 4, 5, 6, 7]);
                    });
                });

                describe('objects', () => {
                    it('should use comparator', () => {
                        const first: ICat[] = [
                            {
                                name: 'Bella',
                                age: 2,
                            },
                            {
                                name: 'Kitty',
                                age: 5,
                            },
                            {
                                name: 'Lilly',
                                age: 11,
                            },
                            {
                                name: 'Charlie',
                                age: 10,
                            },
                        ];
                        const second: ICat[] = [
                            {
                                name: 'Lilly',
                                age: 11,
                            },
                            {
                                name: 'Charlie',
                                age: 10,
                            },
                            {
                                name: 'Kitty',
                                age: 10,
                            },
                        ];

                        const result = _(first).union(second, new CatComparator()).toArray();

                        expect(result).not.equal(undefined);
                        expect(result).deep.equal([
                            {
                                name: 'Lilly',
                                age: 11,
                            },
                            {
                                name: 'Bella',
                                age: 2,
                            },
                            {
                                name: 'Kitty',
                                age: 5,
                            },
                            {
                                name: 'Kitty',
                                age: 10,
                            },
                            {
                                name: 'Charlie',
                                age: 10,
                            },
                        ]);
                    });
                });
            });

            describe('zip', () => {
                it('zip sequences', () => {
                    const first = _([1, 2, 3, 4, 5]);
                    const second = _([6, 7, 8, 9, 0]);

                    const result = first.zip(second).toArray();

                    expect(result).deep.equal([
                        [1, 6],
                        [2, 7],
                        [3, 8],
                        [4, 9],
                        [5, 0],
                    ]);
                });

                it('zip sequences with array', () => {
                    const first = _([1, 2, 3, 4, 5]);

                    const result = first.zip([6, 7, 8, 9, 0], (a, b) => a + b).toArray();

                    expect(result).deep.equal([7, 9, 11, 13, 5]);
                });
            });
        });

        describe('Materializing Methods', () => {
            it('toArray', () => {
                const sequence = _([1, 2, 3, 4, 5]);

                const result = sequence.toArray();

                expect(result).deep.equal([1, 2, 3, 4, 5]);
            });

            it('toDictionary', () => {
                const cats = [
                    { name: 'Barsik', age: 9 },
                    { name: 'Cherry', age: 4 },
                    { name: 'Feya', age: 4 },
                    { name: 'Lulya', age: 1 },
                ];

                const result = _(cats).toDictionary(item => item.age).entries;

                expect(result).deep.equal([
                    [1, { name: 'Lulya', age: 1 }],
                    [4, { name: 'Cherry', age: 4 }],
                    [9, { name: 'Barsik', age: 9 }],
                ]);
            });

            it('toHashSet', () => {
                const cats = [
                    { name: 'Barsik', age: 9 },
                    { name: 'Cherry', age: 4 },
                    { name: 'Barsik', age: 9 },
                    { name: 'Lulya', age: 1 },
                    { name: 'Cherry', age: 4 },
                ];

                const catComparer: IEqualityComparator<any> = {
                    getHashCode: entity => new DefaultComparator().getHashCode(entity.name + entity.age),
                    compare: (first: any, second: any) => new DefaultComparator().compare(first.name + first.age, second.name + second.age),
                    equals: (first: any, second: any) => first.name === second.name && first.age === second.age,
                };

                const result = _(cats).toHashSet(catComparer).entries;

                expect(result).deep.equal([
                    { name: 'Cherry', age: 4 },
                    { name: 'Barsik', age: 9 },
                    { name: 'Lulya', age: 1 },
                ]);
            });

            it('toLookup', () => {
                const cats = [
                    { name: 'Barsik', age: 9 },
                    { name: 'Cherry', age: 4 },
                    { name: 'Feya', age: 4 },
                    { name: 'Lulya', age: 1 },
                ];

                const result = _(cats).toLookup(item => item.age).entries;

                expect(result).deep.equal([
                    [1, [{ name: 'Lulya', age: 1 }]],
                    [
                        4,
                        [
                            { name: 'Cherry', age: 4 },
                            { name: 'Feya', age: 4 },
                        ],
                    ],
                    [9, [{ name: 'Barsik', age: 9 }]],
                ]);
            });

            it('promisify', async () => {
                const first = _([1, 2, 3, 4, 5]);

                const result = await first.promisify().toArray();

                expect(result).deep.equal([1, 2, 3, 4, 5]);
            });
        });
    });
});
