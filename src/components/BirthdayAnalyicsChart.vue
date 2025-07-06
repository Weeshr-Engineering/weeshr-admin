<script setup lang="ts">
import { useBirthdayStore } from '@/stores/analytics-store/analytics-birthday'
import { computed, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import type { ChartOptions, ChartData } from 'chart.js'
import DataLabelsPlugin from 'chartjs-plugin-datalabels' 
import { useNow } from '@vueuse/core'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  DataLabelsPlugin 
)

const birthdayStore = useBirthdayStore()
const now = useNow()

onMounted(() => {
  birthdayStore.fetchBirthdayMetrics()
})

// Get current month name
const currentMonth = computed(() => {
  return now.value.toLocaleString('default', { month: 'long' })
})

// Calculate current month's trend
const currentTrend = computed(() => {
  if (!birthdayStore.monthlyTrends.length) return null
  return birthdayStore.monthlyTrends.find(t => t.month === currentMonth.value)
})

// Format trend message with emoji
const trendMessage = computed(() => {
  if (!currentTrend.value || birthdayStore.data.length === 0) {
    return '🎉 Calculating birthday trends...'
  }
  
  const { trend } = currentTrend.value
  let emoji = '↔️'
  let descriptor = 'stable'
  
  if (trend > 0) {
    emoji = '📈'
    descriptor = `up by ${Math.abs(trend)}%`
  } else if (trend < 0) {
    emoji = '📉'
    descriptor = `down by ${Math.abs(trend)}%`
  }
  
  return `🎉 Birthday occurrence trending ${descriptor} this month ${emoji}`
})

const chartColors = {
  bar: '#6A70FF',
  text: '#60646C',
  darkText: '#1C2024',
  dataLabel: '#333' 
}

const chartData = computed<ChartData<'bar'>>(() => ({
  labels: birthdayStore.data.map((entry) => entry.month),
  datasets: [
    {
      label: 'Birthdays',
      data: birthdayStore.data.map((entry) => entry.count),
      backgroundColor: chartColors.bar,
      borderRadius: 5,
      barThickness: 20
    }
  ]
}))

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'x' as const,
  plugins: {
    legend: { display: false },
    tooltip: { 
      enabled: true,
      displayColors: false,
      callbacks: {
        title: (items) => items[0].label,
        label: (ctx) => `${ctx.parsed.y} birthdays`
      }
    },
    datalabels: {
      display: (context) => {
        return window.innerWidth > 640;
      },
      anchor: 'end',
      align: 'top',
      color: chartColors.dataLabel,
      font: {
        size: 10,
        weight: 'bold'
      },
      formatter: (value: number) => value.toLocaleString(),
      padding: {
        top: 5
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: chartColors.darkText,
        font: {
          size: window.innerWidth < 640 ? 8 : 10,
          weight: 'bold'
        }
      }
    },
    y: {
      grid: { 
        display: true,
        color: '#f0f0f0'
      },
      ticks: {
        color: chartColors.text,
        font: { 
          size: window.innerWidth < 640 ? 8 : 10 
        },
        callback: (value) => {
          if (window.innerWidth < 640 && typeof value === 'number') {
            return value >= 1000 ? `${(value/1000).toFixed(0)}k` : value;
          }
          return value;
        }
      },
      title: {
        display: window.innerWidth > 480,
        text: 'Number of Birthdays',
        color: chartColors.text,
        font: {
          size: 10
        }
      }
    }
  }
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 w-full">
    <div class="mb-3 sm:mb-5">
      <h3 class="text-gray-900 font-semibold text-base sm:text-lg">Birthday Chart</h3>
      <p class="text-[#60646C] text-xs sm:text-sm">January - December 2024</p>
    </div>

    <div class="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px]">
      <Bar v-if="birthdayStore.data.length" :data="chartData" :options="chartOptions" />
      <div v-else class="absolute inset-0 flex items-center justify-center text-[#60646C] text-sm">
        Loading birthday data...
      </div>
    </div>

    <div class="mt-3 sm:mt-4 space-y-1 sm:space-y-2">
      <p class="text-xs sm:text-sm text-[#1C2024] font-medium">
        {{ trendMessage }}
      </p>
      <p class="text-[10px] sm:text-xs text-[#60646C]">Showing total birthdays per month (full calendar year)</p>
    </div>
  </div>
</template>