import { Component, onMount } from "solid-js"
import { Button, Stack, Typography } from "@suid/material"
import { alpha } from "@suid/material/styles"
import { setPageTitle } from "../state/App"
import { firstBreadcrumb } from "../state/Breadcrumbs"
import { testClient } from "../services/TestClient"

const shutdownColors = {
    dark: '#7f0000',
    main: '#d32f2f',
    light: '#ff5252',
} as const

const Settings: Component = () => {

    onMount(() => {
        setPageTitle('Settings')
        firstBreadcrumb({ title: 'Settings', url: '/settings' })
    })

    const throwError = async (): Promise<void> => {
        await testClient.throwError()
    }

    const writeLogEntry = async (): Promise<void> => {
        await testClient.writeLogEntry()
    }

    const shutdown = async (): Promise<void> => {
        await testClient.shutdown()
    }

    return (
        <Stack spacing={2}>
            <Typography>Administrators are fancier than average people.</Typography>
            <Stack
                sx={{
                    alignItems: { xs: 'stretch', sm: 'center' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                }}
            >
                <Typography>Write a test log entry:</Typography>
                <Button onClick={writeLogEntry} variant="contained">Write Log Entry</Button>
            </Stack>
            <Stack
                sx={{
                    alignItems: { xs: 'stretch', sm: 'center' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                }}
            >
                <Typography>Test the global exception handler:</Typography>
                <Button onClick={throwError} variant="contained">Throw Error</Button>
            </Stack>
            <Stack
                sx={{
                    alignItems: { xs: 'stretch', sm: 'center' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                }}
            >
                <Typography>I don't mind. This is a sandbox. If anyone really does attack me, I'll hide it.</Typography>
                <Button
                    onClick={shutdown}
                    startIcon={<span aria-hidden="true">😈</span>}
                    variant="contained"
                    sx={{
                        background: `linear-gradient(135deg, ${shutdownColors.dark} 0%, ${shutdownColors.main} 52%, ${shutdownColors.light} 100%)`,
                        border: `1px solid ${shutdownColors.light}`,
                        boxShadow: `0 0 0.8rem ${alpha(shutdownColors.main, 0.55)}, 0 0.4rem 0.8rem ${alpha(shutdownColors.dark, 0.35)}`,
                        color: (theme) => theme.palette.common.white,
                        fontWeight: 700,
                        letterSpacing: '0.025em',
                        transition: 'background 140ms ease, box-shadow 140ms ease, transform 100ms ease',
                        '&:hover': {
                            background: `linear-gradient(135deg, ${shutdownColors.main} 0%, ${shutdownColors.light} 52%, ${shutdownColors.main} 100%)`,
                            boxShadow: `0 0 1.1rem ${alpha(shutdownColors.light, 0.75)}, 0 0.55rem 1rem ${alpha(shutdownColors.dark, 0.45)}`,
                            transform: 'translateY(-1px)',
                        },
                        '&:active': {
                            background: `linear-gradient(135deg, ${shutdownColors.dark} 0%, ${shutdownColors.main} 60%, ${shutdownColors.dark} 100%)`,
                            boxShadow: `0 0 0.45rem ${alpha(shutdownColors.dark, 0.65)}`,
                            transform: 'translateY(1px)',
                        },
                    }}
                >
                    Shutdown the Backend!!!
                </Button>
            </Stack>
        </Stack>
    )
}

export default Settings
