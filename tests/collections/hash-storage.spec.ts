import {expect} from "chai";
import {DefaultComparator} from "../../src/utils/default-comparator";
import {Entry} from "../../src/models/entry";
import {HashStorage} from "../../src/collections/hash-storage";

describe('HashStorage', () => {
    describe('probeFromIndex', () => {
        let storage: HashStorage<string, number> = null;

        beforeEach(() => {
            storage = new HashStorage<string, number>(new DefaultComparator());
        })

        describe('For insert', () => {
            it('should return 0 index', () => {
                const result = storage.probeFromIndex(0, "key");

                expect(result).equal(0);
            });

            it('should return 4 index', () => {
                storage.array[0] = new Entry<string, number>()

                const result = storage.probeFromIndex(0, "key");

                expect(result).equal(4);
            });

            it('should return 16 index', () => {
                storage.array[0] = new Entry<string, number>()
                storage.array[4] = new Entry<string, number>()

                const result = storage.probeFromIndex(0, "key");

                expect(result).equal(16);
            });

            it('should return 36 index', () => {
                storage.array[0] = new Entry<string, number>()
                storage.array[4] = new Entry<string, number>()
                storage.array[16] = new Entry<string, number>()

                const result = storage.probeFromIndex(0, "key");

                expect(result).equal(36);
            });

            it('should return 84 index', () => {
                storage.array[0] = new Entry<string, number>()
                storage.array[4] = new Entry<string, number>()
                storage.array[16] = new Entry<string, number>()
                storage.array[36] = new Entry<string, number>()

                const result = storage.probeFromIndex(0, "key");

                expect(result).equal(64);
            });

            it('should return -1 index', () => {
                storage.array[0] = new Entry<string, number>()
                storage.array[4] = new Entry<string, number>()
                storage.array[16] = new Entry<string, number>()
                storage.array[36] = new Entry<string, number>()
                storage.array[64] = new Entry<string, number>()

                const result = storage.probeFromIndex(0, "key");

                expect(result).equal(-1);
            });
        })

        describe('For update', () => {
            it('should return 0 index', () => {
                storage.array[0] = new Entry<string, number>('key')

                const result = storage.probeFromIndex(0, "key");

                expect(result).equal(0);
            });

            it('should return 4 index', () => {
                storage.array[0] = new Entry<string, number>()
                storage.array[1] = new Entry<string, number>()
                storage.array[4] = new Entry<string, number>('key')

                const result = storage.probeFromIndex(0, "key");

                expect(result).equal(4);
            });
        })
    })

    describe('getIndexForKey', () => {
        let storage: HashStorage<string, number> = null;

        beforeEach(() => {
            storage = new HashStorage<string, number>(new DefaultComparator());
        })

        it('should return 14 index', () => {
            const result = storage.getIndexForKey("key");

            const expected = 79;

            expect(result).equal(expected);
        });

        it('should return 0 index', () => {
            storage.array[79] = new Entry<string, number>()
            storage.array[83] = new Entry<string, number>()

            const result = storage.getIndexForKey("key");

            const expected = 95;

            expect(result).equal(expected);
        });
    })


    describe('set', () => {
        describe('set (insert)', () => {
            let storage: HashStorage<string, number> = null;

            beforeEach(() => {
                storage = new HashStorage<string, number>(new DefaultComparator());
            })

            it('should set', () => {
                storage.set(new Entry<string, number>('124'));
                storage.set(new Entry<string, number>('qw98xx'));
                storage.set(new Entry<string, number>('345vcl'));
                storage.set(new Entry<string, number>('wee'));
                const result = storage.set(new Entry<string, number>('qwm'));
                const expected = true;

                expect(result).equal(expected);
                expect(storage.count).equal(5);
            });

            it('should not set', () => {
                storage.set(new Entry<string, number>('124'));
                storage.set(new Entry<string, number>('qw98xx'));
                expect(storage.count).equal(2);

                storage.set(new Entry<string, number>('345vcl'));
                storage.set(new Entry<string, number>('wee'));
                storage.set(new Entry<string, number>('qwm'));
                const result = storage.set(new Entry<string, number>('['));

                const expected = false;

                expect(result).equal(expected);
                expect(storage.count).equal(5);
            });
        })

        describe('set (update)', () => {
            let storage: HashStorage<string, number> = null;

            beforeEach(() => {
                storage = new HashStorage<string, number>(new DefaultComparator(), 15);
            })

            it('should update', () => {
                storage.set(new Entry<string, number>('key'));
                storage.set(new Entry<string, number>('keyke2'));
                storage.set(new Entry<string, number>('key126'));
                storage.set(new Entry<string, number>('key441'));

                const result = storage.set(new Entry<string, number>('key'));

                const expected = true;

                expect(result).equal(expected);
                expect(storage.count).equal(4);
            });
        })
    })

    describe('get', () => {
        let storage: HashStorage<string, number> = null;

        beforeEach(() => {
            storage = new HashStorage<string, number>(new DefaultComparator());
        })

        it('should get existing value', () => {
            storage.set(new Entry<string, number>('key', 0));
            storage.set(new Entry<string, number>('keyke2', null));
            storage.set(new Entry<string, number>('key126', undefined));
            storage.set(new Entry<string, number>('key441', 3));


            let result = storage.get('key');
            expect(result).equal(0);

            result = storage.get('keyke2');
            expect(result).equal(null);

            result = storage.get('key126');
            expect(result).equal(undefined);

            result = storage.get('key441');
            expect(result).equal(3);
        });

        it('should get unexisting', () => {
            let result = storage.get('key');
            expect(result).equal(undefined);
        });
    })

    describe('remove', () => {
        let storage: HashStorage<string, number> = null;

        beforeEach(() => {
            storage = new HashStorage<string, number>(new DefaultComparator());
        })

        it('should remove existing', () => {
            storage.set(new Entry<string, number>('key', 777));
            expect(storage.count).equal(1);

            let result = storage.get('key');
            expect(result).equal(777);

            storage.remove('key');
            expect(storage.count).equal(0);

            result = storage.get('key');
            expect(result).equal(undefined);
        });

        it('should unexisting', () => {
            expect(() => storage.remove('key')).throws('Key key does not exists');
        });

        it('should unexisting', () => {
            storage.set(new Entry<string, number>('key', 777));
            storage.remove('key')

            expect(() => storage.remove('key')).throws('Key key does not exists');
        });
    })
})
