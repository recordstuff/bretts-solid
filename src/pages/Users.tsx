import { userClient } from "../services/UserClient"
import { PaginationResult, emptyPaginationResult } from "../models/PaginationResult"
import { UserSummary } from "../models/UserSummary"
import { Link, TableBody, TableCell, TableRow } from "@suid/material"
import OptionFilter from "../components/OptionFilter"
import { JwtRole } from "../models/Jwt"
import TextFilter from "../components/TextFilter"
import TwoElementGuide from "../components/TwoElementGuide"
import { Component, createResource, createSignal, onMount } from "solid-js"
import { setPageTitle } from "../state/App"
import { firstBreadcrumb } from "../state/Breadcrumbs"
import { showStoredSuccessMessage } from "../utils/successMessageStorage"
import { SortDirection } from "../models/SortDirection"
import { UsersSortColumn } from "../models/UsersSortColumn"
import PaginatedEntityList from "../components/PaginatedEntityList"
import SortableTableHead from "../components/SortableTableHead"
import { createTableSort } from "../utils/createTableSort"
import { DEFAULT_PAGE_SIZE } from "../constants/pagination"

const USER_SORT_COLUMNS = [
    { label: 'Id', column: UsersSortColumn.Id },
    { label: 'Display Name', column: UsersSortColumn.DisplayName },
    { label: 'Email', column: UsersSortColumn.Email },
] as const

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
    const { changeSort, sortColumn, sortDirection } = createTableSort<UsersSortColumn>(UsersSortColumn.DisplayName, () => setPage(1))

    const fetchUsersState = (): FetchUsersParams => ({
        page: page(),
        searchText: searchText(),
        roleFilter: roleFilter(),
        sortColumn: sortColumn(),
        sortDirection: sortDirection(),
    })
    const fetchUsers = ({ page, searchText, roleFilter, sortColumn, sortDirection }: FetchUsersParams): Promise<PaginationResult<UserSummary>> =>
        userClient.getUsers(page, DEFAULT_PAGE_SIZE, searchText, roleFilter, sortColumn, sortDirection)
    const [paginationResult] = createResource(fetchUsersState, fetchUsers, { initialValue: emptyPaginationResult<UserSummary>() })

    onMount(() => {
        setPageTitle('Users')
        firstBreadcrumb({title:'Users', url: '/users'})

        showStoredSuccessMessage()
    })

    return (
        <PaginatedEntityList
            addHref="/user"
            addLabel="Add User"
            filters={(
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
            )}
            paginationResult={paginationResult()}
            setPage={setPage}
        >
            <SortableTableHead
                columns={USER_SORT_COLUMNS}
                onSort={changeSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
            />
            <TableBody>
                {paginationResult().Items.map(row => (
                    <TableRow>
                        <TableCell>
                            <Link href={`/user/${row.Guid}`}>{row.Guid}</Link>
                        </TableCell>
                        <TableCell>{row.DisplayName}</TableCell>
                        <TableCell>{row.Email}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </PaginatedEntityList>
    )
}

export default Users
