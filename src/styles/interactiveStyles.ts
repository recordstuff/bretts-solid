const contrastingContent = {
    color: 'primary.contrastText',
    '& .MuiListItemIcon-root, & .MuiTypography-root, & .MuiSvgIcon-root': {
        color: 'inherit',
    },
}

export const interactiveLinkStyles = {
    color: 'text.primary',
    textDecoration: 'none',
    transition: 'background-color 120ms ease, color 120ms ease, transform 80ms ease',
    '&:visited': {
        color: 'text.primary',
    },
    '&.Mui-selected': {
        bgcolor: 'action.selected',
        color: 'text.primary',
        '& .MuiListItemIcon-root, & .MuiTypography-root, & .MuiSvgIcon-root': {
            color: 'inherit',
        },
    },
    '&:hover, &.Mui-selected:hover, &:focus-visible': {
        bgcolor: 'primary.main',
        ...contrastingContent,
    },
    '&:focus-visible': {
        outline: '2px solid',
        outlineColor: 'primary.light',
        outlineOffset: '-2px',
    },
    '&:active, &.Mui-selected:active': {
        bgcolor: 'primary.dark',
        transform: 'scale(0.97)',
        ...contrastingContent,
    },
}

export const mobileMenuButtonStyles = {
    display: { sm: 'none' },
    mr: 2,
    transition: 'background-color 120ms ease, color 120ms ease, transform 80ms ease',
    '&:hover, &:focus-visible': {
        bgcolor: 'background.paper',
        color: 'primary.main',
    },
    '&:focus-visible': {
        outline: '2px solid',
        outlineColor: 'primary.contrastText',
        outlineOffset: '2px',
    },
    '&:active': {
        bgcolor: 'primary.dark',
        color: 'primary.contrastText',
        transform: 'scale(0.9)',
    },
}
