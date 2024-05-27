import { Component, onMount } from "solid-js"
import { setPageTitle } from "../state/App"
import { firstBreadcrumb } from "../state/Breadcrumbs"

const Settings: Component = () => {

    onMount(() => {
        setPageTitle('Settings')
        firstBreadcrumb({ title: 'Settings', url: '/settings' })
    })

    return (
        <>
            <p>Administrators are fancier than average people.</p>
        </>
    )
}

export default Settings