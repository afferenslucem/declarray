import { WhereCondition } from '../../delegates';
import { ISequence } from '../../interfaces/i-sequence';
import { Sequence } from '../sequence';

export class WhereSequence<T> extends Sequence<T> {
    private innerCondition: WhereCondition<T> = null;

    public constructor(inner: ISequence<T>, condition: WhereCondition<T>) {
        super(inner);

        this.innerCondition = condition;
    }

    public where(whereCondition: WhereCondition<T>): ISequence<T> {
        return new WhereSequence<T>(
            this.innerCollection,
            (item: T, index?: number) => this.innerCondition(item, index) && whereCondition(item, index),
        );
    }

    protected materialize(): T[] {
        const array = this.innerCollection.toArray();

        return array.filter((item, index) => this.innerCondition(item, index));
    }
}
