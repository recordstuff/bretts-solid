import { createTheme } from '@suid/material/styles'

export const paletteColors = {
    background: '#DDE4ED',
    backgroundAccent: '#CCDBE9',
    border: '#B4C9DD',
    surface: '#EDE1DB',
    accent: '#F1B3A1',
} as const

export const appTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            light: paletteColors.border,
            main: '#536F8A',
            dark: '#3D556D',
            contrastText: '#FFFFFF',
        },
        secondary: {
            light: paletteColors.accent,
            main: '#A65442',
            dark: '#7F3C30',
            contrastText: '#FFFFFF',
        },
        background: {
            default: paletteColors.background,
            paper: paletteColors.surface,
        },
        text: {
            primary: '#25384A',
            secondary: '#536577',
            disabled: '#82909D',
        },
        divider: paletteColors.border,
        action: {
            active: '#536F8A',
            hover: paletteColors.backgroundAccent,
            selected: paletteColors.border,
            focus: paletteColors.accent,
        },
    },
})
