import PrivateRoute from "../components/PrivateRoute"
import { AppBar, Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography } from "@suid/material"
import AgricultureIcon from '@suid/icons-material/Agriculture';
import HomeIcon from '@suid/icons-material/Home';
import PeopleIcon from '@suid/icons-material/People';
import SettingsIcon from '@suid/icons-material/Settings';
import TableChartIcon from '@suid/icons-material/TableChart';
import TableRowsIcon from '@suid/icons-material/TableRows';
import { MenuOption } from "../models/MenuOption";
import { JwtField, JwtRole } from "../models/Jwt";
import { jwtUtil } from "../wrappers/JwtUtil"
import { Component, createSignal } from "solid-js";
import { A, RouteSectionProps } from "@solidjs/router";

const drawerWidth = 200
let lastRole = JwtRole.Any
const menuOptions: MenuOption[] = [
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

const Layout: Component<RouteSectionProps> = ({ children }) => {
    const [pageTitle, setPageTitle] = createSignal('')

    return (
        <PrivateRoute>
            <Box sx={{ display: 'flex' }}>
                <AppBar
                    position="fixed"
                    sx={{
                        width: `calc(100% - ${drawerWidth}px)`,
                        ml: `${drawerWidth}px`
                    }}
                >
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            {pageTitle()}
                        </Typography>
                        <Box sx={{ marginLeft: 'auto' }}>
                            {localStorage.getItem(JwtField.DisplayName)}
                            <a href="/login" title='Go back to the login screen.'>
                                <Typography sx={{ fontSize: '.9em' }}>Logout</Typography>
                            </a>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="permanent"
                    anchor="left"
                >
                    <List> {/* notice the use of Fragment vs <></> since we need the key property */}
                        {menuOptions.map((menuOption) => {
                            let component = jwtUtil.hasRole(menuOption.Role) ? (
                                <>
                                    {menuOption.Role === JwtRole.Admin && lastRole === JwtRole.User && <Divider />}
                                    <ListItem disablePadding component={A} href={menuOption.Route}>
                                        <ListItemButton selected={menuOption.Route === window.location.pathname
                                            || menuOption.ChildRoutes?.some(cr => window.location.pathname.startsWith(cr))}>
                                            <ListItemIcon>
                                                <menuOption.Icon />
                                            </ListItemIcon>
                                            <ListItemText primary={menuOption.Text} />
                                        </ListItemButton>
                                    </ListItem>
                                </>
                            ) : null // fragment shorthand does not work here (listitem key)
                            lastRole = menuOption.Role
                            return component
                        })}
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
                >
                    <Stack>
                        <Toolbar />
                        {/* <Breadcrumbinator />*/}
                        {children}
                    </Stack>
                </Box>
            </Box>
        </PrivateRoute>
    )
}

export default Layout