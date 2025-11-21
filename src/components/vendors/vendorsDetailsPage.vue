<script setup lang="ts">
import VendorDetailCom from './vendorDetailCom.vue'
import { useSuperAdminStore } from '@/stores/super-admin/super-admin';

const id = useSuperAdminStore().vendorId;

</script>

<template>
  <VendorDetailCom :id="id ? id : ''"/>
</template>