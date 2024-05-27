import { roleClient } from "../services/RoleClient"
import { userClient } from "../services/UserClient"
import { UserDetail, emptyUserDetail } from "../models/UserDetail"
import { Button, Stack, TextField } from "@suid/material"
import ItemsSelector from "../components/ItemsSelector"
import { NameGuidPair } from "../models/NameGuidPair"
import { UserNew } from "../models/UserNew"
import { AxiosError } from "axios"
import { HTTP_STATUS_CODES } from "../services/HttpClient"
import { Component, createResource, createSignal, onMount } from "solid-js"
import { useNavigate, useParams } from "@solidjs/router"
import { setPageTitle } from "../state/App"
import { clearAllWaits } from "../state/PleaseWait"
import { addBreadcrumb } from "../state/Breadcrumbs"

const User: Component = () => {

    const [password, setPassword] = createSignal<string>('')
    const [selectedRoles, setSelectedRoles] = createSignal<NameGuidPair[]>([])

    const { id } = useParams();
    const navigate = useNavigate();

    const [user, { mutate, refetch }] = createResource(id, async () => await userClient.getUser(id), { initialValue: emptyUserDetail() })
    const [roles] = createResource(id, async () => await roleClient.getRoles(), { initialValue: [] })

    onMount(() => {
        let url = '/user'
        let pageTitle

        if (id === undefined) {
            pageTitle = 'Add User'
        }
        else {
            pageTitle = 'Edit User'
            url = `${url}/${id}`
        }

        setPageTitle(pageTitle)
        addBreadcrumb({ title: pageTitle, url })
    })


    const handleChange = (event: { target: { name: string; value: any } }, value: any): void => {
        if (event.target.name === 'Password') {
            setPassword(event.target.value)
            return;
        }

        let newUser = { ...user() }
        newUser[event.target.name as keyof UserDetail] = event.target.value as any
        mutate(newUser)
    }

    const upsert = async (): Promise<void> => {
        if (id === undefined) {
            const newUser: UserNew = { ...user(), Password: password() }
            newUser.Roles = selectedRoles()

            try {
                const userDetail = await userClient.insertUser(newUser)
                navigate(`/user/${userDetail.Guid}`)
            }
            catch (ex: unknown) {
                clearAllWaits()
                if (ex instanceof AxiosError
                    && ex.response?.status === HTTP_STATUS_CODES.CONFLICT) {
                    // email already exists
                    return
                }

                throw ex
            }
        }
        else {
            const newUser = { ...user() }
            newUser.Roles = selectedRoles()

            mutate(await userClient.updateUser(newUser))
        }
    }

    const handleCancel = (): void => {
        if (id === undefined) {
            navigate(-1)
        }
        else {
            refetch()
        }
    }

    const handleDelete = (): void => {
    }

    return (
        <Stack margin={2} spacing={4}>
            {id !== undefined && <TextField fullWidth label="Id" value={user().Guid} disabled />}
            <TextField fullWidth label="Display Name" name='DisplayName' onChange={handleChange} value={user().DisplayName} />
            <TextField fullWidth label="Email" name='Email' onChange={handleChange} value={user().Email} />
            <TextField fullWidth label="Phone" name='Phone' onChange={handleChange} value={user().Phone} />
            {id === undefined && <TextField fullWidth label="Password" name='Password' onChange={handleChange} value={password} />}
            <ItemsSelector
                label="Roles"
                allItems={roles}
                initiallySelectedItems={user().Roles}
                selected={selectedRoles}
                setSelected={setSelectedRoles}
            />
            <Stack direction='row' spacing={2}>
                <Button onClick={upsert} color='primary' variant="contained">{id === undefined ? 'Add' : 'Save'}</Button>
                <Button color="secondary" onClick={handleCancel}>Cancel</Button>
                {id !== undefined && <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>}
            </Stack>
        </Stack>
    )
}

export default User
