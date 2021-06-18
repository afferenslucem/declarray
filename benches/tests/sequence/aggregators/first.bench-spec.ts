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
        .add('Array.findIndex', () => nativeArray.findIndex(item => item >= testArray[99]))
        .add('Sequence.first', () => seq.first(item => item >= testArray[99]));
}

function singleBench(): Suite {
    return getSuite()
        .add('Array.findIndex', () => {
            const copy = Array.from(nativeArray);
            return copy.findIndex(item => item >= testArray[99]);
        })
        .add('Sequence.first', () => _(nativeArray).first(item => item >= testArray[99]));
}

bench_describe('First vs FindIndex Comparing', function () {
    bit(`Native query`, () => {
        nativeBench().run();
    });

    bit(`Single query`, () => {
        singleBench().run();
    });
});
