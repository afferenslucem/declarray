import { DefaultComparator } from './utils/default-comparator';
import { Suite } from 'benchmark';
import { getHashCode } from './utils/hash';

const comparator = new DefaultComparator();

const text = 'qwertyuiop';

const suite = new Suite('Hash')
    .add('Default', () => comparator.getHashCode(text))
    .add('getHashCode', () => getHashCode(text))
    .on('cycle', (event: any) => console.log(String(event.target)));

suite.run();
