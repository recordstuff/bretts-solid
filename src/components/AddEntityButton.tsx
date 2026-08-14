import AddIcon from '@suid/icons-material/Add'
import { Button } from '@suid/material'
import { A } from '@solidjs/router'
import type { Component } from 'solid-js'

interface AddEntityButtonProps {
    href: string
    label: string
}

const AddEntityButton: Component<AddEntityButtonProps> = (props) => (
    <div class="add-entity-button-container">
        <Button
            class="secondary-action-button"
            color="secondary"
            component={A}
            href={props.href}
            startIcon={<AddIcon />}
        >
            {props.label}
        </Button>
    </div>
)

export default AddEntityButton
