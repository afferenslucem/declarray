export function getRandomArray(count: number): Array<number> {
    return new Array(count).fill(0).map(() => (Math.random() * 100000) % 1000 | 0);
}
