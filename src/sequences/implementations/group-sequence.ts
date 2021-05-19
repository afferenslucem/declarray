import { ISequence } from '../../interfaces/i-sequence';
import { IGroupedData } from '../../interfaces/i-grouped-data';
import { SelectExpression } from '../../delegates';
import { IEqualityComparator } from '../../interfaces/i-equality-comparator';
import { fakeSelector } from '../../utils/selectors';
import { Sequence } from '../sequence';

export class GroupSequence<T, TKey, TValue = ISequence<T>> extends Sequence<T, IGroupedData<TKey, TValue>> {
    private keySelector: SelectExpression<T, TKey>;
    private groupModifier: SelectExpression<ISequence<T>, TValue>;
    private comparer: IEqualityComparator<TKey>;

    public constructor(
        inner: ISequence<T>,
        keySelector: SelectExpression<T, TKey>,
        comparer: IEqualityComparator<TKey>,
        groupModifier?: SelectExpression<ISequence<T>, TValue>,
    ) {
        super(inner);
        this.keySelector = keySelector;
        this.groupModifier = groupModifier;
        this.comparer = comparer;
    }

    protected materialize(): IGroupedData<TKey, TValue>[] {
        const lookup = this.innerCollection.toLookup(this.keySelector, this.comparer);

        const groupMapping = this.groupModifier || fakeSelector;

        return lookup.entries.map(item => ({
            key: item[0],
            group: groupMapping(new Sequence(item[1])),
        }));
    }
}
