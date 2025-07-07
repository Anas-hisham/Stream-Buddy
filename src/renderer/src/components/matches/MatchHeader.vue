<script setup>
defineProps({
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
  <h2
    class="font-semibold uppercase text-sm w-full py-4 text-start px-5"
    :class="displayMode === 'dark' ? 'text-white bg-[#22292f]' : 'text-black bg-gray-200'"
  >
    {{ matchIndex === 0 ? 'first Match' : 'second Match' }}
  </h2>
</template>
