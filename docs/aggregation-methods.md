# Aggregation methods

These methods trigger computation of your query. All your chain of methods will be run for taking result.

-   [aggregate](#aggregate)
-   [all](#all)
-   [any](#any)
-   [average](#average)
-   [contains](#contains)
-   [count](#count)
-   [elementAt](#elementAt)
-   [elementAtOrDefault](#elementAtOrDefault)
-   [first](#first)
-   [last](#last)
-   [max](#max)
-   [min](#min)
-   [sequenceEqual](#sequenceEqual)
-   [single](#single)
-   [singleOrDefault](#singleOrDefault)
-   [sum](#sum)

## aggregate

Signature: `aggregate(aggregateExpression: ReduceExpression<T>): T`

Applies an accumulator function over a sequence skipping first value and this value using like accumulator.

```typescript
const sequence = _([0, 2, 4, 6, 8]);

const result = sequence.aggregate((a, b) => a + b);

expect(result).equal(20);
```
### aggregate with accumulator

Signature: `aggregate<TOuter>(aggregateExpression: AccumulateExpression<T, TOuter>, initial: TOuter): TOuter`

Applies an accumulator function over a sequence with initialized accumulator value.

```typescript
const sequence = _([0, 2, 4, 6, 8]);

const result = sequence.aggregate((a, b) => a + b, '');

expect(result).equal('02468');
```

## all

Signature: `all(condition: WhereCondition<T>): boolean`

Determines whether all elements of a sequence satisfy a condition.

```typescript
const temp = _([0, 2, 4, 6, 8]);

const allIsEven = temp.all(item => item % 2 === 0);

expect(allIsEven).equal(true);
```

## any

Signature: `any(condition: WhereCondition<T>): boolean`

Determines whether any element of a sequence satisfies a condition.

```typescript
const sequence = _([0, 2, 4, 6, 7, 8]);

const hasAnyOdd = sequence.any(item => item % 2);

expect(hasAnyOdd).equal(true);
```

## average

Signature: `average(): number`

Computes the average of a sequence of numeric values.

```typescript
const sequence = _([0, 2, 4, 6, 8]);

const result = sequence.average();

expect(result).equal(4);
```

## average for field of objects

Signature: `average(selectCondition?: SelectExpression<T, number>): number`

Computes the average of numeric property on items of a sequence.

```typescript
const cats = [
    {
        name: 'Tom',
        age: 1,
    },
    {
        name: 'Bonny',
        age: 3,
    },
    {
        name: 'Feya',
        age: 2,
    },
];

const middleAge = _(cats).average(item => item.age);

expect(middleAge).equal(2);
```

## contains

Signature: `contains(target: T): boolean`

Determines whether a sequence contains a specified element. Using default equality comparator.

```typescript
const sequence = _([0, 2, 4, 6, 8]);

const hasFour = sequence.contains(4);

expect(hasFour).equal(true);
```

### contains with custom equality comparator

Determines whether a sequence contains a specified element. Using specified equality comparer.

```typescript
const cats = [
    { name: 'Barsik', age: 9 },
    { name: 'Cherry', age: 4 },
    { name: 'Feya', age: 4 },
    { name: 'Lulya', age: 1 },
];

const catByNameComparator: IEqualityComparator<any> = {
    compare: (first: any, second: any) => first.name.localeCompare(second.name),
    equals: (a, b) => a.name === b.name && a.age === b.age,
    getHashCode: entity => new DefaultComparator().getHashCode(entity.name),
};

const cat = { name: 'Feya', age: 4 };

const result = _(cats).contains(cat, catByNameComparator);

expect(result).equal(true);
```

## count

Signature: `count(): number`

Returns the number of elements in a sequence.

```typescript
const result = _([1, 2, 3, 4, 5]).count();

expect(result).equal(5);
```

## elementAt

Signature: `elementAt(index: number): T`

Returns element at specified index at sequence.

```typescript
const temp = _([0, 2, 4, 6, 8]);

const result = temp.elementAt(3);

expect(result).equal(6);
```

> ⚠️ If sequence hasn't got element at specified index - method throws DeclarrayError with message '**Index out of bounds**'

## elementAtOrDefault

Signature: `elementAtOrDefault(index: number): T | null`

Returns element at specified index at sequence. If sequence hasn't got matching element returns null.

```typescript
const sequence = _([0, 2, 4, 6, 8]);

const result = sequence.elementAtOrDefault(6);

expect(result).equal(null);
```

### elementAtOrDefault with custom default

Signature: `elementAtOrDefault(index: number, $default: T): T`

Returns element at specified index at sequence. If sequence hasn't got matching element returns specified default.

```typescript
const sequence = _([0, 2, 4, 6, 8]);

const result = sequence.elementAtOrDefault(6, 10);

expect(result).equal(10);
```

## first

Signature: `first(): T`

Returns first element at sequence.

```typescript
const sequence = _([0, 2, 4, 6, 8]);

const result = sequence.first();

expect(result).equal(0);
```

> ⚠️ If sequence hasn't got any element method throws DeclarrayError with message '**'Sequence is empty'**'

### first for condition

Signature: `first(whereCondition: WhereCondition<T>): T`

Returns first element of sequence passed the condition.

```typescript
const sequence = _([0, 2, 4, 6, 8]);

const result = sequence.first(item => item > 0);

expect(result).equal(2);
```

> ⚠️ If sequence hasn't got any element for condition method throws DeclarrayError with message '**'Sequence is empty'**'

## last

Signature: `last(): T`

Returns last element at sequence.

```typescript
const sequence = _([0, 2, 4, 6, 8]);

const result = sequence.last();

expect(result).equal(8);
```

> ⚠️ If sequence hasn't got any element method throws DeclarrayError with message '**'Sequence is empty'**'

### last for condition

Signature: `last(whereCondition: WhereCondition<T>): T`

Returns last element of sequence passed the condition.

```typescript
const sequence = _([0, 2, 4, 6, 8]);

const result = sequence.last(item => item < 8);

expect(result).equal(6);
```

> ⚠️ If sequence hasn't got any element for condition method throws DeclarrayError with message '**'Sequence is empty'**'

## max

Signature: `max(): T`

Returns maximum value in sequence. Will using default comparing.

```typescript
const sequence = _([0, 2, 4, 8, 6]);

const result = sequence.max();

expect(result).equal(8);
```

> ⚠️ If sequence hasn't got any element method throws DeclarrayError with message '**'Sequence is empty'**'

### max by field

Signature: `max<TProperty>(selectPropertyExpression: SelectExpression<T, TProperty>): T`

Returns maximum object in sequence by field.

```typescript
const cats = [
    { name: 'Tom', age: 1 },
    { name: 'Bonny', age: 3 },
    { name: 'Feya', age: 2 },
];

const result = _(cats).max(item => item.age);

expect(result).deep.equal({
    name: 'Bonny',
    age: 3,
});
```

> ⚠️ If sequence hasn't got any element method throws DeclarrayError with message '**'Sequence is empty'**'

## min

Signature: `min(): T`

Returns minimum value in sequence. Will using default comparing.

```typescript
const sequence = _([2, 0, 4, 8, 6]);

const result = sequence.min();

expect(result).equal(0);
```

> ⚠️ If sequence hasn't got any element method throws DeclarrayError with message '**'Sequence is empty'**'

### min by field

Signature: `min<TProperty>(selectPropertyExpression: SelectExpression<T, TProperty>): T`

Returns minimum object in sequence by field.

```typescript
const cats = [
    { name: 'Tom', age: 1 },
    { name: 'Bonny', age: 3 },
    { name: 'Feya', age: 2 },
];

const result = _(cats).min(item => item.age);

expect(result).deep.equal({
  name: 'Tom',
  age: 1,
});
```

> ⚠️ If sequence hasn't got any element method throws DeclarrayError with message '**'Sequence is empty'**'

## sequenceEqual

Signature: `sequenceEqual(sequence: ISequence<T> | T[]): boolean`

Determines whether two sequences are equal by comparing the elements by using the default equality comparer.

```typescript
const first = _([0, 2, 4, 6, 8]);
const second = [0, 2, 4, 6, 8];

const result = first.sequenceEqual(second);

expect(result).equal(true);
```

### sequenceEqual with custom equality comparator

Signature: `sequenceEqual(sequence: ISequence<T> | T[], comparator: IEqualityComparator<T>): boolean`

```typescript
const first = [
    { name: 'Tom', age: 1 },
    { name: 'Bonny', age: 3 },
    { name: 'Feya', age: 2 },
];

const second = [
    { name: 'Tom', age: 1 },
    { name: 'Bonny', age: 3 },
    { name: 'Feya', age: 2 },
];

const catByNameComparator: IEqualityComparator<any> = {
    compare: (first: any, second: any) => first.name.localeCompare(second.name),
    equals: (a, b) => a.name === b.name && a.age === b.age,
    getHashCode: entity => new DefaultComparator().getHashCode(entity.name),
};

const result = _(first).sequenceEqual(second, catByNameComparator);

expect(result).equal(true);
```

## single

Signature: `single(): T`

Returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence.

```typescript
const sequence = _([9]);
const result = sequence.single();

expect(result).equal(9);
```

> ⚠️ If sequence hasn't got any element method throws DeclarrayError with message '**'Sequence is empty'**'
> ⚠️ If sequence has got more then one element method throws DeclarrayError with message '**'Sequence length greater then 1'**'

## singleOrDefault

Signature: `singleOrDefault($default?: T): T`

Returns the only element of a sequence, or a specified default if the sequence is empty; this method throws an exception if there is more than one element in the sequence.

```typescript
const sequence = _([]);
const result = sequence.singleOrDefault();

expect(result).equal(null);
```

> ⚠️ If sequence has got more then one element method throws DeclarrayError with message '**'Sequence length greater then 1'**'

## sum

Signature: `sum(): number`

Computes the sum of a sequence of numeric values.

```typescript
const sequence = _([0, 2, 4, 6, 8]);

const result = sequence.sum();

expect(result).equal(20);
```

### sum for field of objects

Signature: `sum(map: (item: T) => number): number`

Computes the sum of a sequence of numeric values.

```typescript
const cats = [
    { name: 'Tom', age: 1 },
    { name: 'Bonny', age: 3 },
    { name: 'Feya', age: 2 },
];

const result = _(cats).sum(item => item.age);

expect(result).equal(6);
```
