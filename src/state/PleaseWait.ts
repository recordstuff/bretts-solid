import { createSignal } from "solid-js";

const [waitCount, setWaitCount] = createSignal(0)

export {waitCount}

export const pleaseWait = (): void => {
    setWaitCount(waitCount() + 1)
}

export const doneWaiting = (): void => {
    if (waitCount() > 0) {
        setWaitCount(waitCount() - 1)
    }
}

export const clearAllWaits = (): void => {
    setWaitCount(0)
}
