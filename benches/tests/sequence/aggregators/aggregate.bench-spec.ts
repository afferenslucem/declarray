import { appendLog, bench_describe, bit, getSuite } from '../../../common/suite';
import { Suite } from 'benchmark';
import _ from '../../../../dist';
import { getRandomArray } from '../../../common/utils';

const count = 100;

const testArray = getRandomArray(count);

const seq = _(testArray);
const nativeArray = Array.from(testArray);

function nativeBench(): Suite {
    return getSuite()
        .add('Array.reduce', () => nativeArray.reduce((a, b) => a + b))
        .add('Sequence.aggregate', () => seq.aggregate((a, b) => a + b));
}

function singleBench(): Suite {
    return getSuite()
        .add('Array.reduce', () => {
            const copy = Array.from(nativeArray);
            return copy.reduce((a, b) => a + b);
        })
        .add('Sequence.aggregate', () => _(nativeArray).aggregate((a, b) => a + b));
}

bench_describe('Aggregate vs Reduce Comparing', function () {
    bit(`Native query`, () => {
        nativeBench().run();
    });

    bit(`Single query`, () => {
        singleBench().run();
    });
});
