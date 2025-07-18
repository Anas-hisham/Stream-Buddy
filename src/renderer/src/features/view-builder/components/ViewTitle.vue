<template>
    <div data-aos="zoom-in">
        <h1
            class="text-4xl font-bold text-center"
            :class="
                appStore.settings.displayMode === DISPLAY_MODE.DARK ? 'text-white' : 'text-gray-900'
            "
        >
            {{
                viewBuilderStore.currentViewBeingEdited
                    ? `Edit View: ${viewBuilderStore.currentViewBeingEdited.title}`
                    : TITLES.VIEW_BUILDER
            }}
        </h1>
    </div>
</template>

<script setup>
import { DISPLAY_MODE } from '../../../shared/constants/displayMode'
import { TITLES } from '../../../shared/constants/titles'
import { useAppStore } from '../../../shared/stores'
import {  useViewBuilderStore } from '../viewBuilderStore'

const appStore = useAppStore()
const viewBuilderStore = useViewBuilderStore()
</script>
