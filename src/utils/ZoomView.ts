import {Container, IPoint, Point, DisplayObject, Rectangle, Graphics} from 'pixi.js';
import {clamp} from "./MathUtils";

export class ZoomView {

    private _mapSize: Point;
    private target: DisplayObject;
    private _map: Container;
    private _maskRect: Rectangle;
    private _zoom: number;
    private _mapTarget: Point;
    private _maskCenter: Point;
    private _maskGraphic: Graphics;
    private _lerp: number = 0.95;

    public get zoom(): number {
        return this._zoom;
    }

    public set zoom(value: number) {
        this._zoom = value;
        this._map.scale.set(this._zoom);
    }

    public set maskRect(value: PIXI.Rectangle) {
        this._maskRect = value;
        this._maskCenter = new Point(
            this._maskRect.left + 0.5 * this._maskRect.width,
            this._maskRect.top + 0.5 * this._maskRect.height);
        if (!this._maskGraphic) {
            this._maskGraphic = new Graphics();
            this._map.parent.addChild(this._maskGraphic);
        }
        this._maskGraphic.clear();
        this._maskGraphic.beginFill(0xFF3300);
        this._maskGraphic.drawRect(this._maskRect.x, this._maskRect.y, this._maskRect.width, this._maskRect.height);
        this._maskGraphic.endFill();
        this._map.mask = this._maskGraphic;
    }

    constructor(map: Container, mapSize: Point, target: DisplayObject, maskRect: Rectangle) {
        this._map = map;
        this._mapSize = mapSize;
        this.target = target;
        this._zoom = 1;
        if (maskRect) {
            this.maskRect = maskRect;
        }
        this.initialise();
    }

    public update(delta: number) {
        const playerPosition = this._map.toLocal(this.target.parent.toGlobal(this.target.position));
        this._mapTarget = new Point(
            clamp(playerPosition.x, this._maskRect.width * 0.5 / this._zoom, this._mapSize.x - this._maskRect.width * 0.5 / this._zoom),
            clamp(playerPosition.y, this._maskRect.height * 0.5 / this._zoom, this._mapSize.y - this._maskRect.height * 0.5 / this._zoom)
        );
        this._mapTarget.x -= this._maskCenter.x / this._zoom;
        this._mapTarget.y -= this._maskCenter.y / this._zoom;
        this.lerp(this._map.pivot, this._mapTarget, delta);
        // this._map.pivot.set(...this.lerp(this._map.pivot, this._mapTarget, delta));
        // console.log(this.lerp(this._map.pivot, this._mapTarget, delta));
    /*
                    this._map.pivot.set(
                        this._mapTarget.x,
                        this._mapTarget.y
                    );
    */
    }

    private initialise() {
        this.update(0);
    }

    private lerp(from: IPoint, to: IPoint, delta: number) {
        const lerpValue = Math.pow(this._lerp, 1/delta);
        from.x = from.x * (1 - lerpValue) + to.x * lerpValue;
        from.y = from.y * (1 - lerpValue) + to.y * lerpValue;
    }
}