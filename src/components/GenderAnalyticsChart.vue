<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAnalyticsGender } from '@/stores/analytics-store/analytics-gender'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import type { ChartOptions } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const genderStore = useAnalyticsGender()

const selectedAge = ref<number | null>(null)

onMounted(() => {
  genderStore.fetchAnalytics()
})

const ageOptions = computed(() => {
  if (!genderStore.ageData || !Array.isArray(genderStore.ageData)) return []
  return genderStore.ageData.map((entry) => entry.age).sort((a, b) => a - b)
})

const chartData = computed(() => {
  if (!genderStore.ageData || !Array.isArray(genderStore.ageData)) {
    return { labels: [], datasets: [] }
  }

  if (selectedAge.value === null) {
    return {
      labels: ['Male', 'Female', 'Rather not say'],
      datasets: [
        {
          data: [
            genderStore.genderData.male,
            genderStore.genderData.female,
            genderStore.genderData.other
          ],
          backgroundColor: ['#6A70FF', '#00E19D', '#00BBD4'],
          hoverOffset: 10
        }
      ]
    }
  }

  const selectedEntry = genderStore.ageData.find((entry) => entry.age === selectedAge.value)
  if (!selectedEntry) {
    return { labels: [], datasets: [] }
  }

  // Show gender distribution for the selected age
  return {
    labels: ['Male', 'Female', 'Rather not say'],
    datasets: [
      {
        data: [
          selectedEntry.genders.male || 0,
          selectedEntry.genders.female || 0,
          selectedEntry.genders.others || 0
        ],
        backgroundColor: ['#6A70FF', '#00E19D', '#00BBD4'],
        hoverOffset: 10
      }
    ]
  }
})

const chartOptions: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}
</script>

<template>
  <div class="w-full bg-white p-6 rounded-xl shadow-sm h-full flex flex-col">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
      <div class="space-y-1">
        <h3 class="text-lg font-semibold text-gray-800">Gender Distribution</h3>
        <p class="text-xs text-gray-500">Breakdown by gender and age groups</p>
      </div>
      
      <!-- Age Selector -->
      <select 
        v-model="selectedAge" 
        class="px-3 py-2 bg-[#FCFCFC] border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6A70FF]/50 transition-all"
      >
        <option :value="null">All Ages</option>
        <option v-for="age in ageOptions" :key="age" :value="age">
          Age {{ age }}
        </option>
      </select>
    </div>

    <!-- Chart Container -->
    <div class="relative flex-1 min-h-[300px]">
      <div class="absolute inset-0 flex items-center justify-center">
        <Pie 
          v-if="chartData.datasets.length > 0" 
          :data="chartData" 
          :options="chartOptions" 
          class="max-w-[280px] mx-auto"
        />
        <p v-else class="text-gray-400 text-sm">
          No gender data available
        </p>
      </div>
    </div>

    <!-- Legend -->
    <!-- <div class="mt-6 flex justify-center gap-4 flex-wrap">
      <div 
        v-for="(color, index) in ['#6A70FF', '#00E19D', '#00BBD4']" 
        :key="color" 
        class="flex items-center gap-2"
      >
        <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: color }" />
        <span class="text-xs text-gray-600">
          {{ ['Male', 'Female', 'Rather not say'][index] }}
        </span>
      </div>
    </div> -->
  </div>
</template>

