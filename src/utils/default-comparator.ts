import {IComparator} from "../interfaces/i-comparator";

export class DefaultComparator implements IComparator<string | number> {

    compare(first: string, second: string): number;
    compare(first: number, second: number): number;
    compare(first: string | number, second: string | number): number {
        if(first < second) { return -1; }
        else if (first === second) { return 0; }
        else return 1;
    }

    equals(first: string, second: string): boolean;
    equals(first: number, second: number): boolean;
    equals(first: string | number, second: string | number): boolean {
        return first === second;
    }

    getHashCode(entity: string): number;
    getHashCode(entity: number): number;
    getHashCode(entity: string | number): number {
        if (typeof entity === "number") {
            return entity;
        } else {
            return DefaultComparator.getHashOfString(entity);
        }
    }

    private static getHashOfString(str: string): number {
        let hash = 0;

        for(let i = 0; i < str.length; i++) {
            hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
        }

        return (Math.abs(hash));
    }
}
