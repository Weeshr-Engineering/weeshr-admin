<script setup lang="ts">
import { computed } from 'vue'
import VendorDetailCom from './vendorDetailCom.vue'
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'

const store = useSuperAdminStore()

const id = computed(() => store.vendorId)
</script>



<template>
  <VendorDetailCom :id="id"/>
</template>