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
        .add('Array.sort', () => {
            const copyForSort = Array.from(nativeArray);
            return copyForSort.sort((a, b) => a - b);
        })
        .add('Sequence.orderBy', () => seq.orderBy(item => item).toArray());
}

function singleBench(): Suite {
    return getSuite()
        .add('Array.sort', () => {
            const copyForFunc = Array.from(nativeArray);
            const copyForSort = Array.from(copyForFunc);
            return Array.from(copyForSort).sort((a, b) => a - b);
        })
        .add('Sequence.orderBy', () =>
            _(nativeArray)
                .orderBy(item => item)
                .toArray(),
        );
}

bench_describe('OrderBy vs Sort Comparing', function () {
    bit(`Native query`, () => {
        nativeBench().run();
    });

    bit(`Single query`, () => {
        singleBench().run();
    });
});
