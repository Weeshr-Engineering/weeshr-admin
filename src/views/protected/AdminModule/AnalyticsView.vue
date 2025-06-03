<script setup lang="ts">
import MainNav from '@/components/MainNav.vue'
import AdminCard from '@/components/AdminCards.vue'
import { useDashboardAnalyticsStore } from '@/stores/dashboard-analytics/dashboard-analytics'
import { onMounted, onBeforeMount } from 'vue'
import UserAnalyticsChart from '@/components/AnalyticsChart.vue'
import GenderAnalyticsChart from '@/components/GenderAnalyticsChart.vue'
import BirthdayAnalyicsChart from '@/components/BirthdayAnalyicsChart.vue'
import CategoryAnalytics from '@/components/CategoryAnalytics.vue'
import VerificationAnalyticsChart from '@/components/VerificationAnalyticsChart.vue'
import WeeshStatusAnalyticsChart from '@/components/WeeshStatusAnalyticsChart.vue'
import { storeToRefs } from 'pinia'
import { ability, defineAbilities } from '@/lib/ability';
import router from '@/router'

defineAbilities()

const dashboardAnalyticsStore = useDashboardAnalyticsStore()
const { weeshes, wallet, users, tickets, loading } = storeToRefs(dashboardAnalyticsStore)

onMounted(async () => {
  await dashboardAnalyticsStore.fetchDashboardAnalytics()
})
onBeforeMount(async () => {
  if(ability.cannot("read", "analytics")){
    router.push({ name: 'home' })
  }
})


</script>

<template>
 
  <div
    class="bg-[#f0f8ff] min-h-screen w-full flex flex-col space-y-6 px-4 sm:px-6 lg:px-8 pt-6 pb-10"
  >
 
    <MainNav headingText="Analytics" />

    <!-- Admin Cards Grid -->
    <div class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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

    <div class="w-full flex flex-col space-y-6">
      <!-- First Row of Charts -->
      <div class="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Scrollable wrapper for UserAnalyticsChart -->
        <div class="lg:col-span-2 bg-white p-4 rounded-xl shadow-sm overflow-x-auto">
          <!-- Inner container ensures chart width exceeds small screens -->
          <div class="min-w-[640px] w-full">
            <UserAnalyticsChart />
          </div>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-sm">
          <GenderAnalyticsChart />
        </div>
      </div>
      <!-- Second Row of Charts -->
      <div class="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="bg-white p-4 rounded-xl shadow-sm overflow-x-auto">
          <div class="min-w-[640px] w-full h-[400px] sm:h-[300px]">
            <BirthdayAnalyicsChart />
          </div>
        </div>

        <div class="bg-white p-4 rounded-xl shadow-sm">
          <VerificationAnalyticsChart />
        </div>
        <div class="bg-white p-4 rounded-xl shadow-sm">
          <CategoryAnalytics />
        </div>
      </div>

      <!-- Third Row of Charts -->
      <div class="w-full grid grid-cols-1 gap-6">
        <div class="bg-white p-4 rounded-xl shadow-sm">
          <WeeshStatusAnalyticsChart />
        </div>
      </div>
    </div>
  </div>
</template>
