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
        .add('Array.slice', () => nativeArray.slice(50))
        .add('Sequence.skip', () => seq.skip(50).toArray());
}

function singleBench(): Suite {
    return getSuite()
        .add('Array.slice', () => {
            const copy = Array.from(nativeArray);
            return copy.slice(0, 50);
        })
        .add('Sequence.skip', () => _(nativeArray).skip(50).toArray());
}

function doubleBench(): Suite {
    return getSuite()
        .add('Array.slice', () => {
            const copy = Array.from(nativeArray);
            return copy.slice(50).slice(25);
        })
        .add('Sequence.skip', () => _(nativeArray).skip(50).skip(25).toArray());
}

bench_describe('Slip vs Slice Comparing', function () {
    bit(`Native query`, () => {
        nativeBench().run();
    });

    bit(`Single query`, () => {
        singleBench().run();
    });

    bit(`Double running`, () => {
        doubleBench().run();
    });
});
