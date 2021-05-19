import { DefaultComparator } from './default-comparator';
import { CompareExpression, SelectExpression } from '../delegates';
import { IOrderOptions } from '../interfaces/i-order-options';
import { IEqualityComparator } from '../interfaces/i-equality-comparator';

const defaultComparator: IEqualityComparator<any> = new DefaultComparator();

export function defaultCompare<TInner, TOuter>(first: TInner, second: TInner, selector?: SelectExpression<TInner, TOuter>): number {
    if (selector) {
        const arg1: any = selector(first);
        const arg2: any = selector(second);

        return defaultComparator.compare(arg1, arg2);
    } else {
        return defaultComparator.compare(first as any, second as any);
    }
}

export function createDefaultCompareFunction<TItem, TProperty>(options?: IOrderOptions<TItem, TProperty>): CompareExpression<TItem> {
    return createCompareFunction<TItem, TProperty>(defaultComparator, options);
}

export function createCompareFunction<TItem, TProperty>(
    comparator: IEqualityComparator<TProperty>,
    options?: IOrderOptions<TItem, TProperty>,
): CompareExpression<TItem> {
    if (options?.propertySelector) {
        return function (first, second): number {
            const arg1: any = options.propertySelector(first);
            const arg2: any = options.propertySelector(second);

            const result = comparator.compare(arg1, arg2);

            return options?.isOrderDesc ? -result : result;
        };
    } else {
        return function (first, second): number {
            const result = comparator.compare(first as any, second as any);

            return options?.isOrderDesc ? -result : result;
        };
    }
}
