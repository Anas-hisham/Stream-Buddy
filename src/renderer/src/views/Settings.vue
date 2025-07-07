<template>
    <div class="my-17">
        <div class="mx-auto relative">
            <div data-aos="zoom-in">
                <HeaderInfo />
                <UpdateInfo :displayMode="appStore.settings.displayMode" />
            </div>

            <div data-aos="zoom-in">
                <div class="grid md:grid-cols-2 gap-6 mb-8">
                    <DisplaySettings
                        :settings="appStore.settings"
                        :displayMode="appStore.settings.displayMode"
                    />
                    <SavePathInput
                        :settings="appStore.settings"
                        :folderPath="settingsStore.folderPath"
                        :selectFolder="() => settingsStore.selectFolder(showAlert)"
                        :applySavePath="() => settingsStore.applySavePath(showAlert)"
                        :displayMode="appStore.settings.displayMode"
                        :resetSavePath="() => settingsStore.resetSavePath(showAlert)"
                    />
                </div>
            </div>

            <div data-aos="zoom-in" data-aos-offset="50">
                <ActionButtons
                    :onReset="() => settingsStore.fullReset(showConfirm, showAlert)"
                    :displayMode="appStore.settings.displayMode"
                    :clearInputs="() => settingsStore.clearInputs(showConfirm, showAlert)"
                />
            </div>

            <div data-aos="zoom-in" data-aos-offset="200">
                <ManageViews
                    :views="appStore.allViews"
                    :displayMode="appStore.settings.displayMode"
                    :lastAppliedPreset="settingsStore.lastAppliedPreset"
                />
            </div>

            <div data-aos="zoom-in" data-aos-offset="200">
                <PresetManager :showAlert="showAlert" :showConfirm="showConfirm" />
            </div>
        </div>
        <Confirm
            :show="confirmDialog.show"
            :isPreset="confirmDialog.isPreset"
            :message="confirmDialog.message"
            :displayMode="appStore.settings.displayMode"
            :onCancel="handleCancel"
            :onConfirm="handleConfirm"
        />
        <Alert
            :alert="alert"
            :displayMode="appStore.settings.displayMode"
            :closeAlert="closeAlert"
        />
    </div>
</template>

<script setup>
/* -------------------- Imports -------------------- */
import { onMounted } from 'vue'
import { useAlert } from '../composables/useAlert'
import { useConfirmDialog } from '../composables/useConfirmDialog'
import { useAppStore, useSettingsStore } from '../stores/index'

import SavePathInput from '../components/settings/SavePathInput.vue'
import Alert from '../components/common/Alert.vue'
import Confirm from '../components/common/Confirm.vue'
import ManageViews from '../components/settings/ManageViews.vue'
import ActionButtons from '../components/settings/ActionButtons.vue'
import UpdateInfo from '../components/settings/UpdateInfo.vue'
import PresetManager from '../components/settings/PresetManager.vue'
import HeaderInfo from '../components/settings/HeaderInfo.vue'
import DisplaySettings from '../components/settings/DisplaySettings.vue'

/* -------------------- Store -------------------- */
const appStore = useAppStore()
const settingsStore = useSettingsStore()

/* -------------------- Composable Usage -------------------- */
const { alert, showAlert, closeAlert } = useAlert()
const { confirmDialog, showConfirm, handleCancel, handleConfirm } = useConfirmDialog()

/* -------------------- Lifecycle Hooks -------------------- */
onMounted(async () => {
    await settingsStore.loadPresets(showAlert)
})
</script>
