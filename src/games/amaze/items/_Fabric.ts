import Bonus from "./Bonus";
import Time from "./Time";
import Hammer from "./Hammer";
import Magnet from "./Magnet";

export namespace Item {
    export function generate() {
        //return new Bonus(Math.round(Math.random() * 3));
        //return new Time();
        let rand = Math.random() * 100;
        if (rand < 70) {
            return new Bonus(0);
        } else if (rand < 90) {
            return new Bonus(1);
        } else if (rand < 95) {
            return new Bonus(2);
        } else {
            rand = Math.random() * 100;

            if (rand < 33) {
                return new Time();
            } else if (rand < 66) {
                return new Hammer();
            } else {
                return new Magnet();
            }

        }
    }
}