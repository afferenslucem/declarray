import { appendLog, bench_describe, bit, getSuite } from '../../common/suite';
import { Suite } from 'benchmark';
import _ from '../../../dist';

const count = 100;

const testArray = new Array(count).fill(0).map(() => (Math.random() * 100000) % 1000 | 0);

const seq = _(testArray);
const nativeArray = Array.from(testArray);

function bench(): Suite {
    return getSuite('Sort')
        .add('Array.sort', () => nativeArray.sort((a, b) => a - b))
        .add('Sequence.orderBy', () => seq.orderBy(item => item).toArray());
}

bench_describe('Sort Race', function () {
    bit(`Sequence vs Array`, () => {
        bench().run();

        appendLog(`###`);
    });
});
