<script setup lang="ts">
import { useBirthdayStore } from '@/stores/analytics-store/analytics-birthday';
import { computed, onMounted } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';
import type { ChartOptions, ChartData } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const birthdayStore = useBirthdayStore();

onMounted(() => {
  birthdayStore.fetchBirthdayMetrics();
});

const chartData = computed<ChartData<'bar'>>(() => ({
  labels: birthdayStore.data.map(entry => entry.month),
  datasets: [
    {
      label: 'Birthdays',
      data: birthdayStore.data.map(entry => entry.count),
      backgroundColor: '#6A70FF',
      borderRadius: 5,
      barThickness: 20,
    }
  ]
}));

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: '#60646C',
        font: { size: 12 }
      }
    },
    y: {
      grid: { display: false },
      ticks: {
        color: '#333',
        font: { 
          size: 14,
          weight: 'bold'
        },

        // Ensure months appear in correct order
        callback: (_, index) => birthdayStore.data[index]?.month
      }
    }
  }
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm p-6 w-full max-w-2xl mx-auto">
    <div class="mb-5">
      <h3 class="text-gray-900 font-semibold text-lg">Birthday Chart</h3>
      <p class="text-[#60646C] text-sm">January - December 2024</p>
    </div>

    <div class="relative h-64 md:h-96">
      <Bar 
        v-if="birthdayStore.data.length" 
        :data="chartData" 
        :options="chartOptions" 
      />
      <div 
        v-else
        class="absolute inset-0 flex items-center justify-center text-[#60646C]"
      >
        Loading birthday data...
      </div>
    </div>

    <div class="mt-4 space-y-2">
      <p class="text-sm text-[#1C2024]font-medium">
        🎉 Birthday occurrence trending up by <strong>1%</strong> this month 📈
      </p>
      <p class="text-xs text-[#60646C]">
        Showing total birthdays per month (full calendar year)
      </p>
    </div>
  </div>
</template>