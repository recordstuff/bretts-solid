import { Button } from '@suid/material'
import { Show } from 'solid-js'
import type { Component } from 'solid-js'
import { AppSnackbarSeverity } from '../models/AppSnackbarState'
import { showSnackbar } from '../state/AppSnackbar'

interface EntityFormActionsProps {
    isEdit: boolean
    onCancel: () => void | Promise<void>
    onDelete: () => void
    onSave: () => void
}

const EntityFormActions: Component<EntityFormActionsProps> = (props) => {
    const saveButtonText = (): string => {
        if (props.isEdit) {
            return 'Save'
        }

        return 'Add'
    }

    const cancelButtonText = (): string => {
        if (props.isEdit) {
            return 'Reset Form'
        }

        return 'Cancel'
    }

    const handleCancel = async (): Promise<void> => {
        await props.onCancel()

        if (props.isEdit) {
            showSnackbar('The form was reset.', AppSnackbarSeverity.Info)
        }
    }

    return (
        <div class="entity-form-actions">
            <Button color="primary" onClick={props.onSave} variant="contained">
                {saveButtonText()}
            </Button>
            <Button class="secondary-action-button" color="secondary" onClick={handleCancel}>
                {cancelButtonText()}
            </Button>
            <Show when={props.isEdit}>
                <Button class="delete-button" color="error" onClick={props.onDelete} variant="contained">
                    Delete
                </Button>
            </Show>
        </div>
    )
}

export default EntityFormActions
