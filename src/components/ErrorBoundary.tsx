import { AxiosError } from 'axios'
import { Box, Paper, Stack, Typography } from '@suid/material'
import {
    Component,
    ErrorBoundary as SolidErrorBoundary,
    ParentComponent,
    Show,
    createSignal,
    onCleanup,
    onMount,
} from 'solid-js'
import { HTTP_STATUS_CODES } from '../services/HttpClient'

interface ApplicationError {
    message: string
    name: string
    suppressMessage: boolean
}

interface ErrorViewProps {
    error: ApplicationError
}

const normalizeError = (error: unknown, name?: string, suppressMessage = false): ApplicationError => ({
    message: error instanceof Error ? error.message : String(error),
    name: name ?? (error instanceof Error ? error.name : 'Error'),
    suppressMessage,
})

const ErrorView: Component<ErrorViewProps> = (props) => (
    <Box
        component="main"
        role="alert"
        sx={{
            alignItems: 'center',
            bgcolor: 'background.default',
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: 'center',
            minHeight: '100dvh',
            p: { xs: 2, sm: 3 },
        }}
    >
        <Paper
            variant="outlined"
            sx={{
                borderColor: 'primary.main',
                borderRadius: 2,
                borderWidth: 2,
                boxShadow: (theme) => theme.shadows[8],
                maxWidth: '48rem',
                p: { xs: 3, sm: 6 },
                width: '100%',
            }}
        >
            <Stack spacing={2}>
                <Typography component="h1" variant="h2">Unfortunate Occurrence</Typography>
                <Typography>The application experienced a problem.</Typography>
                <Typography>{`Unhandled Error${props.error.name !== 'Error' ? `: ${props.error.name}` : ''}`}</Typography>
                <Typography sx={{ overflowWrap: 'anywhere' }}>{props.error.message}</Typography>
            </Stack>
        </Paper>
    </Box>
)

const ErrorBoundary: ParentComponent = (props) => {
    const [globalError, setGlobalError] = createSignal<ApplicationError | null>(null)

    const handleError = (event: ErrorEvent): void => {
        const error = event.error instanceof Error ? event.error : null

        setGlobalError({
            message: event.message || error?.message || 'Unknown error',
            name: error?.name ?? 'Error',
            suppressMessage: false,
        })
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
        const suppressMessage = event.reason instanceof AxiosError
            && event.reason.response?.status === HTTP_STATUS_CODES.FORBIDDEN
        const name = event.reason instanceof Error ? undefined : event.type

        setGlobalError(normalizeError(event.reason, name, suppressMessage))
    }

    onMount(() => {
        window.addEventListener('error', handleError)
        window.addEventListener('unhandledrejection', handleUnhandledRejection)
    })

    onCleanup(() => {
        window.removeEventListener('error', handleError)
        window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    })

    const fallback = (error: unknown) => {
        console.error('Unhandled application error:', error)

        return <ErrorView error={normalizeError(error)} />
    }

    return (
        <Show
            when={globalError()}
            fallback={
                <SolidErrorBoundary fallback={fallback}>
                    {props.children}
                </SolidErrorBoundary>
            }
        >
            {(error) => (
                <Show when={!error().suppressMessage}>
                    <ErrorView error={error()} />
                </Show>
            )}
        </Show>
    )
}

export default ErrorBoundary
