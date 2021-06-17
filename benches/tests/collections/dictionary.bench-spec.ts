import { appendLog, bench_describe, bit, getSuite } from '../../common/suite';
import { Suite } from 'benchmark';
import { Dictionary } from '../../../dist';

const count = 100;

let customDictionary: Dictionary<string, number> = null;
let nativeMap: Map<string, number> = null;

function onStart(): void {
    customDictionary = new Dictionary<string, number>();
    nativeMap = new Map<string, number>();

    for (let i = 0; i < count; i++) {
        customDictionary.set(i.toString(), i);
        nativeMap.set(i.toString(), i);
    }
}

function setMeasure(): Suite {
    return getSuite('Dictionary set check', () => onStart())
        .add('Native Map set', () => {
            const map = new Map<string, number>();

            for (let i = 0; i < count; i++) {
                map.set(i.toString(), i);
            }
        })
        .add('Dictionary set', () => {
            const dictionary = new Dictionary<string, number>();

            for (let i = 0; i < count; i++) {
                dictionary.set(i.toString(), i);
            }
        });
}

function getMeasure(): Suite {
    return getSuite('Dictionary get check', () => onStart())
        .add('Native Map get', () => {
            let temp = 0;

            for (let i = 0; i < count; i++) {
                temp = nativeMap.get(i.toString());
            }

            return temp;
        })
        .add('Dictionary get', () => {
            let temp = 0;

            for (let i = 0; i < count; i++) {
                temp = customDictionary.get(i.toString());
            }

            return temp;
        });
}

function removeMeasure(): Suite {
    return getSuite('Dictionary remove check', () => onStart())
        .add('Native Map remove', () => {
            for (let i = 0; i < count; i++) {
                nativeMap.delete(i.toString());
            }

            return nativeMap;
        })
        .add('Dictionary remove', () => {
            for (let i = 0; i < count; i++) {
                customDictionary.remove(i.toString());
            }

            return customDictionary;
        });
}

function containsMeasure(): Suite {
    return getSuite('Dictionary contains check', () => onStart())
        .add('Native Map has', () => {
            for (let i = 0; i < count; i++) {
                nativeMap.has(i.toString());
            }

            return nativeMap;
        })
        .add('Dictionary containsKey', () => {
            for (let i = 0; i < count; i++) {
                customDictionary.containsKey(i.toString());
            }

            return customDictionary;
        });
}

bench_describe('Map Race', function () {
    bit(`Set check`, () => {
        setMeasure().run();
        appendLog(`###`);
    });
    bit(`Get check`, () => {
        getMeasure().run();
        appendLog(`###`);
    });
    bit(`Remove check`, () => {
        removeMeasure().run();
        appendLog(`###`);
    });
    bit(`Contains check`, () => {
        containsMeasure().run();
        appendLog(`###`);
    });
});
