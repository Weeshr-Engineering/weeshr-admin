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
        <div v-if="items.length !== 0">
          <div v-for="item in items" :key="item.id">
            <div class="flex justify-between bg-gray-200 p-2 mb-2 rounded-md">
              <p>{{ item.name }}</p>
              <p>NGN {{ item.amount.toLocaleString() }}</p>
            </div>
          </div>
          <div class="flex justify-between items-center my-12">
            <div>
              <p>Total amount approved</p>
              <p class="font-bold text-2xl">NGN {{ total.toLocaleString()  }}</p>
            </div>
            <div class='flex items-center gap-4'>
              <Dialog>
                <DialogTrigger>
                  <Button variant='destructive' class="rounded-md">
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogDescription>
                    Do you want to reject all selected cash requests?
                  </DialogDescription>
                  <div class='flex gap-4'>
                    <textarea class="w-full" v-model="reason" name="reason" placeholder="Reason" id=""></textarea>
                    <DialogClose>
                      <Button variant="destructive" class="rounded-md" @click='rejectRequest'>
                        Reject
                      </Button>
                    </DialogClose>
                    <DialogClose variant="">
                      <Button variant="outline" class="rounded-md">
                        Cancel
                      </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
              <Button @click="approveRequest" class="rounded-md bg-[#00c37f]">
                Approve
              </Button>
            </div>
          </div>
          <div class="w-full flex justify-center cursor-pointer mb-4" @click="closeModal">
            <p class="text-gray-300">Cancel</p>
          </div>
        </div>
        <div v-else class="text-center text-sm md:text-base">No transaction is currently awaiting approval</div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardDescription, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { defineProps, defineEmits, computed, ref } from 'vue'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTrigger } from './ui/dialog'
import axios from "@/services/ApiService";
import { toast } from '@/components/ui/toast'
import { catchErr } from '@/composables/catchError'

interface Props {
  openApprovalModal: boolean
  items: Array<{ id: number; name: string; amount: number }>
  requests: string | string[],
}

const props = defineProps<Props>()
const reason = ref('')
const emit = defineEmits<{
  (event: 'update:openApprovalModal', value: boolean): void
}>()

function closeModal() {
  emit('update:openApprovalModal', false)
}

const rejectRequest = async()=>{
      toast({
        description: 'Loading...',
        variant: 'loading',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })
      const admin = JSON.parse(localStorage.getItem('user') || '')
      try {
        const response = await axios.post(
          "/api/v1/admin/market/payouts/reject",
          {
            payoutIds: props.requests,
            reason,
            adminId: admin.id
          }
        )

        if (response.status === 200 || response.status === 201) {
          toast({
            description: response.data.message,
            variant: 'success'
          })
          closeModal()
        }
      } catch (error: any) {
        catchErr(error)
      }
  }

  const approveRequest = async()=>{
      toast({
        description: 'Loading...',
        variant: 'loading',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })
      const admin = JSON.parse(localStorage.getItem('user') || '')
      try {
        const response = await axios.post(
          "/api/v1/admin/market/payouts/approve",
          {
            payoutIds: props.requests,
            adminId: admin.id
          }
        )

        if (response.status === 200 || response.status === 201) {
          toast({
            description: response.data.message,
            variant: 'success'
          })
          closeModal()
        }
      } catch (error: any) {
        catchErr(error)
      }
  }

interface Item {
    id: number;
    amount: number;
    name: string;
    [key: string]: any; // Other properties of the item
  }
const total = computed(()=>{
  return(
    sumAmounts(props.items)
  )
})
function sumAmounts(items: Item[]): number {
  return items.reduce((total, item) => total + item.amount, 0);
}

</script>
