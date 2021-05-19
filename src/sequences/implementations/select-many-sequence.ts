import { ISequence } from '../../interfaces/i-sequence';
import { SelectExpression } from '../../delegates';
import { flatten } from '../../utils/reducers';
import { Sequence } from '../sequence';

export class SelectManySequence<TInner, TOuter = TInner> extends Sequence<TInner, TOuter> {
    protected typedSequence: ISequence<TInner>;
    private innerCondition: SelectExpression<TInner, TOuter[]> = null;

    public constructor(inner: ISequence<TInner>, condition: SelectExpression<TInner, TOuter[]>) {
        super(inner);

        this.typedSequence = inner;

        this.innerCondition = condition;
    }

    public selectMany<TTarget>(selectManyCondition: SelectExpression<TOuter, TTarget[]>): ISequence<TTarget> {
        return new SelectManySequence<TInner, TTarget>(this.innerCollection, (item: TInner) => {
            const temp = this.innerCondition(item);

            return this.flatArray(temp, selectManyCondition);
        });
    }

    protected materialize(): TOuter[] {
        const array = this.typedSequence.toArray();

        return this.flatArray(array, this.innerCondition);
    }

    private flatArray<TSource, TTarget>(array: TSource[], selectManyCondition: SelectExpression<TSource, TTarget[]>): TTarget[] {
        return array.map(item => selectManyCondition(item)).reduce(flatten, []);
    }
}
