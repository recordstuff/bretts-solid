export const readableOutlinedFieldsStyles = {
    '& .MuiInputLabel-root': {
        color: 'text.primary',
        fontWeight: 500,
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.light',
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.main',
    },
    '& .MuiInputBase-input.Mui-disabled': {
        '-webkit-text-fill-color': 'text.secondary',
        opacity: 1,
    },
}

export const sampleCredentialButtonStyles = {
    color: 'primary.main',
    '&:hover, &:focus-visible': {
        bgcolor: 'action.hover',
        color: 'primary.dark',
    },
    '&:active': {
        bgcolor: 'primary.light',
        color: 'primary.contrastText',
    },
}
