export class Dictionary<K, V> {
    private _keys: Array<K>;
    private _values: Array<V>;

    constructor() {
        this._keys = [];
        this._values = [];
    }

    public set(key: K, value: V): void {
        const index:number = this._keys.indexOf(key);
        if (index > -1) {
            this._values[index] = value;
        } else {
            this._keys.push(key);
            this._values.push(value);
        }
    }

    /**
     * Note - from what I can tell, if the values are of type number, then returning zero can cause problems if
     * you are trying to evaluate if it exists. We ought to add some unit tests.
     *
     * @param key
     */
    public get(key: K): V {
        const index:number = this._keys.indexOf(key);
        if (index > -1) {
            return this._values[index];
        }

        return null;
    }

    public reverseLookUp(value: V): K {
        const index:number = this._values.indexOf(value);

        if (index > -1) {
            return this._keys[index];
        }

        return null;
    }

    public exists(key: K): boolean {
        const index:number = this._keys.indexOf(key);
        return index > -1;


    }

    public keys(): Array<K> {
        return this._keys.slice();
    }

    public values(): Array<V> {
        return this._values.slice();
    }

    public clone(): Dictionary<K, V> {
        const copy: Dictionary<K, V> = new Dictionary<K, V>();

        for (let i = 0; i < this._keys.length; i++) {
            copy.set(this._keys[i], this._values[i]);
        }

        return copy;
    }

    public remove(key: K): void {
        const index:number = this._keys.indexOf(key);
        if (index > -1) {
            this._keys.splice(index, 1);
            this._values.splice(index, 1);
        }
    }

    public clear(): void {
        this._keys = [];
        this._values = [];
    }

    /**
     * It copies the values of all enumerable own properties from one or more source JSON objects to a new Dictionary.
     *
     * @param {Object} source
     * @param {Object} sources
     * @returns {Dictionary<string, V>}
     */
    public static fromJSON<V>(source: Object, ...sources: Object[]): Dictionary<string, V> {
        const dict: Dictionary<string, V> = new Dictionary<string, V>();

        [source, ...sources]
            .filter(n => n)
            .forEach(el => {
                Object.keys(el).forEach(key => {
                    dict.set(key, el[key]);
                });
            });

        return dict;
    }

    /**
     * It copies the values of all enumerable own properties from one or more source JSON objects to a new Dictionary.
     *
     * NOTE:    YOU CANNOT USE THIS FUNCTION TO BUILD A STATIC VARIABLE/CONST.
     *          (Me and Milos could not figure out why - maybe because the actual instance is being created as
     *          a non-static here and then assigned to be a static?)
     *
     * @param {Array} keys
     * @param {Array} values
     * @returns {Dictionary<string, V>}
     */
    public static fromObject<K, V>(keys: K[], values: V[]): Dictionary<K, V> {
        const dict: Dictionary<K, V> = new Dictionary<K, V>();

        if (keys.length != values.length) {
            throw new Error('*** Creating objects from unmatched key/value objects ***');
        }

        for (let i:number=0; i < keys.length; i++) {
            dict.set(keys[i], values[i]);
        }

        return dict;
    }

}