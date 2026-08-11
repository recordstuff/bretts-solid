import { createTheme } from '@suid/material/styles'

export const paletteColors = {
    darkest: '#3D315B',
    primary: '#5F4B8B',
    muted: '#8E7DBE',
    border: '#C9BDE8',
    background: '#F4F1FA',
    surface: '#FFFFFF',
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
            main: paletteColors.primary,
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
            hover: paletteColors.background,
            selected: paletteColors.border,
            focus: paletteColors.muted,
        },
    },
})
