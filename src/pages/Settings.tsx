import { Component, onMount } from "solid-js"
import { Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@suid/material"
import { alpha } from "@suid/material/styles"
import { setPageTitle } from "../state/App"
import { firstBreadcrumb } from "../state/Breadcrumbs"
import { testClient } from "../services/TestClient"
import { showSnackbar } from "../state/AppSnackbar"
import { AppSnackbarSeverity } from "../models/AppSnackbarState"

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
        try {
            await testClient.writeLogEntry()
            showSnackbar('The test log entry was written.', AppSnackbarSeverity.Success)
        } catch {
            showSnackbar('The test log entry could not be written.', AppSnackbarSeverity.Error)
        }
    }

    const shutdown = async (): Promise<void> => {
        try {
            await testClient.shutdown()
            showSnackbar('The backend shutdown was requested.', AppSnackbarSeverity.Success)
        } catch {
            showSnackbar('The backend shutdown could not be requested.', AppSnackbarSeverity.Error)
        }
    }

    return (
        <Stack spacing={2}>
            <Typography>Administrators are fancier than average people.</Typography>
            <TableContainer component={Paper} sx={{ maxWidth: '56rem', mx: 'auto', width: '100%' }}>
                <Table aria-label="Administrator tasks" sx={{ tableLayout: 'fixed' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: { xs: '52%', sm: '65%' } }}>Admin Task</TableCell>
                            <TableCell aria-label="Action" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Write a test log entry</TableCell>
                            <TableCell><Button fullWidth onClick={writeLogEntry} variant="contained">Write Log Entry</Button></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Test the global exception handler</TableCell>
                            <TableCell><Button fullWidth onClick={throwError} variant="contained">Throw Error</Button></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>I don't mind. This is a sandbox. If anyone really does attack me, I'll hide it.</TableCell>
                            <TableCell>
                                <Button
                                    fullWidth
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
                                        lineHeight: 1.3,
                                        whiteSpace: 'normal',
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
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    )
}

export default Settings
