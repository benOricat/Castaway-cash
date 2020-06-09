import {Container, Rectangle} from "pixi.js"
import {AlignH, AlignV, isTAlignment, Orientation, TAlignment} from "./types";
import {IFullscreenContent} from "./IFullscreenContent";

export class FullscreenApp {

    private _stage:Container;
    private _app: IFullscreenContent;
    private _boundsRect: Rectangle;


    public get stage():Container{
        return this._stage;
    }

    constructor(app:IFullscreenContent){
        this._app = app;
        this.addResizeListener();
    }

    private addResizeListener() {
        window.addEventListener('resize', ()=>this.onResize());
        this.onResize();
    }

    private onResize():void {
        // Resize the renderer
        this._app.renderer.resize(window.innerWidth, window.innerHeight);
        const orientation = window.innerWidth > window.innerHeight ? Orientation.landscape : Orientation.portrait;
        this._app.updateOrientation(orientation);
        // let appSizeX: number;
        // let appSizeY: number;
        let alignment:TAlignment;
        if(isTAlignment(this._app.appAlignment.alignment)){
            alignment = this._app.appAlignment.alignment;
        }else{
            if(orientation == Orientation.landscape){
                alignment = this._app.appAlignment.alignment.landscape;
            }else{
                alignment = this._app.appAlignment.alignment.portrait;
            }

        }
        const scale = Math.min(
            window.innerWidth / alignment.size.x,
            window.innerHeight / alignment.size.y
        );
        this._app.stage.scale.set(scale);
        switch(alignment.alignH) {
            case  AlignH.left:
                this._app.stage.x = 0;
                break;
            case AlignH.right:
                this._app.stage.x = window.innerWidth - alignment.size.x * scale;
                break;
            case AlignH.center:
                this._app.stage.x = 0.5 * (window.innerWidth - alignment.size.x * scale);
                break;
        }

        switch(alignment.alignV){
            case  AlignV.top:
                this._app.stage.y = 0;
                break;
            case AlignV.bottom:
                this._app.stage.y = window.innerHeight - alignment.size.y * scale;
                break;
            case AlignV.center:
                this._app.stage.y = 0.5*(window.innerHeight - alignment.size.y * scale);
                break;
        }

        this._boundsRect = new Rectangle(
            -this._app.stage.x/scale,
            -this._app.stage.y/scale,
            window.innerWidth/scale,
            window.innerHeight/scale);

        this._app.backgroundRect(this._boundsRect);
        this._app.absoluteAlignedItems.forEach(item=>{
           item.asset.x =  (1 - item.offset.x)*this._boundsRect.left + item.offset.x * this._boundsRect.right;
           item.asset.y =  (1 - item.offset.y)*this._boundsRect.top + item.offset.y * this._boundsRect.bottom;
        });
    }
}
