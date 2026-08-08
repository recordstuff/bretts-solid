import { Box, Button, Grid, Link, Paper, TextField } from "@suid/material"
import { HTTP_STATUS_CODES } from "../services/HttpClient"
import { jwtUtil } from "../wrappers/JwtUtil"
import { defaultUserCredentials, UserCredentials } from "../models/UserCredentials"
import { AxiosError } from "axios"
import { userClient } from "../services/UserClient"
import { Component, createSignal, onMount } from "solid-js"
import { useNavigate } from "@solidjs/router"
import { clearAllWaits } from "../state/PleaseWait"
import AppSnackbar from "../components/AppSnackbar"

const Login: Component = () => {

    const [userCredentials, setUserCredentials] = createSignal<UserCredentials>(defaultUserCredentials());
    const [useErrorCondition, setUseErrorCondition] = createSignal<boolean>(false)
    const [isInvalidCredentials, setIsInvalidCredentials] = createSignal<boolean>(false)
    const navigate = useNavigate()

    const login = async (): Promise<void> => {
        try {
            setUseErrorCondition(true)

            if (userCredentials().Email.length === 0 || userCredentials().Password.length === 0) return

            const result = await userClient.login(userCredentials())
            jwtUtil.token = result.Token

            if (!jwtUtil.isExpired) {
                navigate('/')
            }
        }
        catch (ex: unknown) {
            clearAllWaits()
            if (ex instanceof AxiosError && ex.response?.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
                setIsInvalidCredentials(true)
                return
            }

            throw ex
        }
    }

    const credentialsChanged = (event: { target: { name: string; value: any } }, value: any): void => {
        setIsInvalidCredentials(false)
        let newCreds = { ...userCredentials() }
        newCreds[event.target.name as keyof UserCredentials] = value
        setUserCredentials(newCreds)
    }

    const populateCredentials = (credentials: UserCredentials): void => {
        setIsInvalidCredentials(false)
        setUserCredentials(credentials)
    }

    onMount(() => {
        jwtUtil.clear();
    })

    return (
        <Box
            component="main"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: { xs: '50vh', xl: '100dvh' },
                boxSizing: 'border-box',
                padding: 2,
                paddingTop: { xs: 4, sm: 2 },
            }}>
            <Paper
                variant="outlined"
                sx={{
                    width: '100%',
                    maxWidth: '36rem',
                    padding: { xs: 2, sm: 3 },
                    borderColor: 'divider',
                    transform: { xl: 'translateY(-4rem)' },
                }}>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        This is a SolidJS sample. Log in with Admin and User rights to see all options, including Users CRUD operations.
                    </Grid>
                    <Grid item>
                        <Box
                            role="group"
                            aria-label="Populate with Credentials"
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                            }}>
                            <Button onClick={() => populateCredentials(defaultUserCredentials())}>Admin and User rights</Button>
                            <Button onClick={() => populateCredentials({ Email: 'adminonly@brettdrake.org', Password: 'test123' })}>Admin rights only</Button>
                            <Button onClick={() => populateCredentials({ Email: 'useronly@brettdrake.org', Password: 'test123' })}>User rights only</Button>
                        </Box>
                    </Grid>
                    <Grid item>
                        <TextField
                            fullWidth
                            name="Email"
                            label="Email"
                            type="email"
                            onChange={credentialsChanged}
                            required
                            error={useErrorCondition() && userCredentials().Email.length === 0}
                            helperText={useErrorCondition() && userCredentials().Email.length === 0 && "Email cannot be blank."}
                            value={userCredentials().Email}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            fullWidth
                            name="Password"
                            label="Password"
                            type="password"
                            onChange={credentialsChanged}
                            required
                            error={useErrorCondition() && userCredentials().Password.length === 0}
                            helperText={useErrorCondition() && userCredentials().Password.length === 0 && "Password cannot be blank."}
                            value={userCredentials().Password}
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="primary"
                            onClick={login}
                            disabled={useErrorCondition() && (userCredentials().Email.length === 0 || userCredentials().Password.length === 0)}>
                            Login
                        </Button>
                    </Grid>
                    <Grid item sx={{ textAlign: 'right' }}>
                        <Link
                            href="https://brettdrake.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            color="primary">
                            brettdrake.org
                        </Link>
                    </Grid>
                    <AppSnackbar
                        message={isInvalidCredentials() ? 'The Email or Password was incorrect.' : null}
                        severity="warning"
                        onClose={() => setIsInvalidCredentials(false)}
                    />
                </Grid>
            </Paper>
        </Box>
    )
}

export default Login
