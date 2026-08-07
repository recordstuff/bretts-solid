import PrivateRoute from "../components/PrivateRoute"
import { AppBar, Box, Divider, Drawer, IconButton, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography } from "@suid/material"
import AgricultureIcon from '@suid/icons-material/Agriculture';
import HomeIcon from '@suid/icons-material/Home';
import MenuIcon from '@suid/icons-material/Menu';
import PeopleIcon from '@suid/icons-material/People';
import SettingsIcon from '@suid/icons-material/Settings';
import TableChartIcon from '@suid/icons-material/TableChart';
import TableRowsIcon from '@suid/icons-material/TableRows';
import { divider } from "../models/MenuOption";
import type { DrawerMenuItem, MenuOption } from "../models/MenuOption";
import { JwtField, JwtRole } from "../models/Jwt";
import { jwtUtil } from "../wrappers/JwtUtil"
import { createMemo, createSignal, For, Show } from "solid-js";
import type { Component } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import type { RouteSectionProps } from "@solidjs/router";
import { pageTitle } from "../state/App";
import { Breadcrumbinator } from "../components/Breadcruminator";
import { interactiveLinkStyles, mobileMenuButtonStyles } from "../styles/interactiveStyles";

const drawerWidth = 200
const menuOptions: DrawerMenuItem[] = [
    {
        Text: "Home",
        Route: "/",
        Icon: HomeIcon,
        Role: JwtRole.Any,
    },
    {
        Text: "Grid Example",
        Route: "/gridexample",
        Icon: TableRowsIcon,
        Role: JwtRole.User,
    },
    {
        Text: "Example Two",
        Route: "/exampletwo",
        Icon: TableChartIcon,
        Role: JwtRole.User,
    },
    {
        Text: "Bacon Ipsum",
        Route: "/baconipsum",
        Icon: AgricultureIcon,
        Role: JwtRole.User,
    },
    divider,
    {
        Text: "Users",
        Route: "/users",
        Icon: PeopleIcon,
        Role: JwtRole.Admin,
        ChildRoutes: ['/user']
    },
    {
        Text: "Settings",
        Route: "/settings",
        Icon: SettingsIcon,
        Role: JwtRole.Admin,
    },
]

interface DrawerContentProps {
    onNavigate: () => void
    pathname: string
}

const DrawerContent: Component<DrawerContentProps> = (props) => {
    const selectedMenuOption = createMemo(() => menuOptions.find((menuItem): menuItem is MenuOption =>
        menuItem !== divider
        && (menuItem.Route === props.pathname
            || menuItem.ChildRoutes?.some(childRoute => props.pathname.startsWith(childRoute)) === true)))

    return (
        <List>
            <For each={menuOptions}>
                {(menuItem) => {
                    if (menuItem === divider) {
                        return <Show when={jwtUtil.hasMultipleRoles()}><Divider /></Show>
                    }

                    return (
                        <Show when={jwtUtil.hasRole(menuItem.Role)}>
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={A}
                                    href={menuItem.Route}
                                    onClick={props.onNavigate}
                                    selected={menuItem === selectedMenuOption()}
                                    sx={interactiveLinkStyles}
                                >
                                    <ListItemIcon>
                                        <menuItem.Icon />
                                    </ListItemIcon>
                                    <ListItemText primary={menuItem.Text} />
                                </ListItemButton>
                            </ListItem>
                        </Show>
                    )
                }}
            </For>
        </List>
    )
}

const Layout: Component<RouteSectionProps> = (props) => {
    const location = useLocation()
    const [mobileOpen, setMobileOpen] = createSignal(false)

    const handleDrawerToggle = (): void => {
        setMobileOpen(isOpen => !isOpen)
    }

    const handleDrawerClose = (): void => {
        setMobileOpen(false)
    }

    return (
        <PrivateRoute>
            <Box sx={{ display: 'flex' }}>
                <AppBar
                    position="fixed"
                    sx={{
                        ml: { sm: `${drawerWidth}px` },
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                    }}
                >
                    <Toolbar>
                        <IconButton
                            aria-controls="mobile-navigation-drawer"
                            aria-expanded={mobileOpen()}
                            aria-label="toggle navigation menu"
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={mobileMenuButtonStyles}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            {pageTitle()}
                        </Typography>
                        <Stack
                            alignItems="flex-start"
                            spacing={0}
                            sx={{ flexShrink: 0, marginLeft: 'auto', textAlign: 'left' }}
                        >
                            <Typography component="div" sx={{ lineHeight: 1.2 }}>
                                {sessionStorage.getItem(JwtField.DisplayName)}
                            </Typography>
                            <Link
                                component={A}
                                href="/login"
                                color="inherit"
                                sx={{ fontSize: '.9em', lineHeight: 1.2 }}
                                title="Go back to the login screen."
                                underline="hover"
                            >
                                Logout
                            </Link>
                        </Stack>
                    </Toolbar>
                </AppBar>
                <Box
                    aria-label="main navigation"
                    component="nav"
                    sx={{ flexShrink: { sm: 0 }, width: { sm: drawerWidth } }}
                >
                    <Show when={mobileOpen()}>
                        <Drawer
                            id="mobile-navigation-drawer"
                            onClose={handleDrawerClose}
                            open
                            sx={{
                                display: { xs: 'block', sm: 'none' },
                                '& .MuiDrawer-paper': {
                                    boxSizing: 'border-box',
                                    width: drawerWidth,
                                },
                            }}
                            variant="temporary"
                        >
                            <DrawerContent pathname={location.pathname} onNavigate={handleDrawerClose} />
                        </Drawer>
                    </Show>
                    <Drawer
                        open
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            '& .MuiDrawer-paper': {
                                boxSizing: 'border-box',
                                width: drawerWidth,
                            },
                        }}
                        variant="permanent"
                    >
                        <DrawerContent pathname={location.pathname} onNavigate={handleDrawerClose} />
                    </Drawer>
                </Box>
                <Box
                    component="main"
                    sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
                >
                    <Stack>
                        <Toolbar />
                        <Breadcrumbinator />
                        {props.children}
                    </Stack>
                </Box>
            </Box>
        </PrivateRoute>
    )
}

export default Layout
