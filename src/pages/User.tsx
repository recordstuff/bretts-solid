import { ChangeEvent, Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { roleClient } from "../services/RoleClient"
import { userClient } from "../services/UserClient"
import { UserDetail, emptyUserDetail } from "../models/UserDetail"
import { clearAllWaits, doneWaiting, pleaseWait } from "../reducers/WaitSpinnerSlice"
import { useDispatch } from "react-redux"
import { Button, Stack, TextField } from "@mui/material"
import { useParams } from "react-router-dom";
import { addBreadcrumb } from "../reducers/BreadcrumbsSlice"
import ItemsSelector from "../components/ItemsSelector"
import { NameGuidPair } from "../models/NameGuidPair"
import { useNavigate } from 'react-router-dom';
import { UserNew } from "../models/UserNew"
import { AxiosError } from "axios"
import { HTTP_STATUS_CODES } from "../services/HttpClient"

const User: FC = () => {

    const dispatch = useDispatch()
    const setPageTitle: Dispatch<SetStateAction<string>> = useOutletContext()
    const [roles, setRoles] = useState<NameGuidPair[]>([])
    const [user, setUser] = useState<UserDetail>(emptyUserDetail())
    const [password, setPassword] = useState<string>('')
    const [selectedRoles, setSelectedRoles] = useState<NameGuidPair[]>([])

    const { id } = useParams();
    const navigate = useNavigate();

    const getRoles = useCallback(async (): Promise<void> => {
        dispatch(pleaseWait())

        setRoles(await roleClient.getRoles())

        dispatch(doneWaiting())
    }, [dispatch])

    const getUser = useCallback(async (): Promise<void> => {
        if (id === undefined) return

        dispatch(pleaseWait())

        setUser(await userClient.getUser(id))

        dispatch(doneWaiting())
    }, [dispatch, id])

    useEffect(() => {
        let pageTitle
        let url = '/user'

        if (id === undefined) {
            pageTitle = 'Add User'
        }
        else {
            pageTitle = 'Edit User'
            url = `${url}/${id}`
        }

        setPageTitle(pageTitle)
        dispatch(addBreadcrumb({ title: pageTitle, url }))
        getRoles()
        getUser()
    }, [id, setPageTitle, dispatch, getRoles, getUser])

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        if (event.target.name === 'Password') {
            setPassword(event.target.value)
            return;
        }

        let newUser = { ...user }
        newUser[event.target.name as keyof UserDetail] = event.target.value as any
        setUser(newUser)
    }

    const upsert = async (): Promise<void> => {
        dispatch(pleaseWait())

        if (id === undefined) {
            const newUser: UserNew = { ...user, Password: password }
            newUser.Roles = selectedRoles

            try {
                const userDetail = await userClient.insertUser(newUser)
                navigate(`/user/${userDetail.Guid}`)
            }
            catch (ex: unknown) {
                dispatch(clearAllWaits())
                if (ex instanceof AxiosError 
                 && ex.response?.status === HTTP_STATUS_CODES.CONFLICT) {
                    // email already exists
                    return
                }

                throw ex                
            }
        }
        else {
            const newUser = { ...user }
            newUser.Roles = selectedRoles
            
            setUser(await userClient.updateUser(newUser))
        }

        dispatch(doneWaiting())
    }

    const handleCancel = (): void => {
        if (id === undefined) {
            navigate(-1)
        }
        else {
            getUser()
        }
    }

    const handleDelete = (): void => {
    }

    return (
        <Stack margin={2} spacing={4}>
            {id !== undefined && <TextField fullWidth label="Id" value={user.Guid} disabled />}
            <TextField fullWidth label="Display Name" name='DisplayName' onChange={handleChange} value={user.DisplayName} />
            <TextField fullWidth label="Email" name='Email' onChange={handleChange} value={user.Email} />
            <TextField fullWidth label="Phone" name='Phone' onChange={handleChange} value={user.Phone} />
            {id === undefined && <TextField fullWidth label="Password" name='Password' onChange={handleChange} value={password} />}
            <ItemsSelector
                label="Roles"
                allItems={roles}
                initiallySelectedItems={user.Roles}
                selected={selectedRoles}
                setSelected={setSelectedRoles}
            />
            <Stack direction='row' spacing={2}>
                <Button onClick={upsert} color='primary' variant="contained">{id === undefined ? 'Add' : 'Save'}</Button>
                <Button color="secondary" onClick={handleCancel}>Cancel</Button>
                {id !== undefined && <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>}
            </Stack>
        </Stack>
    )
}

export default User
