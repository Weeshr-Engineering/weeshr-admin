<script setup lang="ts">
import { useWalletTransactionStore } from '@/stores/analytics-store/analytics-wallet-transaction'
import { computed, onMounted, watch } from 'vue'
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

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  DataLabelsPlugin
)

interface Props {
  dateRange: {
    start: string
    end: string
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  error: [message: string]
}>()

const walletTransactionStore = useWalletTransactionStore()

onMounted(() => {
  fetchData()
})

watch(
  () => props.dateRange,
  () => {
    fetchData()
  },
  { deep: true }
)

const fetchData = async () => {
  try {
    await walletTransactionStore.fetchWalletTransactionMetrics(props.dateRange)
  } catch (error: any) {
    emit('error', error.message || 'Failed to load wallet transaction data')
  }
}

const chartColors = {
  inflow: '#10B981', // Green for money coming in
  outflow: '#EF4444', // Red for money going out
  text: '#60646C',
  darkText: '#1C2024',
  dataLabel: '#333'
}

const chartData = computed<ChartData<'bar'>>(() => {
  const data = walletTransactionStore.chartData
  
  return {
    labels: data.map(item => item.period),
    datasets: [
      {
        label: 'Inflow',
        data: data.map(item => item.inflow),
        backgroundColor: chartColors.inflow,
        borderRadius: 5,
        barThickness: 20
      },
      {
        label: 'Outflow',
        data: data.map(item => item.outflow),
        backgroundColor: chartColors.outflow,
        borderRadius: 5,
        barThickness: 20
      }
    ]
  }
})

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index'
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        font: {
          size: 12
        },
        color: chartColors.darkText
      }
    },
    tooltip: {
      enabled: true,
      displayColors: true,
      callbacks: {
        title: (items) => items[0].label,
        label: (ctx) => {
          const label = ctx.dataset.label
          const value = walletTransactionStore.formatCurrency(ctx.parsed.y)
          return `${label}: ${value}`
        }
      }
    },
    datalabels: {
      display: false // Disable to avoid cluttering
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
          if (typeof value === 'number') {
            if (value >= 1000000) {
              return `₦${(value / 1000000).toFixed(1)}M`
            } else if (value >= 1000) {
              return `₦${(value / 1000).toFixed(0)}K`
            }
            return `₦${value.toFixed(0)}`
          }
          return value
        }
      },
      title: {
        display: window.innerWidth > 480,
        text: 'Amount (₦)',
        color: chartColors.text,
        font: {
          size: 10
        }
      }
    }
  }
}

// Summary stats
const summaryStats = computed(() => [
  {
    label: 'Total Inflow',
    value: walletTransactionStore.formatCurrency(walletTransactionStore.totalInflow),
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    label: 'Total Outflow',
    value: walletTransactionStore.formatCurrency(walletTransactionStore.totalOutflow),
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    label: 'Net Flow',
    value: walletTransactionStore.formatCurrency(walletTransactionStore.totalNetFlow),
    color: walletTransactionStore.totalNetFlow >= 0 ? 'text-green-600' : 'text-red-600',
    bgColor: walletTransactionStore.totalNetFlow >= 0 ? 'bg-green-50' : 'bg-red-50'
  },
  {
    label: 'Total Transactions',
    value: walletTransactionStore.totalTransactions.toLocaleString(),
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  }
])

const periodOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
]
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 w-full">
    <!-- Header with Period Selector -->
    <div class="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h3 class="text-gray-900 font-semibold text-base sm:text-lg">Wallet Transaction Analytics</h3>
        <p class="text-[#60646C] text-xs sm:text-sm">Money inflow and outflow trends</p>
      </div>
      
      <div class="flex items-center gap-2">
        <label for="period-select" class="text-sm font-medium text-gray-700">Period:</label>
        <select
          id="period-select"
          v-model="walletTransactionStore.currentPeriod"
          class="p-2 border rounded-md bg-white text-sm"
          :disabled="walletTransactionStore.loading"
        >
          <option v-for="option in periodOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div
        v-for="stat in summaryStats"
        :key="stat.label"
        :class="`${stat.bgColor} p-3 rounded-lg`"
      >
        <div class="text-xs text-gray-600 mb-1">{{ stat.label }}</div>
        <div :class="`${stat.color} font-semibold text-sm`">{{ stat.value }}</div>
      </div>
    </div>

    <!-- Chart -->
    <div class="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px]">
      <div v-if="walletTransactionStore.loading" class="absolute inset-0 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6A70FF]"></div>
      </div>
      
      <div v-else-if="walletTransactionStore.error" class="absolute inset-0 flex items-center justify-center text-red-500 text-sm">
        {{ walletTransactionStore.error }}
      </div>
      
      <Bar 
        v-else-if="walletTransactionStore.chartData.length" 
        :data="chartData" 
        :options="chartOptions" 
      />
      
      <div v-else class="absolute inset-0 flex items-center justify-center text-[#60646C] text-sm">
        No wallet transaction data available for the selected period
      </div>
    </div>

    <div class="mt-4 space-y-1">
      <p class="text-xs sm:text-sm text-[#1C2024] font-medium">
        💰 Track money flow patterns across different time periods
      </p>
      <p class="text-[10px] sm:text-xs text-[#60646C]">
        Green bars show money coming in, red bars show money going out
      </p>
    </div>
  </div>
</template>