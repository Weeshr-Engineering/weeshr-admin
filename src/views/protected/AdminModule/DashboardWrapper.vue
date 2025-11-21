<script setup lang="ts">
import { computed } from 'vue'
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import VendorsList from './VendorsList.vue'
import AdminDashboard from './AdminDashboard.vue'

const store = useSuperAdminStore()

const View = computed(() =>
  store.isVendor ? VendorsList : AdminDashboard
)
</script>

<template>
  <component :is="View" />
</template>
