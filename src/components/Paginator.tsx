
//import { Grid, Pagination, Typography } from '@suid/material';
import { Grid, Typography } from '@suid/material';
import { PaginationResult } from '../models/PaginationResult';
import { Component } from 'solid-js';

export interface Props {
    paginationResult: PaginationResult<Object>
    // setPage: Dispatch<SetStateAction<number>>
}

const Paginator: Component<Props> = ({ paginationResult /* , setPage */ }) => {
/*
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    }
*/
    return (
        <Grid container direction='column' alignItems='center'>
            <Grid item>
                <Typography>Page {paginationResult.Page} of {paginationResult.PageCount}</Typography>
            </Grid>
            {/* <Grid item paddingTop={2}>
                <Pagination
                    count={paginationResult.PageCount}
                    showFirstButton
                    showLastButton
                    onChange={handleChange}
                />
    </Grid>*/}
        </Grid>
    )
}

export default Paginator