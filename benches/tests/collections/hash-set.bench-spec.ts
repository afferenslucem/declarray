import { appendLog, bench_describe, bit, getSuite } from '../../common/suite';
import { Suite } from 'benchmark';
import { HashSet } from '../../../dist';

const count = 100;

let customSet: HashSet<string> = null;
let nativeSet: Set<string> = null;

function bench(): Suite {
    return getSuite('Map', () => {
        customSet = new HashSet<string>();
        nativeSet = new Set<string>();

        for (let i = 0; i < count; i++) {
            customSet.add(i.toString());
            nativeSet.add(i.toString());
        }
    })
        .add('HashSet add', () => {
            const set = new HashSet<string>();

            for (let i = 0; i < count; i++) {
                set.add(i.toString());
            }
        })
        .add('Set add', () => {
            const set = new Set<string>();

            for (let i = 0; i < count; i++) {
                set.add(i.toString());
            }
        })
        .add('HashSet contains', () => {
            let temp = 0;

            for (let i = 0; i < count; i++) {
                temp += +customSet.contains(i.toString());
            }

            return temp;
        })
        .add('Set has', () => {
            let temp = 0;

            for (let i = 0; i < count; i++) {
                temp += +nativeSet.has(i.toString());
            }

            return temp;
        })
        .add('HashSet remove', () => {
            for (let i = 0; i < count; i++) {
                customSet.remove(i.toString());
            }

            return customSet;
        })
        .add('Set delete', () => {
            for (let i = 0; i < count; i++) {
                nativeSet.delete(i.toString());
            }

            return nativeSet;
        });
}

bench_describe('Set Race', function () {
    bit(`Set vs HashSet`, () => {
        bench().run();

        appendLog(`###`);
    });
});
