import { expect } from 'chai';
import { Sequence } from '../../../src/sequences/sequence';
import { Aggregator } from '../../../src/sequences/aggregator';
import { DefaultComparator } from '../../../src/utils/default-comparator';
import { cats } from '../../models/fixtures';
import { CatComparator } from '../../utils/cat-comparator';
import { DeclarrayError } from '../../../src/errors/declarray-error';

describe('Aggregator', () => {
    describe('aggregate', () => {
        it('from seq', () => {
            const temp = new Sequence([1, 2, 3, 4]);
            const result = Aggregator.aggregate(temp, (a: number, b: number) => a + b);

            expect(result).equal(10);
        });

        it('from seq with initial value', () => {
            const temp = new Sequence([1, 2, 3, 4]);
            const result = Aggregator.aggregate(temp, (a: number, b: number) => a + b, 5);

            expect(result).equal(15);
        });

        it('from seq with initial value and accumulator func', () => {
            const temp = new Sequence([1, 2, 3, 4]);
            const result = Aggregator.aggregate<number, string>(temp, (a: string, b: number) => a + b.toString(), '');

            expect(result).equal('1234');
        });
    });

    describe('all', () => {
        it('should return true', () => {
            const temp = new Sequence([1, 2, 3, 4]);
            const result = Aggregator.all(temp, item => item > 0);

            expect(result).equal(true);
        });

        it('should return false', () => {
            const temp = new Sequence([1, 2, 3, 4]);
            const result = Aggregator.all(temp, item => item <= 0);

            expect(result).equal(false);
        });

        it('should use index', () => {
            const temp = new Sequence([0, 1, 2, 3, 4]);
            const result = Aggregator.all(temp, (item, index) => item === index);

            expect(result).equal(true);
        });
    });

    describe('all', () => {
        it('should return true', () => {
            const temp = new Sequence([2, 4, 6, 7, 8, 0]);
            const result = Aggregator.any(temp, item => item % 2);

            expect(result).equal(true);
        });

        it('should return false', () => {
            const temp = new Sequence([2, 4, 6, 8, 0]);
            const result = Aggregator.any(temp, item => item % 2);

            expect(result).equal(false);
        });

        it('should use index', () => {
            const temp = new Sequence([0, 1, 2, 4, 4]);
            const result = Aggregator.any(temp, (item, index) => item !== index);

            expect(result).equal(true);
        });
    });

    describe('average', () => {
        it('should sum number seq', () => {
            const temp = new Sequence([0, 1, 2, 3, 4]);
            const result = Aggregator.average(temp);

            expect(result).equal(2);
        });

        it('should select expression', () => {
            const temp = new Sequence([0, 1, 2, 3, 4]);
            const result = Aggregator.average(temp, item => item * item);

            expect(result).equal(6);
        });
    });

    describe('contains', () => {
        describe('numbers', () => {
            it('should find at numbers', () => {
                const temp = new Sequence([0, 1, 2, 3, 4]);
                const result = Aggregator.contains(temp, 2, new DefaultComparator());

                expect(result).equal(true);
            });
            it('should return false', () => {
                const temp = new Sequence([0, 1, 2, 3, 4]);
                const result = Aggregator.contains(temp, 5, new DefaultComparator());

                expect(result).equal(false);
            });
        });

        describe('cats', () => {
            it('should use comparator', () => {
                const temp = new Sequence(cats);
                const result = Aggregator.contains(
                    temp,
                    {
                        name: 'Leo',
                        breed: 'American Wirehair Cat Breed',
                        age: 6,
                    },
                    new CatComparator(),
                );

                expect(result).equal(true);
            });
        });
    });

    describe('count', () => {
        it('should return length', () => {
            const temp = new Sequence([0, 1, 2, 3, 4]);
            const result = Aggregator.count(temp);

            expect(result).equal(5);
        });

        it('should select expression', () => {
            const temp = new Sequence([0, 1, 2, 3, 4]);
            const result = Aggregator.count(temp, item => item % 2);

            expect(result).equal(2);
        });
    });

    describe('elementAt', () => {
        it('should return element', () => {
            const temp = new Sequence([0, 1, 2, 3, 4]);
            const result = Aggregator.elementAt(temp, 4);

            expect(result).equal(4);
        });

        it('should throw error', () => {
            expect(() => {
                const temp = new Sequence([0, 1, 2, 3, 4]);
                Aggregator.elementAt(temp, 5);
            }).throws(DeclarrayError, 'Index out of bounds');
        });
    });

    describe('elementAtOrDefault', () => {
        it('should return item', () => {
            const temp = new Sequence([0, 1, 2, 3, 4]);
            const result = Aggregator.elementAtOrDefault(temp, 4, undefined);

            expect(result).equal(4);
        });

        it('should return default', () => {
            const temp = new Sequence([0, 1, 2, 3, 4]);
            const result = Aggregator.elementAtOrDefault(temp, 6, -1);

            expect(result).equal(-1);
        });
    });

    describe('first', () => {
        it('should return element', () => {
            const temp = new Sequence([0, 1, 2, 3, 4]);
            const result = Aggregator.first(temp);

            expect(result).equal(0);
        });

        it('throw error', () => {
            expect(() => {
                const temp = new Sequence([]);
                Aggregator.first(temp);
            }).throws(DeclarrayError, 'Sequence is empty');
        });

        it('should return element for condition', () => {
            const temp = new Sequence([0, 1, 2, 3, 4]);
            const result = Aggregator.first(temp, item => item % 2);

            expect(result).equal(1);
        });

        it('throw error', () => {
            expect(() => {
                const temp = new Sequence([0, 2, 4, 6]);
                Aggregator.first(temp, item => item % 2);
            }).throws(DeclarrayError, 'Sequence is empty');
        });
    });

    describe('firstOrDefault', () => {
        it('should return element', () => {
            const temp = new Sequence([0, 1, 2, 3, 4]);
            const result = Aggregator.firstOrDefault(temp, null);

            expect(result).equal(0);
        });

        it('should return default', () => {
            const temp = new Sequence([]);
            const result = Aggregator.firstOrDefault(temp, null);

            expect(result).equal(null);
        });

        it('should return element for condition', () => {
            const temp = new Sequence([0, 1, 2, 3, 4]);
            const result = Aggregator.firstOrDefault(temp, null, item => item % 2);

            expect(result).equal(1);
        });

        it('should return default', () => {
            const temp = new Sequence([0, 2, 4, 6]);
            const result = Aggregator.firstOrDefault(temp, null, item => item % 2);

            expect(result).equal(null);
        });
    });

    describe('last', () => {
        it('should return element', () => {
            const temp = new Sequence([0, 1, 2, 3, 4]);
            const result = Aggregator.last(temp);

            expect(result).equal(4);
        });

        it('throw error', () => {
            expect(() => {
                const temp = new Sequence([]);
                Aggregator.last(temp);
            }).throws(DeclarrayError, 'Sequence is empty');
        });

        it('should return element for condition', () => {
            const temp = new Sequence([0, 1, 2, 3, 4]);
            const result = Aggregator.last(temp, item => item % 2);

            expect(result).equal(3);
        });

        it('throw error', () => {
            expect(() => {
                const temp = new Sequence([0, 2, 4, 6]);
                Aggregator.last(temp, item => item % 2);
            }).throws(DeclarrayError, 'Sequence is empty');
        });
    });

    describe('lastOrDefault', () => {
        it('should return element', () => {
            const temp = new Sequence([0, 1, 2, 3, 4]);
            const result = Aggregator.lastOrDefault(temp, null);

            expect(result).equal(4);
        });

        it('should return default', () => {
            const temp = new Sequence([]);
            const result = Aggregator.lastOrDefault(temp, null);

            expect(result).equal(null);
        });

        it('should return element for condition', () => {
            const temp = new Sequence([0, 1, 2, 3, 4]);
            const result = Aggregator.lastOrDefault(temp, null, item => item % 2);

            expect(result).equal(3);
        });

        it('should return default', () => {
            const temp = new Sequence([0, 2, 4, 6]);
            const result = Aggregator.lastOrDefault(temp, null, item => item % 2);

            expect(result).equal(null);
        });
    });

    describe('max', () => {
        it('should return max element', () => {
            const temp = new Sequence([9, 0, 11, 2, 3, 4]);
            const result = Aggregator.max(temp);

            expect(result).equal(11);
        });

        it('should return cat with max age', () => {
            const temp = new Sequence(cats);
            const result = Aggregator.max(temp, item => item.age);

            expect(result).deep.equal({
                name: 'Lilly',
                breed: 'American Curl Cat Breed',
                age: 11,
            });
        });

        it('should throws error', () => {
            const temp = new Sequence([]);

            expect(() => Aggregator.max(temp)).throws(DeclarrayError, 'Sequence is empty');
        });
    });

    describe('min', () => {
        it('should return max element', () => {
            const temp = new Sequence([9, 0, 11, 2, 3, 4]);
            const result = Aggregator.min(temp);

            expect(result).equal(0);
        });

        it('should return cat with max age', () => {
            const temp = new Sequence(cats);
            const result = Aggregator.min(temp, item => item.age);

            expect(result).deep.equal({
                name: 'Bella',
                breed: 'Abyssinian Cat',
                age: 2,
                favoriteToys: ['mouse', 'track ball'],
            });
        });

        it('should throws error', () => {
            const temp = new Sequence([]);

            expect(() => Aggregator.min(temp)).throws(DeclarrayError, 'Sequence is empty');
        });
    });

    describe('sequenceEqual', () => {
        describe('primitives', () => {
            it('should return false for different length', () => {
                const first = new Sequence([9, 0, 11, 2, 3, 4]);
                const second = new Sequence([9, 0, 11]);

                const result = Aggregator.sequenceEqual(first, second, new DefaultComparator());

                expect(result).equal(false);
            });

            it('should return false for different sequences', () => {
                const first = new Sequence([9, 0, 11]);
                const second = new Sequence([9, 0, 13]);

                const result = Aggregator.sequenceEqual(first, second, new DefaultComparator());

                expect(result).equal(false);
            });

            it('should return true', () => {
                const first = new Sequence([9, 0, 11]);
                const second = new Sequence([9, 0, 11]);

                const result = Aggregator.sequenceEqual(first, second, new DefaultComparator());

                expect(result).equal(true);
            });

            it('should return true for array', () => {
                const first = new Sequence([9, 0, 11]);
                const second = new Sequence([9, 0, 11]);

                const result = Aggregator.sequenceEqual(first, second, new DefaultComparator());

                expect(result).equal(true);
            });
        });

        describe('objects', () => {
            it('should return false for different sequences', () => {
                const first = new Sequence([
                    {
                        name: 'Charlie',
                        breed: 'American Curl Cat Breed',
                        age: 10,
                    },
                    {
                        name: 'Lucy',
                        breed: 'American Shorthair Cat',
                        age: 4,
                    },
                    {
                        name: 'Leo',
                        breed: 'American Wirehair Cat Breed',
                        age: 6,
                    },
                ]);
                const second = new Sequence([
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
                        name: 'Lilly',
                        breed: 'American Curl Cat Breed',
                        age: 11,
                    },
                ]);

                const result = Aggregator.sequenceEqual(first, second, new CatComparator());

                expect(result).equal(false);
            });

            it('should return true', () => {
                const first = new Sequence([
                    {
                        name: 'Charlie',
                        breed: 'American Curl Cat Breed',
                        age: 10,
                    },
                    {
                        name: 'Lucy',
                        breed: 'American Shorthair Cat',
                        age: 4,
                    },
                    {
                        name: 'Leo',
                        breed: 'American Wirehair Cat Breed',
                        age: 6,
                    },
                ]);
                const second = new Sequence([
                    {
                        name: 'Charlie',
                        breed: 'American Curl Cat Breed',
                        age: 10,
                    },
                    {
                        name: 'Lucy',
                        breed: 'American Shorthair Cat',
                        age: 4,
                    },
                    {
                        name: 'Leo',
                        breed: 'American Wirehair Cat Breed',
                        age: 6,
                    },
                ]);

                const result = Aggregator.sequenceEqual(first, second, new CatComparator());

                expect(result).equal(true);
            });
        });
    });

    describe('single', () => {
        it('should return single element', () => {
            const temp = new Sequence([9]);
            const result = Aggregator.single(temp);

            expect(result).equal(9);
        });

        it('should throw error for long sequence', () => {
            const temp = new Sequence([9, 0, 1, 3]);

            expect(() => Aggregator.single(temp)).throws(DeclarrayError, 'Sequence length greater then 1');
        });

        it('should throw error for empty sequence', () => {
            const temp = new Sequence([]);

            expect(() => Aggregator.single(temp)).throws(DeclarrayError, 'Sequence is empty');
        });
    });

    describe('singleOrDefault', () => {
        it('should return single element', () => {
            const temp = new Sequence([9]);
            const result = Aggregator.singleOrDefault(temp, null);

            expect(result).equal(9);
        });

        it('should throw error for long sequence', () => {
            const temp = new Sequence([9, 0, 1, 3]);

            expect(() => Aggregator.singleOrDefault(temp, null)).throws(DeclarrayError, 'Sequence length greater then 1');
        });

        it('should return null for empty sequence', () => {
            const temp = new Sequence([]);

            const result = Aggregator.singleOrDefault(temp, null);

            expect(result).equal(null);
        });
    });

    describe('sum', () => {
        it('should sum number seq', () => {
            const temp = new Sequence([0, 1, 2, 3, 4]);
            const result = Aggregator.sum(temp);

            expect(result).equal(10);
        });

        it('should select expression', () => {
            const temp = new Sequence([0, 1, 2, 3, 4]);
            const result = Aggregator.sum(temp, item => item * item);

            expect(result).equal(30);
        });
    });
});
