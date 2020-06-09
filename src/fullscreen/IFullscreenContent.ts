import Rectangle = PIXI.Rectangle;
import {Orientation, TAbsoluteAlignedItem, TAppAlignment} from "./types";
import Application = PIXI.Application;

export interface IFullscreenContent extends Application {
    updateOrientation(value:Orientation);
    backgroundRect(rect:Rectangle);
    appAlignment:TAppAlignment,
    absoluteAlignedItems:TAbsoluteAlignedItem[]
}