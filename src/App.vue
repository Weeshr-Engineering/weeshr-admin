<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toaster from '@/components/ui/toast/UseToaster.vue'
import SideBar from '@/components/SideBar.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import { useGeneralStore } from '@/stores/general-use'

const superAdminStore = useGeneralStore()
</script>

<template>
  <div>
    <LoadingSpinner v-if="superAdminStore.loading" />

    <div v-else class="h-screen w-screen overflow-hidden">
      <SideBar v-if="!$route.meta.hideSidebar" />

      <div class="relative !overflow-auto !h-full" :class="{ 'ml-[4rem]': !$route.meta.hideSidebar }">
        <RouterView  class="!overflow-auto"/>
      </div>

      <Toaster />
    </div>
  </div>
</template>

<style scoped></style>
