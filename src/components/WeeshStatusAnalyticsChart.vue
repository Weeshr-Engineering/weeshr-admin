<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAnalyticsWeeshStatus } from '@/stores/analytics-store/analytics-weesh-status'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import type { ChartOptions } from 'chart.js'
import { useToast } from '@/components/ui/toast'

ChartJS.register(ArcElement, Title, Tooltip, Legend)

const weeshStore = useAnalyticsWeeshStatus()
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
    await weeshStore.fetchWeeshData(
      props.dateRange.start,
      props.dateRange.end
    )
  } catch (error) {
    const errorMsg = 'Failed to load weesh status data'
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
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex-1 min-h-[300px] flex items-center justify-center">
      <div class="w-12 h-12 border-4 border-[#6A70FF] border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Chart Display -->
    <div v-else class="relative flex-1 min-h-[300px] flex items-center justify-center">
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