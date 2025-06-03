<script setup lang="ts">
import { computed, onMounted } from 'vue'
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

onMounted(async () => {
  await verificationStore.fetchVerificationAnalytics()
})

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

      <div class="flex flex-col sm:flex-row gap-2 w-full">
        <input
          type="date"
          v-model="verificationStore.dateFilter.dateFrom"
          class="w-full sm:w-36 px-3 py-2 bg-[#FCFCFC] border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6A70FF]/50"
          placeholder="Start date"
        />
        <span class="text-gray-400 hidden sm:inline-block self-center">to</span>
        <input
          type="date"
          v-model="verificationStore.dateFilter.dateTo"
          class="w-full sm:w-36 px-3 py-2 bg-[#FCFCFC] border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6A70FF]/50"
          placeholder="End date"
        />
      </div>

      <p class="text-xs text-center text-gray-500">
        Total users: {{ verificationStore.verificationData.total }}
      </p>

      <button
        @click="verificationStore.fetchVerificationAnalytics()"
        class="w-full sm:w-auto px-3 py-2 bg-[#6A70FF] text-white rounded-lg text-sm hover:bg-[#575bc7] transition-colors whitespace-nowrap"
        :disabled="!verificationStore.dateFilter.dateFrom || !verificationStore.dateFilter.dateTo"
        :class="{
          'opacity-50 cursor-not-allowed':
            !verificationStore.dateFilter.dateFrom || !verificationStore.dateFilter.dateTo
        }"
      >
        Apply Filter
      </button>
    </div>

    <div class="relative flex-1 min-h-[300px]">
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
