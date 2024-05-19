import { Box, Button, Grid, /* Snackbar, */ TextField } from "@suid/material"
import { HTTP_STATUS_CODES } from "../services/HttpClient"
import { jwtUtil } from "../wrappers/JwtUtil"
import { defaultUserCredentials, UserCredentials } from "../models/UserCredentials"
import { AxiosError } from "axios"
import { userClient } from "../services/UserClient"
import { Component, createSignal, onMount } from "solid-js"
import { useNavigate } from "@solidjs/router"

const Login: Component = () => {

    const [userCredentials, setUserCredentials] = createSignal<UserCredentials>(defaultUserCredentials());
    const [useErrorCondition, setUseErrorCondition] = createSignal<boolean>(false)
    const [isInvalidCredentials, setIsInvalidCredentials] = createSignal<boolean>(false)
    const navigate = useNavigate()

    const login = async (): Promise<void> => {
        try {
            setUseErrorCondition(true)

            if (userCredentials().Email.length === 0 || userCredentials().Password.length === 0) return

            // dispatch(pleaseWait())

            jwtUtil.token = await userClient.login(userCredentials())

            // dispatch(doneWaiting())

            if (!jwtUtil.isExpired) {
                navigate('/')
            }
        }
        catch (ex: unknown) {
            // dispatch(clearAllWaits())
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
        newCreds[event.target.name as keyof UserCredentials] = event.target.value
        setUserCredentials(newCreds)
    }

    onMount(() => {
        jwtUtil.clear();
    });

    return (
        <Box component='div' sx={{ display: 'flex' }} justifyContent="center" alignItems="center" minHeight="50vh">
            <Grid item lg={4} container direction="column" margin={2} spacing={2}>
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
{/*                <Snackbar
                    open={isInvalidCredentials}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    autoHideDuration={3000}
                    message="The Email or Password was incorrect."
    />                */}
            </Grid>
        </Box>
    )
}

export default Login