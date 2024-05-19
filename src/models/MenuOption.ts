import { ComponentType } from "react"
import { JwtRole } from "./Jwt"

export interface MenuOption {
    Text: string
    Route: string
    Icon: ComponentType
    Role: JwtRole
    ChildRoutes?: string[]
}