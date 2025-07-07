<script setup>
defineProps({
  match: {
    type: Object,
    required: true,
  },
  matchIndex: {
    type: Number,
    required: true,
  },
  displayMode: {
    type: String,
    default: 'dark',
  },
})
</script>

<template>
  <div class="relative" :class="displayMode === 'dark' ? 'text-white' : 'text-black'">
    <label
      v-if="match[matchIndex === 0 ? 'firstMatch' : 'secondMatch'].matchTime !== ''"
      class="text-sm font-semibold block mb-1"
      :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
    >
      Match Time
    </label>
    <div class="relative">
      <i
        class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
        :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
      ></i>
      <input
        type="text"
        placeholder="Match Time"
        v-model="match[matchIndex === 0 ? 'firstMatch' : 'secondMatch'].matchTime"
        class="pl-8 w-full border py-2 px-2.5 placeholder-opacity-100"
      />
    </div>
  </div>
</template>
