import { expect } from 'chai';
import _, { DeclarrayError } from '../../dist';
import { books, cats, persons } from '../models/fixtures';
import { IPerson } from '../models/i-person';
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
        it('select', () => {
            const temp = _([1, 2, 3, 4, 5]);

            const result = temp.select(item => item * item).toArray();

            expect(result).deep.equal([1, 4, 9, 16, 25]);
        });

        it('selectMany', () => {
            const temp = _([
                {
                    name: 'Jack',
                    age: 12,
                    cats: [cats[0], cats[1]],
                },
                {
                    name: 'Simon',
                    age: 23,
                    cats: [cats[3]],
                },
                {
                    name: 'Lola',
                    age: 32,
                },
            ] as IPerson[]);

            const result = temp.selectMany(item => item.cats || []).toArray();

            expect(result).deep.equal([
                {
                    name: 'Bella',
                    breed: 'Abyssinian Cat',
                    age: 2,
                    favoriteToys: ['mouse', 'track ball'],
                },
                {
                    name: 'Kitty',
                    breed: 'American Bobtail Cat Breed',
                    age: 5,
                    favoriteToys: [],
                },
                {
                    name: 'Charlie',
                    breed: 'American Curl Cat Breed',
                    age: 10,
                },
            ]);
        });

        describe('where', () => {
            it('should return odd', () => {
                const temp = _([1, 2, 3, 4, 5]);

                const result = temp.where(item => item % 2).toArray();

                expect(result).deep.equal([1, 3, 5]);
            });

            it('should use index', () => {
                const temp = _([0, 1, 2, 3, 4, 5]);

                const result = temp.where((item, index) => item === index).toArray();

                expect(result).deep.equal([0, 1, 2, 3, 4, 5]);
            });
        });

        describe('orderBy', () => {
            it('should order by default comparing', () => {
                const temp = _(persons);

                const result = temp.orderBy(item => item.age).toArray();

                expect(result).deep.equal([
                    {
                        name: 'Jack',
                        age: 12,
                    },
                    {
                        name: 'Emy',
                        age: 19,
                    },
                    {
                        name: 'Simon',
                        age: 23,
                    },
                    {
                        name: 'Lola',
                        age: 32,
                    },
                    {
                        name: 'Harry',
                        age: 35,
                    },
                ]);
            });

            it('should order by comparator', () => {
                const temp = _(persons);

                const result = temp.orderBy(item => item, new PersonComparator()).toArray();

                expect(result).deep.equal([
                    {
                        name: 'Emy',
                        age: 19,
                    },
                    {
                        name: 'Harry',
                        age: 35,
                    },
                    {
                        name: 'Jack',
                        age: 12,
                    },
                    {
                        name: 'Lola',
                        age: 32,
                    },
                    {
                        name: 'Simon',
                        age: 23,
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

        it('skip', () => {
            const temp = _([1, 2, 3, 4, 5]);

            const result = temp.skip(2).toArray();

            expect(result).deep.equal([3, 4, 5]);
        });

        it('skipLast', () => {
            const temp = _([1, 2, 3, 4, 5]);

            const result = temp.skipLast(2).toArray();

            expect(result).deep.equal([1, 2, 3]);
        });

        it('take', () => {
            const temp = _([1, 2, 3, 4, 5]);

            const result = temp.take(3).toArray();

            expect(result).deep.equal([1, 2, 3]);
        });

        it('takeLast', () => {
            const temp = _([1, 2, 3, 4, 5]);

            const result = temp.takeLast(2).toArray();

            expect(result).deep.equal([4, 5]);
        });

        it('append', () => {
            const temp = _([1, 2, 3, 4, 5]);

            const result = temp.append(6).toArray();

            expect(result).deep.equal([1, 2, 3, 4, 5, 6]);
        });

        it('prepend', () => {
            const temp = _([1, 2, 3, 4, 5]);

            const result = temp.prepend(0).toArray();

            expect(result).deep.equal([0, 1, 2, 3, 4, 5]);
        });

        it('reverse', () => {
            const temp = _([1, 2, 3, 4, 5]);

            const result = temp.reverse().toArray();

            expect(result).deep.equal([5, 4, 3, 2, 1]);
        });

        it('defaultIfEmpty', () => {
            const temp = _([1, 2, 3, 4, 5]);

            const result = temp
                .where(item => item > 10)
                .defaultIfEmpty(0)
                .toArray();

            expect(result).deep.equal([0]);
        });

        describe('groupBy', () => {
            it('groupBy by primitive key', () => {
                const temp = _(books);

                const result = temp.groupBy(item => item.type).toArray();

                expect(result).deep.equal([
                    {
                        key: 0,
                        group: _([books[0], books[1]]),
                    },
                    {
                        key: 1,
                        group: _([books[3]]),
                    },
                    {
                        key: 2,
                        group: _([books[2]]),
                    },
                ]);
            });

            it('groupBy primitive key and group modifying', () => {
                const temp = _(books);

                const result = temp
                    .groupBy(
                        item => item.type,
                        group => group.select(item => item.name).toArray(),
                    )
                    .toArray();

                expect(result).deep.equal([
                    {
                        key: 0,
                        group: ['Мастер и Маргарита', 'Преступление и наказание'],
                    },
                    {
                        key: 1,
                        group: ['Метро 2033'],
                    },
                    {
                        key: 2,
                        group: ['Метро 2034'],
                    },
                ]);
            });

            it('groupBy object key', () => {
                const temp = _(books);

                const result = temp.groupBy(item => item.authors, new AuthorComparator()).toArray();

                expect(result).deep.equal([
                    {
                        key: ['Михаил Булгаков'],
                        group: _([books[0]]),
                    },
                    {
                        key: ['Дмитрий Глуховский'],
                        group: _([books[2], books[3]]),
                    },
                    {
                        key: ['Федор Достоевский'],
                        group: _([books[1]]),
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

        describe('distinct', () => {
            it('distinct primitives', () => {
                const temp = _([1, 2, 2, 3, 3, 3, 4, 4, 4, 4]);

                const result = temp.distinct().toArray();

                expect(result).deep.equal([1, 2, 3, 4]);
            });

            it('distinct objects', () => {
                const temp = _(books.map(item => item.authors));

                const result = temp.distinct(new AuthorComparator()).toArray();

                expect(result).deep.equal([['Михаил Булгаков'], ['Дмитрий Глуховский'], ['Федор Достоевский']]);
            });
        });

        describe('concat', () => {
            it('with array', () => {
                const temp = _([1, 2, 3, 4]);

                const result = temp.concat([5, 6]).toArray();

                expect(result).deep.equal([1, 2, 3, 4, 5, 6]);
            });

            it('with other sequence', () => {
                const temp = _([1, 2, 3, 4]);

                const additional = _([5, 6]);

                const result = temp.concat(additional).toArray();

                expect(result).deep.equal([1, 2, 3, 4, 5, 6]);
            });
        });

        describe('except', () => {
            describe('primitives', () => {
                it('with array', () => {
                    const temp = _([1, 2, 3, 4]);

                    const result = temp.except([4, 5]).toArray();

                    expect(result).deep.equal([1, 2, 3]);
                });

                it('with other sequence', () => {
                    const temp = _([1, 2, 3, 4]);

                    const additional = _([3, 4]);

                    const result = temp.except(additional).toArray();

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
                    const temp = _([1, 2, 3, 4]);

                    const result = temp.intersect([3, 4, 5]).toArray();

                    expect(result).deep.equal([3, 4]);
                });

                it('with other sequence', () => {
                    const temp = _([1, 2, 3, 4]);

                    const additional = _([3, 4, 5]);

                    const result = temp.intersect(additional).toArray();

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
                    const temp = _([1, 2, 3, 4]);

                    const result = temp.union([3, 4, 5, 6]).toArray();

                    expect(result).deep.equal([1, 2, 3, 4, 5, 6]);
                });

                it('with other sequence', () => {
                    const temp = _([1, 2, 3, 4]);

                    const additional = _([3, 4, 5, 6, 7]);

                    const result = temp.union(additional).toArray();

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
                            age: 10,
                        },
                        {
                            name: 'Kitty',
                            age: 5,
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

        it('promisify', async () => {
            const first = _([1, 2, 3, 4, 5]);

            const result = await first.promisify().toArray();

            expect(result).deep.equal([1, 2, 3, 4, 5]);
        });

        describe('all', () => {
            it('should return true', () => {
                const temp = _([0, 2, 4, 6, 8]);

                const result = temp.all(item => item % 2 === 0);

                expect(result).equal(true);
            });

            it('should use index', () => {
                const temp = _([0, 1, 2, 3]);

                const result = temp.all((item, index) => item === index);

                expect(result).equal(true);
            });
        });

        describe('any', () => {
            it('should return true', () => {
                const temp = _([0, 2, 4, 6, 7, 8]);

                const result = temp.any(item => item % 2);

                expect(result).equal(true);
            });

            it('should use index', () => {
                const temp = _([1, 2, 3, 4, 4]);

                const result = temp.any((item, index) => item === index);

                expect(result).equal(true);
            });
        });

        describe('average', () => {
            it('should compute from numbers', () => {
                const temp = _([0, 2, 4, 6, 8]);

                const result = temp.average();

                expect(result).equal(4);
            });

            it('should use select expression', () => {
                const temp = _(cats);

                const result = temp.average(item => item.age);

                expect(result).equal(6);
            });
        });

        describe('contains', () => {
            it('should check number', () => {
                const temp = _([0, 2, 4, 6, 8]);

                const result = temp.contains(4);

                expect(result).equal(true);
            });

            it('should use comparator', () => {
                const temp = _(cats);

                const result = temp.contains(
                    {
                        name: 'Lilly',
                        breed: 'American Curl Cat Breed',
                        age: 11,
                    },
                    new CatComparator(),
                );

                expect(result).equal(true);
            });
        });

        describe('elementAt', () => {
            it('should return element', () => {
                const temp = _([0, 2, 4, 6, 8]);

                const result = temp.elementAt(3);

                expect(result).equal(6);
            });

            it('should throw error', () => {
                expect(() => {
                    const temp = _([0, 2, 4, 6, 8]);

                    temp.elementAt(6);
                }).throws(DeclarrayError, 'Index out of bounds');
            });
        });

        describe('elementAtOrDefault', () => {
            it('should return element', () => {
                const temp = _([0, 2, 4, 6, 8]);

                const result = temp.elementAtOrDefault(3);

                expect(result).equal(6);
            });

            it('should return null', () => {
                const temp = _([0, 2, 4, 6, 8]);

                const result = temp.elementAtOrDefault(6);

                expect(result).equal(null);
            });

            it('should return default', () => {
                const temp = _([0, 2, 4, 6, 8]);

                const result = temp.elementAtOrDefault(6, 10);

                expect(result).equal(10);
            });
        });

        describe('first', () => {
            it('should return first element', () => {
                const temp = _([0, 2, 4, 6, 8]);

                const result = temp.first();

                expect(result).equal(0);
            });

            it('should throw error', () => {
                expect(() => {
                    const temp = _([]);

                    temp.first();
                }).throws(DeclarrayError, 'Sequence is empty');
            });

            it('should return first element for condition', () => {
                const temp = _([0, 2, 4, 6, 8]);

                const result = temp.first(item => item > 0);

                expect(result).equal(2);
            });

            it('should throw error', () => {
                expect(() => {
                    const temp = _([0, 2, 4, 6, 8]);

                    temp.first(item => item % 2);
                }).throws(DeclarrayError, 'Sequence is empty');
            });
        });

        describe('firstOrDefault', () => {
            it('should return first element', () => {
                const temp = _([0, 2, 4, 6, 8]);

                const result = temp.firstOrDefault();

                expect(result).equal(0);
            });

            it('should return null', () => {
                const temp = _([]);

                const result = temp.firstOrDefault();

                expect(result).equal(null);
            });

            it('should return default', () => {
                const temp = _([]);

                const result = temp.firstOrDefault(10);

                expect(result).equal(10);
            });

            it('should return first element for condition', () => {
                const temp = _([0, 2, 4, 6, 8]);

                const result = temp.firstOrDefault(item => item > 0);

                expect(result).equal(2);
            });

            it('should return null for condition', () => {
                const temp = _([2, 4, 6, 8]);

                const result = temp.firstOrDefault(item => item % 2);

                expect(result).equal(null);
            });

            it('should return default for condition', () => {
                const temp = _([2, 4, 6, 8]);

                const result = temp.firstOrDefault(item => item % 2, 9);

                expect(result).equal(9);
            });
        });

        describe('last', () => {
            it('should return last element', () => {
                const temp = _([0, 2, 4, 6, 8]);

                const result = temp.last();

                expect(result).equal(8);
            });

            it('should throw error', () => {
                expect(() => {
                    const temp = _([]);

                    temp.last();
                }).throws(DeclarrayError, 'Sequence is empty');
            });

            it('should return last element for condition', () => {
                const temp = _([0, 2, 4, 6, 8]);

                const result = temp.last(item => item < 8);

                expect(result).equal(6);
            });

            it('should throw error', () => {
                expect(() => {
                    const temp = _([0, 2, 4, 6, 8]);

                    temp.last(item => item % 2);
                }).throws(DeclarrayError, 'Sequence is empty');
            });
        });

        describe('lastOrDefault', () => {
            it('should return last element', () => {
                const temp = _([0, 2, 4, 6, 8]);

                const result = temp.lastOrDefault();

                expect(result).equal(8);
            });

            it('should return null', () => {
                const temp = _([]);

                const result = temp.lastOrDefault();

                expect(result).equal(null);
            });

            it('should return default', () => {
                const temp = _([]);

                const result = temp.lastOrDefault(10);

                expect(result).equal(10);
            });

            it('should return last element for condition', () => {
                const temp = _([0, 2, 4, 6, 8]);

                const result = temp.lastOrDefault(item => item < 8);

                expect(result).equal(6);
            });

            it('should return null for condition', () => {
                const temp = _([2, 4, 6, 8]);

                const result = temp.lastOrDefault(item => item % 2);

                expect(result).equal(null);
            });

            it('should return default for condition', () => {
                const temp = _([2, 4, 6, 8]);

                const result = temp.lastOrDefault(item => item % 2, 9);

                expect(result).equal(9);
            });
        });

        describe('max', () => {
            it('should return max element', () => {
                const temp = _([0, 2, 4, 6, 8]);

                const result = temp.max();

                expect(result).equal(8);
            });

            it('should return cat with max age', () => {
                const temp = _(cats);

                const result = temp.max(item => item.age);

                expect(result).deep.equal({
                    name: 'Lilly',
                    breed: 'American Curl Cat Breed',
                    age: 11,
                });
            });

            it('should return cat with max age', () => {
                const temp = _([]);

                expect(() => temp.max(item => item.age)).throws(DeclarrayError, 'Sequence is empty');
            });
        });

        describe('min', () => {
            it('should return min element', () => {
                const temp = _([0, 2, 4, 6, 8]);

                const result = temp.min();

                expect(result).equal(0);
            });

            it('should return cat with max age', () => {
                const temp = _(cats);

                const result = temp.min(item => item.age);

                expect(result).deep.equal({
                    name: 'Bella',
                    breed: 'Abyssinian Cat',
                    age: 2,
                    favoriteToys: ['mouse', 'track ball'],
                });
            });

            it('should return cat with max age', () => {
                const temp = _([]);

                expect(() => temp.min(item => item.age)).throws(DeclarrayError, 'Sequence is empty');
            });
        });

        describe('min', () => {
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
        });

        describe('single', () => {
            it('should return single element', () => {
                const temp = _([9]);
                const result = temp.single();

                expect(result).equal(9);
            });

            it('should throw error for long sequence', () => {
                const temp = _([9, 0, 1, 3]);

                expect(() => temp.single()).throws(DeclarrayError, 'Sequence length greater then 1');
            });

            it('should throw error for empty sequence', () => {
                const temp = _([]);

                expect(() => temp.single()).throws(DeclarrayError, 'Sequence is empty');
            });
        });

        describe('single', () => {
            it('should return single element', () => {
                const temp = _([9]);
                const result = temp.singleOrDefault(null);

                expect(result).equal(9);
            });

            it('should throw error for long sequence', () => {
                const temp = _([9, 0, 1, 3]);

                expect(() => temp.singleOrDefault(null)).throws(DeclarrayError, 'Sequence length greater then 1');
            });

            it('should return null for empty sequence', () => {
                const temp = _([]);

                const result = temp.singleOrDefault();

                expect(result).equal(null);
            });
        });

        describe('sum', () => {
            it('should compute from numbers', () => {
                const temp = _([0, 2, 4, 6, 8]);

                const result = temp.sum();

                expect(result).equal(20);
            });

            it('should use select expression', () => {
                const temp = _(cats);

                const result = temp.sum(item => item.age);

                expect(result).equal(78);
            });
        });
    });
});
