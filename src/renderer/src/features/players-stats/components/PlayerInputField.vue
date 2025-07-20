<template>
    <div class="grid gap-2 relative">
        <label
            v-if="value !== '' && value !== null && value !== undefined"
            class="px-2 z-5 w-max absolute left-1/2 -top-2.5 -translate-x-1/2 block mb-1 text-sm font-semibold"
            :class="appStore.isDarkMode ? 'text-white bg-[#2a3444]' : 'text-black bg-white'"
        >
            {{ label }}
        </label>

        <div
            class="px-4 py-3 border relative rounded-md"
            :class="appStore.isDarkMode ? 'text-white border-white' : 'text-black border-black'"
        >
            <i
                class="pi pi-pencil pencil"
                :class="appStore.isDarkMode ? 'text-white' : 'text-black'"
            ></i>

            <input
                :type="type || 'text'"
                :value="value"
                :placeholder="placeholder"
                class="outline-hidden pl-5 w-full bg-transparent"
                :class="
                    appStore.isDarkMode
                        ? 'placeholder-white text-white'
                        : 'placeholder-black text-black'
                "
                @input="onInput($event)"
            />
        </div>
    </div>
</template>

<script setup>
import { useAppStore } from '../../../shared/stores'

const appStore = useAppStore()
const props = defineProps({
    value: [String, Number],
    label: String,
    placeholder: String,
    type: {
        type: String,
        default: 'text',
    },
    onInputChange: {
        type: Function,
        required: true,
    },
})

function onInput(event) {
    props.onInputChange(event.target.value)
}
</script>
