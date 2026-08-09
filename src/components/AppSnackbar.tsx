import { Alert, Box, Fade } from "@suid/material"
import { Component, Show, createEffect, onCleanup } from "solid-js"
import { Portal } from "solid-js/web"
import { AppSnackbarSeverity } from "../models/AppSnackbarState"

interface AppSnackbarProps {
    message: string | null
    severity: AppSnackbarSeverity
    onClose: () => void
}

const AppSnackbar: Component<AppSnackbarProps> = (props) => {
    createEffect(() => {
        if (props.message === null) return

        const timeout = window.setTimeout(props.onClose, 4000)
        onCleanup(() => window.clearTimeout(timeout))
    })

    return (
        <Portal>
            <Show when={props.message !== null}>
                <Fade in>
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
                        <Alert
                            severity={props.severity}
                            variant="filled"
                            onClose={props.onClose}
                            role="alert"
                            sx={{ width: "100%" }}
                        >
                            {props.message}
                        </Alert>
                    </Box>
                </Fade>
            </Show>
        </Portal>
    )
}

export default AppSnackbar
