import { Event, Suite } from 'benchmark';
import { describe, Func, Test } from 'mocha';
import fs from 'fs';
import Benchmark = require('benchmark');

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

export function getSuite(name: string = null, onStart?: () => void, onComplite?: () => void): Suite {
    const statistic: Benchmark[] = [];

    const suite = new Suite(null, {
        onCycle: (event: Event) => {
            statistic.push(event.target as any);
        },
        onStart: () => {
            if (onStart != null) {
                onStart();
            }
        },
        onComplete: () => {
            const report = createReport();
            appendLog(report);
            console.log(report);
            if (onComplite != null) {
                onComplite();
            }
        },
        onError: function (...args: any) {
            console.warn(...args);
        },
    });

    function createReport(): string {
        const basis = statistic[0];

        const comparings = statistic.map(item => createComparing(basis, item));

        return comparings.join('\n');
    }

    function createComparing(basis: Benchmark, target: Benchmark): string {
        return `${(target as any).name} x ${(target.hz / basis.hz).toFixed(2)} x dev ±${target.stats.rme.toFixed(2)}% x ${Math.floor(
            target.hz,
        )} op/sec (${target.stats.sample.length} runs sampled)`;
    }

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
