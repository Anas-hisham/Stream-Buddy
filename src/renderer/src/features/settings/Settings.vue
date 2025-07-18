<template>
    <div class="my-15">
        <div class="relative">
            <div data-aos="zoom-in">
                <ViewTitle title="Settings" />
                <UpdateInfo />
            </div>

            <div data-aos="zoom-in">
                <div class="grid md:grid-cols-2 gap-6 mb-8">
                    <DisplaySettings />
                    <SavePathInput
                        :selectFolder="() => settingsStore.selectFolder(showAlert)"
                        :applySavePath="() => settingsStore.applySavePath(showAlert)"
                        :resetSavePath="() => settingsStore.resetSavePath(showAlert)"
                    />
                </div>
            </div>

            <div data-aos="zoom-in" data-aos-offset="50">
                <ActionButtons
                    :onReset="() => settingsStore.fullReset(showConfirm, showAlert)"
                    :clearInputs="() => settingsStore.clearInputs(showConfirm, showAlert)"
                />
            </div>

            <div data-aos="zoom-in" data-aos-offset="200">
                <ManageViews />
            </div>

            <div data-aos="zoom-in" data-aos-offset="200">
                <PresetManager :showAlert="showAlert" :showConfirm="showConfirm" />
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
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAlert } from '../../shared/composables/useAlert'
import { useConfirmDialog } from '../../shared/composables/useConfirmDialog'
import { useSettingsStore } from '../../shared/stores'

import SavePathInput from './components/SavePathInput.vue'
import Alert from '../../shared/components/Alert.vue'
import Confirm from '../../shared/components/Confirm.vue'
import ManageViews from './components/ManageViews.vue'
import ActionButtons from './components/ActionButtons.vue'
import UpdateInfo from './components/UpdateInfo.vue'
import PresetManager from './components/PresetManager.vue'
import DisplaySettings from './components/DisplaySettings.vue'
import ViewTitle from '../../shared/components/ViewTitle.vue'

const settingsStore = useSettingsStore()

const { alert, showAlert, closeAlert } = useAlert()
const { confirmDialog, showConfirm, handleCancel, handleConfirm } = useConfirmDialog()

onMounted(async () => {
    await settingsStore.loadPresets(showAlert)
})
</script>
