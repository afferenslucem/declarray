import { ISequence } from '../../interfaces/i-sequence';
import { SelectExpression } from '../../delegates';
import { Sequence } from '../sequence';

export class SelectSequence<TInner, TOuter = TInner> extends Sequence<TInner, TOuter> {
    protected typedSequence: ISequence<TInner>;
    private innerCondition: SelectExpression<TInner, TOuter> = null;

    public constructor(inner: ISequence<TInner>, condition: SelectExpression<TInner, TOuter>) {
        super(inner);

        this.typedSequence = inner;

        this.innerCondition = condition;
    }

    public select<TTarget>(selectCondition: SelectExpression<TOuter, TTarget>): ISequence<TTarget> {
        return new SelectSequence<TInner, TTarget>(this.innerCollection, (item: TInner) => {
            const temp = this.innerCondition(item);

            return selectCondition(temp);
        });
    }

    protected materialize(): TOuter[] {
        const array = this.typedSequence.toArray();

        return array.map(item => this.innerCondition(item));
    }
}
