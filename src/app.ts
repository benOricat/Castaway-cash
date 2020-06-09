import * as PIXI from 'pixi.js';
import {FullscreenApp} from "./fullscreen/FullscreenApp";
import './styles.css'
import {GameApp} from "./game/GameApp";

PIXI;

new FullscreenApp(new GameApp());

