import Dispatcher from "../../Dispatcher";
import { distance } from "../../../utils";

export default class _Item extends PIXI.Container {

    public type: string = "abstract";
    public isBonus: boolean = false;

    constructor() {
        super();

        Dispatcher.on("userMove", this.onUserMove);
        this.on("removed", this.onRemoved);
    }

    private onUserMove = (x: number, y: number): void => {
        if (distance(this, { x: x - 10, y: y - 10 }, true) < 15) {
            this.grab();
        }
    }

    /**
     * Grab an item
     */
    protected grab(): void {
        this.parent.removeChild(this);
        Dispatcher.dispatch("grabItem", this);
    }

    /**
     * Removed from stage
     */
    private onRemoved = () => {
        Dispatcher.off("userMove", this.onUserMove);
    }
}