import { IEqualityComparator } from '../interfaces/i-equality-comparator';

export class DefaultComparator implements IEqualityComparator<string | number | boolean> {
    compare(first: string, second: string): number;
    compare(first: number, second: number): number;
    compare(first: boolean, second: boolean): number;
    compare(first: string | number | boolean, second: string | number | boolean): number {
        if (first < second) {
            return -1;
        } else if (first === second) {
            return 0;
        } else return 1;
    }

    equals(first: string, second: string): boolean;
    equals(first: number, second: number): boolean;
    equals(first: boolean, second: boolean): boolean;
    equals(first: string | number | boolean, second: string | number | boolean): boolean {
        return first === second;
    }

    getHashCode(entity: string): number;
    getHashCode(entity: number): number;
    getHashCode(entity: boolean): number;
    getHashCode(entity: string | number | boolean): number {
        if (typeof entity === 'number') {
            return Math.abs(entity);
        } else if (typeof entity === 'boolean') {
            return +entity;
        } else {
            return DefaultComparator.getHashOfString(entity);
        }
    }

    private static getHashOfString(str: string): number {
        if (str == null) {
            return 0;
        }

        let hash = 0;

        for (let i = 0; i < str.length; i++) {
            hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
        }

        return Math.abs(hash);
    }
}
