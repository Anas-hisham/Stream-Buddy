import { PATHS } from "../constants/paths"


export const editView = (viewToEdit, router) => {
    router.push({
        path: PATHS.VIEW_BUILDER,
        query: { editPath: viewToEdit.path }
    })
}
