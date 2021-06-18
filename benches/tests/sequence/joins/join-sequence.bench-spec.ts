import { appendLog, bench_describe, bit, getSuite } from '../../../common/suite';
import { Suite } from 'benchmark';
import _ from '../../../../dist';
import { ISequence } from '../../../../dist';

function rand(): number {
    return (Math.random() * 1000000) | 0;
}

function randomize(seq: ISequence<number>): ISequence<number> {
    const data = seq.toArray();

    for (let i = 0; i < data.length; i++) {
        const index = rand();

        const temp = data[i];
        data[i] = data[index];
        data[index] = temp;
    }

    return _(data);
}

const first = randomize(_.range(0, 100));
const second = randomize(_.range(50, 150));

first.toArray();
second.toArray();

function bench(): Suite {
    return getSuite('Sets')
        .add('Sequence.except', () => first.except(second).toArray())
        .add('Sequence.intersect', () => first.intersect(second).toArray())
        .add('Sequence.union', () => first.union(second).toArray());
}

bench_describe('Sets race', function () {
    bit(`Sequence`, () => {
        bench().run();
    });
});
