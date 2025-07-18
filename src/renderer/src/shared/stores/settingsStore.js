// stores/settingsStore.js
import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useAppStore } from './index'

export const useSettingsStore = defineStore('settingsStore', () => {
    /* -------------------- Store -------------------- */
    const appStore = useAppStore()

    /* -------------------- Reactive State -------------------- */
    const folderPath = ref('')
    const newPresetName = ref('')
    const editingName = ref(null)
    const editedPresetName = ref('')
    const updatingPreset = ref(null)
    const tempUpdatedViews = ref([])
    const lastAppliedPreset = ref(null)
    const presets = ref({})

    /* -------------------- Computed Properties -------------------- */
    const presetList = computed(() =>
        Object.entries(presets.value).map(([name, views]) => ({ name, views })),
    )

    /* -------------------- File Path Management -------------------- */
    async function selectFolder(showAlertCallback) {
        try {
            const path = await window.myAPI.selectFolder()
            if (path) {
                folderPath.value = path
                appStore.settings.savePath = path
                await applySavePath(showAlertCallback)
            }
        } catch (error) {
            handleError('Error selecting folder:', error, showAlertCallback)
        }
    }

    async function applySavePath(showAlertCallback) {
        try {
            const pathToApply = appStore.settings.savePath.trim()
            await window.myAPI.setCustomSavePath(pathToApply)
            if (showAlertCallback) showAlertCallback('Save path updated successfully')
        } catch (error) {
            handleError('Error updating save path:', error, showAlertCallback)
        }
    }

    async function resetSavePath(showAlertCallback) {
        try {
            await window.myAPI.setCustomSavePath('')
            const defaultPath = await window.myAPI.getDefaultSavePath()
            appStore.settings.savePath = defaultPath
            folderPath.value = defaultPath
            if (showAlertCallback) showAlertCallback('Save path reset to default.')
        } catch (error) {
            handleError('Error resetting save path:', error, showAlertCallback)
        }
    }

    /* -------------------- Settings Management -------------------- */
    async function fullReset(showConfirmCallback, showAlertCallback) {
        try {
            const shouldReset = await showConfirmCallback('Are you sure you want to reset all settings?')
            if (!shouldReset) return

            await appStore.resetSettings()
            await window.myAPI.clearLastAppliedPreset()
            resetLocalState()
            if (showAlertCallback) showAlertCallback('All settings reset to default.')
        } catch (error) {
            handleError('Full reset failed:', error, showAlertCallback)
        }
    }

    function resetLocalState() {
        newPresetName.value = ''
        editedPresetName.value = ''
        editingName.value = null
        updatingPreset.value = null
        tempUpdatedViews.value = []
        folderPath.value = ''
        lastAppliedPreset.value = null
    }

    async function clearInputs(showConfirmCallback, showAlertCallback) {
        try {
            const shouldClear = await showConfirmCallback('Are you sure you want to clear all inputs data?')
            if (shouldClear) {
                await window.myAPI.clearDataCache()
                if (showAlertCallback) showAlertCallback('Inputs cleared successfully')
            }
        } catch (error) {
            handleError('Failed to clear cache:', error, showAlertCallback)
        }
    }

    /* -------------------- Preset Management -------------------- */
    async function loadPresets(showAlertCallback) {
        try {
            const savedPresets = (await window.myAPI.getPresets()) || {}
            presets.value = savedPresets

            await handleLastAppliedPreset(showAlertCallback)
            await initializeSavePath(showAlertCallback)
        } catch (error) {
            handleError('Error loading presets:', error, showAlertCallback)
        }
    }

    async function handleLastAppliedPreset(showAlertCallback) {
        try {
            lastAppliedPreset.value = (await window.myAPI.getLastAppliedPreset()) || ''
        } catch (error) {
            handleError('Error loading last preset:', error, showAlertCallback)
            lastAppliedPreset.value = ''
        }
    }

    async function initializeSavePath(showAlertCallback) {
        if (window.myAPI?.getDefaultSavePath) {
            const path = await window.myAPI.getDefaultSavePath()
            const stringPath = typeof path === 'string' ? path : path?.customSavePath || ''
            appStore.settings.savePath = stringPath
            folderPath.value = stringPath
        }
    }

    async function savePreset(name, viewsToSave, showAlertCallback) {
        if (!name.trim()) return false

        try {
            // Create a clean copy with all path information preserved
            const cleanViews = viewsToSave.map(view => ({
                title: view.title,
                path: view.path, // Preserve the original path
                visible: view.visible
            }));

            await window.myAPI.savePreset(name.trim(), cleanViews)
            presets.value[name] = cleanViews
            if (newPresetName.value === name) newPresetName.value = ''
            return true
        } catch (error) {
            handleError('Error saving preset:', error, showAlertCallback)
            return false
        }
    }

    async function handleSavePreset(showConfirmCallback, showAlertCallback) {
        updatingPreset.value = ""
        const currentViewsForPreset = appStore.allViews.map(view => ({
            title: view.title,
            path: view.path,
            visible: view.visible
        }));

        if (lastAppliedPreset.value) {
            const shouldOverwrite = await showConfirmCallback(
                `Update "${lastAppliedPreset.value}" with current visibility?`,
                true,
            )
            if (shouldOverwrite) {
                await savePreset(lastAppliedPreset.value, currentViewsForPreset, showAlertCallback)
                if (showAlertCallback) showAlertCallback(`Preset "${lastAppliedPreset.value}" updated`)
                return
            }
        }

        if (!newPresetName.value.trim()) {
            if (showAlertCallback) showAlertCallback('Please enter a name for the new preset')
            return
        }

        const presetName = newPresetName.value.trim()
        // Only save and apply if it's a new preset being created, not if it already exists implicitly.
        if (!presets.value[presetName] && await savePreset(presetName, currentViewsForPreset, showAlertCallback)) {
            await applyPreset(presetName, showAlertCallback)
            if (showAlertCallback) showAlertCallback(`New preset "${presetName}" created and applied`)
            newPresetName.value = ''
        } else if (presets.value[presetName]) {
            // If the preset name already exists, suggest updating it.
            if (showAlertCallback) showAlertCallback(`Preset "${presetName}" already exists. Use the "Update" button to modify it.`)
        }
    }

    async function applyPreset(name, showAlertCallback) {
        try {
            const preset = presets.value[name]
            if (!preset) {
                if (showAlertCallback) showAlertCallback('Preset not found')
                return
            }

            lastAppliedPreset.value = name
            await window.myAPI.setLastAppliedPreset(name)
            applyViewsFromPreset(preset)
        } catch (error) {
            handleError('Error applying preset:', error, showAlertCallback)
        }
    }

    function applyViewsFromPreset(presetViews) {
        const updatedAppViews = appStore.allViews.map(appView => {
            // Match by path, not title
            const presetView = presetViews.find(pView => pView.path === appView.path);
            if (presetView) {
                return { ...appView, visible: presetView.visible, title: presetView.title }; // Also update title
            }
            return appView;
        });
        appStore.setSettings({ ...appStore.settings, views: updatedAppViews });
    }

    async function applyCurrentPreset(presetName) {
        const preset = presets.value[presetName]
        if (!preset) return

        lastAppliedPreset.value = presetName
        await window.myAPI.setLastAppliedPreset(presetName)
        applyViewsFromPreset(preset)
    }

    async function applyPresetFromButton(presetName, showAlertCallback) {
        await applyCurrentPreset(presetName);
        if (showAlertCallback) showAlertCallback(`Preset "${presetName}" has been applied.`)
    }

    async function deletePreset(name, showAlertCallback, showConfirmCallback) {
        try {
            const shouldDelete = await showConfirmCallback(
                `Are you sure to delete "${name}" preset?`
            )
            if (shouldDelete) {
                if (lastAppliedPreset.value === name) {
                    lastAppliedPreset.value = ''
                    await window.myAPI.clearLastAppliedPreset()
                    const allViewsVisible = appStore.allViews.map(view => ({
                        ...view,
                        visible: true
                    }));
                    appStore.setSettings({ ...appStore.settings, views: allViewsVisible });
                }
                await window.myAPI.deletePreset(name)
                await loadPresets(showAlertCallback)
            }
        } catch (error) {
            handleError('Error deleting preset:', error, showAlertCallback)
        }
    }

    /* -------------------- Preset Editing -------------------- */
    // Synchronize views based on path
    function synchronizePresetViews(presetViews) {
        const existingAppViewPaths = new Set(appStore.allViews.map(view => view.path));
        return presetViews.filter(presetView => existingAppViewPaths.has(presetView.path));
    }

    function startUpdatingPreset(preset) {
        updatingPreset.value = preset.name
        // Filter out views that don't exist in appStore.allViews and create clean copies
        tempUpdatedViews.value = preset.views
            .filter(presetView => appStore.allViews.some(appView => appView.path === presetView.path))
            .map(view => ({
                title: view.title,
                path: view.path,
                visible: view.visible
            }));
    }

    function cancelUpdatePreset() {
        updatingPreset.value = null
        tempUpdatedViews.value = []
    }

    async function confirmUpdatePreset(name, showAlertCallback) {
        if (!name.trim() || !tempUpdatedViews.value.length) return;

        try {
            // Create a clean copy of the views data
            const cleanViews = tempUpdatedViews.value.map(view => ({
                title: view.title,
                path: view.path,
                visible: view.visible
            }));

            // Save the updated preset
            await savePreset(name, cleanViews, showAlertCallback);

            // If this is the currently applied preset, update the views
            if (lastAppliedPreset.value === name) {
                applyViewsFromPreset(cleanViews);
            }

            updatingPreset.value = null;
            tempUpdatedViews.value = [];
            await loadPresets(showAlertCallback);

            if (showAlertCallback) showAlertCallback(`Preset "${name}" updated`);
        } catch (error) {
            handleError('Error updating preset:', error, showAlertCallback);
        }
    }

    function startRenaming(name) {
        editingName.value = name
        editedPresetName.value = name
    }

    function cancelRename() {
        editingName.value = null
        editedPresetName.value = ''
    }

    async function confirmRename(oldName, showAlertCallback) {
        const newName = editedPresetName.value.trim()
        if (!newName) return

        try {
            await window.myAPI.renamePreset(oldName, newName)
            if (lastAppliedPreset.value === oldName) {
                lastAppliedPreset.value = newName
                await window.myAPI.setLastAppliedPreset(newName)
            }
            await loadPresets(showAlertCallback)
            cancelRename()
        } catch (error) {
            handleError('Error renaming preset:', error, showAlertCallback)
        }
    }

    // NEW FUNCTION: Update view name in all presets
    async function updateViewNameInPresets(viewPath, newViewTitle) {
        try {
            const updatedPresets = { ...presets.value };
            let presetsChanged = false;

            for (const presetName in updatedPresets) {
                const presetViews = updatedPresets[presetName];
                const viewIndex = presetViews.findIndex(view => view.path === viewPath);

                if (viewIndex !== -1) {
                    // Update the title if it's different
                    if (presetViews[viewIndex].title !== newViewTitle) {
                        presetViews[viewIndex] = { ...presetViews[viewIndex], title: newViewTitle };
                        presetsChanged = true;
                    }
                }
            }

            if (presetsChanged) {
                // Save all affected presets
                await Promise.all(
                    Object.entries(updatedPresets).map(([name, views]) =>
                        window.myAPI.savePreset(name, JSON.parse(JSON.stringify(views)))
                    )
                );
                // Update the local store state
                presets.value = updatedPresets;
            }
        } catch (error) {
            handleError('Error updating view name in presets:', error);
        }
    }

    /* -------------------- Error Handling -------------------- */
    function handleError(message, error, showAlertCallback = null) {
        console.error(message, error)
        window.myAPI.logError(`${message} ${error.message}`)
        if (showAlertCallback) {
            showAlertCallback(message.split(':')[0] + ' - see console for details')
        }
    }

    /* -------------------- Watchers -------------------- */
    watch(
        () => appStore.settings.savePath,
        async (newPath) => {
            const actualPath = typeof newPath === 'string'
                ? newPath
                : newPath?.customSavePath || newPath?.path || '';

            if (typeof actualPath === 'string' && actualPath.trim() === '') {
                await window.myAPI.setCustomSavePath('');
            }
        }
    )

    async function cleanUpPresetViews(deletedViewPath) {
        try {
            // Get the title of the view being deleted
            const deletedView = appStore.allViews.find(view => view.path === deletedViewPath);
            if (!deletedView) return;

            // Create a shallow copy of presets to modify
            const updatedPresets = { ...presets.value };

            // Clean up each preset
            for (const [presetName, views] of Object.entries(updatedPresets)) {
                // Filter out the deleted view and create a new array, matching by path
                updatedPresets[presetName] = views.filter(view => {
                    return view.path !== deletedViewPath; // Use path for comparison
                });
            }

            // Save all updated presets
            await Promise.all(
                Object.entries(updatedPresets).map(([name, views]) =>
                    window.myAPI.savePreset(name, JSON.parse(JSON.stringify(views)))
                )
            );

            // Update local state
            presets.value = updatedPresets;
        } catch (error) {
            handleError('Error cleaning up presets:', error);
        }
    }
    async function addViewToAllPresets(newView) {
        try {
            const updatedPresets = { ...presets.value };
            let presetsChanged = false;

            for (const presetName in updatedPresets) {
                const presetViews = updatedPresets[presetName];

                // Check if view already exists in preset (by path)
                const viewExists = presetViews.some(view => view.path === newView.path);

                if (!viewExists) {
                    // Add the view but with visible: false for presets
                    presetViews.push({
                        title: newView.title,
                        path: newView.path,
                        visible: false // This ensures it's not visible in presets by default
                    });
                    presetsChanged = true;
                }
            }

            if (presetsChanged) {
                // Save all updated presets
                await Promise.all(
                    Object.entries(updatedPresets).map(([name, views]) =>
                        window.myAPI.savePreset(name, JSON.parse(JSON.stringify(views)))
                    )
                );
                // Update local state
                presets.value = updatedPresets;
            }
        } catch (error) {
            handleError('Error adding view to presets:', error);
        }
    }
    return {
        folderPath,
        newPresetName,
        editingName,
        editedPresetName,
        updatingPreset,
        tempUpdatedViews,
        lastAppliedPreset,
        presets,
        presetList,
        selectFolder,
        applySavePath,
        resetSavePath,
        fullReset,
        clearInputs,
        loadPresets,
        handleSavePreset,
        applyCurrentPreset,
        applyPresetFromButton,
        deletePreset,
        startUpdatingPreset,
        cancelUpdatePreset,
        confirmUpdatePreset,
        startRenaming,
        cancelRename,
        confirmRename,
        handleError,
        cleanUpPresetViews,
        updateViewNameInPresets,
        addViewToAllPresets,

    }
})
