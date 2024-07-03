<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  count: {
    type: Number,
    required: false,
    default: 0
  },
  perPage: {
    type: Number,
    required: false,
    default: 25
  },
  from: {
    type: Number,
    required: false,
    default: 1
  },
  to: {
    type: Number,
    required: false,
    default: 1
  },
  nextFrom: {
    type: Number,
    required: false,
    default: 1
  },
  validNextPage: {
    type: Boolean,
    required: false,
    default: false
  },
  prevFrom: {
    type: Number,
    required: false,
    default: 1
  },
  validPrevPage: {
    type: Boolean,
    required: false,
    default: false
  },
  perPageOptions: {
    type: Array as () => number[],
    required: false,
    default: () => [10, 25, 50, 75, 100, 150, 200]
  },
  showPerPageOptions: {
    type: Boolean,
    required: false,
    default: true
  }
})

const emit = defineEmits(['next', 'prev', 'per_page']);

const selectedPerPage = ref<number>(25);

const nextPage = (): void => {
  if (!props.validNextPage)
    return;

  emit('next', Number(props.nextFrom));
}

const prevPage = (): void => {
  if ([0, 1].includes(props.from))
    return;

  emit('prev', Number(props.prevFrom));
}

const startPage = (): void => {
  emit('prev', 1);
}

watch(selectedPerPage, () => {
  if (props.showPerPageOptions) {
    emit('per_page', Number(selectedPerPage.value));
  }
});

watch(() => props, () => {
  console.log({ props })
}, { deep: true })

onMounted(() => {
  selectedPerPage.value = props.perPage || 25
})
</script>

<template>
  <div class="flex flex-row-reverse items-center gap-3">
    <!-- Buttons -->
    <div class="inline-flex">
      <button :disabled="props.validPrevPage !== true" class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white
        disabled:cursor-not-allowed" @click="startPage">
        1
      </button>
      <button :disabled="props.validPrevPage !== true" class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-s hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white
        disabled:cursor-not-allowed" @click="prevPage">
        Prev
      </button>
      <button :disabled="props.validNextPage !== true" class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white
        disabled:cursor-not-allowed" @click="nextPage">
        Next
      </button>
    </div>
    <!-- Buttons End -->

    <!-- Select Perpage -->
    <div v-if="props.showPerPageOptions">
      <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-1" v-model="selectedPerPage">
        <option v-for="(option, index) in props.perPageOptions" :key="index" :selected="option === props.perPage">{{
          option }}</option>
      </select>
    </div>
    <!-- Select Perpage Ends -->

    <!-- Help text -->
    <span class="text-sm text-gray-700 dark:text-gray-400">
      Showing <span class="font-semibold">{{ props.from }}</span> to
      <span class="font-semibold">{{ props.to }}</span> of
      <span class="font-semibold">{{ props.count }}</span> Entries
    </span>
  </div>
</template>
