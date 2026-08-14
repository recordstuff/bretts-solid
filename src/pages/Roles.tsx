import { Link, TableBody, TableCell, TableRow } from '@suid/material'
import { Component, createResource, createSignal, For, onMount } from 'solid-js'
import PaginatedEntityList from '../components/PaginatedEntityList'
import SortableTableHead from '../components/SortableTableHead'
import TextFilter from '../components/TextFilter'
import { DEFAULT_PAGE_SIZE } from '../constants/pagination'
import { NameGuidPair } from '../models/NameGuidPair'
import { emptyPaginationResult, PaginationResult } from '../models/PaginationResult'
import { RolesSortColumn } from '../models/RolesSortColumn'
import { SortDirection } from '../models/SortDirection'
import { roleClient } from '../services/RoleClient'
import { setPageTitle } from '../state/App'
import { firstBreadcrumb } from '../state/Breadcrumbs'
import { createTableSort } from '../utils/createTableSort'
import { showStoredSuccessMessage } from '../utils/successMessageStorage'

const ROLE_SORT_COLUMNS = [
    { label: 'Id', column: RolesSortColumn.Id },
    { label: 'Name', column: RolesSortColumn.Name },
] as const

interface FetchRolesParams {
    page: number
    searchText: string
    sortColumn: RolesSortColumn
    sortDirection: SortDirection
}

const Roles: Component = () => {
    const [page, setPage] = createSignal(1)
    const [searchText, setSearchText] = createSignal('')
    const { changeSort, sortColumn, sortDirection } = createTableSort<RolesSortColumn>(RolesSortColumn.Name, () => setPage(1))

    const fetchRolesState = (): FetchRolesParams => ({
        page: page(),
        searchText: searchText(),
        sortColumn: sortColumn(),
        sortDirection: sortDirection(),
    })
    const fetchRoles = ({ page, searchText, sortColumn, sortDirection }: FetchRolesParams): Promise<PaginationResult<NameGuidPair>> =>
        roleClient.getRoles(page, DEFAULT_PAGE_SIZE, searchText, sortColumn, sortDirection)
    const [paginationResult] = createResource(fetchRolesState, fetchRoles, { initialValue: emptyPaginationResult<NameGuidPair>() })

    onMount(() => {
        setPageTitle('Roles')
        firstBreadcrumb({ title: 'Roles', url: '/roles' })

        showStoredSuccessMessage()
    })

    return (
        <PaginatedEntityList
            addHref="/role"
            addLabel="Add Role"
            filters={(
                <TextFilter label="Search Text" searchText={searchText} setSearchText={setSearchText} />
            )}
            paginationResult={paginationResult()}
            setPage={setPage}
        >
            <SortableTableHead
                columns={ROLE_SORT_COLUMNS}
                onSort={changeSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
            />
            <TableBody>
                <For each={paginationResult().Items}>
                    {(role) => (
                        <TableRow>
                            <TableCell>
                                <Link href={`/role/${role.Guid}`}>{role.Guid}</Link>
                            </TableCell>
                            <TableCell>{role.Name}</TableCell>
                        </TableRow>
                    )}
                </For>
            </TableBody>
        </PaginatedEntityList>
    )
}

export default Roles
