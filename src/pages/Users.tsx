import { userClient } from "../services/UserClient"
import { PaginationResult, emptyPaginationResult } from "../models/PaginationResult"
import { UserSummary } from "../models/UserSummary"
import { Button, ButtonBase, Grid, Link, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@suid/material"
import OptionFilter from "../components/OptionFilter"
import { JwtRole } from "../models/Jwt"
import Paginator from "../components/Paginator"
import TextFilter from "../components/TextFilter"
import TwoElementGuide from "../components/TwoElementGuide"
import AddIcon from '@suid/icons-material/Add';
import ArrowDownwardIcon from '@suid/icons-material/ArrowDownward';
import { Component, createResource, createSignal, For, onMount } from "solid-js"
import { setPageTitle } from "../state/App"
import { firstBreadcrumb } from "../state/Breadcrumbs"
import { A } from "@solidjs/router"
import { cancelButtonStyles } from "../styles/interactiveStyles"
import { lighten } from "@suid/material/styles"
import { appTheme } from "../theme"
import { takeSuccessMessage } from "../utils/successMessageStorage"
import { SortDirection } from "../models/SortDirection"
import { UsersSortColumn } from "../models/UsersSortColumn"
import { showSnackbar } from "../state/AppSnackbar"
import { AppSnackbarSeverity } from "../models/AppSnackbarState"

const PAGE_SIZE = 5
const USER_SORT_COLUMNS = [
    { label: 'Id', column: UsersSortColumn.Id },
    { label: 'Display Name', column: UsersSortColumn.DisplayName },
    { label: 'Email', column: UsersSortColumn.Email },
] as const

const sortableHeaderStyles = {
    borderRadius: 1,
    color: 'inherit',
    mx: -0.75,
    my: -0.25,
    px: 0.75,
    py: 0.25,
    textDecoration: 'underline',
    textDecorationThickness: '1px',
    textUnderlineOffset: '0.2em',
    transition: 'background-color 120ms ease, color 120ms ease, transform 80ms ease',
    '&:hover': {
        bgcolor: lighten(appTheme.palette.secondary.light, 0.3),
        color: 'text.primary',
    },
    '&:active': {
        bgcolor: lighten(appTheme.palette.secondary.light, 0.15),
        color: 'text.primary',
        transform: 'translateY(1px) scale(0.98)',
    },
    '&.Mui-focusVisible': {
        outline: '2px solid',
        outlineColor: 'text.primary',
        outlineOffset: '2px',
    },
    '&:hover .sort-direction-icon': {
        opacity: 0.55,
    },
}

interface FetchUsersParams {
    page: number,
    searchText: string,
    roleFilter: JwtRole,
    sortColumn: UsersSortColumn,
    sortDirection: SortDirection,
}

const Users: Component = () => {
    const [page, setPage] = createSignal(1)
    const [searchText, setSearchText] = createSignal('')
    const [roleFilter, setRoleFilter] = createSignal<JwtRole>(JwtRole.Any)
    const [sortColumn, setSortColumn] = createSignal(UsersSortColumn.DisplayName)
    const [sortDirection, setSortDirection] = createSignal(SortDirection.Ascending)

    const fetchUsersState = (): FetchUsersParams => ({
        page: page(),
        searchText: searchText(),
        roleFilter: roleFilter(),
        sortColumn: sortColumn(),
        sortDirection: sortDirection(),
    })
    const fetchUsers = ({ page, searchText, roleFilter, sortColumn, sortDirection }: FetchUsersParams): Promise<PaginationResult<UserSummary>> =>
        userClient.getUsers(page, PAGE_SIZE, searchText, roleFilter, sortColumn, sortDirection)
    const [paginationResult] = createResource(fetchUsersState, fetchUsers, { initialValue: emptyPaginationResult<UserSummary>() })

    const handleSort = (column: UsersSortColumn): void => {
        setPage(1)

        if (column === sortColumn()) {
            setSortDirection(sortDirection() === SortDirection.Ascending
                ? SortDirection.Descending
                : SortDirection.Ascending)
            return
        }

        setSortColumn(column)
        setSortDirection(SortDirection.Ascending)
    }

    onMount(() => {
        setPageTitle('Users')
        firstBreadcrumb({title:'Users', url: '/users'})

        const storedSuccessMessage = takeSuccessMessage()

        if (storedSuccessMessage !== null) {
            showSnackbar(storedSuccessMessage, AppSnackbarSeverity.Success)
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
                                <For each={USER_SORT_COLUMNS}>
                                    {({ label, column }) => {
                                        const active = (): boolean => sortColumn() === column
                                        const direction = (): 'asc' | 'desc' => sortDirection() === SortDirection.Ascending ? 'asc' : 'desc'

                                        return (
                                            <TableCell scope="col" sortDirection={active() ? direction() : false}>
                                                <ButtonBase
                                                    aria-label={`Sort by ${label} ${active() && direction() === 'asc' ? 'descending' : 'ascending'}`}
                                                    focusRipple
                                                    onClick={() => handleSort(column)}
                                                    sx={sortableHeaderStyles}
                                                >
                                                    <span>{label}</span>
                                                    <ArrowDownwardIcon
                                                        class="sort-direction-icon"
                                                        sx={{
                                                            fontSize: '1rem',
                                                            ml: 0.5,
                                                            opacity: active() ? 1 : 0,
                                                            transform: active() && direction() === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                                                            transition: 'opacity 120ms ease, transform 120ms ease',
                                                        }}
                                                    />
                                                </ButtonBase>
                                            </TableCell>
                                        )
                                    }}
                                </For>
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
        </>
    )
}

export default Users
