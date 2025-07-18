import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAppStore } from '../../shared/stores'

export const useViewBuilderStore = defineStore('viewBuilder', () => {
    // STATE
    const newView = ref(createEmptyView())
    const viewNameError = ref('')
    const sectionErrors = ref({})
    const fieldErrors = ref({})
    const currentViewBeingEdited = ref(null)

    // Constants for error messages
    const ERROR_MESSAGES = {
        VIEW_NAME_EMPTY: 'View name cannot be empty.',
        VIEW_NAME_EXISTS: 'This view name already exists. Please choose a unique name.',
        SECTION_NAME_EMPTY: 'Section name cannot be empty.',
        SECTION_NAME_EXISTS: 'Section name must be unique.',
        FIELD_NAME_EMPTY: 'Field name cannot be empty.',
        FIELD_NAME_EXISTS: 'Field name should be unique.'
    }

    // Factory functions
    function createEmptyView() {
        return {
            name: '',
            sections: [createEmptySection()],
            layoutStyle: 'grid'
        }
    }

    function createEmptySection() {
        return {
            name: '',
            lines: [createEmptyLine()]
        }
    }

    function createEmptyLine() {
        return {
            fields: [createEmptyField()]
        }
    }

    function createEmptyField() {
        return {
            name: '',
            type: 'text'
        }
    }

    // Helper functions
    function getFieldErrorKey(sectionIndex, lineIndex, fieldIndex) {
        return `${sectionIndex}-${lineIndex}-${fieldIndex}`
    }

    function getTrimmedName(name) {
        return name.trim().toLowerCase()
    }

    function isEmptyString(value) {
        return value.trim() === ''
    }

    // ACTIONS
    function setNewView(view) {
        newView.value = view
    }

    function setCurrentViewBeingEdited(view) {
        currentViewBeingEdited.value = view
    }

    function resetState() {
        newView.value = createEmptyView()
        currentViewBeingEdited.value = null
        resetErrors()
    }

    function resetErrors() {
        viewNameError.value = ''
        sectionErrors.value = {}
        fieldErrors.value = {}
    }

    // Section/Line/Field Operations
    function addSection() {
        newView.value.sections.push(createEmptySection())
    }

    function removeSection(index) {
        newView.value.sections.splice(index, 1)
        adjustSectionErrorsAfterRemoval(index)
    }

    function adjustSectionErrorsAfterRemoval(removedIndex) {
        const newSectionErrors = {}
        for (const key in sectionErrors.value) {
            const idx = parseInt(key)
            if (idx < removedIndex) {
                newSectionErrors[key] = sectionErrors.value[key]
            } else if (idx > removedIndex) {
                newSectionErrors[idx - 1] = sectionErrors.value[key]
            }
        }
        sectionErrors.value = newSectionErrors
        cleanupFieldErrorsBySection(removedIndex)
    }

    function cleanupFieldErrorsBySection(sectionIndex) {
        const newErrors = {}
        for (const key in fieldErrors.value) {
            const [sIdx, lIdx, fIdx] = key.split('-').map(Number)
            if (sIdx === sectionIndex) continue

            if (sIdx > sectionIndex) {
                newErrors[`${sIdx - 1}-${lIdx}-${fIdx}`] = fieldErrors.value[key]
            } else {
                newErrors[key] = fieldErrors.value[key]
            }
        }
        fieldErrors.value = newErrors
    }

    function addLine(sectionIndex) {
        newView.value.sections[sectionIndex].lines.push(createEmptyLine())
    }

    function removeLine(sectionIndex, lineIndex) {
        newView.value.sections[sectionIndex].lines.splice(lineIndex, 1)
        cleanupFieldErrors(sectionIndex, lineIndex)
    }

    function addFieldToLine(sectionIndex, lineIndex) {
        newView.value.sections[sectionIndex].lines[lineIndex].fields.push(createEmptyField())
    }

    function removeField(sectionIndex, lineIndex, fieldIndex) {
        newView.value.sections[sectionIndex].lines[lineIndex].fields.splice(fieldIndex, 1)
        delete fieldErrors.value[getFieldErrorKey(sectionIndex, lineIndex, fieldIndex)]
    }

    function cleanupFieldErrors(sectionIndex, lineIndex) {
        const newErrors = {}
        for (const key in fieldErrors.value) {
            const [sIdx, lIdx, fIdx] = key.split('-').map(Number)
            if (sIdx === sectionIndex && lIdx === lineIndex) continue

            if (sIdx === sectionIndex && lIdx > lineIndex) {
                newErrors[`${sIdx}-${lIdx - 1}-${fIdx}`] = fieldErrors.value[key]
            } else {
                newErrors[key] = fieldErrors.value[key]
            }
        }
        fieldErrors.value = newErrors
    }

    // VALIDATION ACTIONS
    function validateViewName() {
        const name = newView.value.name.trim()
        viewNameError.value = getViewNameError(name, isViewNameUnique.value)
    }

    function validateSectionName(sectionIndex) {
        const section = newView.value.sections[sectionIndex]
        const trimmedName = getTrimmedName(section.name)
        const error = getSectionNameError(sectionIndex, trimmedName, newView.value.sections)

        if (error) {
            sectionErrors.value[sectionIndex] = { nameError: error }
        } else {
            delete sectionErrors.value[sectionIndex]
        }
    }

    function validateFieldName(sectionIndex, lineIndex, fieldIndex) {
        const field = newView.value.sections[sectionIndex].lines[lineIndex].fields[fieldIndex]
        const key = getFieldErrorKey(sectionIndex, lineIndex, fieldIndex)
        const error = getFieldNameError(
            field,
            sectionIndex,
            lineIndex,
            fieldIndex,
            newView.value.sections
        )

        if (error) {
            fieldErrors.value[key] = error
        } else {
            delete fieldErrors.value[key]
        }
    }

    function updateReactiveErrors(errors) {
        viewNameError.value = errors.viewName || ''
        sectionErrors.value = {}
        fieldErrors.value = {}

        errors.sectionsErrors.forEach((sectionError, sectionIndex) => {
            if (sectionError.name) {
                sectionErrors.value[sectionIndex] = { nameError: sectionError.name }
            }

            if (sectionError.linesErrors?.length) {
                sectionError.linesErrors.forEach((lineError, lineIndex) => {
                    if (lineError?.fieldsErrors?.length) {
                        lineError.fieldsErrors.forEach((msg, fieldIndex) => {
                            if (msg) {
                                const key = getFieldErrorKey(sectionIndex, lineIndex, fieldIndex)
                                fieldErrors.value[key] = msg
                            }
                        })
                    }
                })
            }
        })
    }

    // GETTERS (computed properties)
    const appStore = useAppStore()

    const isEditingExistingView = computed(() => !!currentViewBeingEdited.value)

    const isViewNameUnique = computed(() => {
        return checkViewNameUniqueness(
            newView.value.name,
            isEditingExistingView.value,
            currentViewBeingEdited.value
        )
    })

    function checkViewNameUniqueness(name, isEditing, currentView) {
        const trimmedName = getTrimmedName(name)
        return !appStore.allViews.some(
            (view) =>
                view.title.toLowerCase() === trimmedName && (!isEditing || view.path !== currentView.path)
        )
    }

    const hasUniqueSectionNames = computed(() => {
        return checkSectionNamesUniqueness(newView.value.sections)
    })

    function checkSectionNamesUniqueness(sections) {
        const names = sections.map((s) => getTrimmedName(s.name))
        return new Set(names).size === names.length
    }

    const isSaveEnabled = computed(() => {
        return validateSaveConditions(
            newView.value,
            isViewNameUnique.value,
            hasUniqueSectionNames.value,
            sectionErrors.value,
            fieldErrors.value
        )
    })

    function validateSaveConditions(view, isNameUnique, hasUniqueSections, sectionErrs, fieldErrs) {
        const hasName = !isEmptyString(view.name)
        const hasSections = view.sections.length > 0
        const sectionNamesValid = view.sections.every((section) => !isEmptyString(section.name))
        const hasFieldContent = view.sections.some((section) =>
            section.lines.some((line) => line.fields.some((field) => !isEmptyString(field.name)))
        )
        const fieldsValid = view.sections.every((section) =>
            section.lines.every((line) =>
                line.fields.every((field) => !isEmptyString(field.name) && field.type !== '')
            )
        )

        return (
            hasName &&
            isNameUnique &&
            hasSections &&
            sectionNamesValid &&
            hasFieldContent &&
            fieldsValid &&
            hasUniqueSections &&
            Object.values(sectionErrs).every((e) => !e?.nameError) &&
            Object.keys(fieldErrs).length === 0
        )
    }

    // Error message functions
    function getViewNameError(name, isUnique) {
        if (isEmptyString(name)) return ERROR_MESSAGES.VIEW_NAME_EMPTY
        if (!isUnique) return ERROR_MESSAGES.VIEW_NAME_EXISTS
        return ''
    }

    function getSectionNameError(sectionIndex, trimmedName, sections) {
        if (isEmptyString(trimmedName)) return ERROR_MESSAGES.SECTION_NAME_EMPTY

        const duplicateIndex = sections.findIndex(
            (s, idx) => idx !== sectionIndex && getTrimmedName(s.name) === trimmedName
        )

        if (duplicateIndex !== -1) return ERROR_MESSAGES.SECTION_NAME_EXISTS
        return ''
    }

    function getFieldNameError(field, sectionIndex, lineIndex, fieldIndex, sections) {
        if (isEmptyString(field.name)) return ERROR_MESSAGES.FIELD_NAME_EMPTY

        const currentLineFields = sections[sectionIndex].lines[lineIndex].fields
        const duplicateInLine = currentLineFields.some(
            (f, idx) =>
                idx !== fieldIndex && getTrimmedName(f.name) === getTrimmedName(field.name)
        )

        if (duplicateInLine) return ERROR_MESSAGES.FIELD_NAME_EXISTS
        return ''
    }

    const hasMinimumFieldsInAllSections = computed(() => {
        if (!newView.value.sections?.length) return false

        return newView.value.sections.every((section) =>
            section.lines?.some((line) => line.fields?.length > 0)
        )
    })

    const hasEmptyLines = computed(() => {
        return newView.value.sections.some((section) =>
            section.lines.some((line) => line.fields.length === 0)
        )
    })

    // Validation functions used by createView
    function validateViewNameForCreation(errors) {
        const name = newView.value.name.trim()
        errors.viewName = getViewNameError(name, isViewNameUnique.value)
    }

    function validateSectionsForCreation(errors) {
        const nameOccurrences = new Map()

        newView.value.sections.forEach((section, i) => {
            const name = getTrimmedName(section.name)
            const sectionErrorsList = {}

            if (isEmptyString(name)) {
                sectionErrorsList.name = ERROR_MESSAGES.SECTION_NAME_EMPTY
            } else if (nameOccurrences.has(name)) {
                sectionErrorsList.name = ERROR_MESSAGES.SECTION_NAME_EXISTS
            } else {
                nameOccurrences.set(name, i)
            }

            errors.sectionsErrors[i] = {
                ...sectionErrorsList,
                linesErrors: []
            }
        })
    }

    function validateFieldsForCreation(errors) {
        newView.value.sections.forEach((section, sectionIndex) => {
            section.lines.forEach((line, lineIndex) => {
                initializeLineErrors(errors, sectionIndex, lineIndex)
                validateLineFields(section, line, sectionIndex, lineIndex, errors)
            })
        })
    }

    function initializeLineErrors(errors, sectionIndex, lineIndex) {
        if (!errors.sectionsErrors[sectionIndex]) {
            errors.sectionsErrors[sectionIndex] = { linesErrors: [] }
        }
        if (!errors.sectionsErrors[sectionIndex].linesErrors[lineIndex]) {
            errors.sectionsErrors[sectionIndex].linesErrors[lineIndex] = { fieldsErrors: [] }
        }
    }

    function validateLineFields(section, line, sectionIndex, lineIndex, errors) {
        const fieldNames = line.fields.map((f) => getTrimmedName(f.name))

        fieldNames.forEach((name, fieldIndex) => {
            if (isEmptyString(name)) {
                setFieldError(errors, sectionIndex, lineIndex, fieldIndex, ERROR_MESSAGES.FIELD_NAME_EMPTY)
            }

            for (let i = fieldIndex + 1; i < fieldNames.length; i++) {
                if (name && name === fieldNames[i]) {
                    setFieldError(errors, sectionIndex, lineIndex, i, ERROR_MESSAGES.FIELD_NAME_EXISTS)
                    if (!getFieldError(errors, sectionIndex, lineIndex, fieldIndex)) {
                        setFieldError(errors, sectionIndex, lineIndex, fieldIndex, ERROR_MESSAGES.FIELD_NAME_EXISTS)
                    }
                }
            }
        })
    }

    function setFieldError(errors, sectionIndex, lineIndex, fieldIndex, message) {
        errors.sectionsErrors[sectionIndex].linesErrors[lineIndex].fieldsErrors[fieldIndex] = message
    }

    function getFieldError(errors, sectionIndex, lineIndex, fieldIndex) {
        return errors.sectionsErrors[sectionIndex]?.linesErrors[lineIndex]?.fieldsErrors[fieldIndex]
    }

    return {
        // State
        newView,
        viewNameError,
        sectionErrors,
        fieldErrors,
        currentViewBeingEdited,

        // Actions
        setNewView,
        setCurrentViewBeingEdited,
        resetState,
        resetErrors,
        addSection,
        removeSection,
        addLine,
        removeLine,
        addFieldToLine,
        removeField,
        validateViewName,
        validateSectionName,
        validateFieldName,
        updateReactiveErrors,
        validateViewNameForCreation,
        validateSectionsForCreation,
        validateFieldsForCreation,

        // Getters
        isEditingExistingView,
        isViewNameUnique,
        hasUniqueSectionNames,
        isSaveEnabled,
        hasMinimumFieldsInAllSections,
        hasEmptyLines,
        getFieldErrorKey,
    }
})
