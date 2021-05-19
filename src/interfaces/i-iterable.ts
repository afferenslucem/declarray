export interface IIterable<T> {
    [Symbol.iterator](): IterableIterator<T>;
}
