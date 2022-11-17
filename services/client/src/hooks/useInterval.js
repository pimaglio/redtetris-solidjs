import { createEffect, onCleanup } from "solid-js";

export function useInterval(callback, delay) {
    createEffect(() => {
        let id = null
        if (delay()) id = setInterval(callback, delay())
        onCleanup(() => clearInterval(id))
    })
}
