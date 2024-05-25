import { Breadcrumbs, Link, Typography } from "@suid/material"
import { Component } from "solid-js"

export const Breadcrumbinator: Component = () => {
    //const breadcrumbs = useSelector((state: RootState) => state.breadcrumbs.visitedPages)

    return (    
        <Breadcrumbs sx={{paddingBottom: 1}}>
            <Link href='/'>
                Home
            </Link>
            {breadcrumbs.map((page, index) => {
                if (index === breadcrumbs.length - 1) {
                    return (
                        <Typography>
                            {page.title}
                        </Typography>
                    )
                }
                else {
                    return (
                        <Link href={page.url}>
                            {page.title}
                        </Link>
                    )
                }
            })}
        </Breadcrumbs>
    )
}
