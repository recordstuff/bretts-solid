import { roleClient } from "../services/RoleClient"
import { userClient } from "../services/UserClient"
import { UserDetail, emptyUserDetail } from "../models/UserDetail"
import { TextField } from "@suid/material"
import ItemsSelector from "../components/ItemsSelector"
import EntityFormActions from "../components/EntityFormActions"
import { NameGuidPair } from "../models/NameGuidPair"
import { UserNew } from "../models/UserNew"
import { HTTP_STATUS_CODES, isHttpStatusError } from "../services/HttpClient"
import { Component, createEffect, createResource, createSignal, Show } from "solid-js"
import { useNavigate, useParams } from "@solidjs/router"
import { setPageTitle } from "../state/App"
import { clearAllWaits } from "../state/PleaseWait"
import { addBreadcrumb } from "../state/Breadcrumbs"
import YesNoDialog from "../components/YesNoDialog"
import { showStoredSuccessMessage, storeSuccessMessage } from "../utils/successMessageStorage"
import { showSnackbar } from "../state/AppSnackbar"
import { AppSnackbarSeverity } from "../models/AppSnackbarState"

const User: Component = () => {

    const [password, setPassword] = createSignal<string>('')
    const [selectedRoles, setSelectedRoles] = createSignal<NameGuidPair[]>([])
    const [deleteDialogOpen, setDeleteDialogOpen] = createSignal(false)

    const params = useParams()
    const id = (): string | undefined => params.id
    const isEdit = (): boolean => id() !== undefined
    const navigate = useNavigate();


    const fetchUser = async (userId: string): Promise<UserDetail> => {
        const user = await userClient.getUser(userId)

        setSelectedRoles(user.Roles)

        return user
    }

    const getAllRoles = async (): Promise<NameGuidPair[]> => {
        const roles = await roleClient.getAllRoles()

        return roles;
    }

    const [user, { mutate, refetch }] = createResource(id, fetchUser, { initialValue: emptyUserDetail() })
    const [roles] = createResource(getAllRoles, { initialValue: [] })

    createEffect(() => {
        const userId = id()
        let url = '/user'
        let pageTitle

        if (userId === undefined) {
            pageTitle = 'Add User'
        }
        else {
            pageTitle = 'Edit User'
            url = `${url}/${userId}`
        }

        setPageTitle(pageTitle)
        addBreadcrumb({ title: pageTitle, url })
    })

    createEffect(() => {
        if (isEdit()) {
            showStoredSuccessMessage()
        }
    })


    const handleChange = (event: { target: { name: string; value: any } }, value: any): void => {
        if (event.target.name === 'Password') {
            setPassword(value)
            return;
        }

        let newUser = { ...user() }
        newUser[event.target.name as keyof UserDetail] = value
        mutate(newUser)
    }

    const upsert = async (): Promise<void> => {
        try {
            if (id() === undefined) {
                const newUser: UserNew = { ...user(), Password: password() }
                newUser.Roles = selectedRoles()

                const userDetail = await userClient.insertUser(newUser)
                storeSuccessMessage('This user was created.')
                navigate(`/user/${userDetail.Guid}`)
            }
            else {
                const updatedUser = { ...user() }
                updatedUser.Roles = selectedRoles()

                mutate(await userClient.updateUser(updatedUser))
                showSnackbar('This user was saved.', AppSnackbarSeverity.Success)
            }
        }
        catch (ex: unknown) {
            clearAllWaits()

            if (isHttpStatusError(ex, HTTP_STATUS_CODES.CONFLICT)) {
                showSnackbar('A user with this email already exists.', AppSnackbarSeverity.Warning)
                return
            }

            throw ex
        }
    }

    const handleCancel = (): void => {
        if (id() === undefined) {
            navigate(-1)
        }
        else {
            refetch()
        }
    }

    const handleDelete = async (): Promise<void> => {
        const userId = id()
        if (userId === undefined) return

        setDeleteDialogOpen(false)
        await userClient.deleteUser(userId)
        storeSuccessMessage('This user was deleted.')
        navigate('/users')
    }

    return (
        <div class="entity-form readable-outlined-fields">
            <Show when={isEdit()}>
                <TextField fullWidth label="Id" value={user().Guid} disabled />
            </Show>
            <TextField fullWidth label="Display Name" name='DisplayName' onChange={handleChange} value={user().DisplayName} />
            <TextField fullWidth label="Email" name='Email' onChange={handleChange} value={user().Email} />
            <TextField fullWidth label="Phone" name='Phone' onChange={handleChange} value={user().Phone} />
            <Show when={!isEdit()}>
                <TextField fullWidth label="Password" name='Password' onChange={handleChange} value={password()} />
            </Show>
            <ItemsSelector
                label="Roles"
                allItems={roles}
                selected={selectedRoles}
                setSelected={setSelectedRoles}
            />
            <EntityFormActions
                isEdit={isEdit()}
                onCancel={handleCancel}
                onDelete={() => setDeleteDialogOpen(true)}
                onSave={upsert}
            />
            <YesNoDialog
                open={deleteDialogOpen()}
                question="Are you sure you want to delete this user?"
                onNo={() => setDeleteDialogOpen(false)}
                onYes={handleDelete}
            />
        </div>
    )
}

export default User
