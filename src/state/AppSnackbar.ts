import { createSignal } from 'solid-js'
import { AppSnackbarSeverity, AppSnackbarState } from '../models/AppSnackbarState'

const [snackbar, setSnackbar] = createSignal<AppSnackbarState>({
    message: null,
    severity: AppSnackbarSeverity.Info,
})

export {snackbar}

export const showSnackbar = (message: string, severity: AppSnackbarSeverity): void => {
    setSnackbar({message, severity})
}

export const closeSnackbar = (): void => {
    setSnackbar(currentSnackbar => ({...currentSnackbar, message: null}))
}
