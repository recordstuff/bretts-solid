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

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
    )
}

render(() => (
    <>
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
                <Route path="settings" component={Settings} />
            </Route>
            <Route path="*" component={NotFound} />
        </Router>
    </>
), root!)
