"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const Cell_1 = require("./Cell");
const utils_1 = require("../../utils");
const _Fabric_1 = require("./items/_Fabric");
class Maze extends PIXI.Container {
    constructor() {
        super();
        this.w = _1.main.gameWidth - 20;
        this.h = _1.main.gameHeight - 30 - 20;
        this.x = 10;
        this.y = 10;
        this.container = new PIXI.Container();
        this.container.mask = this.drawMask();
        this.addChild(this.container);
        this.drawBackground();
    }
    levelEnd() {
        this.container.removeChildren(1);
        this.arCells = [];
        this.arPlaceHolders = [];
    }
    set level(value) {
        this._level = value;
        this.arPlaceHolders = [];
        this.cell_size = (_1.main.gameWidth - 20) / (value + 2);
        this.drawMaze();
        this.arPlaceHolders = utils_1.shuffle(this.arPlaceHolders);
        this.placeUser();
        this.placeEnd();
        this.placeItems();
    }
    registerPlaceholder(cell) {
        this.arPlaceHolders.push(cell);
    }
    findCell(pos) {
        let x = Math.floor((pos.x - 10) / this.cell_size);
        let y = Math.floor((pos.y - 10) / this.cell_size);
        try {
            return this.arCells[y][x];
        }
        catch (e) {
            return null;
        }
    }
    drawMask() {
        let m = new PIXI.Graphics();
        m.beginFill(0xFF0000, .5).drawRoundedRect(0, 0, this.w, this.h, 10);
        this.addChild(m);
        return m;
    }
    drawBackground() {
        var b = new PIXI.Graphics();
        b.beginFill(0xFFFFFF, .1).drawRoundedRect(0, 0, this.w, this.h, 10);
        this.container.addChild(b);
    }
    drawMaze() {
        let cells;
        this.arCells = [];
        let cell;
        let prev;
        let prevs = [];
        for (let col = 0; col < this._level + 2; col++) {
            cells = [];
            for (let row = 0; row < this._level + 2; row++) {
                cell = new Cell_1.default(this.cell_size);
                cell.x = row * this.cell_size;
                cell.y = col * this.cell_size;
                this.container.addChild(cell);
                if (prev && row > 0) {
                    cell.left = prev;
                }
                prev = cell;
                if (col > 0) {
                    cell.top = prevs.shift();
                }
                prevs.push(cell);
                cells.push(cell);
            }
            this.arCells.push(cells);
        }
        this.arCells[0][0].start();
    }
    placeUser() {
        _1.main.game.user.start(this.arPlaceHolders[0]);
    }
    placeEnd() {
        let cell = this.furthestCell(this.arPlaceHolders[0]);
        _1.main.game.end.start(cell);
    }
    placeItems() {
        for (let i = 0; i < this.arPlaceHolders.length; i++) {
            if (this.arPlaceHolders[i].filled)
                continue;
            let item = _Fabric_1.Item.generate();
            this.container.addChild(item);
            item.x = this.arPlaceHolders[i].x + this.arPlaceHolders[i].size / 2;
            item.y = this.arPlaceHolders[i].y + this.arPlaceHolders[i].size / 2;
        }
    }
    furthestCell(cell) {
        let furthest;
        let dist = 0;
        for (let i = 0; i < this.arPlaceHolders.length; i++) {
            const d = Math.abs(cell.x - this.arPlaceHolders[i].x) + Math.abs(cell.y - this.arPlaceHolders[i].y);
            if (d > dist) {
                dist = d;
                furthest = this.arPlaceHolders[i];
            }
        }
        return furthest;
    }
}
exports.default = Maze;
//# sourceMappingURL=Maze.js.map