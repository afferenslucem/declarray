import { bench_describe, bit, getSuite } from '../../../common/suite';
import { Suite } from 'benchmark';
import _ from '../../../../dist';
import { getRandomArray } from '../../../common/utils';

const count = 100;

const testArray = getRandomArray(count);

const seq = _(testArray);
const nativeArray = Array.from(testArray);

function nativeBench(): Suite {
    return getSuite()
        .add('Array.map', () => nativeArray.map(item => item * item))
        .add('Sequence.select', () => seq.select(item => item * item).toArray());
}

function singleBench(): Suite {
    return getSuite()
        .add('Array.map', () => {
            const copy = Array.from(nativeArray);
            return copy.map(item => item * item);
        })
        .add('Sequence.select', () =>
            _(nativeArray)
                .select(item => item * item)
                .toArray(),
        );
}

function doubleBench(): Suite {
    return getSuite()
        .add('Array.map', () => {
            const copy = Array.from(nativeArray);
            return copy.map(item => item * item).map(item => item * item);
        })
        .add('Sequence.select', () =>
            _(nativeArray)
                .select(item => item * item)
                .select(item => item * item)
                .toArray(),
        );
}

bench_describe('Select vs Map Comparing', function () {
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
