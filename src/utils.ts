/** 
 * Const to convert degrees in radians
 */
export const D2R = Math.PI / 180;

/**
 * Const to convert radians in degrees
 */
export const R2D = 180 / Math.PI;

/**
 * Shuffles an array
 * @param ar The array to shuffle
 * @return Array<Object>
 */
export function shuffle(ar: Object[]) {
    for (let i = ar.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ar[i], ar[j]] = [ar[j], ar[i]];
    }
    return ar;
}

/**
 * Determine the distance between two objects
 * @param obj1 First object
 * @param obj2 Second object
 * @param rapid No use of square root
 */
export function distance(obj1: { x: number, y: number }, obj2: { x: number, y: number }, rapid: boolean = false): number {
    if (rapid) {

        return Math.abs(obj1.x - obj2.x) + Math.abs(obj1.y - obj2.y);
    }

    return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
}