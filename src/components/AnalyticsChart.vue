// AnalyticsChart.vue
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAnalytics } from '@/stores/analytics-store/analytics-store';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale } from 'chart.js';
import type { ChartOptions, ChartData } from 'chart.js';

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
      borderColor: '#6366F1',
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      pointBackgroundColor: '#6366F1',
      tension: 0.4,
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
      ticks: { color: '#6b7280' }
    },
    y: {
      ticks: { color: '#6b7280' }
    }
  }
};
</script>

<template>
  <div class="w-full max-w-[800px] h-[410px] mx-auto p-5 bg-[#FFFFFF] rounded-lg shadow-sm">
    <div>
    <div class="flex gap-4 mb-2.5">
      <p class="text-lg font-semibold">User Analytics</p>
      <select 
        v-model="selectedInterval" 
        @change="updateAnalytics"
        class="ml-2 p-1 border border-gray-300 rounded-md cursor-pointer"
      >
        <option value="daily">Daily</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>

    </div>
    <p>Showing total number of users that joined weeshr</p>
  </div>
    <Line v-if="chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
    <p v-else class="text-gray-600">No data available</p>
  </div>
</template>