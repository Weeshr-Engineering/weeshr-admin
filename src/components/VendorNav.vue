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
  <nav class="flex items-center justify-between px-2 sm:px-4 py-4 lg:px-8 sm:py-6 lg:space-x-6 w-full md:w-auto">
    <div class="min-w-0">
      <h4 class="text-[#02072199] text-xs sm:text-sm truncate">
        {{ formattedDate }}
      </h4>

      <h2 class="text-xl sm:text-2xl lg:text-3xl truncate">
        {{ headingText }}
      </h2>
    </div>

    <div class="flex items-center ml-auto space-x-2 shrink-0">
      <VendorShare :vendor-name="superAdminStore.companyName" />
      <div class="hidden sm:flex items-center space-x-2 ml-auto">
          <div>
          <h6 class="font-semibold text-sm truncate max-w-[120px] lg:max-w-none">{{ superAdminStore.companyName }}</h6>
          <!-- <h6 class="text-xs text-end text-[#373B4D]">Administrator</h6> -->
        </div>
        <VendorsIcon/>
      </div>
    </div>
  </nav>
</template>
