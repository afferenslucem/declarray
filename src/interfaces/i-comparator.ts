export interface IComparator<T> {
    getHashCode(entity: T): number;
    getHashCode(entity: T): number;
    compare(first: T, second: T): number;
    equals(first: T, second: T): boolean;
}
