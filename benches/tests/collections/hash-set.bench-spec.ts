import { appendLog, bench_describe, bit, getSuite } from '../../common/suite';
import { Suite } from 'benchmark';
import { HashSet } from '../../../dist';

const count = 100;

let customSet: HashSet<string> = null;
let nativeSet: Set<string> = null;

function onStart() {
    customSet = new HashSet<string>();
    nativeSet = new Set<string>();

    for (let i = 0; i < count; i++) {
        customSet.add(i.toString());
        nativeSet.add(i.toString());
    }
}

function addMeasure(): Suite {
    return getSuite('HashSet add check', () => onStart())
        .add('NativeSet add', () => {
            const set = new Set<string>();

            for (let i = 0; i < count; i++) {
                set.add(i.toString());
            }
        })
        .add('HashSet add', () => {
            const set = new HashSet<string>();

            for (let i = 0; i < count; i++) {
                set.add(i.toString());
            }
        });
}

function hasMeasure(): Suite {
    return getSuite('HashSet contains check', () => onStart())
        .add('Native Set has', () => {
            let temp = 0;

            for (let i = 0; i < count; i++) {
                temp += +nativeSet.has(i.toString());
            }

            return temp;
        })
        .add('HashSet contains', () => {
            let temp = 0;

            for (let i = 0; i < count; i++) {
                temp += +customSet.contains(i.toString());
            }

            return temp;
        });
}

function removeMeasure(): Suite {
    return getSuite('HashSet remove check', () => onStart())
        .add('Native Set delete', () => {
            for (let i = 0; i < count; i++) {
                nativeSet.delete(i.toString());
            }

            return nativeSet;
        })
        .add('HashSet remove', () => {
            for (let i = 0; i < count; i++) {
                customSet.remove(i.toString());
            }

            return customSet;
        });
}

bench_describe('Set Race', function () {
    bit(`add check`, () => {
        addMeasure().run();

        appendLog(`###`);
    });
    bit(`has check`, () => {
        hasMeasure().run();

        appendLog(`###`);
    });
    bit(`remove check`, () => {
        removeMeasure().run();

        appendLog(`###`);
    });
});
