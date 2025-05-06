<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAnalyticsWeeshStatus } from '@/stores/analytics-store/analytics-weesh-status'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import type { ChartOptions } from 'chart.js'

ChartJS.register(ArcElement, Title, Tooltip, Legend)

const weeshStore = useAnalyticsWeeshStatus()

// Initial load
onMounted(async () => {
  await weeshStore.fetchWeeshData()
})

// Chart configuration
const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '75%',
  rotation: -90,
  circumference: 180,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  }
}

const chartData = computed(() => ({
  labels: ['Fulfilled', 'Remaining'],
  datasets: [{
    data: [
      weeshStore.weeshStatusData.fulfilled,
      weeshStore.weeshStatusData.created - weeshStore.weeshStatusData.fulfilled
    ],
    backgroundColor: ['#00E19D', '#F0F8FF'],
    borderWidth: 0
  }]
}))

// Handle filter application
async function handleFilter() {
  await weeshStore.fetchWeeshData()
}
</script>

<template>
  <div class="w-full bg-white p-6 rounded-xl shadow-sm h-full flex flex-col">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
      <div class="space-y-1">
        <h3 class="text-lg font-semibold text-gray-800">Weesh Status</h3>
        <p class="text-xs text-gray-500">
          Fulfillment Rate: {{ weeshStore.weeshStatusData.percentageFulfilled }}%
        </p>
      </div>
      
      <!-- Date Filter -->
      <div class="w-full sm:w-auto flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="date"
            v-model="weeshStore.dateFilter.dateFrom"
            class="w-full sm:w-36 px-3 py-2 bg-[#FCFCFC] border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6A70FF]/50"
          >
          <span class="text-gray-400 hidden sm:inline-block self-center">to</span>
          <input
            type="date"
            v-model="weeshStore.dateFilter.dateTo"
            class="w-full sm:w-36 px-3 py-2 bg-[#FCFCFC] border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6A70FF]/50"
          >
        </div>
        <button
          @click="handleFilter"
          class="w-full sm:w-auto px-3 py-2 bg-[#6A70FF] text-white rounded-lg text-sm hover:bg-[#575bc7] transition-colors whitespace-nowrap"
          :disabled="!weeshStore.dateFilter.dateFrom || !weeshStore.dateFilter.dateTo"
          :class="{ 'opacity-50 cursor-not-allowed': !weeshStore.dateFilter.dateFrom || !weeshStore.dateFilter.dateTo }"
        >
          Apply Filter
        </button>
      </div>
    </div>

    <!-- Chart Display -->
    <div class="relative flex-1 min-h-[300px] flex items-center justify-center">
      <div class="relative w-full max-w-[280px] mx-auto">
        <Doughnut 
          :data="chartData" 
          :options="chartOptions"
          v-if="weeshStore.weeshStatusData.created > 0"
        />
        <div v-if="weeshStore.weeshStatusData.created > 0" class="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <span class="text-3xl font-bold text-gray-800">
            {{ weeshStore.weeshStatusData.percentageFulfilled }}%
          </span>
          <div class="text-center mt-2">
            <p class="text-sm text-gray-600">
              <span class="text-[#00E19D]">{{ weeshStore.weeshStatusData.fulfilled }}</span> fulfilled
            </p>
            <p class="text-sm text-gray-600">
              <span class="text-[#6A70FF]">{{ weeshStore.weeshStatusData.created }}</span> created
            </p>
          </div>
        </div>
        <p v-else class="text-gray-400 text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          No weesh data available
        </p>
      </div>
    </div>
  </div>
</template>
