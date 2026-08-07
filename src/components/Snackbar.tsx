import { Alert, Box } from "@suid/material"
import { Component, Show, createEffect, onCleanup } from "solid-js"
import { Portal } from "solid-js/web"

interface Props {
    open: boolean
    message: string
    autoHideDuration?: number
    onClose?: () => void
}

const Snackbar: Component<Props> = (props) => {
    createEffect(() => {
        if (!props.open || props.autoHideDuration === undefined) return

        const timeout = window.setTimeout(() => props.onClose?.(), props.autoHideDuration)
        onCleanup(() => window.clearTimeout(timeout))
    })

    return (
        <Portal>
            <Show when={props.open}>
                <Box
                    sx={{
                        position: "fixed",
                        top: 24,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "min(90vw, 480px)",
                        zIndex: 1400,
                    }}
                >
                    <Alert severity="error" role="alert">{props.message}</Alert>
                </Box>
            </Show>
        </Portal>
    )
}

export default Snackbar
