import { appendLog, bench_describe, bit, getSuite } from '../../../common/suite';
import { Suite } from 'benchmark';
import _ from '../../../../dist';
import { flatten } from '../../../../dist/utils/reducers';

const count = 100;

function random() {
    return (Math.random() * 100000) % 1000 | 0;
}

const testArray = new Array(count).fill(0).map(() => [random(), random(), random(), random()]);

const seq = _(testArray);
const nativeArray = Array.from(testArray);

function nativeBench(): Suite {
    return getSuite()
        .add('Array.map/reduce', () => nativeArray.map(item => item).reduce(flatten, []))
        .add('Sequence.selectMany', () => seq.selectMany(item => item).toArray());
}

function singleBench(): Suite {
    return getSuite()
        .add('Array.map', () => {
            const copy = Array.from(nativeArray);
            return copy.map(item => item).reduce(flatten, []);
        })
        .add('Sequence.select', () =>
            _(nativeArray)
                .selectMany(item => item)
                .toArray(),
        );
}

bench_describe('SelectMany vs Map/Reduce', function () {
    bit(`Native query`, () => {
        nativeBench().run();
    });

    bit(`Single query`, () => {
        singleBench().run();
    });
});
