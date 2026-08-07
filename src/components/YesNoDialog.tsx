import HelpOutlineIcon from '@suid/icons-material/HelpOutline'
import { Button, Dialog, DialogActions, DialogTitle, Stack } from '@suid/material'
import type { Component } from 'solid-js'

interface YesNoDialogProps {
    open: boolean
    question: string
    onNo: () => void
    onYes: () => void
}

const YesNoDialog: Component<YesNoDialogProps> = (props) => (
    <Dialog
        open={props.open}
        onClose={props.onNo}
        aria-labelledby="yes-no-dialog-question"
    >
        <DialogTitle id="yes-no-dialog-question" sx={{ color: 'info.light' }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
                <HelpOutlineIcon color="info" />
                <span>{props.question}</span>
            </Stack>
        </DialogTitle>
        <DialogActions>
            <Button color="error" onClick={props.onYes}>Yes</Button>
            <Button autofocus color="info" variant="contained" onClick={props.onNo}>No</Button>
        </DialogActions>
    </Dialog>
)

export default YesNoDialog
