<template>
  <div
    class="flex justify-between lg:col-span-2 px-4 h-14 items-center gap-3 md:col-span-2"
    :class="displayMode === 'dark' ? 'bg-[#1f2937] text-white' : 'bg-gray-100 text-black shadow-md'"
  >
    <span class="text-sm">Team Image</span>
    <div v-if="teamImage" class="flex items-center gap-2">
      <img
        :src="teamImage"
        alt="Team Image"
        class="w-12 h-12 object-cover cursor-pointer"
        @click="onAddClick(index, 'image')"
        title="Click to change image"
      />
      <button
        type="button"
        class="text-red-500 font-semibold hover:underline"
        @click="onRemoveClick(index, 'image')"
        title="Delete image"
      >
        Delete
      </button>
    </div>
    <button
      v-else
      class="font-semibold cursor-pointer"
      :class="displayMode === 'dark' ? 'text-green-400' : 'text-green-600'"
      @click="onAddClick(index, 'image')"
    >
      + ADD
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  teamImage: String,
  displayMode: String,
  index: Number,
  onAddClick: Function,
  onRemoveClick: Function,
})
</script>
