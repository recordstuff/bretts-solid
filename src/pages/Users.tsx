import { userClient } from "../services/UserClient"
import { PaginationResult, emptyPaginationResult } from "../models/PaginationResult"
import { UserSummary } from "../models/UserSummary"
import { Button, Grid, Link, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@suid/material"
import OptionFilter from "../components/OptionFilter"
import { JwtRole } from "../models/Jwt"
import Paginator from "../components/Paginator"
import TextFilter from "../components/TextFilter"
import TwoElementGuide from "../components/TwoElementGuide"
import AddIcon from '@suid/icons-material/Add';
import { Component, createResource, createSignal, onMount } from "solid-js"
import { setPageTitle } from "../state/App"
import { firstBreadcrumb } from "../state/Breadcrumbs"
import { A } from "@solidjs/router"
import { cancelButtonStyles } from "../styles/interactiveStyles"
import AppSnackbar from "../components/AppSnackbar"
import { takeSuccessMessage } from "../utils/successMessageStorage"

const PAGE_SIZE = 5

interface FetchUsersParams {
    page: number,
    searchText: string,
    roleFilter: JwtRole,
}

const Users: Component = () => {
    const [page, setPage] = createSignal(1)
    const [searchText, setSearchText] = createSignal('')
    const [roleFilter, setRoleFilter] = createSignal<JwtRole>(JwtRole.Any)
    const [successMessage, setSuccessMessage] = createSignal<string | null>(null)

    const fetchUsersState = (): FetchUsersParams => ({ page: page(), searchText: searchText(), roleFilter: roleFilter() })
    const fetchUsers = ({ page, searchText, roleFilter }: FetchUsersParams): Promise<PaginationResult<UserSummary>> => userClient.getUsers(page, PAGE_SIZE, searchText, roleFilter)
    const [paginationResult] = createResource(fetchUsersState, fetchUsers, { initialValue: emptyPaginationResult<UserSummary>() })

    onMount(() => {
        setPageTitle('Users')
        firstBreadcrumb({title:'Users', url: '/users'})

        const storedSuccessMessage = takeSuccessMessage()

        if (storedSuccessMessage !== null) {
            setSuccessMessage(storedSuccessMessage)
        }
    })

    return (
        <>
            <Grid item marginBottom={2} marginLeft={-1} marginTop={1}>
                <Button
                    color="secondary"
                    component={A}
                    href="/user"
                    startIcon={<AddIcon />}
                    sx={cancelButtonStyles}
                >
                    Add User
                </Button>
            </Grid>
            <Stack spacing={3}>
                <TwoElementGuide
                    leftElement={<TextFilter
                        label="Search Text"
                        searchText={searchText}
                        setSearchText={setSearchText}

                    />
                    }
                    rightElement={<OptionFilter
                        label="Has Role"
                        options={[
                            { Name: 'Any', Value: JwtRole.Any },
                            { Name: 'User', Value: JwtRole.User },
                            { Name: 'Admin', Value: JwtRole.Admin },
                        ]}
                        selectedValue={roleFilter}
                        setSelectedValue={setRoleFilter}
                    />
                    } />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Id
                                </TableCell>
                                <TableCell>
                                    Display Name
                                </TableCell>
                                <TableCell>
                                    Email
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginationResult().Items.map(row => (
                                <TableRow>
                                    <TableCell>
                                        <Link href={`/user/${row.Guid}`}>{row.Guid}</Link>
                                    </TableCell>
                                    <TableCell>
                                        {row.DisplayName}
                                    </TableCell>
                                    <TableCell>
                                        {row.Email}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Paginator
                    paginationResult={paginationResult()}
                    setPage={setPage}
                />
            </Stack>
            <AppSnackbar
                message={successMessage()}
                severity="success"
                onClose={() => setSuccessMessage(null)}
            />
        </>
    )
}

export default Users
