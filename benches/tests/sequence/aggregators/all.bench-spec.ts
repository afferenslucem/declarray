import { appendLog, bench_describe, bit, getSuite } from '../../../common/suite';
import { Suite } from 'benchmark';
import _ from '../../../../dist';

const count = 100;

const testArray = new Array(count).fill(0).map((item, index) => index * 2);

const seq = _(testArray);
const nativeArray = Array.from(testArray);

function nativeBench(): Suite {
    return getSuite()
        .add('Array.every', () => nativeArray.every(item => item % 2 === 0))
        .add('Sequence.all', () => seq.all(item => item % 2 === 0));
}

function singleBench(): Suite {
    return getSuite()
        .add('Array.every', () => {
            const copy = Array.from(nativeArray);
            return copy.every(item => item % 2 === 0);
        })
        .add('Sequence.all', () => _(nativeArray).all(item => item % 2 === 0));
}

bench_describe('All vs Every Comparing', function () {
    bit(`Native query`, () => {
        nativeBench().run();
    });

    bit(`Single query`, () => {
        singleBench().run();
    });
});
