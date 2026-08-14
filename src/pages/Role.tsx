import { Button, Stack, TextField } from '@suid/material'
import { useNavigate, useParams } from '@solidjs/router'
import { AxiosError } from 'axios'
import { Component, createEffect, createResource, createSignal } from 'solid-js'
import YesNoDialog from '../components/YesNoDialog'
import { AppSnackbarSeverity } from '../models/AppSnackbarState'
import { NameGuidPair } from '../models/NameGuidPair'
import { RoleNew } from '../models/RoleNew'
import { HTTP_STATUS_CODES } from '../services/HttpClient'
import { roleClient } from '../services/RoleClient'
import { setPageTitle } from '../state/App'
import { showSnackbar } from '../state/AppSnackbar'
import { addBreadcrumb } from '../state/Breadcrumbs'
import { clearAllWaits } from '../state/PleaseWait'
import { readableOutlinedFieldsStyles } from '../styles/formStyles'
import { cancelButtonStyles, deleteButtonStyles } from '../styles/interactiveStyles'
import { storeSuccessMessage, takeSuccessMessage } from '../utils/successMessageStorage'

const emptyRole = (): NameGuidPair => ({ Guid: '', Name: '' })

const Role: Component = () => {
    const [deleteDialogOpen, setDeleteDialogOpen] = createSignal(false)
    const params = useParams()
    const id = (): string | undefined => params.id
    const isEdit = (): boolean => id() !== undefined
    const navigate = useNavigate()

    const getRole = (roleId: string): Promise<NameGuidPair> => roleClient.getRole(roleId)
    const [role, { mutate, refetch }] = createResource(id, getRole, { initialValue: emptyRole() })

    createEffect(() => {
        const roleId = id()
        let pageTitle = 'Add Role'
        let url = '/role'

        if (roleId !== undefined) {
            pageTitle = 'Edit Role'
            url = `${url}/${roleId}`
        }

        setPageTitle(pageTitle)
        addBreadcrumb({ title: pageTitle, url })
    })

    createEffect(() => {
        if (!isEdit()) {
            return
        }

        const storedSuccessMessage = takeSuccessMessage()

        if (storedSuccessMessage !== null) {
            showSnackbar(storedSuccessMessage, AppSnackbarSeverity.Success)
        }
    })

    const handleChange = (_event: { target: { value: unknown } }, value: string): void => {
        mutate({ ...role(), Name: value })
    }

    const upsert = async (): Promise<void> => {
        const roleName = role().Name.trim()

        if (roleName.length === 0) {
            showSnackbar('Complete the required role fields.', AppSnackbarSeverity.Warning)
            return
        }

        try {
            if (!isEdit()) {
                const newRole: RoleNew = { Name: roleName }
                const roleDetail = await roleClient.insertRole(newRole)

                storeSuccessMessage('This role was created.')
                navigate(`/role/${roleDetail.Guid}`)
            }
            else {
                const updatedRole = { ...role(), Name: roleName }

                mutate(await roleClient.updateRole(updatedRole))
                showSnackbar('This role was saved.', AppSnackbarSeverity.Success)
            }
        }
        catch (exception: unknown) {
            clearAllWaits()

            if (exception instanceof AxiosError
             && exception.response?.status === HTTP_STATUS_CODES.CONFLICT) {
                showSnackbar('A role with this name already exists.', AppSnackbarSeverity.Warning)
                return
            }

            throw exception
        }
    }

    const handleCancel = (): void => {
        if (!isEdit()) {
            navigate(-1)
            return
        }

        refetch()
    }

    const handleDelete = async (): Promise<void> => {
        const roleId = id()

        if (roleId === undefined) {
            return
        }

        setDeleteDialogOpen(false)

        try {
            await roleClient.deleteRole(roleId)
            storeSuccessMessage('This role was deleted.')
            navigate('/roles')
        }
        catch (exception: unknown) {
            clearAllWaits()

            if (exception instanceof AxiosError
             && exception.response?.status === HTTP_STATUS_CODES.CONFLICT) {
                showSnackbar('This role is assigned to one or more users and cannot be deleted.', AppSnackbarSeverity.Warning)
                return
            }

            throw exception
        }
    }

    const saveButtonText = (): string => {
        if (isEdit()) {
            return 'Save'
        }

        return 'Add'
    }

    const cancelButtonText = (): string => {
        if (isEdit()) {
            return 'Reset Form'
        }

        return 'Cancel'
    }

    return (
        <Stack margin={2} spacing={4} sx={{ maxWidth: '75rem', ...readableOutlinedFieldsStyles }}>
            {isEdit() && <TextField fullWidth label="Id" value={role().Guid} disabled />}
            <TextField fullWidth label="Name" name="Name" onChange={handleChange} value={role().Name} />
            <Stack direction="row" spacing={2}>
                <Button onClick={upsert} color="primary" variant="contained">{saveButtonText()}</Button>
                <Button color="secondary" onClick={handleCancel} sx={cancelButtonStyles}>{cancelButtonText()}</Button>
                {isEdit() && <Button variant="contained" color="error" onClick={() => setDeleteDialogOpen(true)} sx={deleteButtonStyles}>Delete</Button>}
            </Stack>
            <YesNoDialog
                open={deleteDialogOpen()}
                question="Are you sure you want to delete this role?"
                onNo={() => setDeleteDialogOpen(false)}
                onYes={handleDelete}
            />
        </Stack>
    )
}

export default Role
