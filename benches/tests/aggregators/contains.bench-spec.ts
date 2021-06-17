import { appendLog, bench_describe, bit, getSuite } from '../../common/suite';
import { Suite } from 'benchmark';
import _ from '../../../dist';

const count = 100;

const testArray = new Array(count).fill(0).map(() => (Math.random() * 100000) % 1000 | 0);

const seq = _(testArray);
const nativeArray = Array.from(testArray);

const target = testArray[99];

function bench(): Suite {
    return getSuite('Contains')
        .add('Array.indexOf', () => nativeArray.indexOf(target) !== -1)
        .add('Sequence.contains', () => seq.contains(target));
}

bench_describe('Contains Race', function () {
    bit(`Sequence vs Array`, () => {
        bench().run();

        appendLog(`###`);
    });
});
