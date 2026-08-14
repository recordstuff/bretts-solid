import ArrowDownwardIcon from '@suid/icons-material/ArrowDownward'
import { ButtonBase, TableCell, TableHead, TableRow } from '@suid/material'
import { For } from 'solid-js'
import type { Accessor, JSX } from 'solid-js'
import { SortDirection } from '../models/SortDirection'

export interface SortColumn<T> {
    column: T
    label: string
}

interface SortableTableHeadProps<T> {
    columns: readonly SortColumn<T>[]
    onSort: (column: T) => void
    sortColumn: Accessor<T>
    sortDirection: Accessor<SortDirection>
}

function SortableTableHead<T>(props: SortableTableHeadProps<T>): JSX.Element {
    const direction = (): 'asc' | 'desc' => {
        if (props.sortDirection() === SortDirection.Descending) {
            return 'desc'
        }

        return 'asc'
    }

    return (
        <TableHead>
            <TableRow>
                <For each={props.columns}>
                    {({ label, column }) => {
                        const isActive = (): boolean => props.sortColumn() === column

                        const tableSortDirection = (): 'asc' | 'desc' | false => {
                            if (isActive()) {
                                return direction()
                            }

                            return false
                        }

                        const sortLabel = (): string => {
                            if (isActive() && direction() === 'asc') {
                                return `Sort by ${label} descending`
                            }

                            return `Sort by ${label} ascending`
                        }

                        return (
                            <TableCell scope="col" sortDirection={tableSortDirection()}>
                                <ButtonBase
                                    aria-label={sortLabel()}
                                    class="sortable-table-heading"
                                    focusRipple
                                    onClick={() => props.onSort(column)}
                                >
                                    <span>{label}</span>
                                    <ArrowDownwardIcon
                                        classList={{
                                            'sort-direction-icon': true,
                                            'sort-direction-icon-active': isActive(),
                                            'sort-direction-icon-ascending': isActive() && direction() === 'asc',
                                        }}
                                    />
                                </ButtonBase>
                            </TableCell>
                        )
                    }}
                </For>
            </TableRow>
        </TableHead>
    )
}

export default SortableTableHead
