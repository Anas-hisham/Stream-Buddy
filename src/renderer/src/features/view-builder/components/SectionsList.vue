<template>
    <div data-aos="zoom-in">
        <draggable
            v-model="newView.sections"
            tag="div"
            item-key="name"
            handle=".section-handle"
            class="space-y-6"
        >
            <template #item="{ element: section, index: sectionIndex }">
                <SectionItem
                    :section="section"
                    :sectionIndex="sectionIndex"
                    :newView="newView"
                />
            </template>
        </draggable>
    </div>
</template>

<script setup>
import draggable from 'vuedraggable'
import SectionItem from './SectionItem.vue'

import { useAppStore } from '../../../shared/stores'
import {  useViewBuilderStore } from '../viewBuilderStore'

const appStore = useAppStore()
const viewBuilderStore = useViewBuilderStore()
const props = defineProps({
    newView: Object,
})
</script>
