<template>
  <div class="mb-10 mt-15 min-h-screen w-full overflow-y-auto transition-colors duration-200">
    <ViewTitle :currentViewBeingEdited="currentViewBeingEdited" :displayMode="displayMode" />
    <div class="max-w-7xl mx-auto w-full p-4 mt-6">
      <ViewConfiguration :displayMode="displayMode" :newView="newView" :viewNameError="viewNameError"
        :validateViewName="validateViewName" />
      <SectionsHeader :displayMode="displayMode" :addSection="addSection" />

      <SectionsList :displayMode="displayMode" :newView="newView" :validateSectionName="validateSectionName"
        :sectionErrors="sectionErrors" :removeSection="removeSection" :fieldErrors="fieldErrors"
        :validateFieldName="validateFieldName" :removeField="removeField" :addFieldToLine="addFieldToLine"
        :removeLine="removeLine" :addLine="addLine" />
    </div>
  </div>
  <ViewButtons :displayMode="displayMode" :onSave="createView" :saveOnly="true" />
</template>

<script setup>
// ==============================================
// IMPORTS
// ==============================================
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ViewButtons from '../components/common/ViewButtons.vue'
import ViewTitle from '../components/viewBuilder/ViewTitle.vue'
import ViewConfiguration from '../components/viewBuilder/ViewConfiguration.vue'
import SectionsHeader from '../components/viewBuilder/SectionsHeader.vue'
import SectionsList from '../components/viewBuilder/SectionsList.vue'

// ==============================================
// PROPS & ROUTER
// ==============================================
const props = defineProps({
  displayMode: String,
  settings: Object,
  setSettings: Function,
  allViews: Array
})

const router = useRouter()
const route = useRoute()

// ==============================================
// STATE
// ==============================================
const newView = ref(createEmptyView())
const viewNameError = ref('')
const sectionErrors = ref({})
const fieldErrors = ref({})
const currentViewBeingEdited = ref(null)
const isAutoSaving = ref(false)

// ==============================================
// COMPUTED
// ==============================================
const autoSaveKey = computed(() => `autoSave_${route.query.editPath}`)
const isEditingExistingView = computed(() => !!currentViewBeingEdited.value)

const isViewNameUnique = computed(
  () =>
    !props.allViews.some(
      (view) =>
        view.title.toLowerCase() === newView.value.name.toLowerCase().trim() &&
        (!isEditingExistingView.value || view.path !== currentViewBeingEdited.value.path)
    )
)

const hasUniqueSectionNames = computed(() => {
  const names = newView.value.sections.map((s) => s.name.trim().toLowerCase())
  return new Set(names).size === names.length
})



const isSaveEnabled = computed(() => {
  const view = newView.value
  const hasName = view.name.trim() !== ''
  const isUnique = isViewNameUnique.value
  const hasSections = view.sections.length > 0
  const sectionNamesValid = view.sections.every((section) => section.name.trim() !== '')
  const hasFieldContent = view.sections.some((section) =>
    section.lines.some((line) => line.fields.some((field) => field.name.trim() !== ''))
  )
  const fieldsValid = view.sections.every((section) =>
    section.lines.every((line) =>
      line.fields.every((field) => field.name.trim() !== '' && field.type !== '')
    )
  )

  return (
    hasName &&
    isUnique &&
    hasSections &&
    sectionNamesValid &&
    hasFieldContent &&
    fieldsValid &&
    hasUniqueSectionNames.value &&
    Object.values(sectionErrors.value).every((e) => !e?.nameError) &&
    Object.keys(fieldErrors.value).length === 0
  )
})

// ==============================================
// VIEW INITIALIZATION
// ==============================================
function createEmptyView() {
  return {
    name: '',
    sections: [
      {
        name: '',
        lines: [
          {
            fields: [
              {
                name: '',
                type: 'text'
              }
            ]
          }
        ]
      }
    ],
    layoutStyle: 'grid'
  }
}

function resetNewView() {
  newView.value = createEmptyView()
  currentViewBeingEdited.value = null
  viewNameError.value = ''
  sectionErrors.value = {}
  fieldErrors.value = {}
}

// ==============================================
// VALIDATION
// ==============================================
function validateViewName() {
  const name = newView.value.name.trim()
  viewNameError.value = !name
    ? 'View name cannot be empty.'
    : !isViewNameUnique.value
      ? 'This view name already exists. Please choose a unique name.'
      : ''
}

