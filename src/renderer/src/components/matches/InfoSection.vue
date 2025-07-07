<script setup>
defineProps({
  matchInfo: {
    type: Object,
    required: true,
  },
  displayMode: {
    type: String,
    default: 'dark',
  },
})
</script>

<template>
  <!-- Info Header -->
  <h2
    class="font-semibold uppercase text-sm w-full py-4 text-start px-5"
    :class="displayMode === 'dark' ? 'text-white bg-[#22292f]' : 'text-black bg-gray-200'"
  >
    INFO
  </h2>

  <!-- Date Input -->
  <div class="p-4 mb-10" :class="displayMode === 'dark' ? 'bg-[#1f2937]' : 'bg-gray-100'">
    <label
      v-if="(matchInfo.date !== '')"
      class="text-sm font-semibold block mb-1"
      :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
    >
      Date
    </label>
    <div class="relative">
      <i class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"></i>
      <input
        type="text"
        placeholder="Date"
        v-model="matchInfo.date"
        class="pl-8 w-full border py-2 px-3"
      />
    </div>
  </div>
</template>
<style>
.dark-mode input[type='date'],
.dark-mode input[type='time'] {
  color-scheme: dark;
}
</style>
