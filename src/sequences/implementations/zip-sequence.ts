import { ISequence } from '../../interfaces/i-sequence';
import { ZipExpression } from '../../delegates';
import { Sequence } from '../sequence';

export class ZipSequence<TInner, TOuter, TResult> extends Sequence<TInner, TResult> {
    private outer: ISequence<TOuter>;
    private zipFunction: ZipExpression<TInner, TOuter, TResult>;

    public constructor(inner: ISequence<TInner>, outer: ISequence<TOuter>, zipFunction: ZipExpression<TInner, TOuter, TResult>) {
        super(inner);
        this.outer = outer;
        this.zipFunction = zipFunction;
    }

    protected materialize(): TResult[] {
        const inner = this.innerCollection.toArray();
        const outer = this.outer.toArray();

        if (inner.length < outer.length) {
            return inner.map((item, index) => this.zipFunction(item, outer[index]));
        } else {
            return outer.map((item, index) => this.zipFunction(inner[index], item));
        }
    }
}
