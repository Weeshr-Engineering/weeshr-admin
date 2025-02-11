<template>
  <Card class="h-[210px] rounded-[24px] shadow-md transition-transform transform hover:scale-105">
    <div :class="`h-[130px] pt-4 ${topBgColor} relative rounded-tr-[24px] rounded-tl-[24px]`">
      <CardContent class="flex items-center justify-between space-y-0">
        <p class="text-l font-medium text-[#020721]">{{ title }}</p>
        <img class="h-6 w-6" :src="iconSrc" alt="icon" />
        <div class="text-2xl lg:text-2xl font-medium text-[#020721] absolute bottom-2 left-5">
          <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
          <p v-else>{{ formattedValue }}</p>
        </div>
      </CardContent>
    </div>
    <div class="bg-[#020721] pt-2 h-[80px] rounded-bl-[24px] rounded-br-[24px]">
      <CardContent class="flex flex-col space-y-0">
        <p class="text-l font-normal text-[#F8F9FFB2]">{{ subtitle }}</p>
        <div class="text-2xl font-normal text-white">
          <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-white animate-spin" />
          <p v-else>{{ formattedSubvalue }}</p>
        </div>
      </CardContent>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String as () => 'weeshes' | 'wallet' | 'users' | 'tickets',
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  subvalue: {
    type: Number,
    required: true
  }
})

// Card configuration based on type
const cardConfig = computed(() => {
  switch (props.type) {
    case 'weeshes':
      return {
        title: 'Weeshes',
        iconSrc: 'https://res.cloudinary.com/dotojp6xu/image/upload/v1715162947/menu_mvjoy6.svg',
        subtitle: 'Delivered',
        topBgColor: 'bg-[#00e19d] bg-opacity-20'
      }
    case 'wallet':
      return {
        title: 'Total wallet balance',
        iconSrc:
          'https://res.cloudinary.com/dotojp6xu/image/upload/v1715162926/wallet-3_fbkk9u.svg',
        subtitle: 'Invested',
        topBgColor: 'bg-[#6A70FF] bg-opacity-20'
      }
    case 'users':
      return {
        title: 'Users',
        iconSrc:
          'https://res.cloudinary.com/dotojp6xu/image/upload/v1715162907/profile-2user_stezwz.svg',
        subtitle: 'Active',
        topBgColor: 'bg-[#00BBD4] bg-opacity-20'
      }
    case 'tickets':
      return {
        title: 'Tickets',
        iconSrc: 'https://res.cloudinary.com/dotojp6xu/image/upload/v1715162881/ticket_etur0t.svg',
        subtitle: 'Pending',
        topBgColor: 'bg-[#AEE219] bg-opacity-20'
      }
    default:
      throw new Error(`Invalid card type: ${props.type}`)
  }
})

const { title, iconSrc, subtitle, topBgColor } = cardConfig.value

// Formatting functions
const formatNumberWithCommas = (number: number) =>
  number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

const formatCurrency = (number: number) => {
  const [integerPart, decimalPart] = number.toFixed(2).split('.')
  return `₦${integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decimalPart}`
}

// Conditionally format values
const formattedValue = computed(() =>
  props.type === 'wallet' ? formatCurrency(props.value) : formatNumberWithCommas(props.value)
)

const formattedSubvalue = computed(() =>
  props.type === 'wallet' ? formatCurrency(props.subvalue) : formatNumberWithCommas(props.subvalue)
)
</script>
