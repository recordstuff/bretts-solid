import { userClient } from "../services/UserClient"
import { PaginationResult, emptyPaginationResult } from "../models/PaginationResult"
import { UserSummary } from "../models/UserSummary"
import { Grid, IconButton, Link, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@suid/material"
import OptionFilter from "../components/OptionFilter"
import { JwtRole } from "../models/Jwt"
//import Paginator from "../components/Paginator"
import TextFilter from "../components/TextFilter"
import TwoElementGuide from "../components/TwoElementGuide"
import AddIcon from '@suid/icons-material/Add';
import { Component, createResource, createSignal } from "solid-js"

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

    const fetchUsersState = (): FetchUsersParams => ({page: page(), searchText: searchText(), roleFilter: roleFilter()})
    const fetchUsers = (params: FetchUsersParams): Promise<PaginationResult<UserSummary>> => userClient.getUsers(page(), PAGE_SIZE, searchText(), roleFilter())
    const [paginationResult] = createResource(fetchUsersState, fetchUsers, {initialValue: emptyPaginationResult<UserSummary>()})
    
    /*
    useEffect(() => {
        setPageTitle('Users')
        dispatch(firstBreadcrumb({title:'Users', url: '/users'}))
        getUsers()
    }, [setPageTitle, dispatch, getUsers])
*/

    return (
        <>
            <Grid item marginBottom={2} marginLeft={-1} marginTop={1}>
                <IconButton component={Link} href='/user' sx={{ paddingBottom: '-1' }}>
                    <AddIcon /><Typography variant='body2'>Add User</Typography>
                </IconButton>
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
                {/* <Paginator
                    paginationResult={paginationResult}
                    setPage={setPage}
                        /> */}
            </Stack>
        </>
    )
}

export default Users
