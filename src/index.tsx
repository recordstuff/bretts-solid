import { render } from 'solid-js/web'
import NotFound from './pages/NotFound'
import Login from './pages/Login'

import './index.css'
import App from './App'
import { Route, Router } from '@solidjs/router'
import Layout from './pages/Layout'
import BaconIpsum from './pages/BaconIpsum'
import Home from './pages/Home'
import GridExample from './pages/GridExample'
import ExampleTwo from './pages/ExampleTwo'
import Settings from './pages/Settings'
import { PleaseWait } from './components/PleaseWait'
import Users from './pages/Users'
import User from './pages/User'
import Role from './pages/Role'
import Roles from './pages/Roles'
import { CssBaseline } from '@suid/material'
import { lighten, ThemeProvider } from '@suid/material/styles'
import { appTheme } from './theme'
import ErrorBoundary from './components/ErrorBoundary'

const root = document.getElementById('root')

const cssVariables = {
    '--app-action-hover': appTheme.palette.action.hover,
    '--app-action-selected': appTheme.palette.action.selected,
    '--app-background-paper': appTheme.palette.background.paper,
    '--app-divider': appTheme.palette.divider,
    '--app-primary-dark': appTheme.palette.primary.dark,
    '--app-primary-main': appTheme.palette.primary.main,
    '--app-secondary-light': appTheme.palette.secondary.light,
    '--app-text-primary': appTheme.palette.text.primary,
    '--app-text-secondary': appTheme.palette.text.secondary,
    '--sortable-heading-active': lighten(appTheme.palette.secondary.light, 0.15),
    '--sortable-heading-hover': lighten(appTheme.palette.secondary.light, 0.3),
}

Object.entries(cssVariables).forEach(([name, value]) => {
    document.documentElement.style.setProperty(name, value)
})

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
    )
}

render(() => (
    <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <ErrorBoundary>
            <PleaseWait />
            <Router root={App}>
                <Route path='/login' component={Login} />
                <Route path="/" component={Layout}>
                    <Route path="" component={Home} />
                    <Route path="baconipsum" component={BaconIpsum} />
                    <Route path="exampletwo" component={ExampleTwo} />
                    <Route path="gridexample" component={GridExample} />
                    <Route path="users" component={Users} />
                    <Route path="user/:id?" component={User} />
                    <Route path="roles" component={Roles} />
                    <Route path="role/:id?" component={Role} />
                    <Route path="settings" component={Settings} />
                </Route>
                <Route path="*" component={NotFound} />
            </Router>
        </ErrorBoundary>
    </ThemeProvider>
), root!)
