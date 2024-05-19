import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from "react"
import { Link, useOutletContext } from "react-router-dom"
import { userClient } from "../services/UserClient"
import { PaginationResult, emptyPaginationResult } from "../models/PaginationResult"
import { UserSummary } from "../models/UserSummary"
import { doneWaiting, pleaseWait } from "../reducers/WaitSpinnerSlice"
import { firstBreadcrumb } from "../reducers/BreadcrumbsSlice"
import { useDispatch } from "react-redux"
import { Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import OptionFilter from "../components/OptionFilter"
import { JwtRole } from "../models/Jwt"
import Paginator from "../components/Paginator"
import TextFilter from "../components/TextFilter"
import TwoElementGuide from "../components/TwoElementGuide"
import AddIcon from '@mui/icons-material/Add';

const PAGE_SIZE = 5

const Users: FC = () => {
    const dispatch = useDispatch()
    const setPageTitle: Dispatch<SetStateAction<string>> = useOutletContext()
    const [paginationResult, setPaginationResult] = useState<PaginationResult<UserSummary>>(emptyPaginationResult())
    const [page, setPage] = useState(1)
    const [searchText, setSearchText] = useState('')
    const [roleFilter, setRoleFilter] = useState<JwtRole>(JwtRole.Any)

    const getUsers = useCallback(async (): Promise<void> => {
        dispatch(pleaseWait())

        const response = await userClient.getUsers(page, PAGE_SIZE, searchText, roleFilter)

        setPaginationResult(response)

        dispatch(doneWaiting())
    }, [dispatch, page, searchText, roleFilter])

    useEffect(() => {
        setPageTitle('Users')
        dispatch(firstBreadcrumb({title:'Users', url: '/users'}))
        getUsers()
    }, [setPageTitle, dispatch, getUsers])

    return (
        <>
        <Grid item marginBottom={2} marginLeft={-1} marginTop={1}>
        <IconButton component={Link} to='/user' sx={{paddingBottom: '-1'}}>
                <AddIcon/><Typography variant='body2'>Add User</Typography>
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
                            {paginationResult.Items.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Link to={`/user/${row.Guid}`}>{row.Guid}</Link>
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
                    paginationResult={paginationResult}
                    setPage={setPage}
                />
            </Stack>
        </>
    )
}

export default Users
