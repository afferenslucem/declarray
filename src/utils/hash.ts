const depth = 256;
const mod = 20999999;

export function getHashCode(text: string | number): number {
    text = text.toString();

    let result = 0;

    for (let i = 0; i < text.length; i++) {
        result = (Math.imul(result, depth) + text.charCodeAt(0)) | 0;
    }

    return Math.abs(result) % mod;
}
