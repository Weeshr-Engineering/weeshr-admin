<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAnalyticsGender } from '@/stores/analytics-store/analytics-gender'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import type { ChartOptions } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

// Import Pinia store
const genderStore = useAnalyticsGender()

// Selected age group
const selectedAge = ref<number | null>(null)

// Fetch data on mount
onMounted(() => {
  genderStore.fetchAnalytics()
})

// Get unique age groups for the dropdown
const ageOptions = computed(() => {
  if (!genderStore.ageData || !Array.isArray(genderStore.ageData)) return []
  return genderStore.ageData.map(entry => entry.age).sort((a, b) => a - b)
})

// Compute chart data based on selected age
const chartData = computed(() => {
  if (!genderStore.ageData || !Array.isArray(genderStore.ageData)) {
    return { labels: [], datasets: [] }
  }

  // If no age is selected, show aggregated gender data
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
          backgroundColor: ['#6366F1', '#10B981', '#06B6D4'],
          hoverOffset: 10
        }
      ]
    }
  }

  // Find the selected age entry
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
        backgroundColor: ['#6366F1', '#10B981', '#06B6D4'],
        hoverOffset: 10
      }
    ]
  }
})

// Chart options
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
  <div class="chart-wrapper">
    <div class="header">
      <h3 class="title">User Distribution</h3>
      <select v-model="selectedAge" class="dropdown">
        <option :value="null">All Ages</option>
        <option v-for="age in ageOptions" :key="age" :value="age">Age {{ age }}</option>
      </select>
    </div>
    <div class="chart-container">
      <Pie v-if="chartData.datasets.length > 0" :data="chartData" :options="chartOptions" />
      <p v-else>No data available</p>
    </div>
  </div>
</template>

<style scoped>
.chart-wrapper {
  width: 100%;
  max-width: 450px;
  margin: auto;
  text-align: center;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px; /* Keeps chart from moving down */
  width: 100%;
}

.dropdown {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ddd;
}
</style>