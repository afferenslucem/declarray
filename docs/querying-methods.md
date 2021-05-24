# Querying Methods

Querying methods always returns new immutable sequence.

## Menu

-   [append](#append)
-   [defaultIfEmpty](#defaultifempty)
-   [distinct](#distinct)
-   [groupBy](#groupby)
-   [orderBy](#orderby)
-   [prepend](#prepend)
-   [reverse](#reverse)
-   [select](#select)
-   [selectMany](#selectmany)
-   [skip](#skip)
-   [take](#take)
-   [where](#where)

## append

Signature: `append(item: T): ISequence<T>`

Appends a value to the end of the sequence.

```typescript
const sequence = _([1, 2, 3, 4, 5]);

const result = sequence.append(6).toArray();

expect(result).deep.equal([1, 2, 3, 4, 5, 6]);
```

## defaultIfEmpty

Signature: `defaultIfEmpty($default: T | T[] | ISequence<T>): ISequence<T>`

Returns the elements of the sequence, or the specified value in a sequence if the original sequence is empty.

```typescript
const sequence = _([1, 2, 3, 4, 5]);

const result = sequence
    .where(item => item > 10)
    .defaultIfEmpty(0)
    .toArray();

expect(result).deep.equal([0]);
```

## distinct

Signature: `distinct(): ISequence<T>`

Returns distinct elements from a sequence using default equality comparer.

```typescript
const sequence = _([1, 2, 2, 3, 3, 3, 4, 4, 4, 4]);

const result = sequence.distinct().toArray();

expect(result).deep.equal([1, 2, 3, 4]);
```

### distinct with custom comparer

Signature: `distinct(comparator: IEqualityComparator<T>): ISequence<T>`

Returns distinct elements from a sequence by using specified equality comparer

```typescript
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
```

## groupBy

Signature: `distinct(comparator: IEqualityComparator<T>): ISequence<T>`

Groups the elements of a sequence by specified key.

```typescript
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
```

### groupBy with groups converting

Signature:

```
groupBy<TKey, TValue>(
    keySelector: SelectExpression<T, TKey>,
    groupMap: SelectExpression<ISequence<T>, TValue>
): ISequence<IGroupedData<TKey, TValue>>
```

Groups the elements of a sequence by specified key and convert groups by query.

```typescript
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
```

### groupBy with object key

Signature:

```
groupBy<TKey, TValue>(
    keySelector: SelectExpression<T, TKey>,
    eqalityComparer: IEqualityComparator<TKey>,
    groupMap: SelectExpression<ISequence<T>, TValue>
): ISequence<IGroupedData<TKey, TValue>>
```

Groups the elements of a sequence by specified key with using specified key comparator and convert groups by query.

```typescript
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
        return;
        first.street === second.street && first.apartment === second.apartment;
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
```

## orderBy

Signature: `orderBy<TProperty>(condition: SelectExpression<T, TProperty>): IThenBySequence<T>`

Sorts the elements of a sequence in ascending order to a key.

```typescript
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
```

### orderBy with object key

Signature: `orderBy<TProperty>(condition: SelectExpression<T, TProperty>, comparator?: IEqualityComparator<TProperty>): IThenBySequence<T>`

Sorts the elements of a sequence in ascending order to a key. For key comparing uses comparator.

```typescript
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
```

## prepend

Signature: `prepend(item: T): ISequence<T>`

Adds a value to the beginning of the sequence.

```typescript
const sequence = _([1, 2, 3, 4, 5]);

const result = sequence.prepend(0).toArray();

expect(result).deep.equal([0, 1, 2, 3, 4, 5]);
```

## reverse

Signature: `reverse(): ISequence<T>`

```typescript
const reverced = _([1, 2, 3, 4, 5]).reverse().toArray();

console.log(reverced); // [ 5, 4, 3, 2, 1 ]
```

## select

Signature: `select<TOuter>(expression: SelectExpression<T, TOuter>): ISequence<TOuter>`

```typescript
const sequence = _([1, 2, 3, 4, 5]);

const result = sequence.select(item => item ** 2).toArray();

expect(result).deep.equal([1, 4, 9, 16, 25]);
```

## selectMany

Signature: `selectMany<TOuter>(selectManyExpression: SelectExpression<T, TOuter[]>): ISequence<TOuter>`

```typescript
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
```

## skip

Signature: `skip(skipCount: number): ISequence<T>`

Bypasses `skipCount` elements in a sequence and then returns the remaining elements.

```typescript
const sequence = _([1, 2, 3, 4, 5]);

const result = sequence.skip(2).toArray();

expect(result).deep.equal([3, 4, 5]);
```

## take

Signature: `take(takeCount: number): ISequence<T>`

Returns a `takeCount` elements from the start of a sequence.

```typescript
const sequence = _([1, 2, 3, 4, 5]);

const result = sequence.take(3).toArray();

expect(result).deep.equal([1, 2, 3]);
```

## where

Signature: `take(takeCount: number): ISequence<T>`

Filters a sequence of values based on a predicate.

```typescript
const sequence = _([1, 2, 3, 4, 5]);

const result = sequence.where(item => item % 2).toArray();

expect(result).deep.equal([1, 3, 5]);
```
