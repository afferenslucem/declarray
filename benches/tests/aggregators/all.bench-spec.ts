import { appendLog, bench_describe, bit, getSuite } from '../../common/suite';
import { Suite } from 'benchmark';
import _ from '../../../dist';

const count = 100;

const testArray = new Array(count).fill(0).map((item, index) => index * 2);

const seq = _(testArray);
const nativeArray = Array.from(testArray);

function bench(): Suite {
    return getSuite('All')
        .add('Array.every', () => nativeArray.every(item => item % 2 === 0))
        .add('Sequence.all', () => seq.all(item => item % 2 === 0));
}

bench_describe('All Race', function () {
    bit(`Sequence vs Array`, () => {
        bench().run();

        appendLog(`###`);
    });
});
