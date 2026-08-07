import AgricultureIcon from '@suid/icons-material/Agriculture'
import PeopleIcon from '@suid/icons-material/People'
import SettingsIcon from '@suid/icons-material/Settings'
import TableChartIcon from '@suid/icons-material/TableChart'
import TableRowsIcon from '@suid/icons-material/TableRows'
import { Card, CardActionArea, Stack, Typography } from '@suid/material'
import { A } from '@solidjs/router'
import { onMount } from 'solid-js'
import type { Component, JSX } from 'solid-js'
import { setPageTitle } from '../state/App'

interface OptionCardProps {
    children: JSX.Element
    featured?: boolean
    href: string
}

const OptionCard: Component<OptionCardProps> = (props) => (
    <Card
        variant="outlined"
        sx={props.featured ? { borderColor: 'primary.main', borderWidth: 2 } : undefined}
    >
        <CardActionArea
            component={A}
            href={props.href}
            sx={{
                p: props.featured ? 3 : 2,
                color: 'text.primary',
                textDecoration: 'none',
                transition: 'background-color 120ms ease, transform 80ms ease',
                '&:visited': {
                    color: 'text.primary',
                },
                '&:hover': {
                    bgcolor: 'action.hover',
                },
                '&:active': {
                    bgcolor: 'action.selected',
                    transform: 'scale(0.995)',
                },
            }}
        >
            {props.children}
        </CardActionArea>
    </Card>
)

const Home: Component = () => {
    onMount(() => {
        setPageTitle('Home')
    })

    return (
        <Stack spacing={3}>
            <div>
                <Typography variant="h5" gutterBottom>Project options</Typography>
                <Typography>
                    Use the menu to explore examples of common application layouts and, if you are an administrator, manage users and settings.
                </Typography>
            </div>

            <OptionCard href="/gridexample">
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <TableRowsIcon />
                    <Typography variant="h6">Grid Example</Typography>
                </Stack>
                <Typography>
                    Contains two groups of fields: Contact and Address. They appear side by side on larger screens, then move into one column on smaller screens with Contact first and Address below it.
                </Typography>
            </OptionCard>

            <OptionCard href="/exampletwo">
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <TableChartIcon />
                    <Typography variant="h6">Example Two</Typography>
                </Stack>
                <Typography>
                    Shows a different responsive two-column pattern. Instead of moving whole field groups like Grid Example, its individual fields flow from two columns into a single column as the screen narrows.
                </Typography>
            </OptionCard>

            <OptionCard href="/baconipsum">
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <AgricultureIcon />
                    <Typography variant="h6">Bacon Ipsum</Typography>
                </Stack>
                <Typography>
                    A placeholder page for now. Its sample text keeps the navigation route and application layout represented until this area is replaced with a functional feature.
                </Typography>
            </OptionCard>

            <OptionCard featured href="/users">
                <Typography color="primary" variant="overline">Featured working example</Typography>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <PeopleIcon color="primary" />
                    <Typography variant="h5">Users</Typography>
                </Stack>
                <Typography>
                    The project's most complete working feature manages real user data through a full set of CRUD operations. Administrators can search and filter users, create accounts, edit user details and role assignments, and delete users.
                </Typography>
            </OptionCard>

            <OptionCard href="/settings">
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <SettingsIcon />
                    <Typography variant="h6">Settings</Typography>
                </Stack>
                <Typography>
                    An administrator-only placeholder for now. It reserves a location for future application-level configuration, but it does not currently provide working settings.
                </Typography>
            </OptionCard>
        </Stack>
    )
}

export default Home
