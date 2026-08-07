import { Grid, Pagination, Typography } from '@suid/material'
import type { PaginationResult } from '../models/PaginationResult'
import type { Component, Setter } from 'solid-js'

export interface Props {
    paginationResult: PaginationResult<unknown>
    setPage: Setter<number>
}

const Paginator: Component<Props> = (props) => {
    return (
        <Grid container direction='column' alignItems='center'>
            <Grid item>
                <Typography>Page {props.paginationResult.Page} of {props.paginationResult.PageCount}</Typography>
            </Grid>
            <Grid item paddingTop={2}>
                <Pagination
                    count={props.paginationResult.PageCount}
                    page={Math.max(1, props.paginationResult.Page)}
                    showFirstButton
                    showLastButton
                    onChange={(_, value) => props.setPage(value)}
                />
            </Grid>
        </Grid>
    )
}

export default Paginator
