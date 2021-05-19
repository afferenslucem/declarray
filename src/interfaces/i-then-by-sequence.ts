import { SelectExpression } from '../delegates';
import { ISequence } from './i-sequence';

export interface IThenBySequence<T> extends ISequence<T> {
    thenBy<TOuter>(condition: SelectExpression<T, TOuter>): IThenBySequence<T>;

    thenByDescending<TOuter>(condition: SelectExpression<T, TOuter>): IThenBySequence<T>;
}
