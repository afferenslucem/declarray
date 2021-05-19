import { appendLog, bench_describe, bit, getSuite } from '../../common/suite';
import { Suite } from 'benchmark';
import { Dictionary } from '../../../dist';

const count = 100;

let customDictionary: Dictionary<string, number> = null;
let nativeMap: Map<string, number> = null;

function bench(): Suite {
    return getSuite('Map', () => {
        customDictionary = new Dictionary<string, number>();
        nativeMap = new Map<string, number>();

        for (let i = 0; i < count; i++) {
            customDictionary.set(i.toString(), i);
            nativeMap.set(i.toString(), i);
        }
    })
        .add('Dictionary set', () => {
            const dictionary = new Dictionary<string, number>();

            for (let i = 0; i < count; i++) {
                dictionary.set(i.toString(), i);
            }
        })
        .add('Map set', () => {
            const map = new Map<string, number>();

            for (let i = 0; i < count; i++) {
                map.set(i.toString(), i);
            }
        })
        .add('Dictionary get', () => {
            let temp = 0;

            for (let i = 0; i < count; i++) {
                temp = customDictionary.get(i.toString());
            }

            return temp;
        })
        .add('Map get', () => {
            let temp = 0;

            for (let i = 0; i < count; i++) {
                temp = nativeMap.get(i.toString());
            }

            return temp;
        })
        .add('Dictionary remove', () => {
            for (let i = 0; i < count; i++) {
                customDictionary.remove(i.toString());
            }

            return customDictionary;
        })
        .add('Map remove', () => {
            for (let i = 0; i < count; i++) {
                nativeMap.delete(i.toString());
            }

            return nativeMap;
        })
        .add('Dictionary containsKey', () => {
            for (let i = 0; i < count; i++) {
                customDictionary.containsKey(i.toString());
            }

            return customDictionary;
        })
        .add('Map has', () => {
            for (let i = 0; i < count; i++) {
                nativeMap.has(i.toString());
            }

            return nativeMap;
        });
}

bench_describe('Map Race', function () {
    bit(`Map vs Dictionary`, () => {
        bench().run();

        appendLog(`###`);
    });
});
