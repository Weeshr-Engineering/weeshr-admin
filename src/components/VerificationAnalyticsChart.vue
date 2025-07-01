<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue'
import { useAnalyticsVerification } from '@/stores/analytics-store/analytics-verification'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import type { ChartOptions } from 'chart.js'
import DataLabelsPlugin from 'chartjs-plugin-datalabels'
import { useToast } from '@/components/ui/toast'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  DataLabelsPlugin 
)

const verificationStore = useAnalyticsVerification()
const loading = ref(true)
const { toast } = useToast()

// Define props and emits
const props = defineProps({
  dateRange: {
    type: Object,
    required: true,
    default: () => ({
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    })
  }
})

const emit = defineEmits(['error'])

// Watch for date range changes
watch(() => props.dateRange, () => {
  fetchData()
}, { deep: true })

async function fetchData() {
  loading.value = true
  try {
    await verificationStore.fetchVerificationAnalytics(
      props.dateRange.start,
      props.dateRange.end
    )
  } catch (error) {
    const errorMsg = 'Failed to load verification data'
    console.error(errorMsg, error)
    toast({
      title: 'Error',
      description: errorMsg,
      variant: 'destructive'
    })
    emit('error', errorMsg)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const chartColors = {
  verified: '#00E19D',
  unverified: '#6A70FF',
  dataLabel: '#FFFFFF', 
  text: '#60646C'
}

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    datalabels: {
      anchor: 'end', 
      align: 'start', 
      color: chartColors.dataLabel,
      font: {
        weight: 'bold',
        size: 12
      },
      formatter: (value: number) => {
        return value.toLocaleString()
      },
      padding: {
        top: 6
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.dataset.label || ''
          const value = context.parsed.y || 0
          const total = verificationStore.verificationData.total
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%'
          return `${label}: ${value} (${percentage})`
        }
      }
    }
  },
  scales: {
    x: {
      stacked: false,
      grid: {
        display: false
      },
      ticks: {
        color: chartColors.text
      }
    },
    y: {
      stacked: false,
      beginAtZero: true,
      ticks: {
        precision: 0,
        color: chartColors.text
      }
    }
  }
}

const chartData = computed(() => ({
  labels: ['Verification Status'],
  datasets: [
    {
      label: 'Verified',
      data: [verificationStore.verificationData.verified],
      backgroundColor: chartColors.verified,
      barThickness: 40
    },
    {
      label: 'Unverified',
      data: [verificationStore.verificationData.unverified],
      backgroundColor: chartColors.unverified,
      barThickness: 40
    }
  ]
}))
</script>

<template>
  <div class="w-full bg-white p-6 rounded-xl shadow-sm h-full flex flex-col">
    <div class="flex flex-col justify-between items-start sm:items-center gap-3 mb-6">
      <div class="space-y-1">
        <h3 class="text-lg font-semibold text-gray-800">Verification Status</h3>
      </div>

      <p class="text-xs text-center text-gray-500">
        Total users: {{ verificationStore.verificationData.total }}
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex-1 min-h-[300px] flex items-center justify-center">
      <div class="w-12 h-12 border-4 border-[#6A70FF] border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else class="relative flex-1 min-h-[300px]">
      <Bar
        v-if="verificationStore.verificationData.total > 0"
        :data="chartData"
        :options="chartOptions"
      />
      <p
        v-else
        class="text-gray-400 text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        No verification data available
      </p>
    </div>
  </div>
</template>