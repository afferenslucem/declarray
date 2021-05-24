# Joining Methods

* [concat](#concat)
* [except](#except)
* [intersect](#intersect)
* [groupJoin](#groupJoin)
* [join](#join)
* [union](#union)
* [zip](#zip)

## concat

Signature: `concat(items: T[] | ISequence<T>): ISequence<T>`

Concatenates two sequences.

```typescript
const sequence = _([1, 2, 3, 4]);

const result = sequence.concat([5, 6]).toArray();

expect(result).deep.equal([1, 2, 3, 4, 5, 6]);
```

## except

Signature: `except(additional: T[] | ISequence<T>, comparator?: IEqualityComparator<T>): ISequence<T>`

Produces the set sequence of two sequences by using the default equality comparer to compare values.

```typescript
const sequence = _([1, 2, 3, 4]);

const onlyInFirst = sequence.except([4, 5]).toArray();

expect(onlyInFirst).deep.equal([1, 2, 3]);
```

## intersect

Signature: `intersect(additional: ISequence<T> | T[], comparator?: IEqualityComparator<T>): ISequence<T>`

Produces the set sequence of two sequences by using the default equality comparer to compare values.

```typescript
const sequence = _([1, 2, 3, 4]);

const result = sequence.intersect([3, 4, 5]).toArray();

expect(result).deep.equal([3, 4]);
```

## groupJoin

Signature: 
```
groupJoin<TOuter, TKey, TResult>(
    outer: ISequence<TOuter> | TOuter[], 
    innerKeySelector: SelectExpression<T, TKey>, 
    outerKeySelector: SelectExpression<TOuter, TKey>, 
    zipFunction: ZipExpression<T, ISequence<TOuter>, TResult>, 
    comparer?: IEqualityComparator<TKey>
): ISequence<TResult>
```

Correlates the elements of two sequences based on equality of keys and groups the results by using default comparer.

```typescript
const cats: ICat[] = [
    { name: 'Barsik', age: 9 },
    { name: 'Cherry', age: 4 },
    { name: 'Feya', age: 4 },
    { name: 'Lulya', age: 1 },
];

const ages: IAge[] = [
    { years: 1, name: 'Young' },
    { years: 4, name: 'Middle' },
    { years: 9, name: 'Old' },
];

const joined = _(ages)
    .groupJoin(
        cats,
        age => age.years,
        cat => cat.age,
        (age, cats) => ({ age: age.name, cats: cats.select(cat => cat.name).toArray() }),
        new DefaultComparator() as IEqualityComparator<number>,
    )
    .toArray();

expect(joined).deep.equal([
    { age: 'Young', cats: ['Lulya'] },
    { age: 'Middle', cats: ['Cherry', 'Feya'] },
    { age: 'Old', cats: ['Barsik'] },
]);
```

## join

Signature: 
```
join<TOuter, TKey, TResult>(
    outer: ISequence<TOuter> | TOuter[], 
    innerKeySelector: SelectExpression<T, TKey>, 
    outerKeySelector: SelectExpression<TOuter, TKey>, 
    zipFunction: ZipExpression<T, TOuter, TResult>, 
    comparer: IEqualityComparator<TKey>
): ISequence<TResult>
```

Correlates the elements of two collections based on matching keys by using default keys equality comparer.

```typescript
const cats: ICat[] = [
    { name: 'Barsik', age: 9 },
    { name: 'Cherry', age: 4 },
    { name: 'Feya', age: 4 },
    { name: 'Lulya', age: 1 },
];

const ages: IAge[] = [
    { years: 1, name: 'Young' },
    { years: 4, name: 'Middle' },
    { years: 9,  name: 'Old' },
];

const joined = _(cats)
    .join(
        ages,
        cat => cat.age,
        age => age.years,
        (cat, age) => ({ name: cat.name, age: age.name }),
    )
    .toArray();

expect(joined).deep.equal([
    { name: 'Barsik', age: 'Old' },
    { name: 'Cherry', age: 'Middle' },
    { name: 'Feya', age: 'Middle' },
    { name: 'Lulya', age: 'Young' },
]);
```

## union

Signature: `union(additional: ISequence<T> | T[], comparator?: IEqualityComparator<T>): ISequence<T>`

Produces the set union of two sequences by using the default equality comparer.

```typescript
const sequence = _([1, 2, 3, 4]);

const result = sequence.union([3, 4, 5, 6]).toArray();

expect(result).deep.equal([1, 2, 3, 4, 5, 6]);
```

## zip

Signature: `zip<TOuter, TResult = [T, TOuter]>(additional: ISequence<TOuter> | TOuter[]): ISequence<TResult>`

Returns new sequence with converted corresponding elements to tuples.

```typescript
const first = _([1, 2, 3, 4, 5]);
const second = _([6, 7, 8, 9, 0]);

const result = first.zip(second).toArray();

expect(result).deep.equal([
    [1, 6],
    [2, 7],
    [3, 8],
    [4, 9],
    [5, 0],
]);
```

### zip with function

Signature: 
```
zip<TOuter, TResult = [T, TOuter]>(
    additional: ISequence<TOuter> | TOuter[], 
    zipFunction: ZipExpression<T, TOuter, TResult>
): ISequence<TResult>
```

Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.

```typescript
const first = _([1, 2, 3, 4, 5]);

const result = first.zip([6, 7, 8, 9, 0], (a, b) => a + b).toArray();

expect(result).deep.equal([7, 9, 11, 13, 5]);
```
