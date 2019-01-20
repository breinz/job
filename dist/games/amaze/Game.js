"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bar_1 = require("./Bar");
const Maze_1 = require("./Maze");
const _1 = require(".");
const User_1 = require("./User");
const End_1 = require("./End");
const gsap_1 = require("gsap");
const utils_1 = require("../../utils");
class Game extends PIXI.Container {
    constructor(app) {
        super();
        this.levelEnd = () => {
            this.user.levelEnd();
            this.topbar.levelEnd();
            this.close();
        };
        this.init();
        this.level = -1;
    }
    startLevel() {
        this.level = Math.min(++this.level, 9);
        this.maze.level = this.level;
        this.topbar.newLevel();
        this.open();
    }
    nextLevel() {
        this.level++;
        this.maze.levelEnd();
        this.maze.level = this.level;
        this.topbar.newLevel();
        this.open();
    }
    init() {
        let img = PIXI.Sprite.fromImage("/img/paper.jpg");
        if (img.texture.baseTexture.hasLoaded) {
            console.log("hasLoaded");
        }
        else {
            img.texture.baseTexture.once("loaded", () => {
                img.width = img.width * 430 / img.height;
                img.height = 430;
                img.x = 200 - img.width / 2;
            });
        }
        this.addChild(img);
        this.topbar = new Bar_1.default();
        this.addChild(this.topbar);
        this.container = new PIXI.Container();
        this.container.y = 30;
        this.maskContainer = new PIXI.Container();
        this.addChild(this.maskContainer);
        this.maskContainer.addChild(this.container);
        this.masq = new PIXI.Graphics();
        this.masq.beginFill(0).drawCircle(0, 0, 260);
        this.container.addChild(this.masq);
        this.maskContainer.mask = this.masq;
        this.maze = new Maze_1.default();
        this.container.addChild(this.maze);
        var b = new PIXI.Graphics();
        b.lineStyle(4, 0, 1, 1).drawRoundedRect(10, 40, _1.main.gameWidth - 20, _1.main.gameHeight - 30 - 20, 10);
        this.addChild(b);
        this.user = new User_1.default();
        this.container.addChild(this.user);
        this.end = new End_1.default();
        this.container.addChild(this.end);
    }
    maskSize(obj) {
        return Math.max(utils_1.distance(obj, { x: 0, y: 10 }), utils_1.distance(obj, { x: _1.main.gameWidth - 0, y: 10 }), utils_1.distance(obj, { x: 10, y: _1.main.gameHeight - 40 }), utils_1.distance(obj, { x: _1.main.gameWidth - 10, y: _1.main.gameHeight - 40 })) * 2;
    }
    open() {
        let size = this.maskSize(this.user);
        this.masq.x = this.user.x;
        this.masq.y = this.user.y;
        this.masq.width = this.masq.height = 0;
        gsap_1.TweenLite.to(this.masq, 2, { width: size, height: size, ease: gsap_1.Quint.easeInOut });
    }
    close() {
        let size = this.maskSize(this.end);
        this.masq.width = size;
        this.masq.height = size;
        this.masq.x = this.end.x;
        this.masq.y = this.end.y;
        gsap_1.TweenLite.to(this.masq, 2, {
            width: 0,
            height: 0,
            ease: gsap_1.Quint.easeInOut,
            onComplete: () => {
                this.nextLevel();
            }
        });
    }
}
exports.default = Game;
//# sourceMappingURL=Game.js.map