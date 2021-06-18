import { bench_describe, bit, getSuite } from '../../../common/suite';
import { Suite } from 'benchmark';
import _ from '../../../../dist';
import { getRandomArray } from '../../../common/utils';

const count = 100;

const testArray = getRandomArray(count);

const nativeArray = Array.from(testArray);
const seq = _(testArray);

function nativeBench(): Suite {
    return getSuite()
        .add('Array.filter', () => nativeArray.filter(item => item % 2))
        .add('Sequence.where', () => seq.where(item => item % 2).toArray());
}

function singleBench(): Suite {
    return getSuite()
        .add('Array.filter', () => {
            const copy = Array.from(nativeArray);
            return copy.filter(item => item % 2);
        })
        .add('Sequence.where', () =>
            _(nativeArray)
                .where(item => item % 2)
                .toArray(),
        );
}

function doubleBench(): Suite {
    return getSuite()
        .add('Array.filter', () => {
            const copy = Array.from(nativeArray);
            return copy.filter(item => item % 2).filter(item => item % 3);
        })
        .add('Sequence.where', () =>
            _(nativeArray)
                .where(item => item % 2)
                .where(item => item % 3)
                .toArray(),
        );
}

bench_describe('Where vs Filter Race', function () {
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
