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

    <!-- Date Picker Section for charts only -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-gray-800">Charts Date Range</h1>
        <p class="text-sm text-gray-600">Select date range for all charts</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-2 items-end">
        <div class="flex flex-col sm:flex-row gap-2">
          <div class="flex items-center">
            <label for="start-date" class="mr-2 text-sm font-medium text-gray-700">From:</label>
            <input
              type="date"
              id="start-date"
              v-model="tempDateRange.start"
              class="p-2 border rounded-md bg-white text-sm"
              :disabled="loading"
            />
          </div>
          <div class="flex items-center">
            <label for="end-date" class="mr-2 text-sm font-medium text-gray-700">To:</label>
            <input
              type="date"
              id="end-date"
              v-model="tempDateRange.end"
              class="p-2 border rounded-md bg-white text-sm"
              :max="new Date().toISOString().split('T')[0]"
              :disabled="loading"
            />
          </div>
        </div>
        <button
          class="px-4 py-2 bg-[#6A70FF] text-white rounded-md text-sm hover:bg-[#575bc7] transition-colors whitespace-nowrap"
          :class="{'opacity-50 cursor-not-allowed': loading || isDateInvalid}"
          :disabled="loading || isDateInvalid"
          @click="applyDateRange"
        >
          Apply
        </button>
      </div>
    </div>

    <!-- Charts Section with Loading State -->
    <div v-if="loading" class="w-full flex flex-col space-y-6">
      <!-- Skeleton Loaders for Charts -->
      <div class="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-white p-4 rounded-xl shadow-sm min-h-[510px] animate-pulse">
          <div class="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div class="h-64 bg-gray-200 rounded"></div>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-sm min-h-[510px] animate-pulse">
          <div class="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div class="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      <div class="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="bg-white p-4 rounded-xl shadow-sm min-h-[400px] animate-pulse">
          <div class="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div class="h-64 bg-gray-200 rounded"></div>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-sm min-h-[400px] animate-pulse">
          <div class="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div class="h-64 bg-gray-200 rounded"></div>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-sm min-h-[400px] animate-pulse">
          <div class="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div class="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      <div class="w-full grid grid-cols-1 gap-6">
        <div class="bg-white p-4 rounded-xl shadow-sm min-h-[400px] animate-pulse">
          <div class="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div class="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <div v-else class="w-full flex flex-col space-y-6">
    <!-- First Row of Charts -->
    <div class="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white p-4 rounded-xl shadow-sm overflow-x-auto">
        <div class="min-w-[640px] w-full">
          <UserAnalyticsChart :date-range="appliedDateRange" @error="handleChartError" />
        </div>
      </div>
      <div class="bg-white p-4 rounded-xl shadow-sm">
        <GenderAnalyticsChart :date-range="appliedDateRange" @error="handleChartError" />
      </div>
    </div>
    
    <!-- Second Row: WeeshStatusAnalyticsChart in second row -->
    <div class="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
      <WeeshStatusAnalyticsChart 
        class="col-span-1"
        :date-range="appliedDateRange" 
        @error="handleChartError" 
      />
      <VerificationAnalyticsChart :date-range="appliedDateRange" @error="handleChartError" />
      <CategoryAnalytics :date-range="appliedDateRange" @error="handleChartError" />
    </div>

    <!-- Third Row: BirthdayAnalyicsChart full width -->
    <div class="w-full">
      <BirthdayAnalyicsChart 
        :date-range="appliedDateRange" 
        @error="handleChartError" 
      />
    </div>

   
  </div>
  </div>
</template>

<script setup lang="ts">
import MainNav from '@/components/MainNav.vue'
import AdminCard from '@/components/AdminCards.vue'
import { useDashboardAnalyticsStore } from '@/stores/dashboard-analytics/dashboard-analytics'
import { onMounted, onBeforeMount, ref, computed } from 'vue'
import UserAnalyticsChart from '@/components/AnalyticsChart.vue'
import GenderAnalyticsChart from '@/components/GenderAnalyticsChart.vue'
import BirthdayAnalyicsChart from '@/components/BirthdayAnalyicsChart.vue'
import CategoryAnalytics from '@/components/CategoryAnalytics.vue'
import VerificationAnalyticsChart from '@/components/VerificationAnalyticsChart.vue'
import WeeshStatusAnalyticsChart from '@/components/WeeshStatusAnalyticsChart.vue'
import { storeToRefs } from 'pinia'
import { ability, defineAbilities } from '@/lib/ability';
import router from '@/router'
import { useToast } from '@/components/ui/toast'

defineAbilities()
const { toast } = useToast()

const dashboardAnalyticsStore = useDashboardAnalyticsStore()
const { weeshes, wallet, users, tickets, loading } = storeToRefs(dashboardAnalyticsStore)

// Date range state - only for charts
const tempDateRange = ref({
  start: new Date('2024-10-10').toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
});


const appliedDateRange = ref({ ...tempDateRange.value })

// Check if dates are invalid
const isDateInvalid = computed(() => {
  if (!tempDateRange.value.start || !tempDateRange.value.end) return true
  return new Date(tempDateRange.value.start) > new Date(tempDateRange.value.end)
})

// Apply date range
const applyDateRange = () => {
  if (isDateInvalid.value) {
    toast({
      title: 'Invalid Date Range',
      description: 'Start date must be before end date',
      variant: 'destructive'
    })
    return
  }
  
  appliedDateRange.value = { ...tempDateRange.value }
  toast({
    title: 'Date Range Applied',
    description: 'Charts are updating with new date range',
  })
}

onMounted(async () => {
  try {
    // Fetch dashboard analytics without date range
    await dashboardAnalyticsStore.fetchDashboardAnalytics()
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to load dashboard data',
      variant: 'destructive'
    })
  }
})

onBeforeMount(async () => {
  if(ability.cannot("read", "analytics")){
    router.push({ name: 'home' })
  }
})

// Handle chart errors
const handleChartError = (message: string) => {
  toast({
    title: 'Chart Error',
    description: message,
    variant: 'destructive'
  })
}
</script>