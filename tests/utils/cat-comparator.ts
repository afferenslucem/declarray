import { IEqualityComparator } from '../../src/interfaces/i-equality-comparator';
import { ICat } from '../models/i-cat';
import { DefaultComparator } from '../../src/utils/default-comparator';

export class CatComparator implements IEqualityComparator<ICat> {
    compare(first: ICat, second: ICat): number {
        return new DefaultComparator().compare(first.name, second.name);
    }

    getHashCode(entity: ICat): number {
        return new DefaultComparator().getHashCode(entity.name);
    }

    equals(first: ICat, second: ICat): boolean {
        return first.name === second.name && first.breed === second.breed && first.age === second.age;
    }
}
