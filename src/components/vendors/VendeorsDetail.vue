<script setup lang="ts">
import { useRoute } from 'vue-router'
import VendorDetailCom from './vendorDetailCom.vue'

const route = useRoute()
const id: any = route.params.id

</script>

<template>
  <VendorDetailCom :id="id ? id : ''"/>
</template>