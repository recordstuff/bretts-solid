import { createSignal } from 'solid-js'
import type { Accessor } from 'solid-js'
import { SortDirection } from '../models/SortDirection'

interface TableSort<T> {
    changeSort: (column: T) => void
    sortColumn: Accessor<T>
    sortDirection: Accessor<SortDirection>
}

export const createTableSort = <T extends number>(initialColumn: T, onChange: () => void): TableSort<T> => {
    const [sortColumn, setSortColumn] = createSignal<T>(initialColumn)
    const [sortDirection, setSortDirection] = createSignal(SortDirection.Ascending)

    const changeSort = (column: T): void => {
        onChange()

        if (column === sortColumn()) {
            if (sortDirection() === SortDirection.Ascending) {
                setSortDirection(SortDirection.Descending)
            }
            else {
                setSortDirection(SortDirection.Ascending)
            }

            return
        }

        setSortColumn(() => column)
        setSortDirection(SortDirection.Ascending)
    }

    return {
        changeSort,
        sortColumn,
        sortDirection,
    }
}
