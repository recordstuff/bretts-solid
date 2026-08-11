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

export const cancelButtonStyles = {
    color: 'primary.main',
    '&:hover, &:focus-visible': {
        bgcolor: 'action.hover',
        color: 'text.primary',
    },
    '&:active': {
        bgcolor: 'action.selected',
        color: 'text.primary',
    },
}

export const logoutLinkStyles = {
    color: 'inherit',
    fontSize: '.9em',
    lineHeight: 1.2,
    textDecoration: 'none',
    transition: 'color 120ms ease',
    '&:visited': {
        color: 'inherit',
    },
    '&:hover, &:focus-visible': {
        color: 'background.default',
        fontWeight: 700,
        textDecoration: 'none',
    },
    '&:active': {
        color: 'secondary.light',
        fontWeight: 700,
        textDecoration: 'none',
    },
}

export const drawerExternalLinkStyles = {
    alignItems: 'center',
    alignSelf: 'center',
    color: 'primary.main',
    display: 'flex',
    py: 1,
    textDecoration: 'underline',
    textDecorationThickness: '1px',
    textUnderlineOffset: '0.2em',
    transition: 'color 120ms ease, text-decoration-thickness 120ms ease, transform 80ms ease',
    width: 'fit-content',
    '&:visited': {
        color: 'primary.main',
    },
    '&:hover, &:focus-visible': {
        color: 'primary.light',
        textDecorationThickness: '2px',
    },
    '&:active': {
        color: 'primary.dark',
        textDecorationThickness: '2px',
        transform: 'translateY(1px) scale(0.98)',
    },
}

export const breadcrumbLinkStyles = {
    color: 'primary.main',
    textDecoration: 'underline',
    textDecorationThickness: '1px',
    textUnderlineOffset: '0.2em',
    transition: 'color 120ms ease, text-decoration-thickness 120ms ease',
    '&:visited': {
        color: 'primary.main',
    },
    '&:hover, &:focus-visible': {
        color: 'primary.light',
        fontWeight: 500,
        textDecorationThickness: '2px',
    },
    '&:active': {
        color: 'primary.dark',
        fontWeight: 700,
        textDecorationThickness: '3px',
    },
}

export const deleteButtonStyles = {
    '&:hover, &:focus-visible': {
        bgcolor: '#B3261E',
    },
    '&:active': {
        bgcolor: '#8F1712',
    },
}
