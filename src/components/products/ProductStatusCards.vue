<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Check, ScrollText, Battery, Archive } from 'lucide-vue-next'

interface Props {
  publishedCount: number
  draftCount: number
  archivedCount: number
  outOfStockCount: number
}

defineProps<Props>()
</script>

<template>
  <div class="w-full grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4 pt-6">
    <!-- Published Card -->
    <Card
      class="h-[150px] rounded-[24px] bg-[#00C37F] cardShadow1 border-transparent transition-transform transform hover:scale-105"
    >
      <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
        <CardContent class="flex items-center justify-between space-y-0">
          <p class="text-l font-medium text-[#FFFFFF]">Published</p>
          <div class="weeshr-icon2 rounded-[7px]">
            <Check width="24px" height="24px" color="#00C37F" />
          </div>
          <p class="text-2xl lg:text-3xl font-medium text-[#FFFFFF] absolute bottom-2 left-5">
            {{ publishedCount }}
          </p>
        </CardContent>
      </div>
    </Card>

    <!-- Draft Card -->
    <Card
      class="h-[150px] rounded-[24px] bg-[#6A70FF] cardShadow1 border-transparent transition-transform transform hover:scale-105"
    >
      <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
        <CardContent class="flex items-center justify-between space-y-0">
          <p class="text-l font-medium text-[#FFFFFF]">Draft</p>
          <div class="weeshr-icon2 rounded-[7px]">
            <ScrollText width="24px" height="24px" color="#6A70FF" />
          </div>
          <p class="text-2xl lg:text-3xl font-medium text-[#FFFFFF] absolute bottom-2 left-5">
            {{ draftCount }}
          </p>
        </CardContent>
      </div>
    </Card>

    <!-- Archived Card -->
    <Card
      class="h-[150px] rounded-[24px] bg-[#3A8EE5] cardShadow1 border-transparent transition-transform transform hover:scale-105"
    >
      <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
        <CardContent class="flex items-center justify-between space-y-0">
          <p class="text-l font-medium text-[#FFFFFF]">Archived</p>
          <div class="weeshr-icon2 rounded-[7px]">
            <Archive width="24px" height="24px" color="#3A8EE5" />
          </div>
          <p class="text-2xl lg:text-3xl font-medium text-[#FFFFFF] absolute bottom-2 left-5">
            {{ archivedCount }}
          </p>
        </CardContent>
      </div>
    </Card>

    <!-- Out of Stock Card -->
    <Card
      class="h-[150px] rounded-[24px] bg-[#DF6C50] cardShadow1 border-transparent transition-transform transform hover:scale-105"
    >
      <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
        <CardContent class="flex items-center justify-between space-y-0">
          <p class="text-l font-medium text-[#FFFFFF]">Out of Stock</p>
          <div class="weeshr-icon2 rounded-[7px]">
            <Battery width="24px" height="24px" color="#DF6C50" />
          </div>
          <p class="text-2xl lg:text-3xl font-medium text-[#FFFFFF] absolute bottom-2 left-5">
            {{ outOfStockCount }}
          </p>
        </CardContent>
      </div>
    </Card>
  </div>
</template>

<style scoped>
.cardShadow1 {
  box-shadow:
    0px 31px 30px -23px #dddcdc,
    inset 0px -23px 20px -23px rgba(0, 0, 0, 0.25);
}

.weeshr-icon2 {
  background-color: white;
}
</style>
