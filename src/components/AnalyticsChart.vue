<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAnalytics } from '@/stores/analytics-store/analytics-store'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import type { ChartOptions, ChartData } from 'chart.js'
import DataLabelsPlugin from 'chartjs-plugin-datalabels' 
import DeviceAnalytics from '@/components/DeviceAnalytics.vue'


ChartJS.register(
  Title,
  Tooltip,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  DataLabelsPlugin 
)

type LineChartData = ChartData<'line'> & {
  labels: string[]
}

const analyticsStore = useAnalytics()
const selectedInterval = ref<'daily' | 'monthly' | 'yearly'>('daily')

onMounted(() => {
  analyticsStore.fetchUserAnalytics(selectedInterval.value)
})

const updateAnalytics = () => {
  analyticsStore.fetchUserAnalytics(selectedInterval.value)
}


const chartColors = {
  line: '#6A70FF',
  point: '#F4F4F5',
  background: '#FFFFFF',
  text: '#60646C',
  dataLabel: '#6A70FF' // NEW: Color for data labels
}

const chartData = computed<LineChartData>(() => ({
  labels: analyticsStore.data.map((entry) => entry.date),
  datasets: [
    {
      data: analyticsStore.data.map((entry) => entry.value),
      borderColor: chartColors.line,
      backgroundColor: chartColors.background,
      pointBackgroundColor: chartColors.point,
      tension: 0.5,
      fill: true
    }
  ]
}))

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
 
    datalabels: {
      align: 'top',
      anchor: 'end',
      color: chartColors.dataLabel,
      font: {
        weight: 'bold',
        size: 10
      },
      formatter: (value: number) => value.toLocaleString(),
      padding: {
        top: 6
      }
    },
    // Optional: Tooltip remains for additional context
    tooltip: {
      callbacks: {
        label: (context) => {
          const date = context.label || ''
          const value = context.raw as number
          return `${date}: ${value.toLocaleString()} users`
        }
      }
    }
  },
  scales: {
    x: {
      ticks: { color: chartColors.text }
    },
    y: {
      ticks: { color: chartColors.text }
    }
  }
}
</script>

<template>
  <div class="w-full max-w-[800px] min-h-[510px] p-7 bg-[#FFFFFF] rounded-lg">
    <div class="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
      <div class="w-full sm:w-auto">
        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <p class="text-lg font-semibold">User Analytics</p>
          <select
            v-model="selectedInterval"
            @change="updateAnalytics"
            class="p-1 bg-[#FCFCFC] border rounded-md cursor-pointer text-sm sm:text-base"
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <p class="mt-2 text-xs sm:text-sm">Showing total number of users that joined weeshr</p>
      </div>

      <!-- DeviceAnalytics Component -->
      <DeviceAnalytics class="w-full sm:w-auto" />
    </div>

    <!-- Chart Section -->
    <div class="mt-4 h-[350px]">
      <Line v-if="chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
      <p v-else class="text-[#60646C]">No data available</p>
    </div>
  </div>
</template>
