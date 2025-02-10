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

const dashboardAnalyticsStore = useDashboardAnalyticsStore()
const { weeshes, wallet, users, tickets, loading } = storeToRefs(dashboardAnalyticsStore)

// Fetch data once when the dashboard mounts
onMounted(async () => {
  await dashboardAnalyticsStore.fetchDashboardAnalytics()
})

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
    

      <!-- Chart component receiving data from the store -->
      <UserAnalyticsChart  />
    </div>
    <div class="p-6 grid gap-6">
      <GenderAnalyticsChart />
    </div>
    
  </div>
</template>
