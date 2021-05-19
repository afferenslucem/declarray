import { expect } from 'chai';
import { DefaultComparator } from '../../../../src/utils/default-comparator';
import { Entry } from '../../../../src/models/entry';
import { HashStorage } from '../../../../src/collections/hash-map/hash-storage';

describe('HashStorage', () => {
    describe('set', () => {
        let storage: HashStorage<string, number> = null;

        beforeEach(() => {
            storage = new HashStorage<string, number>(new DefaultComparator(), 100);
        });

        it('should insert', () => {
            storage.set(new Entry<string, number>('124', 124));

            expect(storage.count).equal(1);
            expect(storage.entries().length).equal(1);
            expect(storage.get('124')).equal(124);
        });

        it('should update', () => {
            storage.set(new Entry<string, number>('124', 124));
            storage.set(new Entry<string, number>('124', 421));

            expect(storage.count).equal(1);
            expect(storage.entries().length).equal(1);
            expect(storage.get('124')).equal(421);
        });
    });

    describe('get', () => {
        let storage: HashStorage<string, number> = null;

        beforeEach(() => {
            storage = new HashStorage<string, number>(new DefaultComparator(), 10);
        });

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
            const result = storage.get('key');
            expect(result).equal(undefined);
        });
    });

    describe('remove', () => {
        let storage: HashStorage<string, number> = null;

        beforeEach(() => {
            storage = new HashStorage<string, number>(new DefaultComparator(), 10);
        });

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
    });
});
