import { createSignal } from 'solid-js'
import { AppSnackbarSeverity, AppSnackbarState } from '../models/AppSnackbarState'

export const createAppSnackbar = () => {
    const [snackbar, setSnackbar] = createSignal<AppSnackbarState>({
        message: null,
        severity: AppSnackbarSeverity.Info,
    })

    const showSnackbar = (message: string, severity: AppSnackbarSeverity): void => {
        setSnackbar({message, severity})
    }

    const closeSnackbar = (): void => {
        setSnackbar(currentSnackbar => ({...currentSnackbar, message: null}))
    }

    return {snackbar, showSnackbar, closeSnackbar}
}
