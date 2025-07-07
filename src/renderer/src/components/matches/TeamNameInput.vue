<script setup>
defineProps({
  side: {
    type: String,
    required: true,
    validator: (value) => ['left', 'right'].includes(value)
  },
  match: {
    type: Object,
    required: true
  },
  matchIndex: {
    type: Number,
    required: true
  },
  displayMode: {
    type: String,
    default: 'dark'
  }
});
</script>

<template>
  <div class="relative">
    <label
      class="text-sm font-semibold block mb-1"
      :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
    >
      {{ side === 'left' ? 'Left' : 'Right' }} Team Name
    </label>
    <div class="relative">
      <i
        class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
        :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
      ></i>
      <input
        type="text"
        :placeholder="`${side === 'left' ? 'Left' : 'Right'} Team Name`"
        v-model="match[matchIndex === 0 ? 'firstMatch' : 'secondMatch'][`${side}TeamName`]"
        class="pl-8 w-full border py-2 placeholder-opacity-100"
      />
    </div>
  </div>
</template>
