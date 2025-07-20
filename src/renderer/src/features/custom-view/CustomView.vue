<template>
    <div class="my-15 min-h-screen w-full">
        <ViewTitle :title="customViewStore.currentCustomView?.title" />
        <ViewButtons
            :onSave="handleSaveViewData"
            :onClear="handleClearData"
            :onDelete="handleDeleteView"
            :isCustom="true"
            :editableCustomViewConfig="customViewStore.editableCustomViewConfig"
        />
        <div class="max-w-7xl mx-auto w-full">
            <div
                v-if="customViewStore.editableCustomViewConfig?.config?.length > 0"
                class="space-y-6"
            >
                <draggable
                    v-model="customViewStore.editableCustomViewConfig.config"
                    tag="div"
                    item-key="name"
                    handle=".section-handle"
                    @end="customViewStore.handleDragEnd"
                >
                    <template #item="{ element: section, index: sectionIndex }">
                        <ViewSection
                            :section="section"
                            :sectionIndex="sectionIndex"
                            :handleDragEnd="customViewStore.handleDragEnd"
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
        :onCancel="handleCancel"
        :onConfirm="handleConfirm"
    />

    <Alert :alert="alert" :closeAlert="closeAlert" />
</template>

<script setup>
import { onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import { useConfirmDialog } from '../../shared/composables/useConfirmDialog'
import { useAlert } from '../../shared/composables/useAlert'
import { useCustomViewStore } from './customViewStore'
import { useSettingsStore } from '../../shared/stores'
import Confirm from '../../shared/components/Confirm.vue'
import Alert from '../../shared/components/Alert.vue'
import ViewButtons from '../../shared/components/ViewButtons.vue'
import Spinner from '../../shared/components/Spinner.vue'
import ViewSection from './components/ViewSection.vue'
import ViewTitle from './components/ViewTitle.vue'

const customViewStore = useCustomViewStore()
const settingsStore = useSettingsStore()
const router = useRouter()

const { confirmDialog, showConfirm, handleCancel, handleConfirm } = useConfirmDialog()
const { alert, showAlert, closeAlert } = useAlert()

onUnmounted(() => {
    customViewStore.cleanUpImages()
})

async function handleSaveViewData() {
    const result = await customViewStore.saveViewData()
    if (result.success) {
        showAlert(result.alertMessage)
    } else {
        showAlert(
            result.alertMessage ||
                'Failed to save view data due to validation errors or an unexpected issue.',
        )
    }
}

async function handleClearData() {
    const confirmed = await showConfirm('Are you sure you want to clear data in this view?', false)
    if (confirmed) {
        await customViewStore.clearData()
        showAlert('View data cleared!')
    }
}

async function handleDeleteView() {
    const confirmed = await showConfirm(
        'Are you sure you want to delete this entire view? This action cannot be undone.',
        false,
    )
    if (confirmed) {
        await customViewStore.deleteView(router.push, settingsStore.cleanUpPresetViews)
    }
}
</script>
