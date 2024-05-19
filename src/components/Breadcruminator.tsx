import { FC } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../store"
import { Breadcrumbs, Typography } from "@mui/material"
import { Link } from "react-router-dom"

export const Breadcrumbinator: FC = () => {
    const breadcrumbs = useSelector((state: RootState) => state.breadcrumbs.visitedPages)

    return (    
        <Breadcrumbs sx={{paddingBottom: 1}}>
            <Link to='/'>
                Home
            </Link>
            {breadcrumbs.map((page, index) => {
                if (index === breadcrumbs.length - 1) {
                    return (
                        <Typography key={index}>
                            {page.title}
                        </Typography>
                    )
                }
                else {
                    return (
                        <Link to={page.url} key={index}>
                            {page.title}
                        </Link>
                    )
                }
            })}
        </Breadcrumbs>
    )
}
