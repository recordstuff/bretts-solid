import { Breadcrumbs, Link, Typography } from "@suid/material"
import { Component } from "solid-js"
import { breadcrumbs } from "../state/Breadcrumbs"

export const Breadcrumbinator: Component = () => {
    

    return (    
        <Breadcrumbs sx={{paddingBottom: 1}}>
            <Link href='/'>
                Home
            </Link>
            {breadcrumbs().map((page, index) => {
                if (index === breadcrumbs().length - 1) {
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
