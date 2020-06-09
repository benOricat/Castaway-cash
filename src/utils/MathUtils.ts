export function clamp(base:number, min:number, max:number):number {
    return Math.min(Math.max(base,min), max)
}