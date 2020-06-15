export function sleep(seconds: number) {
    return new Promise(r => setTimeout(r, seconds * 1000));
}