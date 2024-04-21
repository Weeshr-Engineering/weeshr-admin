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

    <div v-else>
      <SideBar v-if="!$route.meta.hideSidebar" />

      <div :class="{ 'ml-[4rem]': !$route.meta.hideSidebar }">
        <RouterView />
      </div>

      <Toaster />
    </div>
  </div>
</template>

<style scoped></style>
