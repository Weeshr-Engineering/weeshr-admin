<script setup lang="ts">
import { useDeviceAnalyticsStore } from '@/stores/analytics-store/analytics-device';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const store = useDeviceAnalyticsStore();
const { iosUsers, androidUsers, loading, error } = storeToRefs(store); 

onMounted(() => {
  store.fetchDeviceMetrics();
});



</script>

<template>
  <div class=" bg-[#F4F4F5] rounded-lg sm:w-80 w-full">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else class="flex flex-row gap-6 p-1 px-4  ">
      <div class=" text-center w-full sm:w-1/2">
        <span class="text-sm text-[#60646C]">iOS</span>
        <p class="text-2xl">{{ iosUsers }}</p> 
      </div>
      <div class="  text-center w-full sm:w-1/2">
        <span class=" text-sm text-[#60646C]"> Android </span>
        <p class="text-2xl">{{ androidUsers }}</p> 
      </div>
    </div>
  </div>

</template>
