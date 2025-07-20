<template>
    <div class="my-15">
        <ViewTitle title="View Builder" />
        <div class="max-w-7xl mx-auto w-full p-4 mt-6">
            <ViewConfiguration />
            <SectionsHeader />
            <SectionsList :newView="viewBuilderStore.newView" />
        </div>
    </div>
    <ViewButtons :onSave="createView" :saveOnly="true" />
    <Confirm
        :show="confirmDialog.show"
        :isPreset="confirmDialog.isPreset"
        :message="confirmDialog.message"
        :onCancel="handleCancel"
        :onConfirm="handleConfirm"
    />
    <Alert :alert="alert" :closeAlert="closeAlert" />
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import ViewButtons from '../../shared/components/ViewButtons.vue'
import ViewTitle from '../../shared/components/ViewTitle.vue'
import ViewConfiguration from './components/ViewConfiguration.vue'
import SectionsHeader from './components/SectionsHeader.vue'
import SectionsList from './components/SectionsList.vue'
import Alert from '../../shared/components/Alert.vue'
import Confirm from '../../shared/components/Confirm.vue'

import { useAppStore, useSettingsStore } from '../../shared/stores'
import { useViewBuilderStore } from './viewBuilderStore'
import { deepClone } from '../../shared/utils/deepClone'
import { useConfirmDialog } from '../../shared/composables/useConfirmDialog'
import { useAlert } from '../../shared/composables/useAlert'

// Stores & Composables
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const viewBuilderStore = useViewBuilderStore()
const { confirmDialog, showConfirm, handleCancel, handleConfirm } = useConfirmDialog()
const { alert, showAlert, closeAlert } = useAlert()

// Router
const router = useRouter()
const route = useRoute()

// Computed Keys
const autoSaveKey = computed(() => `autoSave_${route.query.editPath}`)

// View Creation Logic
function generateUniquePath(name) {
    const basePath = name.toLowerCase().replace(/\s+/g, '-')
    const uniqueId = Date.now().toString(36)
    return `/${basePath}-${uniqueId}`
}

function hasValidationErrors(errors) {
    return (
        errors.viewName ||
        errors.sectionsErrors.some(
            (section) =>
                section.name ||
                section.linesErrors.some((line) => line.fieldsErrors.some((fieldErr) => fieldErr)),
        )
    )
}

function buildViewToSave() {
    const isEditing = viewBuilderStore.isEditingExistingView
    const current = viewBuilderStore.currentViewBeingEdited

    return {
        title: viewBuilderStore.newView.name,
        path: isEditing ? current.path : generateUniquePath(viewBuilderStore.newView.name),
        visible: isEditing ? current.visible : true,
        layoutStyle: viewBuilderStore.newView.layoutStyle,
        config: viewBuilderStore.newView.sections.map((section) => ({
            name: section.name,
            lines: section.lines.map((line) => ({
                fields: line.fields.map((field) => ({
                    name: field.name,
                    type: field.type,
                    value: field.type === 'image' ? '' : field.value || '',
                    filePath: field.filePath || '',
                })),
            })),
        })),
    }
}

async function persistView(viewToSave) {
    const isEditing = viewBuilderStore.isEditingExistingView
    const oldPath = isEditing ? viewBuilderStore.currentViewBeingEdited.path : null

    const updatedViews = isEditing
        ? appStore.allViews.map((view) => (view.path === oldPath ? viewToSave : view))
        : [...appStore.settings.views, viewToSave]

    appStore.setSettings({ views: updatedViews })

    await window.myAPI.clearBuilderCache(autoSaveKey.value)
    await window.myAPI.saveViewCache(route.query.editPath || viewToSave.path, deepClone(viewToSave))

    await settingsStore.addViewToAllPresets({ ...viewToSave, visible: false })

    if (isEditing && viewBuilderStore.currentViewBeingEdited.title !== viewToSave.title) {
        settingsStore.updateViewNameInPresets(oldPath, viewToSave.title)
    }
}

async function createView() {
    const errors = { viewName: '', sectionsErrors: [] }

    viewBuilderStore.validateViewNameForCreation(errors)
    viewBuilderStore.validateSectionsForCreation(errors)
    viewBuilderStore.validateFieldsForCreation(errors)
    viewBuilderStore.updateReactiveErrors(errors)

    if (hasValidationErrors(errors)) {
        showAlert('Please correct the errors before saving.')
        return
    }

    if (!viewBuilderStore.hasMinimumFieldsInAllSections) {
        showAlert('You must have at least one section and one field in each section.')
        return
    }

    if (viewBuilderStore.hasEmptyLines) {
        const confirm = await showConfirm('There are empty lines. Do you want to continue?', false)
        if (!confirm) return
    }

    const viewToSave = buildViewToSave()
    await persistView(viewToSave)

    if (viewBuilderStore.currentViewBeingEdited?.visible === false) router.back()
    router.push(viewToSave.path)

    if (viewBuilderStore.isEditingExistingView) {
        viewBuilderStore.currentViewBeingEdited.title = viewToSave.title
    }

    viewBuilderStore.resetState()
}

// Auto Save
async function autoSaveView() {
    if (!viewBuilderStore.newView.name) return
    try {
        await window.myAPI.saveBuilderCache(
            autoSaveKey.value,
            JSON.stringify(viewBuilderStore.newView),
        )
    } catch (err) {
        console.error('Auto-save failed:', err)
    }
}

// Load View for Edit Mode
async function loadViewForEditing(path) {
    const view = appStore.allViews.find((v) => v.path === path)
    const cached = await window.myAPI.loadViewCache(path)

    const editingView = {
        ...cached.data,
        visible: view?.visible,
    }

    viewBuilderStore.setCurrentViewBeingEdited(deepClone(editingView))
    viewBuilderStore.setNewView({
        name: editingView.title,
        layoutStyle: editingView.layoutStyle || 'grid',
        sections: deepClone(editingView.config || []),
    })

    viewBuilderStore.resetErrors()
}

// Lifecycle & Watchers
onMounted(async () => {
    try {
        const saved = await window.myAPI.loadBuilderCache(autoSaveKey.value)
        if (saved) {
            const parsed = JSON.parse(saved)
            if (
                !route.query.editPath ||
                parsed.name === viewBuilderStore.currentViewBeingEdited?.title
            ) {
                viewBuilderStore.setNewView(parsed)
                viewBuilderStore.resetErrors()
            }
        }
    } catch (err) {
        console.error('Failed to load auto-saved data:', err)
    }
})

watch(() => viewBuilderStore.newView, autoSaveView, { deep: true })
watch(() => viewBuilderStore.newView, viewBuilderStore.resetErrors, { deep: true })
watch(
    () => route.query.editPath,
    async (path) => {
        if (path) await loadViewForEditing(path)
        else viewBuilderStore.resetState()
    },
    { immediate: true },
)
</script>
