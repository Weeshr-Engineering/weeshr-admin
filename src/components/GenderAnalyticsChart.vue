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
  return genderStore.ageData.map(entry => entry.age).sort((a, b) => a - b)
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

  const selectedEntry = genderStore.ageData.find(entry => entry.age === selectedAge.value)
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
  <div class="w-full bg-[#FFFFFF] max-w-[450px] p-7 text-center min-h-[510px] rounded-lg">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Gender</h3>
      <select v-model="selectedAge" class="px-2 py-1 rounded border">
        <option :value="null">All Ages</option>
        <option v-for="age in ageOptions" :key="age" :value="age">Age {{ age }}</option>
      </select>
    </div>
    <div class="flex justify-center items-center h-[300px] w-full">
      <Pie v-if="chartData.datasets.length > 0" :data="chartData" :options="chartOptions" />
      <p v-else class="text-[#60646C]">No data available</p>
    </div>
  </div>
  
</template>