function validateSectionName(sectionIndex) {
  const section = newView.value.sections[sectionIndex]
  const trimmedName = section.name.trim().toLowerCase()

  if (!trimmedName) {
    sectionErrors.value[sectionIndex] = { nameError: 'Section name cannot be empty.' }
    return
  }

  const duplicateIndex = newView.value.sections.findIndex(
    (s, idx) => idx !== sectionIndex && s.name.trim().toLowerCase() === trimmedName
  )

  if (duplicateIndex !== -1) {
    sectionErrors.value[sectionIndex] = { nameError: 'Section name must be unique.' }
  } else {
    delete sectionErrors.value[sectionIndex]
  }
}

function validateFieldName(sectionIndex, lineIndex, fieldIndex) {
  const field = newView.value.sections[sectionIndex].lines[lineIndex].fields[fieldIndex]
  const key = `${sectionIndex}-${lineIndex}-${fieldIndex}`

  if (!field.name.trim()) {
    fieldErrors.value[key] = 'Field name cannot be empty.'
    return
  }

  const allNames = []

  newView.value.sections[sectionIndex].lines.forEach((line, lIdx) => {
    line.fields.forEach((f, fIdx) => {
      if (!(lIdx === lineIndex && fIdx === fieldIndex)) {
        allNames.push(f.name.trim().toLowerCase())
      }
    })
  })

  delete fieldErrors.value[key]

}

// ==============================================
// VIEW CREATION & SAVING
// ==============================================
async function autoSaveView() {
  if (!newView.value.name) return
  isAutoSaving.value = true

  try {
    await window.myAPI.saveViewAutoSave(autoSaveKey.value, JSON.stringify(newView.value))
  } catch (err) {
    console.error('Auto-save failed:', err)
  } finally {
    isAutoSaving.value = false
  }
}

async function createView() {
  let createViewErrors = {
    viewName: "",
    sectionsErrors: []
  }

  // ✅ Check if view name is unique
  const isViewNameUnique = () =>
    !props.allViews.some(
      (view) =>
        view.title.toLowerCase() === newView.value.name.toLowerCase().trim() &&
        (!isEditingExistingView.value || view.path !== currentViewBeingEdited.value.path)
    )

  if (!isViewNameUnique()) {
    createViewErrors.viewName = "This view name already exists. Please choose a unique name."

  }
  if (newView.value.name.trim() === '') {
    createViewErrors.viewName = "View name cannot be empty."
  }

  // ✅ Check section name uniqueness and emptiness
  const sectionNamesErrors = () => {
    const nameOccurrences = new Map()

    newView.value.sections.forEach((section, i) => {
      const name = section.name.trim().toLowerCase()
      const errors = {}

      if (name === "") {
        errors.name = "Section name cannot be empty."
      } else {
        if (nameOccurrences.has(name)) {
          errors.name = "Section name repeated and it must be unique."
        } else {
          // First time seeing this name
          nameOccurrences.set(name, i)
        }
      }

      createViewErrors.sectionsErrors[i] = {
        ...errors,
        linesErrors: []
      }
    })
  }

  sectionNamesErrors()

  // ✅ Check field names inside lines inside sections
  const fieldsNamesErrors = () => {
    newView.value.sections.forEach((section, sectionIndex) => {
      section.lines.forEach((line, lineIndex) => {
        const fieldNames = line.fields.map((f) => f.name.trim().toLowerCase())

        // prepare the linesErrors array if it doesn't exist
        if (!createViewErrors.sectionsErrors[sectionIndex]) {
          createViewErrors.sectionsErrors[sectionIndex] = { linesErrors: [] }
        }
        if (!createViewErrors.sectionsErrors[sectionIndex].linesErrors[lineIndex]) {
          createViewErrors.sectionsErrors[sectionIndex].linesErrors[lineIndex] = {
            fieldsErrors: []
          }
        }

        // validate each field
        fieldNames.forEach((name, fieldIndex) => {
          if (name === "") {
            createViewErrors.sectionsErrors[sectionIndex].linesErrors[lineIndex].fieldsErrors[fieldIndex] =
              `Field  name cannot be empty.`
          }
        })
      })
    })
  }
  fieldsNamesErrors()

  console.log("createViewErrors =>", createViewErrors)

  viewNameError.value = createViewErrors.viewName || ''

  sectionErrors.value = {}
  fieldErrors.value = {}

  createViewErrors.sectionsErrors.forEach((sectionError, sectionIndex) => {
    if (sectionError.name) {
      sectionErrors.value[sectionIndex] = {
        nameError: sectionError.name
      }
    }

    if (sectionError.linesErrors?.length) {
      sectionError.linesErrors.forEach((lineError, lineIndex) => {
        if (lineError?.fieldsErrors?.length) {
          lineError.fieldsErrors.forEach((msg, fieldIndex) => {
            if (msg) {
              const key = `${sectionIndex}-${lineIndex}-${fieldIndex}`
              fieldErrors.value[key] = msg
            }
          })
        }
      })
    }
  })


  if (!isSaveEnabled.value) return

  const viewToSave = {
    title: newView.value.name,
    path: isEditingExistingView.value
      ? currentViewBeingEdited.value.path
      : `/${newView.value.name.toLowerCase().replace(/\s+/g, '-')}`,
    visible: isEditingExistingView.value ? currentViewBeingEdited.value.visible : true,
    layoutStyle: newView.value.layoutStyle,
    config: newView.value.sections.map((section) => ({
      name: section.name,
      lines: section.lines.map((line) => ({
        fields: line.fields.map((field) => ({
          name: field.name,
          type: field.type,
          value: field.type === 'image' ? '' : field.value || '',
          filePath: field.filePath || ''
        }))
      }))
    }))
  }

  const updatedViews = isEditingExistingView.value
    ? props.allViews.map((view) =>
      view.path === currentViewBeingEdited.value.path ? viewToSave : view
    )
    : [...props.settings.views, viewToSave]

  props.setSettings({ views: updatedViews })
  await window.myAPI.clearAutoSavedView(autoSaveKey.value)
  await window.myAPI.saveViewCache(
    route.query.editPath || viewToSave.path,
    JSON.parse(JSON.stringify(viewToSave))
  )

  if (currentViewBeingEdited.value?.visible === false) router.back()
  router.push(viewToSave.path)
  resetNewView()
}

