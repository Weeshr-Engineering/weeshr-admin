<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAnalyticsGender } from '@/stores/analytics-store/analytics-gender'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import type { ChartOptions } from 'chart.js'
import DataLabelsPlugin from 'chartjs-plugin-datalabels'


ChartJS.register(ArcElement, Tooltip, Legend, DataLabelsPlugin)

const genderStore = useAnalyticsGender()
const selectedAge = ref<number | null>(null)

onMounted(() => {
  genderStore.fetchAnalytics()
})

const genderConfig = [
  { label: 'Male', color: '#6A70FF' },
  { label: 'Female', color: '#00E19D' },
  { label: 'Rather not say', color: '#00BBD4' }
]

const ageOptions = computed(() => {
  if (!genderStore.ageData || !Array.isArray(genderStore.ageData)) return []
  return genderStore.ageData.map((entry) => entry.age).sort((a, b) => a - b)
})

const chartData = computed(() => {
  if (!genderStore.ageData || !Array.isArray(genderStore.ageData)) {
    return { labels: [], datasets: [] }
  }

  const labels = genderConfig.map((item) => item.label)

  if (selectedAge.value === null) {
    return {
      labels,
      datasets: [
        {
          data: [
            genderStore.genderData.male,
            genderStore.genderData.female,
            genderStore.genderData.other
          ],
          backgroundColor: genderConfig.map((item) => item.color),
          hoverOffset: 10
        }
      ]
    }
  }

  const selectedEntry = genderStore.ageData.find((entry) => entry.age === selectedAge.value)
  if (!selectedEntry) {
    return { labels: [], datasets: [] }
  }

  return {
    labels,
    datasets: [
      {
        data: [
          selectedEntry.genders.male || 0,
          selectedEntry.genders.female || 0,
          selectedEntry.genders.others || 0
        ],
        backgroundColor: genderConfig.map((item) => item.color),
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
      display: false
    },
    datalabels: {
      formatter: (value: number) => {
        return value.toLocaleString()
      },
      color: 'white',
      font: {
        weight: 'bold',
        size: 14
      },
      textAlign: 'center',
      textStrokeColor: '#000',
      textStrokeWidth: 1,
      textShadowBlur: 5,
      textShadowColor: 'rgba(0,0,0,0.3)'
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.label || ''
          const value = context.raw as number
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0
          return `${label}: ${value.toLocaleString()} (${percentage}%)`
        }
      }
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
        <option v-for="age in ageOptions" :key="age" :value="age">Age {{ age }}</option>
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
        <p v-else class="text-gray-400 text-sm">No gender data available</p>
      </div>
    </div>

    <!-- Legend and Summary -->
    <div class="mt-6">
      <!-- Legend -->
      <div class="flex justify-center gap-4 flex-wrap mb-3">
        <div v-for="(item, index) in genderConfig" :key="index" class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: item.color }" />
          <span class="text-xs text-gray-600">
            {{ item.label }}
          </span>
        </div>
      </div>

      <!-- Optional: Total Count -->
      <div class="text-center text-sm text-gray-500 mt-2" v-if="chartData.datasets.length > 0">
        Total:
        {{
          (selectedAge === null
            ? genderStore.genderData.male +
              genderStore.genderData.female +
              genderStore.genderData.other
            : chartData.datasets[0].data.reduce((a, b) => a + b, 0)
          ).toLocaleString()
        }}
      </div>
    </div>
  </div>
</template>
