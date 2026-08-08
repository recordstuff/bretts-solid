import type { Component } from "solid-js"
import type { JwtRole } from "./Jwt"
import type { VisitedPage } from "../state/Breadcrumbs"

export interface MenuOption {
    Text: string
    Route: string
    Icon: Component
    Role: JwtRole
    Breadcrumb: VisitedPage
    ChildRoutes?: string[]
}

export const divider = Symbol("divider")

export type DrawerMenuItem = MenuOption | typeof divider
