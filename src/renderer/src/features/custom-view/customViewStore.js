import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { toCamelCase } from '../../shared/utils/stringUtils'
import { useImageHandling } from '../../shared/composables/useImageHandling'
import { ViewService } from './services/ViewService'
import { deepClone } from '../../shared/utils/deepClone'
import { useAppStore } from '../../shared/stores'
import { PATHS } from '../../shared/constants/paths'

export const useCustomViewStore = defineStore('customView', () => {
    const editableCustomViewConfig = ref(null)
    const fieldErrors = ref({})

    const { uploadImage, loadImage, removeImage } = useImageHandling()

    const appStore = useAppStore()
    const route = useRoute()

    const currentCustomView = computed(() =>
        appStore.allViews.find((view) => view.path === route.path),
    )

    watch(currentCustomView, loadViewData, { immediate: true })
    watch(
        editableCustomViewConfig,
        () => {
            loadImageFields()
            removeErrors()
        },
        { deep: true },
    )

    async function loadViewData() {
        if (!currentCustomView.value) {
            editableCustomViewConfig.value = null
            return
        }
        try {
            const cached = await ViewService.loadViewCache(currentCustomView.value.path)
            editableCustomViewConfig.value = cached || deepClone(currentCustomView.value)
        } catch (error) {
            console.error('Error loading view data:', error)
            editableCustomViewConfig.value = deepClone(currentCustomView.value)
            window.myAPI.showErrorDialog('Failed to load view data from cache.')
        } finally {
            await loadImageFields()
        }
    }

    async function loadImageFields() {
        if (!editableCustomViewConfig.value) return
        for (const section of editableCustomViewConfig.value.config) {
            for (const line of section.lines) {
                for (const field of line.fields) {
                    if (field.type === 'image' && !field.value && field.filePath) {
                        try {
                            field.value = await loadImage(field.filePath)
                        } catch {
                            field.value = ''
                            field.filePath = ''
                        }
                    }
                }
            }
        }
    }

    function removeErrors() {
        fieldErrors.value = {}
    }

    function cleanUpImages() {
        if (!editableCustomViewConfig.value) return
        editableCustomViewConfig.value.config.forEach((section) => {
            section.lines.forEach((line) => {
                line.fields.forEach((field) => {
                    if (field.type === 'image' && field.value?.startsWith('blob:')) {
                        removeImage(field.value)
                    }
                })
            })
        })
    }

    async function saveViewCache() {
        if (!editableCustomViewConfig.value || !currentCustomView.value) return
        await ViewService.saveViewCache(currentCustomView.value.path, editableCustomViewConfig.value)
    }

    function updateFieldValue(sectionIndex, lineIndex, fieldIndex, value) {
        if (!editableCustomViewConfig.value) return
        const field =
            editableCustomViewConfig.value.config[sectionIndex].lines[lineIndex].fields[fieldIndex]
        if (field.type === 'image' && field.value?.startsWith('blob:')) removeImage(field.value)
        field.value = value
        saveViewCache()
    }

    async function uploadImageFunction(sectionIndex, lineIndex, fieldIndex) {
        const imagePath = await uploadImage()
        if (!imagePath) return
        try {
            const imageUrl = await loadImage(imagePath)
            const field =
                editableCustomViewConfig.value.config[sectionIndex].lines[lineIndex].fields[
                fieldIndex
                ]
            removeImage(field.value)
            field.value = imageUrl
            field.filePath = imagePath
            await saveViewCache()
        } catch {
            console.error('Error handling image upload')
        }
    }

    function removeImageFunction(sectionIndex, lineIndex, fieldIndex) {
        const field =
            editableCustomViewConfig.value.config[sectionIndex].lines[lineIndex].fields[fieldIndex]
        removeImage(field.value)
        field.value = ''
        field.filePath = ''
        saveViewCache()
    }

    function handleDragEnd() {
        saveViewCache()
    }

    function validateFields(errors) {
        editableCustomViewConfig.value.config.forEach((section, sIdx) => {
            section.lines.forEach((line, lIdx) => {
                const fieldNames = line.fields.map((f) => f.name.trim().toLowerCase())
                const lineErrors = { fieldsErrors: [] }
                fieldNames.forEach((name, fIdx) => {
                    if (!name) {
                        lineErrors.fieldsErrors[fIdx] = 'Field name cannot be empty.'
                    } else {
                        for (let i = fIdx + 1; i < fieldNames.length; i++) {
                            if (name === fieldNames[i]) {
                                lineErrors.fieldsErrors[fIdx] =
                                    lineErrors.fieldsErrors[fIdx] || 'Field name should be unique.'
                                lineErrors.fieldsErrors[i] = 'Field name should be unique.'
                            }
                        }
                    }
                })
                if (lineErrors.fieldsErrors.length > 0) {
                    errors.fieldsErrors[`${sIdx}-${lIdx}`] = lineErrors.fieldsErrors
                }
            })
        })
    }

    function updateReactiveErrors(errors) {
        fieldErrors.value = {}
        Object.entries(errors.fieldsErrors).forEach(([key, fieldErrorsArray]) => {
            fieldErrorsArray.forEach((msg, fIdx) => {
                if (msg) fieldErrors.value[`${key}-${fIdx}`] = msg
            })
        })
    }

    function buildStructuredData() {
        const result = { sections: [] }
        editableCustomViewConfig.value.config.forEach((section) => {
            const sectionKey = toCamelCase(section.name)
            const lines = section.lines.map((line, idx) => {
                const lineKey = `line${idx + 1}`
                const fields = {}
                line.fields.forEach((field) => {
                    const key = toCamelCase(field.name)
                    fields[key] = field.type === 'image' ? field.filePath || '' : String(field.value)
                })
                return { [lineKey]: fields }
            })
            result.sections.push({ [sectionKey]: { lines } })
        })
        return result
    }

    async function saveViewData() {
        if (!editableCustomViewConfig.value) {
            return { success: false, message: 'View configuration not loaded.' }
        }

        const errors = { fieldsErrors: {} }
        validateFields(errors)
        updateReactiveErrors(errors)

        if (Object.keys(fieldErrors.value).length > 0) {
            return { success: false, message: 'Validation errors present.' }
        }

        try {
            const structuredData = buildStructuredData()
            const result = await ViewService.saveViewData(currentCustomView.value.title, structuredData)
            if (result.success) {
                return { success: true, alertMessage: `${currentCustomView.value.title} saved successfully!` }
            } else {
                throw new Error(result.message)
            }
        } catch (error) {
            console.error('Error saving view data:', error)
            return { success: false, alertMessage: 'Failed to save view data' }
        }
    }

    async function clearData() {
        if (!editableCustomViewConfig.value) return

        editableCustomViewConfig.value.config.forEach((section) => {
            section.lines.forEach((line) => {
                line.fields.forEach((field) => {
                    if (field.type === 'image' && field.value?.startsWith('blob:'))
                        removeImage(field.value)
                    field.value = ''
                    if (field.type === 'image') field.filePath = ''
                })
            })
        })
        await saveViewCache()
    }

    async function deleteView(routerPush, cleanUpPresetViews) {
        cleanUpImages()
        await ViewService.clearViewCache(route.path)

        await cleanUpPresetViews(route.path)

        appStore.setSettings({ views: appStore.allViews.filter((view) => view.path !== route.path) })
        routerPush(PATHS.VIEW_BUILDER)
    }

    return {
        editableCustomViewConfig,
        fieldErrors,
        currentCustomView,
        loadViewData,
        cleanUpImages,
        updateFieldValue,
        uploadImageFunction,
        removeImageFunction,
        handleDragEnd,
        saveViewData,
        clearData,
        deleteView,
        removeErrors,
    }
})
