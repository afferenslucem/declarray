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
        .add('Array.findLastIndex', () => nativeArray.reverse().findIndex(item => item >= testArray[0]))
        .add('Sequence.last', () => seq.last(item => item >= testArray[0]));
}

function singleBench(): Suite {
    return getSuite()
        .add('Array.findLastIndex', () => {
            const copy = Array.from(nativeArray);
            return copy.reverse().findIndex(item => item >= testArray[99]);
        })
        .add('Sequence.last', () => _(nativeArray).last(item => item >= testArray[99]));
}

bench_describe('Last vs FindLastIndex Comparing', function () {
    bit(`Native query`, () => {
        nativeBench().run();
    });

    bit(`Single query`, () => {
        singleBench().run();
    });
});
