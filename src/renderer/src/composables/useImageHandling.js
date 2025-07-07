export function useImageHandling() {
    const uploadImage = async (filters = [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] }]) => {
        try {
            const result = await window.myAPI.openFileDialog({ filters })
            if (result.canceled || !result.filePaths.length) return null
            return result.filePaths[0]
        } catch (error) {
            console.error('Error opening file dialog:', error)
            window.myAPI.showErrorDialog('Failed to open image dialog')
            return null
        }
    }

    const loadImage = async (path) => {
        try {
            const fileData = await window.myAPI.readFile(path)
            const blob = new Blob([fileData])
            return URL.createObjectURL(blob)
        } catch (error) {
            console.error('Error loading image:', error)
            window.myAPI.showErrorDialog('Failed to load image')
            return null
        }
    }

    const removeImage = (imageUrl) => {
        if (imageUrl && imageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(imageUrl)
        }
    }

    return {
        uploadImage,
        loadImage,
        removeImage
    }
}
