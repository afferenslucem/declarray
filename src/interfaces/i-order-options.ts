import { SelectExpression } from '../delegates';

export interface IOrderOptions<TItem, TProperty> {
    propertySelector?: SelectExpression<TItem, TProperty>;
    isOrderDesc?: boolean;
}
