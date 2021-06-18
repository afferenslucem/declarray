import { appendLog, bench_describe, bit, getSuite } from '../../../common/suite';
import { Suite } from 'benchmark';
import _ from '../../../../dist';

const count = 100;

const testArray = new Array(count).fill(0).map(() => (Math.random() * 100000) % 1000 | 0);

const seq = _(testArray);
const nativeArray = Array.from(testArray);

const target = testArray[99];

function nativeBench(): Suite {
    return getSuite()
        .add('Array.indexOf', () => nativeArray.indexOf(target) !== -1)
        .add('Sequence.contains', () => seq.contains(target));
}

function singleBench(): Suite {
    return getSuite()
        .add('Array.indexOf', () => {
            const copy = Array.from(nativeArray);
            return copy.indexOf(target) !== -1;
        })
        .add('Sequence.contains', () => _(nativeArray).contains(target));
}

bench_describe('Contain vs IndexOf Comparing', function () {
    bit(`Native query`, () => {
        nativeBench().run();
    });

    bit(`Single query`, () => {
        singleBench().run();
    });
});
