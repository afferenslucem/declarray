# Materializing Methods

Materializing methods trigger computation of your query. All your chain of methods will be runned for taking result.

* [toArray](#toArray)
* [toDictionary](#toDictionary)
* [toHashSet](#toHashSet)
* [toLookup](#toLookup)

## toArray

Signature: `toArray(): T[]`

Creates an array from sequence.

```typescript
const sequence = _([1, 2, 3, 4, 5]);

const result = sequence.toArray();

expect(result).deep.equal([1, 2, 3, 4, 5]);
```

## toDictionary

Signature: `toDictionary<TKey>(keySelector: MapCondition<T, TKey>): Dictionary<TKey, T>`

Creates a Dictionary<TKey, TElement> from a sequence according to specified key selector and element selector functions by using default equality comparer.

```typescript
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
```

## toHashSet

Signature: `toHashSet(comparer: IEqualityComparator<T>): HashSet<T>`

Creates a `HashSet<T>` from an sequence.

```typescript
const cats = [
    { name: 'Barsik', age: 9 },
    { name: 'Cherry', age: 4 },
    { name: 'Barsik', age: 9 },
    { name: 'Lulya', age: 1 },
    { name: 'Cherry', age: 4 },
];

const catComparer: IEqualityComparator<any> = {
    getHashCode: entity => 
        new DefaultComparator().getHashCode(entity.name + entity.age),
    
    compare: (first: any, second: any) => 
        new DefaultComparator().compare(
            first.name + first.age, second.name + second.age),
    
    equals: (first: any, second: any) => 
        first.name === second.name && first.age === second.age,
};

const result = _(cats).toHashSet(catComparer).entries;

expect(result).deep.equal([
    { name: 'Cherry', age: 4 },
    { name: 'Barsik', age: 9 },
    { name: 'Lulya', age: 1 },
]);
```

## toLookup

Signature: `toLookup<TKey, TValue>(key: SelectExpression<T, TKey>, comparer?: IEqualityComparator<TKey>, value?: SelectExpression<T, TValue>): ILookup<TKey, TValue>`

Creates a `ILookup<TKey, TValue[]>` from a sequence according to a specified key selector function.

```typescript
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
```
