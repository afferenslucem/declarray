import { appendLog, bench_describe, bit, getSuite } from '../../common/suite';
import { Suite } from 'benchmark';
import _ from '../../../dist';

const count = 100;

const testArray = new Array(count).fill(0).map((item, index) => index * 2);
testArray.push(1);

const seq = _(testArray);
const nativeArray = Array.from(testArray);

function bench(): Suite {
    return getSuite('Any')
        .add('Array.some', () => nativeArray.some(item => item % 2))
        .add('Sequence.any', () => seq.any(item => item % 2));
}

bench_describe('Any Race', function () {
    bit(`Sequence vs Array`, () => {
        bench().run();

        appendLog(`###`);
    });
});
