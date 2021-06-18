import { appendLog, bench_describe, bit, getSuite } from '../../../common/suite';
import { Suite } from 'benchmark';
import _ from '../../../../dist';

const count = 100;

const testArray = new Array(count).fill(0).map((item, index) => index * 2);
testArray.push(1);

const seq = _(testArray);
const nativeArray = Array.from(testArray);

function nativeBench(): Suite {
    return getSuite()
        .add('Array.some', () => nativeArray.some(item => item % 2))
        .add('Sequence.any', () => seq.any(item => item % 2));
}

function singleBench(): Suite {
    return getSuite()
        .add('Array.some', () => {
            const copy = Array.from(nativeArray);
            return copy.some(item => item % 2);
        })
        .add('Sequence.any', () => _(nativeArray).any(item => item % 2));
}

bench_describe('Any vs Some Comparing', function () {
    bit(`Native query`, () => {
        nativeBench().run();
    });

    bit(`Single query`, () => {
        singleBench().run();
    });
});
