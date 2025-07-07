<template>
    <div class="mb-10 mt-15 min-h-screen w-full overflow-y-auto transition-colors duration-200">
        <div data-aos="zoom-in">
            <ViewTitle :title="currentCustomView?.title" :displayMode="displayMode" />
        </div>
        <ViewButtons
            :displayMode="displayMode"
            :onSave="saveViewData"
            :onClear="clearData"
            :onDelete="deleteView"
            :isCustom="true"
            :editableCustomViewConfig="editableCustomViewConfig"
        />
        <div class="max-w-7xl mx-auto w-full">
            <div v-if="editableCustomViewConfig?.config?.length > 0" class="space-y-6">
                <draggable
                    v-model="editableCustomViewConfig.config"
                    tag="div"
                    item-key="name"
                    handle=".section-handle"
                    @end="handleDragEnd"
                >
                    <template #item="{ element: section, index: sectionIndex }">
                        <ViewSection
                            :section="section"
                            :sectionIndex="sectionIndex"
                            :displayMode="displayMode"
                            :layoutStyle="editableCustomViewConfig.layoutStyle"
                            :updateFieldValue="updateFieldValue"
                            :uploadImageFunction="uploadImageFunction"
                            :removeImage="removeImageFunction"
                            :handleDragEnd="handleDragEnd"
                        />
                    </template>
                </draggable>
            </div>
            <Spinner v-else />
        </div>
    </div>
    <Confirm
        :show="confirmDialog.show"
        :isPreset="confirmDialog.isPreset"
        :message="confirmDialog.message"
        :displayMode="displayMode"
        :onCancel="handleCancel"
        :onConfirm="handleConfirm"
    />
    <AlertDialog :alert="alert" :displayMode="'dark'" :closeAlert="closeAlert" />
</template>

