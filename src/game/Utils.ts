export class Utils {
    /**
     * Randomises the indexes of contents of an array
     *
     * @param {any[]} arr
     * @returns {any[]}
     */
    public static shuffleArray(arr:any[]):any[] {
        let l:number = arr.length-1;
        let t:any;
        let j:number;

        for (let i:number = l; i>0; i--) {
            j = Math.floor(Math.random()*(i+1));
            if (i != j) {
                t = arr[i];
                arr[i] = arr[j];
                arr[j] = t;
            }
        }
        return arr;
    }
}