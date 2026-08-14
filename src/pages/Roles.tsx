import AddIcon from '@suid/icons-material/Add'
import ArrowDownwardIcon from '@suid/icons-material/ArrowDownward'
import { Button, ButtonBase, Grid, Link, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@suid/material'
import { lighten } from '@suid/material/styles'
import { A } from '@solidjs/router'
import { Component, createResource, createSignal, For, onMount } from 'solid-js'
import Paginator from '../components/Paginator'
import TextFilter from '../components/TextFilter'
import { AppSnackbarSeverity } from '../models/AppSnackbarState'
import { NameGuidPair } from '../models/NameGuidPair'
import { emptyPaginationResult, PaginationResult } from '../models/PaginationResult'
import { RolesSortColumn } from '../models/RolesSortColumn'
import { SortDirection } from '../models/SortDirection'
import { roleClient } from '../services/RoleClient'
import { setPageTitle } from '../state/App'
import { showSnackbar } from '../state/AppSnackbar'
import { firstBreadcrumb } from '../state/Breadcrumbs'
import { cancelButtonStyles } from '../styles/interactiveStyles'
import { appTheme } from '../theme'
import { takeSuccessMessage } from '../utils/successMessageStorage'

const PAGE_SIZE = 5
const ROLE_SORT_COLUMNS = [
    { label: 'Id', column: RolesSortColumn.Id },
    { label: 'Name', column: RolesSortColumn.Name },
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

interface FetchRolesParams {
    page: number
    searchText: string
    sortColumn: RolesSortColumn
    sortDirection: SortDirection
}

const Roles: Component = () => {
    const [page, setPage] = createSignal(1)
    const [searchText, setSearchText] = createSignal('')
    const [sortColumn, setSortColumn] = createSignal(RolesSortColumn.Name)
    const [sortDirection, setSortDirection] = createSignal(SortDirection.Ascending)

    const fetchRolesState = (): FetchRolesParams => ({
        page: page(),
        searchText: searchText(),
        sortColumn: sortColumn(),
        sortDirection: sortDirection(),
    })
    const fetchRoles = ({ page, searchText, sortColumn, sortDirection }: FetchRolesParams): Promise<PaginationResult<NameGuidPair>> =>
        roleClient.getRoles(page, PAGE_SIZE, searchText, sortColumn, sortDirection)
    const [paginationResult] = createResource(fetchRolesState, fetchRoles, { initialValue: emptyPaginationResult<NameGuidPair>() })

    const handleSort = (column: RolesSortColumn): void => {
        setPage(1)

        if (column === sortColumn()) {
            if (sortDirection() === SortDirection.Ascending) {
                setSortDirection(SortDirection.Descending)
            }
            else {
                setSortDirection(SortDirection.Ascending)
            }

            return
        }

        setSortColumn(column)
        setSortDirection(SortDirection.Ascending)
    }

    const direction = (): 'asc' | 'desc' => {
        if (sortDirection() === SortDirection.Descending) {
            return 'desc'
        }

        return 'asc'
    }

    const tableSortDirection = (column: RolesSortColumn): 'asc' | 'desc' | false => {
        if (sortColumn() === column) {
            return direction()
        }

        return false
    }

    const sortLabel = (label: string, column: RolesSortColumn): string => {
        if (sortColumn() === column && direction() === 'asc') {
            return `Sort by ${label} descending`
        }

        return `Sort by ${label} ascending`
    }

    const sortIconOpacity = (column: RolesSortColumn): number => {
        if (sortColumn() === column) {
            return 1
        }

        return 0
    }

    const sortIconTransform = (column: RolesSortColumn): string => {
        if (sortColumn() === column && direction() === 'asc') {
            return 'rotate(180deg)'
        }

        return 'rotate(0deg)'
    }

    onMount(() => {
        setPageTitle('Roles')
        firstBreadcrumb({ title: 'Roles', url: '/roles' })

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
                    href="/role"
                    startIcon={<AddIcon />}
                    sx={cancelButtonStyles}
                >
                    Add Role
                </Button>
            </Grid>
            <Stack spacing={3}>
                <TextFilter label="Search Text" searchText={searchText} setSearchText={setSearchText} />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <For each={ROLE_SORT_COLUMNS}>
                                    {({ label, column }) => (
                                        <TableCell scope="col" sortDirection={tableSortDirection(column)}>
                                            <ButtonBase
                                                aria-label={sortLabel(label, column)}
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
                                                        opacity: sortIconOpacity(column),
                                                        transform: sortIconTransform(column),
                                                        transition: 'opacity 120ms ease, transform 120ms ease',
                                                    }}
                                                />
                                            </ButtonBase>
                                        </TableCell>
                                    )}
                                </For>
                            </TableRow>
                        </TableHead>
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
                    </Table>
                </TableContainer>
                <Paginator paginationResult={paginationResult()} setPage={setPage} />
            </Stack>
        </>
    )
}

export default Roles
