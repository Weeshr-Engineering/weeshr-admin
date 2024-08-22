<template>
  <div
    v-if="props.openApprovalModal"
    @click.self="closeModal"
    class="fixed inset-0 flex items-center justify-center w-full h-full bg-black/30 backdrop-blur-md z-[500]"
  >
    <Card class="rounded-[25px] px-6 w-10/12 md:w-1/3 my-4 ms-10 md:ms-0 mt-10">
      <CardHeader class="mt-10">
        <Icon
          icon="ri:secure-payment-line"
          width="50px"
          height="50px"
          class="text-[#00c37f] mx-auto"
        />
      </CardHeader>
      <CardDescription>
        <p class="text-2xl text-black text-center font-medium">Be sure to review carefully!</p>
        <p class="text-lg mb-10 mt-2 text-center">
          You're about to approve the following transactions
        </p>
      </CardDescription>
      <CardContent class="w-9/12">
        <div v-if="items.length !== 0">
          <div v-for="item in items" :key="item.id">
            <div class="flex justify-between bg-gray-200 p-2 mb-2 rounded-md">
              <p>{{ item.name }}</p>
              <p>₦ {{ item.amount.toLocaleString() }}</p>
            </div>
          </div>
          <div class="flex flex-col md:flex-row justify-between items-center my-12">
            <div class="mb-4 md:mb-0">
              <p>Total amount approved</p>
              <p class="font-bold text-2xl">₦ 5,190,500</p>
            </div>
            <div>
              <Button
                @click="approveTransactions"
                class="bg-[#00c37f] rounded-[15px] px-10 py-6 font-light"
              >
                Approve
              </Button>
            </div>
          </div>
          <div class="w-full flex justify-center cursor-pointer mb-6" @click="closeModal">
            <p class="text-gray-300">Cancel</p>
          </div>
        </div>
        <div v-else class="text-center text-sm md:text-base">
          No transaction is currently awaiting approval
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardDescription, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { defineProps, defineEmits } from 'vue'

interface Props {
  openApprovalModal: boolean
  items: Array<{ id: number; name: string; amount: number }>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (event: 'update:openApprovalModal', value: boolean): void
}>()

function closeModal() {
  emit('update:openApprovalModal', false)
}

function approveTransactions() {
  // Logic for approving transactions
  emit('update:openApprovalModal', false)
}
</script>
