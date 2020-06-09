import {Container, Loader, Sprite} from 'pixi.js';

export class BackgroundGroup extends Container{

    constructor() {
        super();
        this.build();
    }

    private build() {
        const background = new Sprite(Loader.shared.resources.background.texture);
        const backgroundElements = Loader.shared.resources.backgroundElements;

        const bushesL = new Sprite(backgroundElements.textures['bushesL.png']);
        const bushesR = new Sprite(backgroundElements.textures['bushesR.png']);
        const islandForeground = new Sprite(backgroundElements.textures['islandForeground.png']);
        const islandMiddle = new Sprite(backgroundElements.textures['islandMiddle.png']);
        const palmL = new Sprite(backgroundElements.textures['palmL.png']);
        const palmR = new Sprite(backgroundElements.textures['palmR.png']);

        background.name = 'background';
        bushesL.name = 'bushesL';
        bushesR.name = 'bushesR';
        islandForeground.name = 'islandForeground';
        islandMiddle.name = 'islandMiddle';
        palmL.name = 'palmL';
        palmR.name = 'palmR';


        bushesL.x =  100;
        bushesL.y = 1117;
        bushesR.x = 1651;
        bushesR.y = 1117;
        islandForeground.x = 0;
        islandForeground.y = 1226;
        islandMiddle.x = 400;
        islandMiddle.y = 712;
        palmL.x = 0;
        palmL.y = 268;
        palmR.x = 1266;
        palmR.y = 268;


        this.addChild(background);
        this.addChild(islandForeground);
        this.addChild(bushesL);
        this.addChild(bushesR);
        this.addChild(islandMiddle);
        this.addChild(palmL);
        this.addChild(palmR);
    }
}