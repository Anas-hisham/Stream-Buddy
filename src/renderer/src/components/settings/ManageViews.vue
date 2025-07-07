<template>
    <div
        :class="[
            'rounded-lg shadow-md p-6 mb-6',
            displayMode === 'dark' ? 'bg-gray-700' : 'bg-white',
        ]"
    >
        <h2 class="text-xl font-semibold mb-4 flex justify-center gap-2">Views Management</h2>
        <div class="mt-8">
            <div class="bg-opacity-50 py-4 rounded">
                <template v-for="(view, index) in views" :key="index">
                    <div
                        v-if="view.path !== '/settings' && view.path !== '/view-builder'"
                        class="flex items-center justify-between py-4 p-2 transition-all duration-300 rounded-lg"
                        :class="
                            displayMode === 'dark' ? ' hover:bg-gray-600' : '  hover:bg-gray-100'
                        "
                    >
                        <span
                            :class="[
                                'font-medium',
                                displayMode === 'light' ? 'text-black' : 'text-white',
                            ]"
                        >
                            {{ view.title }}
                        </span>
                        <div class="flex items-center space-x-4">
                            <button
                                v-if="withoutEditButton(view.path)"
                                @click="editView(view)"
                                :class="[
                                    'px-3 py-1 rounded text-sm font-medium',
                                    displayMode === 'dark'
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-blue-500 hover:bg-blue-600 text-white',
                                ]"
                            >
                                Edit
                            </button>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    v-model="views[index].visible"
                                    class="sr-only peer"
                                />
                                <div
                                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                                    :class="
                                        displayMode === 'dark'
                                            ? 'peer-checked:bg-blue-600 bg-gray-500'
                                            : 'peer-checked:bg-blue-500 bg-gray-300'
                                    "
                                ></div>
                            </label>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <AppliedPreset :lastAppliedPreset="lastAppliedPreset" :displayMode="displayMode" />
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppliedPreset from './AppliedPreset.vue'

const props = defineProps({
    views: {
        type: Array,
        required: true,
    },
    displayMode: {
        type: String,
        default: 'light',
    },
    lastAppliedPreset: {
        type: String,
    },
})

const router = useRouter()

const withoutEditButton = (path) => {
    const without =
        path !== '/settings' && path !== '/brackets' && path !== '/players' && path !== '/matches'
    return without
}

const editView = (viewToEdit) => {
    router.push({
        path: '/view-builder',
        query: { editPath: viewToEdit.path },
    })
}
</script>
