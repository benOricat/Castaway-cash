import Point = PIXI.Point;
import DisplayObject = PIXI.DisplayObject;

export enum AlignH {
    left,
    right,
    center,
}

export enum AlignV {
    top,
    bottom,
    center
}

export enum Orientation {
    portrait,
    landscape
}

export type TAlignment = {
    size:Point,
    alignH:AlignH,
    alignV:AlignV
}

export function isTAlignment(object: any): object is TAlignment {
    return 'size' in object;
}

export type TAppAlignment = {
    alignment:TAlignment | {portrait:TAlignment, landscape:TAlignment};
}

export type TAbsoluteAlignedItem = {asset:DisplayObject, offset:Point};