import { jwtUtil } from "../wrappers/JwtUtil"
import { useNavigate } from '@solidjs/router';
import { Component, JSX, onMount } from 'solid-js';

interface Props {
    children: JSX.Element;
}

const PrivateRoute: Component<Props> = ({children}) => {
    const isAuthenticated = !jwtUtil.isExpired
    const navigate = useNavigate();

    onMount(() => {
        if (!isAuthenticated) {
            navigate('/login')
        }
    })

    return (
        <>
            {isAuthenticated && children}
        </>
    )
}

export default PrivateRoute