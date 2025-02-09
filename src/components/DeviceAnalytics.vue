<script setup lang="ts">
import { useDeviceAnalyticsStore } from '@/stores/analytics-store/analytics-device';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const store = useDeviceAnalyticsStore();
const { iosUsers, androidUsers, loading, error } = storeToRefs(store); // ✅ Ensures reactivity

onMounted(() => {
  store.fetchDeviceMetrics();
});

// Debugging logs

</script>

<template>
  <div class="device-analytics p-4 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Device Analytics</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else class="flex gap-6">
      <div class="p-4 bg-gray-100 rounded-lg text-center w-1/2">
        <span class="block text-gray-500">iOS</span>
        <strong class="text-xl">{{ iosUsers }}</strong> <!-- ✅ Ensures reactivity -->
      </div>
      <div class="p-4 bg-gray-100 rounded-lg text-center w-1/2">
        <span class="block text-gray-500">Android</span>
        <strong class="text-xl">{{ androidUsers }}</strong> <!-- ✅ Ensures reactivity -->
      </div>
    </div>
  </div>
</template>