<script setup>
import { computed, watch, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import { toCamelCase } from '../utils/stringUtils'
import { useConfirmDialog } from '../composables/useConfirmDialog'
import { useAlert } from '../composables/useAlert'
import { useImageHandling } from '../composables/useImageHandling'
import { ViewService } from '../services/ViewService'
import Confirm from '../components/common/Confirm.vue'
import AlertDialog from '../components/common/Alert.vue'
import ViewButtons from '../components/common/ViewButtons.vue'
import Spinner from '../components/common/Spinner.vue'
import ViewSection from '../components/customView/ViewSection.vue'
import ViewTitle from '../components/customView/ViewTitle.vue'

const props = defineProps({
    displayMode: String,
    allViews: Array,
    setSettings: Function,
})

const route = useRoute()
const router = useRouter()
const editableCustomViewConfig = ref(null)

// Composable functions
const { confirmDialog, showConfirm, handleCancel, handleConfirm } = useConfirmDialog()
const { alert, showAlert, closeAlert } = useAlert()
const { uploadImage, loadImage , removeImage } = useImageHandling()

// Computed properties
const currentCustomView = computed(() => {
    return props.allViews.find((view) => view.path === route.path)
})

// Methods
const updateFieldValue = (sectionIndex, lineIndex, fieldIndex, value) => {
    if (!editableCustomViewConfig.value) return

    const field =
        editableCustomViewConfig.value.config[sectionIndex].lines[lineIndex].fields[fieldIndex]

    // Clean up image URL if needed
    if (field.type === 'image' && field.value && field.value.startsWith('blob:')) {
        removeImage(field.value)
    }

    field.value = value
    saveViewCache()
}

const loadImageFields = async () => {
    if (!editableCustomViewConfig.value) return

    for (const section of editableCustomViewConfig.value.config) {
        for (const line of section.lines) {
            for (const field of line.fields) {
                if (field.type === 'image' && !field.value && field.filePath) {
                    try {
                        field.value = await loadImage(field.filePath)
                    } catch (error) {
                        console.error(`Failed to load image: ${error}`)
                        field.value = ''
                        field.filePath = ''
                    }
                }
            }
        }
    }
}

const loadViewData = async () => {
    if (!currentCustomView.value) {
        editableCustomViewConfig.value = null
        return
    }

    try {
        const cachedData = await ViewService.loadViewCache(currentCustomView.value.path)
        editableCustomViewConfig.value =
            cachedData || JSON.parse(JSON.stringify(currentCustomView.value))
        await loadImageFields()
    } catch (error) {
        console.error('Error loading view data:', error)
        editableCustomViewConfig.value = JSON.parse(JSON.stringify(currentCustomView.value))
        await loadImageFields()
    }
}

const saveViewCache = async () => {
    if (!editableCustomViewConfig.value || !currentCustomView.value) return
    await ViewService.saveViewCache(currentCustomView.value.path, editableCustomViewConfig.value)
}

const handleDragEnd = () => {
    if (!editableCustomViewConfig.value) return
    props.setSettings({
        views: props.allViews.map((view) =>
            view.path === route.path ? editableCustomViewConfig.value : view,
        ),
    })
    saveViewCache()
}

const uploadImageFunction = async (sectionIndex, lineIndex, fieldIndex) => {
    const imagePath = await uploadImage()
    if (!imagePath) return

    try {
        const imageUrl = await loadImage(imagePath)
        const field =
            editableCustomViewConfig.value.config[sectionIndex].lines[lineIndex].fields[fieldIndex]

        // Clean up previous image if exists
        removeImage(field.value)

        field.value = imageUrl
        field.filePath = imagePath

        props.setSettings({
            views: props.allViews.map((view) =>
                view.path === route.path ? editableCustomViewConfig.value : view,
            ),
        })
        await saveViewCache()
    } catch (error) {
        console.error('Error handling image:', error)
        window.myAPI.showErrorDialog('Failed to handle image')
    }
}

const removeImageFunction = (sectionIndex, lineIndex, fieldIndex) => {
    const field =
        editableCustomViewConfig.value.config[sectionIndex].lines[lineIndex].fields[fieldIndex]
    removeImage(field.value)
    field.value = ''
    field.filePath = ''

    props.setSettings({
        views: props.allViews.map((view) =>
            view.path === route.path ? editableCustomViewConfig.value : view,
        ),
    })
    saveViewCache()
}

const saveViewData = async () => {
    if (!editableCustomViewConfig.value) return

    try {
        const structuredData = {
            sections: {},
        }

        for (const section of editableCustomViewConfig.value.config) {
            const sectionKey = toCamelCase(section.name)
            structuredData.sections[sectionKey] = {}

            for (const line of section.lines) {
                for (const field of line.fields) {
                    const fieldKey = toCamelCase(field.name)
                    structuredData.sections[sectionKey][fieldKey] =
                        field.type === 'image' ? field.filePath || '' : String(field.value || '')
                }
            }
        }

        const result = await ViewService.saveViewData(currentCustomView.value.title, structuredData)

        if (result.success) {
            showAlert(`${currentCustomView.value.title} saved successfully!`)
        } else {
            throw new Error(result.message)
        }
    } catch (error) {
        console.error('Error saving view data:', error)
        showAlert('Failed to save view data')
    }
}

const clearData = async () => {
    if (!editableCustomViewConfig.value) return

    try {
        const shouldOverwrite = await showConfirm(
            `Are you sure you want to clear data in this view?`,
            false,
        )
        if (!shouldOverwrite) return

        for (const section of editableCustomViewConfig.value.config) {
            for (const line of section.lines) {
                for (const field of line.fields) {
                    if (field.type === 'image' && field.value?.startsWith('blob:')) {
                        removeImage(field.value)
                    }
                    field.value = ''
                    if (field.type === 'image') {
                        field.filePath = ''
                    }
                }
            }
        }

        props.setSettings({
            views: props.allViews.map((view) =>
                view.path === route.path ? editableCustomViewConfig.value : view,
            ),
        })
        await saveViewCache()
    } catch (error) {
        console.error('Error clearing data:', error)
        showAlert('Failed to clear data')
    }
}

const deleteView = async () => {
    try {
        const shouldOverwrite = await showConfirm(
            `Are you sure you want to delete this entire view? This action cannot be undone.`,
            false,
        )
        if (!shouldOverwrite) return

        // Clean up resources
        if (editableCustomViewConfig.value) {
            for (const section of editableCustomViewConfig.value.config) {
                for (const line of section.lines) {
                    for (const field of line.fields) {
                        if (field.type === 'image' && field.value?.startsWith('blob:')) {
                            removeImage(field.value)
                        }
                    }
                }
            }
        }

        await ViewService.clearViewCache(route.path)

        const updatedViews = props.allViews.filter((view) => view.path !== route.path)
        props.setSettings({
            views: updatedViews,
        })

        router.push('/view-builder')
    } catch (error) {
        console.error('Error deleting view:', error)
        showAlert('Failed to delete view')
    }
}

// Watchers
watch(currentCustomView, loadViewData, { immediate: true })
watch(editableCustomViewConfig, loadImageFields, { deep: true })

// Lifecycle hooks

onUnmounted(() => {
    if (!editableCustomViewConfig.value) return

    for (const section of editableCustomViewConfig.value.config) {
        for (const line of section.lines) {
            for (const field of line.fields) {
                if (field.type === 'image' && field.value?.startsWith('blob:')) {
                    removeImage(field.value)
                }
            }
        }
    }
    saveViewCache()
})
</script>
