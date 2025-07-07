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
                    :displayMode="displayMode"
                    :validateSectionName="validateSectionName"
                    :sectionErrors="sectionErrors"
                    :removeSection="removeSection"
                    :fieldErrors="fieldErrors"
                    :validateFieldName="validateFieldName"
                    :removeField="removeField"
                    :addFieldToLine="addFieldToLine"
                    :removeLine="removeLine"
                    :addLine="addLine"
                    :newView="newView"
                />
            </template>
        </draggable>
    </div>
</template>

<script setup>
import draggable from 'vuedraggable'
import SectionItem from './SectionItem.vue'

const props = defineProps({
    displayMode: String,
    newView: Object,
    validateSectionName: Function,
    sectionErrors: Object,
    removeSection: Function,
    fieldErrors: Object,
    validateFieldName: Function,
    removeField: Function,
    addFieldToLine: Function,
    removeLine: Function,
    addLine: Function,
})
</script>
