import { reactive } from 'vue'

export function useConfirmDialog() {
    const confirmDialog = reactive({
        show: false,
        message: '',
        isPreset: false,
        resolve: null,
    })

    function showConfirm(message, isPreset) {
        confirmDialog.message = message
        confirmDialog.show = true
        confirmDialog.isPreset = isPreset
        return new Promise((resolve) => {
            confirmDialog.resolve = resolve
        })
    }

    function handleCancel() {
        confirmDialog.show = false
        confirmDialog.isPreset = false
    }

    function handleConfirm(result) {
        confirmDialog.show = false
        confirmDialog.isPreset = false
        confirmDialog.resolve(result)
    }

    return {
        confirmDialog,
        showConfirm,
        handleCancel,
        handleConfirm
    }
}
