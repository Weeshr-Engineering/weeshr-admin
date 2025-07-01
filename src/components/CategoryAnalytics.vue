<script setup lang="ts">
import { useCategoryAnalyticsStore } from '@/stores/analytics-store/analytics-category'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const categoryStore = useCategoryAnalyticsStore()
const { allCategories, loading, error } = storeToRefs(categoryStore)
const showAll = ref(false)
</script>

<!-- CategoryAnalytics.vue -->
<template>
  <div class="p-4 bg-white rounded-lg shadow-md">
    <div class="flex justify-between items-center">
      <h3 class="text-md font-semibold">Top Categories</h3>
      <button
        v-if="!loading && !error"
        @click="showAll = !showAll"
        class="text-blue-500 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {{ showAll ? 'See less' : 'See all' }}
      </button>
    </div>

    <div v-if="loading" class="py-4 text-gray-500">Loading...</div>
    <div v-else-if="error" class="py-4 text-red-500">{{ error }}</div>
    <div v-else>
      <!-- Top 5 Categories View -->
      <div v-if="!showAll" class="mt-4 space-y-3">
        <div
          v-for="(category, index) in allCategories.slice(0, 5)"
          :key="index"
          class="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          <span class="text-gray-700 truncate pr-2">{{ category.category }}</span>
          <span class="text-gray-600 whitespace-nowrap"
            >{{ category.count.toLocaleString() }} Users</span
          >
        </div>
      </div>

      <!-- All Categories View -->
      <div v-else class="mt-4 space-y-3">
        <div
          v-for="(category, index) in allCategories"
          :key="index"
          class="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          <span class="text-gray-700 truncate pr-2">{{ category.category }}</span>
          <span class="text-gray-600 whitespace-nowrap"
            >{{ category.count.toLocaleString() }} Users</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
