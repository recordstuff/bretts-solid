import { Box, Button, ButtonGroup, Grid, TextField } from "@suid/material"
import { HTTP_STATUS_CODES } from "../services/HttpClient"
import { jwtUtil } from "../wrappers/JwtUtil"
import { defaultUserCredentials, UserCredentials } from "../models/UserCredentials"
import { AxiosError } from "axios"
import { userClient } from "../services/UserClient"
import { Component, createSignal, onMount } from "solid-js"
import { useNavigate } from "@solidjs/router"
import { clearAllWaits } from "../state/PleaseWait"
import Snackbar from "../components/Snackbar"

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
        <Box component='div' sx={{ display: 'flex' }} justifyContent="center" alignItems="center" minHeight="50vh">
            <Grid item lg={4} container direction="column" margin={2} spacing={2}>
                <Grid item>
                    This is a SolidJS sample. Log in with Admin and User rights to see all options, including Users CRUD operations.
                </Grid>
                <Grid item sx={{ textAlign: 'center' }}>
                    <ButtonGroup variant="text" aria-label="Populate with Credentials">
                        <Button onClick={() => populateCredentials(defaultUserCredentials())}>Admin and User rights</Button>
                        <Button onClick={() => populateCredentials({ Email: 'adminonly@brettdrake.org', Password: 'test123' })}>Admin rights only</Button>
                        <Button onClick={() => populateCredentials({ Email: 'useronly@brettdrake.org', Password: 'test123' })}>User rights only</Button>
                    </ButtonGroup>
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
                <Snackbar
                    open={isInvalidCredentials()}
                    autoHideDuration={3000}
                    message="The Email or Password was incorrect."
                    onClose={() => setIsInvalidCredentials(false)}
                />
            </Grid>
        </Box>
    )
}

export default Login
