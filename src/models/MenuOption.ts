import type { Component } from "solid-js"
import { JwtRole } from "./Jwt"

export interface MenuOption {
    Text: string
    Route: string
    Icon: Component
    Role: JwtRole
    ChildRoutes?: string[]
}
