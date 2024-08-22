<template>
  <div
    v-if="props.openLienModal"
    @click.self="closeModal"
    class="fixed inset-0 flex items-center justify-center w-full h-full bg-black/30 backdrop-blur-md text-[#020721] z-[500]"
  >
    <Card class="rounded-[25px] px-10 md:px-6 w-3/4 md:w-1/3 ms-12 md:ms-0">
      <CardHeader class="mt-4 lg:mt-10 flex flex-col items-center justify-center">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23.3604 29.24L28.4804 24.12L23.3604 19"
            stroke="#020721"
            stroke-width="2.7"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8 24.1191H28.34"
            stroke="#020721"
            stroke-width="2.7"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M24 8C32.84 8 40 14 40 24C40 34 32.84 40 24 40"
            stroke="#020721"
            stroke-width="2.7"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </CardHeader>
      <CardDescription class="text-center text-[#020721]">
        <h1 class="text-base md:text-2xl font-bold">Lien View</h1>
        <p class="text-xs md:text-sm xl:text-lg mb-10">Summary of user's pending payout</p>
      </CardDescription>
      <CardContent>
        <div v-if="items" class="flex flex-col justify-between">
          <div>
            <h2 class="text-sm md:text-base lg:text-lg font-semibold">{{ item.fullName }}</h2>
            <div
              class="flex items-center justify-between py-2 md:py-4 px-4 md:px-6 bg-[#E5E7F1] rounded-md my-4 text-sm md:text-lg"
            >
              <p class="text-sm font-light">Felixcant</p>
              <p class="font-semibold">₦ {{ formatPrice(item.amount.toString()) }}</p>
            </div>
            <div class="flex flex-col gap-4 lg:gap-8 my-8">
              <div class="flex w-full md:w-9/12 justify-between">
                <div>
                  <p class="text-xs lg:text-base">Request Date</p>
                  <h3 class="font-bold text-sm md:text-base lg:text-lg">{{ item.request_date }}</h3>
                </div>
                <div>
                  <p class="text-xs lg:text-base">Approved Date</p>
                  <h3 class="font-bold text-sm md:text-base lg:text-lg">
                    {{ item.approved_date }}
                  </h3>
                </div>
              </div>
              <div class="flex w-full md:w-8/12 justify-between">
                <div>
                  <p class="text-xs lg:text-base">Approved by</p>
                  <h3 class="font-bold text-sm md:text-base lg:text-lg">{{ item.approved_by }}</h3>
                </div>
                <div>
                  <p class="text-xs lg:text-base">Channel</p>
                  <h3 class="font-bold text-sm md:text-base lg:text-lg">{{ item.channel }}</h3>
                </div>
              </div>
            </div>
          </div>
          <div class="w-full flex items-center justify-center cursor-pointer mb-8 mt-12">
            <Button class="text-[#F8F9FF] bg-[#54586DCC] px-6" @click="closeModal">Cancel</Button>
          </div>
        </div>
        <div v-else>No Lien data</div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardDescription, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { defineProps, defineEmits } from 'vue'

interface Item {
  fullName: string
  amount: number
  request_date: string
  approved_date: string
  approved_by: string
  channel: string
}

const item: Item = {
  fullName: 'Tochukwu Felix Onwuelo',
  amount: 1500000,
  request_date: '01 Jul 2024',
  approved_date: '04 Jul 2024',
  approved_by: 'Kemi Ogwulang',
  channel: 'Paystack'
}
interface Props {
  openLienModal: boolean
  items: Array<{ id: number; name: string; amount: number }>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (event: 'update:openLienModal', value: boolean): void
}>()

function closeModal() {
  emit('update:openLienModal', false)
}

const formatPrice = (val: string) => {
  const price = parseInt(val)
  const formattedPrice = new Intl.NumberFormat('en-US').format(price)
  return formattedPrice
}
</script>
