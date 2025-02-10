// AnalyticsChart.vue
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAnalytics } from '@/stores/analytics-store/analytics-store';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale } from 'chart.js';
import type { ChartOptions, ChartData } from 'chart.js';
import DeviceAnalytics from '@/components/DeviceAnalytics.vue'
// Register necessary Chart.js components
ChartJS.register(Title, Tooltip, PointElement, LineElement, CategoryScale, LinearScale);

// Define a custom type to enforce labels as required
type LineChartData = ChartData<'line'> & {
  labels: string[];
};

// Initialize store
const analyticsStore = useAnalytics();
const selectedInterval = ref<'daily' | 'monthly' | 'yearly'>('monthly');

// Fetch data on mount
onMounted(() => {
  analyticsStore.fetchUserAnalytics(selectedInterval.value);
});

// Watch for interval changes and refetch data
const updateAnalytics = () => {
  analyticsStore.fetchUserAnalytics(selectedInterval.value);
};

// Compute chart data with the custom type
const chartData = computed<LineChartData>(() => ({
  labels: analyticsStore.data.map(entry => entry.date),
  datasets: [
    {
      data: analyticsStore.data.map(entry => entry.value),
      borderColor: '#6A70FF',
      backgroundColor: '#FFFFFF',
      pointBackgroundColor: '#F4F4F5',
      tension: 0.7,
      fill: true,
    }
  ]
}));

// Define chart options (remain unchanged)
const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      ticks: { color: '#60646C' }
    },
    y: {
      ticks: { color: '#6b7280' }
    }
  }
};
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
            class="p-1 bg-[#FCFCFC] border  rounded-md cursor-pointer text-sm sm:text-base"
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
      <p v-else class="text-gray-600">No data available</p>
    </div>
  </div>
</template>