import { Paper, Table, TableContainer } from '@suid/material'
import type { JSX, Setter } from 'solid-js'
import type { PaginationResult } from '../models/PaginationResult'
import AddEntityButton from './AddEntityButton'
import Paginator from './Paginator'

interface PaginatedEntityListProps<TEntity> {
    addHref: string
    addLabel: string
    children: JSX.Element
    filters: JSX.Element
    paginationResult: PaginationResult<TEntity>
    setPage: Setter<number>
}

const PaginatedEntityList = <TEntity,>(props: PaginatedEntityListProps<TEntity>): JSX.Element => (
    <>
        <AddEntityButton href={props.addHref} label={props.addLabel} />
        <div class="paginated-entity-list">
            {props.filters}
            <TableContainer component={Paper}>
                <Table>{props.children}</Table>
            </TableContainer>
            <Paginator paginationResult={props.paginationResult} setPage={props.setPage} />
        </div>
    </>
)

export default PaginatedEntityList
