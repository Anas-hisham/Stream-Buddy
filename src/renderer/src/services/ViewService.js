export class ViewService {
    static async loadViewCache(viewPath) {
        try {
            const result = await window.myAPI.loadViewCache(viewPath)
            if (result.success && result.data && Object.keys(result.data).length > 0) {
                return JSON.parse(JSON.stringify(result.data))
            }
            return null
        } catch (error) {
            console.error('Error loading view cache:', error)
            return null
        }
    }

    static async saveViewCache(viewPath, data) {
        try {
            const dataToSave = JSON.parse(JSON.stringify(data))
            // Clean image URLs before saving
            dataToSave.config?.forEach((section) => {
                section.lines?.forEach((line) => {
                    line.fields?.forEach((field) => {
                        if (field.type === 'image') {
                            field.value = ''
                        }
                    })
                })
            })
            await window.myAPI.saveViewCache(viewPath, dataToSave)
            return true
        } catch (error) {
            console.error('Error saving view cache:', error)
            return false
        }
    }

    static async clearViewCache(viewPath) {
        try {
            await window.myAPI.clearViewCache(viewPath)
            return true
        } catch (error) {
            console.error('Error clearing view cache:', error)
            return false
        }
    }

    static async saveViewData(viewTitle, data) {
        try {
            const result = await window.myAPI.saveViewData(viewTitle, data)
            return result
        } catch (error) {
            console.error('Error saving view data:', error)
            return { success: false, message: error.message }
        }
    }
}
