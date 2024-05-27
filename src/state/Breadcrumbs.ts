const SESSION_KEY = 'OurBreadcrumbs'

import { createSignal } from "solid-js";

export interface VisitedPage {
    title: string
    url: string
}

const initialState = (): VisitedPage[] => {
    const persistedBreadcrumbs = localStorage.getItem(SESSION_KEY)

        if (persistedBreadcrumbs !== null) {
            return JSON.parse(persistedBreadcrumbs) as VisitedPage[]
        }

        return []
}

const [breadcrumbs, setBreadcrumbs] = createSignal<VisitedPage[]>(initialState())

export {breadcrumbs}

const isLastBreadcrumb = (pageToCheck: VisitedPage): boolean => {
    const visitedPages = breadcrumbs()
    
    if (visitedPages.length === 0) return false
    
    const lastBreadcrumb =  visitedPages[visitedPages.length - 1]

    return lastBreadcrumb.title === pageToCheck.title
        && lastBreadcrumb.url === pageToCheck.url
}

const persist = () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(breadcrumbs()))
}

export const atHome = () => {
    setBreadcrumbs([])
    persist()
}

export const firstBreadcrumb = (visitedPage: VisitedPage) => {
    setBreadcrumbs([visitedPage])
    persist()
}

export const addBreadcrumb = (visitedPage: VisitedPage) => {
    if (isLastBreadcrumb(visitedPage)) return 

    const crumbs = breadcrumbs()
    crumbs.push(visitedPage)

    setBreadcrumbs(crumbs)
    persist()
}