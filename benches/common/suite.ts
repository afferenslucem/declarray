import { Event, Suite } from 'benchmark';
import { describe, Func, Test } from 'mocha';
import fs from 'fs';

const outFileName = 'benchmark-output.txt';

function cleanFile() {
    try {
        fs.truncateSync(outFileName, 0);
    } catch (e) {
        console.log('file not found');
    }
}

cleanFile();

export function appendLog(value: string): void {
    fs.appendFileSync(outFileName, `${value}\r\n`);
}

export const BENCH_TIMEOUT = '200s';

export function getSuite(name: string, onStart?: () => void, onComplite?: () => void): Suite {
    const suite = new Suite(name, {
        onCycle: (event: Event) => {
            const log = String(event.target);
            appendLog(log);
            console.log(log);
        },
        onStart: () => {
            if (onStart != null) {
                onStart();
            }
        },
        onComplete: () => {
            if (onComplite != null) {
                onComplite();
            }
        },
        onError: function (...args: any) {
            console.warn(...args);
        },
    });

    return suite;
}

export function bit(title: string, func: Func): Test {
    const test = it(title, func);
    test.timeout(BENCH_TIMEOUT);

    return test;
}

export function bench_describe(title: string, func: (this: Mocha.Suite) => void): Mocha.Suite {
    const desc = describe(title, func);

    desc.beforeAll(() => {
        appendLog(`Bench Name: ${title}`);
    });

    desc.afterAll(() => {
        appendLog('***');
    });

    return desc;
}
