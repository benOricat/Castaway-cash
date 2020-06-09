export type TKey = {
    value: string;
    isDown: boolean;
    isUp: boolean;
    press: ()=>void;
    release: ()=>void;
    downHandler: (event: KeyboardEvent) => void;
    upHandler: (event: KeyboardEvent) => void;
    unsubscribe: () => void;
}

export function keyboard(value:string): TKey {
    let key: TKey = {
        value: value,
        isDown: false,
        isUp: true,
        press: undefined,
        release: undefined,
        //The `downHandler`
        downHandler: (event: KeyboardEvent) => {
            if (event.key === value) {
                if (key.isUp && key.press) key.press();
                key.isDown = true;
                key.isUp = false;
                event.preventDefault();
            }
        },

        //The `upHandler`
        upHandler: (event: KeyboardEvent) => {
            if (event.key === value) {
                if (key.isDown && key.release) key.release();
                key.isDown = false;
                key.isUp = true;
                event.preventDefault();
            }
        },

        // Detach event listeners
        unsubscribe: undefined
    };
    //Attach event listeners
    const downListener = (event: KeyboardEvent)=>key.downHandler(event);
    const upListener = (event: KeyboardEvent)=>key.upHandler(event);

    window.addEventListener(
        "keydown", downListener, false
    );
    window.addEventListener(
        "keyup", upListener, false
    );

    // Detach event listeners
    key.unsubscribe = () => {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyup", upListener);
    };

    return key;
}