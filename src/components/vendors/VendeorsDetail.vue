<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ability, defineAbilities, verifyAbilities } from '@/lib/ability'
import VendorDetailCom from './vendorDetailCom.vue'

defineAbilities()
const update = true//ability.can('update', 'users')
const route = useRoute()
const id: string = route.params.id[0]

</script>

<template>
  <VendorDetailCom :id="id ? id : ''"/>
</template>