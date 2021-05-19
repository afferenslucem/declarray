import { IEqualityComparator } from '../../src/interfaces/i-equality-comparator';
import { DefaultComparator } from '../../src/utils/default-comparator';
import { IPerson } from '../models/i-person';

export class PersonComparator implements IEqualityComparator<IPerson> {
    compare(first: IPerson, second: IPerson): number {
        return new DefaultComparator().compare(first.name, second.name);
    }

    getHashCode(entity: IPerson): number {
        return new DefaultComparator().getHashCode(entity.name);
    }

    equals(first: IPerson, second: IPerson): boolean {
        return first.name === second.name && first.age === second.age;
    }
}
