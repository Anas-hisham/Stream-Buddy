import { reactive } from 'vue'

export function useAlert() {
    const alert = reactive({
        showAlert: false,
        text: ''
    })

    function showAlert(text) {
        alert.text = text
        alert.showAlert = true
    }

    function closeAlert() {
        alert.showAlert = false
    }

    return {
        alert,
        showAlert,
        closeAlert
    }
}
