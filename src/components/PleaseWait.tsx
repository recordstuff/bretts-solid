import { Backdrop, CircularProgress } from "@suid/material"
import { Component } from "solid-js"

export const PleaseWait: Component = () => {
    const waitCount: number = 0 /* useSelector((state: RootState) => state.waitSpinner.waitCount) */

    return (
        <Backdrop
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={waitCount > 0}
        >
            <CircularProgress />
        </Backdrop>
    )
}
