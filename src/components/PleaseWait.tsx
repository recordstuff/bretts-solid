import { Backdrop, CircularProgress } from "@suid/material"
import { Component } from "solid-js"
import { waitCount } from "../state/PleaseWait"

export const PleaseWait: Component = () => {

    return (
        <Backdrop
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={waitCount() > 0}
        >
            <CircularProgress />
        </Backdrop>
    )
}
