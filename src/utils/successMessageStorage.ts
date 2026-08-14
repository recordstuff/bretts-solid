import { AppSnackbarSeverity } from '../models/AppSnackbarState'
import { showSnackbar } from '../state/AppSnackbar'

const SUCCESS_MESSAGE_STORAGE_KEY = 'bretts-solid-success-message'

export const storeSuccessMessage = (message: string): void => {
    sessionStorage.setItem(SUCCESS_MESSAGE_STORAGE_KEY, message)
}

const takeSuccessMessage = (): string | null => {
    const message = sessionStorage.getItem(SUCCESS_MESSAGE_STORAGE_KEY)

    sessionStorage.removeItem(SUCCESS_MESSAGE_STORAGE_KEY)

    return message
}

export const showStoredSuccessMessage = (): void => {
    const message = takeSuccessMessage()

    if (message !== null) {
        showSnackbar(message, AppSnackbarSeverity.Success)
    }
}
