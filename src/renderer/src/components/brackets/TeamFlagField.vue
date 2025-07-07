<template>
  <div
    class="flex justify-between lg:col-span-2 px-4 h-14 items-center gap-3 md:col-span-2"
    :class="displayMode === 'dark' ? 'bg-[#1f2937] text-white' : 'bg-gray-100 text-black shadow-md'"
  >
    <span class="text-sm">Team Flag</span>
    <div v-if="teamFlag" class="flex items-center gap-2">
      <img
        :src="teamFlag"
        alt="Flag"
        class="w-12 h-12 object-cover cursor-pointer"
        @click="onAddClick(index, 'flag')"
        title="Click to change flag"
      />
      <button
        type="button"
        class="text-red-500 font-semibold hover:underline"
        @click="onRemoveClick(index, 'flag')"
        title="Delete flag"
      >
        Delete
      </button>
    </div>
    <button
      v-else
      class="font-semibold cursor-pointer"
      :class="displayMode === 'dark' ? 'text-green-400' : 'text-green-600'"
      @click="onAddClick(index, 'flag')"
    >
      + ADD
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  teamFlag: String,
  displayMode: String,
  index: Number,
  onAddClick: Function,
  onRemoveClick: Function,
})
</script>