// ==============================================
// SECTION / FIELD OPERATIONS
// ==============================================
const addSection = () => newView.value.sections.push(createEmptyView().sections[0])
const removeSection = (index) => {
  newView.value.sections.splice(index, 1)
  delete sectionErrors.value[index]
}

const addLine = (sectionIndex) => {
  newView.value.sections[sectionIndex].lines.push({
    fields: [{
      name: '',
      type: 'text'
    }]
  })
}

const removeLine = (sectionIndex, lineIndex) => {
  newView.value.sections[sectionIndex].lines.splice(lineIndex, 1)
  cleanupFieldErrors(sectionIndex, lineIndex)
}

const addFieldToLine = (sectionIndex, lineIndex) => {
  newView.value.sections[sectionIndex].lines[lineIndex].fields.push({
    name: '',
    type: 'text',
    value: ''
  })
}

const removeField = (sectionIndex, lineIndex, fieldIndex) => {
  newView.value.sections[sectionIndex].lines[lineIndex].fields.splice(fieldIndex, 1)
  delete fieldErrors.value[`${sectionIndex}-${lineIndex}-${fieldIndex}`]
}

function cleanupFieldErrors(sectionIndex, lineIndex) {
  const newErrors = {}
  for (const key in fieldErrors.value) {
    const [sIdx, lIdx] = key.split('-')
    if (parseInt(sIdx) !== sectionIndex || parseInt(lIdx) !== lineIndex) {
      newErrors[key] = fieldErrors.value[key]
    }
  }
  fieldErrors.value = newErrors
}

// ==============================================
// WATCHERS
// ==============================================
watch(newView, autoSaveView, { deep: true })

watch(
  () => route.query.editPath,
  async (newPath) => {
    if (newPath) {
      const viewToEdit = props.allViews.find((view) => view.path === newPath)
      const viewCache = await window.myAPI.loadViewCache(newPath)
      const editingView = {
        ...viewCache.data,
        visible: viewToEdit?.visible
      }

      currentViewBeingEdited.value = JSON.parse(JSON.stringify(editingView))
      newView.value = {
        name: editingView.title,
        sections: JSON.parse(JSON.stringify(editingView.config || [])),
        layoutStyle: editingView.layoutStyle || 'grid'
      }

      sectionErrors.value = {}
      fieldErrors.value = {}
    } else {
      resetNewView()
    }
  },
  { immediate: true }
)

// ==============================================
// LIFECYCLE
// ==============================================
onMounted(async () => {
  try {
    const savedData = await window.myAPI.getAutoSavedView(autoSaveKey.value)
    if (savedData) {
      const parsed = JSON.parse(savedData)
      if (!route.query.editPath || parsed.name === currentViewBeingEdited.value?.title) {
        newView.value = parsed
        sectionErrors.value = {}
        fieldErrors.value = {}
      }
    }
  } catch (err) {
    console.error('Failed to load auto-saved data:', err)
  }
})
</script>
