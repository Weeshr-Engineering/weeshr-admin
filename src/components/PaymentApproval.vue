<template>
  <div
    v-if="props.openApprovalModal"
    @click.self="closeModal"
    class="fixed inset-0 flex items-center justify-center w-full h-full bg-black/30 backdrop-blur-md z-50"
  >
    <Card class="rounded-md px-6">
      <CardHeader class="mt-10">
        <Icon
          icon="ri:secure-payment-line"
          width="40px"
          height="40px"
          class="text-[#00c37f] mx-auto"
        />
      </CardHeader>
      <CardDescription>
        <p class="text-2xl text-black text-center font-medium">Be sure to review carefully!</p>
        <p class="text-lg mb-10">You're about to approve the following transactions</p>
      </CardDescription>
      <CardContent>
        <div v-if="items">
          <div v-for="item in items" :key="item.id">
            <div class="flex justify-between bg-gray-200 p-2 mb-2 rounded-md">
              <p>{{ item.name }}</p>
              <p>NGN {{ item.amount.toLocaleString() }}</p>
            </div>
          </div>
          <div class="flex justify-between items-center my-12">
            <div>
              <p>Total amount approved</p>
              <p class="font-bold text-2xl">NGN 5,190,500</p>
            </div>
            <div>
              <Button @click="approveTransactions" class="rounded-md bg-[#00c37f]">
                Approve
              </Button>
            </div>
          </div>
          <div class="w-full flex justify-center cursor-pointer mb-4" @click="closeModal">
            <p class="text-gray-300">Cancel</p>
          </div>
        </div>
        <div v-else>No transaction is currently awaiting approval</div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardDescription, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { defineProps, defineEmits } from 'vue'
import type { Ref } from 'vue'

interface Props {
  openApprovalModal: Ref<boolean>
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
