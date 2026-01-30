<script setup lang="ts">
import { defineProps } from 'vue'
import VendorsIcon from './VendorsIcon.vue'
// Function to format the date in the desired format (e.g., "Tue, 5 Feb 2023")
import { useDateFormat, useNow } from '@vueuse/core'
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import VendorShare from './vendors/VendorShare.vue'

const superAdminStore = useSuperAdminStore()
const formattedDate = useDateFormat(useNow(), 'ddd, D MMM YYYY')

const props = defineProps<{
  headingText: string
}>()

const headingText = props.headingText
</script>

<template>
  <nav class="flex items-center justify-between p-4 py-6 sm:space-x-4 lg:space-x-6 w-full md:w-auto">
    <div>
      <h4 class="text-[#02072199] text-sm">
        {{ formattedDate }}
      </h4>

      <h2 class="text-3xl">
        {{ headingText }}
      </h2>
    </div>

    <div class="flex items-center ml-auto space-x-2">
      <VendorShare :vendor-name="superAdminStore.companyName" />
      <div class="hidden sm:flex items-center space-x-2 ml-auto">
          <div>
          <h6 class="font-semibold">{{ superAdminStore.companyName }}</h6>
          <!-- <h6 class="text-xs text-end text-[#373B4D]">Administrator</h6> -->
        </div>
        <VendorsIcon/>
      </div>
    </div>
  </nav>
</template>
