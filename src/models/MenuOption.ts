import type { Component } from "solid-js"
import type { JwtRole } from "./Jwt"

export interface MenuOption {
    Text: string
    Route: string
    Icon: Component
    Role: JwtRole
    ChildRoutes?: string[]
}

export const divider = Symbol("divider")

export type DrawerMenuItem = MenuOption | typeof divider
