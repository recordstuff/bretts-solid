import { TextField } from '@suid/material'
import { useNavigate, useParams } from '@solidjs/router'
import { Component, createEffect, createResource, createSignal, Show } from 'solid-js'
import EntityFormActions from '../components/EntityFormActions'
import YesNoDialog from '../components/YesNoDialog'
import { AppSnackbarSeverity } from '../models/AppSnackbarState'
import { NameGuidPair } from '../models/NameGuidPair'
import { RoleNew } from '../models/RoleNew'
import { HTTP_STATUS_CODES, isHttpStatusError } from '../services/HttpClient'
import { roleClient } from '../services/RoleClient'
import { setPageTitle } from '../state/App'
import { showSnackbar } from '../state/AppSnackbar'
import { addBreadcrumb } from '../state/Breadcrumbs'
import { clearAllWaits } from '../state/PleaseWait'

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

                showSnackbar('This role was created.', AppSnackbarSeverity.Success)
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

            if (isHttpStatusError(exception, HTTP_STATUS_CODES.CONFLICT)) {
                showSnackbar('A role with this name already exists.', AppSnackbarSeverity.Warning)
                return
            }

            throw exception
        }
    }

    const handleCancel = async (): Promise<void> => {
        if (!isEdit()) {
            navigate(-1)
            return
        }

        await refetch()
    }

    const handleDelete = async (): Promise<void> => {
        const roleId = id()

        if (roleId === undefined) {
            return
        }

        setDeleteDialogOpen(false)

        try {
            await roleClient.deleteRole(roleId)
            showSnackbar('This role was deleted.', AppSnackbarSeverity.Success)
            navigate('/roles')
        }
        catch (exception: unknown) {
            clearAllWaits()

            if (isHttpStatusError(exception, HTTP_STATUS_CODES.CONFLICT)) {
                showSnackbar('This role is assigned to one or more users and cannot be deleted.', AppSnackbarSeverity.Warning)
                return
            }

            throw exception
        }
    }

    return (
        <div class="entity-form readable-outlined-fields">
            <Show when={isEdit()}>
                <TextField fullWidth label="Id" value={role().Guid} disabled />
            </Show>
            <TextField fullWidth label="Name" name="Name" onChange={handleChange} value={role().Name} />
            <EntityFormActions
                isEdit={isEdit()}
                onCancel={handleCancel}
                onDelete={() => setDeleteDialogOpen(true)}
                onSave={upsert}
            />
            <YesNoDialog
                open={deleteDialogOpen()}
                question="Are you sure you want to delete this role?"
                onNo={() => setDeleteDialogOpen(false)}
                onYes={handleDelete}
            />
        </div>
    )
}

export default Role
