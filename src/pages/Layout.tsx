import PrivateRoute from "../components/PrivateRoute"
import { AppBar, Box, Divider, Drawer, IconButton, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, SvgIcon, Toolbar, Typography } from "@suid/material"
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
import { drawerExternalLinkStyles, interactiveLinkStyles, logoutLinkStyles, mobileMenuButtonStyles } from "../styles/interactiveStyles";
import { firstBreadcrumb } from "../state/Breadcrumbs";

const drawerWidth = 200
const menuOptions: DrawerMenuItem[] = [
    {
        Text: "Home",
        Route: "/",
        Icon: HomeIcon,
        Role: JwtRole.Any,
        Breadcrumb: { title: "Home", url: "/" },
    },
    {
        Text: "Grid Example",
        Route: "/gridexample",
        Icon: TableRowsIcon,
        Role: JwtRole.User,
        Breadcrumb: { title: "Grid Example", url: "/gridexample" },
    },
    {
        Text: "Example Two",
        Route: "/exampletwo",
        Icon: TableChartIcon,
        Role: JwtRole.User,
        Breadcrumb: { title: "Example Two", url: "/exampletwo" },
    },
    {
        Text: "Bacon Ipsum",
        Route: "/baconipsum",
        Icon: AgricultureIcon,
        Role: JwtRole.User,
        Breadcrumb: { title: "Bacon Ipsum", url: "/baconipsum" },
    },
    divider,
    {
        Text: "Users",
        Route: "/users",
        Icon: PeopleIcon,
        Role: JwtRole.Admin,
        Breadcrumb: { title: "Users", url: "/users" },
        ChildRoutes: ['/user']
    },
    {
        Text: "Settings",
        Route: "/settings",
        Icon: SettingsIcon,
        Role: JwtRole.Admin,
        Breadcrumb: { title: "Settings", url: "/settings" },
    },
]

interface DrawerContentProps {
    onExternalNavigate: () => void
    onNavigate: (menuOption: MenuOption) => void
    pathname: string
}

const DrawerContent: Component<DrawerContentProps> = (props) => {
    const selectedMenuOption = createMemo(() => menuOptions.find((menuItem): menuItem is MenuOption =>
        menuItem !== divider
        && (menuItem.Route === props.pathname
            || menuItem.ChildRoutes?.some(childRoute => props.pathname.startsWith(childRoute)) === true)))

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
            <List disablePadding>
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
                                        onClick={() => props.onNavigate(menuItem)}
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
            <Stack component="footer" sx={{ mt: 'auto', px: 2, py: 2 }}>
                <Link
                    href="https://github.com/recordstuff/bretts-solid"
                    onClick={props.onExternalNavigate}
                    rel="noopener noreferrer"
                    sx={{ ...drawerExternalLinkStyles, gap: 0.5, pb: 1, pt: 0.5 }}
                    target="_blank"
                >
                    <SvgIcon aria-hidden="true" fontSize="small">
                        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.47v-1.73c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0 1 12 6.8c.85 0 1.71.12 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85v2.79c0 .25.16.56.67.46A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10" />
                    </SvgIcon>
                    GitHub Repo
                </Link>
                <Link
                    href="https://brettdrake.org/"
                    onClick={props.onExternalNavigate}
                    rel="noopener noreferrer"
                    sx={drawerExternalLinkStyles}
                    target="_blank"
                >
                    brettdrake.org
                </Link>
            </Stack>
        </Box>
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

    const handleDrawerNavigate = (menuOption: MenuOption): void => {
        firstBreadcrumb(menuOption.Breadcrumb)
        handleDrawerClose()
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
                                sx={logoutLinkStyles}
                                title="Go back to the login screen."
                                underline="none"
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
                            <DrawerContent
                                pathname={location.pathname}
                                onExternalNavigate={handleDrawerClose}
                                onNavigate={handleDrawerNavigate}
                            />
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
                        <DrawerContent
                            pathname={location.pathname}
                            onExternalNavigate={handleDrawerClose}
                            onNavigate={handleDrawerNavigate}
                        />
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
