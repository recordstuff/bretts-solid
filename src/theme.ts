import { createTheme } from '@suid/material/styles'

export const paletteColors = {
    darkest: '#543622',
    primary: '#725444',
    muted: '#8F7265',
    border: '#C0A099',
    background: '#F2E9E4',
    surface: '#FFFDFC',
} as const

export const appTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            light: paletteColors.muted,
            main: paletteColors.primary,
            dark: paletteColors.darkest,
            contrastText: '#FFFFFF',
        },
        secondary: {
            light: paletteColors.border,
            main: '#806052',
            dark: paletteColors.darkest,
            contrastText: '#FFFFFF',
        },
        background: {
            default: paletteColors.background,
            paper: paletteColors.surface,
        },
        text: {
            primary: paletteColors.darkest,
            secondary: paletteColors.primary,
            disabled: paletteColors.muted,
        },
        divider: paletteColors.border,
        action: {
            active: paletteColors.primary,
            hover: '#E6D8D4',
            selected: paletteColors.border,
            focus: paletteColors.muted,
        },
    },
})
