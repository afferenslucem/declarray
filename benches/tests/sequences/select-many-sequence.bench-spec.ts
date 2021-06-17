import { appendLog, bench_describe, bit, getSuite } from '../../common/suite';
import { Suite } from 'benchmark';
import _ from '../../../dist';
import { flatten } from '../../../dist/utils/reducers';

const count = 100;

function random() {
    return (Math.random() * 100000) % 1000 | 0;
}

const testArray = new Array(count).fill(0).map(() => [random(), random(), random(), random()]);

const seq = _(testArray);
const nativeArray = Array.from(testArray);

function bench(): Suite {
    return getSuite('Select Many')
        .add('Array.map-reduce', () => nativeArray.map(item => item.map(num => num * 2)).reduce(flatten, []))
        .add('Sequence.selectMany', () => seq.selectMany(item => item.map(item => item * 2)).toArray());
}

bench_describe('SelectMany Race', function () {
    bit(`Sequence vs Array`, () => {
        bench().run();

        appendLog(`###`);
    });
});
