<template>
  <div class="flex-col flex bg-[#f0f8ff] h-full p-8 pt-6 pb-10 w-full">
    <MainNav class="mx-6" headingText="Dashboard" />
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
      <AdminCard
        type="users"
        :loading="loading"
        :value="users.all"
        :subvalue="users.active"
      />
      <AdminCard
        type="tickets"
        :loading="loading"
        :value="tickets.all"
        :subvalue="tickets.pending"
      />
    </div>
    <Card class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-16 mb-4">
      <usersTable />
    </Card>
    <DashboardFooter/>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import MainNav from '@/components/MainNav.vue';
import DashboardFooter from '@/components/DashboardFooter.vue';
import usersTable from '@/components/usersTable.vue';
import AdminCard from '@/components/AdminCards.vue';
import { useDashboardAnalyticsStore } from '@/stores/dashboard-analytics/dashboard-analytics';
import { storeToRefs } from 'pinia';

const dashboardAnalyticsStore = useDashboardAnalyticsStore();
const { weeshes, wallet, users, tickets, loading } = storeToRefs(dashboardAnalyticsStore);

// Fetch data once when the dashboard mounts
onMounted(async () => {
  await dashboardAnalyticsStore.fetchDashboardAnalytics();
});
</script>