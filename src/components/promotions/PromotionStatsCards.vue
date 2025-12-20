<template>
  <div class="container w-full grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4 pt-6 text-nowrap">
    <Card
      class="h-[150px] rounded-[24px] bg-[#00C37F] cardShadow1 border-transparent transition-transform transform hover:scale-105"
    >
      <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
        <CardContent class="flex items-center justify-between space-y-0">
          <p class="text-l font-medium text-[#ffffff]">Active</p>
          <div class="weeshr-icon2 rounded-[7px]">
            <Check width="24px" height="24px" color="#00C37F" />
          </div>
          <p
            class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5"
          >
            {{ activeCount }}
          </p>
        </CardContent>
      </div>
    </Card>

    <Card
      class="h-[150px] rounded-[24px] bg-[#6A70FF] border-transparent transition-transform transform hover:scale-105"
    >
      <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
        <CardContent class="flex items-center justify-between space-y-0">
          <p class="text-l font-medium text-[#ffffff]">Scheduled</p>
          <Archive width="24px" height="24px" color="#ffffff" />
          <p
            class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5"
          >
            <span>{{ scheduledCount }}</span>
          </p>
        </CardContent>
      </div>
    </Card>

    <Card
      class="h-[150px] rounded-[24px] bg-[#3A8EE5] border-transparent transition-transform transform hover:scale-105"
    >
      <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
        <CardContent class="flex items-center justify-between space-y-0">
          <p class="text-l font-medium text-[#ffffff]">Draft</p>
          <ScrollText width="24px" height="24px" color="#ffffff" />
          <p
            class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5"
          >
            <span>{{ draftCount }}</span>
          </p>
        </CardContent>
      </div>
    </Card>

    <Card
      class="h-[150px] rounded-[24px] bg-[#DF6C50] border-transparent transition-transform transform hover:scale-105"
    >
      <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
        <CardContent class="flex items-center justify-between space-y-0">
          <p class="text-l font-medium text-[#ffffff]">Expired</p>
          <CalendarDays width="24px" height="24px" color="#ffffff" />
          <p
            class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5"
          >
            <span>{{ expiredCount }}</span>
          </p>
        </CardContent>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Check, Archive, CalendarDays, ScrollText } from 'lucide-vue-next'

defineProps<{
  activeCount: number
  scheduledCount: number
  draftCount: number
  expiredCount: number
}>()
</script>
