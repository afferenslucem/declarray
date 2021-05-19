import { IEqualityComparator } from '../../src/interfaces/i-equality-comparator';
import { DefaultComparator } from '../../src/utils/default-comparator';

export class AuthorComparator implements IEqualityComparator<string[]> {
    compare(first: string[], second: string[]): number {
        return new DefaultComparator().compare(first.join(''), second.join(''));
    }

    getHashCode(entity: string[]): number {
        return new DefaultComparator().getHashCode(entity.join(''));
    }

    equals(first: string[], second: string[]): boolean {
        return first.join('') === second.join('');
    }
}
