<script setup lang="ts">
import MainNav from '@/components/MainNav.vue'
import { ref, watch } from 'vue'
import AdminCard from '@/components/AdminCards.vue'
import { useDashboardAnalyticsStore } from '@/stores/dashboard-analytics/dashboard-analytics'
import { onMounted } from 'vue'
import UserAnalyticsChart from '@/components/AnalyticsChart.vue'
import { useAnalytics } from '@/stores/analytics-store/analytics-store'
import GenderAnalyticsChart from '@/components/GenderAnalyticsChart.vue'
import { storeToRefs } from 'pinia'
import DeviceAnalytics from '@/components/DeviceAnalytics.vue'

const dashboardAnalyticsStore = useDashboardAnalyticsStore()
const { weeshes, wallet, users, tickets, loading } = storeToRefs(dashboardAnalyticsStore)

// Fetch data once when the dashboard mounts
onMounted(async () => {
  await dashboardAnalyticsStore.fetchDashboardAnalytics()
})
// Sample user analytics data
// Initialize the store
const analyticsStore = useAnalytics()

// Create a reactive variable to hold the selected interval.
// The default is 'monthly', but the user can choose 'daily' or 'yearly'
const selectedInterval = ref<'daily' | 'monthly' | 'yearly'>('monthly')

// Watch for changes to the selected interval and fetch new data accordingly
watch(selectedInterval, (newInterval) => {
  analyticsStore.fetchUserAnalytics(newInterval)
})

// Fetch the default data when the component mounts
analyticsStore.fetchUserAnalytics(selectedInterval.value)
</script>

<template>
  <div class="flex-col flex bg-[#f0f8ff] h-full p-8 pt-6 pb-10 w-full">
    <MainNav class="mx-6" headingText="Analytics" />
    <div class="w-full grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
      <AdminCard
        type="weeshes"
        :loading="loading"
        :value="weeshes.all"
        :subvalue="weeshes.fulfilled"
      />
      <AdminCard
        type="wallet"
        :loading="loading"
        :value="wallet.total_current_balance.balance"
        :subvalue="wallet.invested.balance"
      />
      <AdminCard type="users" :loading="loading" :value="users.all" :subvalue="users.active" />
      <AdminCard
        type="tickets"
        :loading="loading"
        :value="tickets.all"
        :subvalue="tickets.pending"
      />
    </div>
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">User Analytics</h2>

      <!-- Dropdown to select the interval view -->
      <div class="mb-4">
        <label for="interval" class="mr-2 font-medium">View: </label>
        <select id="interval" v-model="selectedInterval" class="p-2 border rounded">
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <!-- Chart component receiving data from the store -->
      <UserAnalyticsChart :data="analyticsStore.data" />
    </div>
    <div class="p-6 grid gap-6">
      <GenderAnalyticsChart />
    </div>
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">Device Analytics</h2>
      <DeviceAnalytics />
    </div>
  </div>
</template>
