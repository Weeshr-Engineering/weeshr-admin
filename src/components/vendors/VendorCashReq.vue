<template>
  <div class="bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10">
    <MainNav headingText="Bank / Cash request" class="" />
    <div>
      <VendorPaymentApproval
        :items="stage"
        :openApprovalModal="modal"
        @update:openApprovalModal="handleModal"
        :requests="reqIDs"
      />
      <VendorPaymentApproval
        :items="stageGroup"
        :openApprovalModal="groupModal"
        @update:openApprovalModal="handleGroupModal"
        :requests="reqIDs"
      />
      <!-- <LienComponent :items="items" :openApprovalModal="modal"  @update:openApprovalModal="handleModal"/> -->
      <Card
        class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-14 mb-4"
      >
        <div class="flex flex-col sm:flex-row sm:gap-4 items-center justify-between py-4">
          <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-2 sm:mb-0">
            Vendors Cash Request
            <p class="text-xs sm:text-sm font-normal text-[#02072199]">List of cash payout</p>
          </div>
          <div class="flex flex-col sm:flex-row sm:gap-4 gap-3 items-centerh-full">
            <Search class="mt-3 sm:mt-0" />
            <Button
              class="bg-[#00C37F]"
              :class="createStyle"
              @click="approveGroup"
              :disabled="
                !ability.can('create', 'wallet-payouts') || stageGroup.length === 0 || !canApprove
              "
              >Approve Selection</Button
            >
            <Dialog>
              <DialogTrigger :disabled="selectedRequests.length === 0 || !canDisburse">
                <Button
                  class="bg-primary"
                  :class="createStyle"
                  v-if="ability.can('create', 'wallet-payouts')"
                  :disabled="selectedRequests.length === 0 || !canDisburse"
                  :readonly="selectedRequests.length === 0 || !canDisburse"
                  >Disburse Selection</Button
                >
              </DialogTrigger>
              <DialogContent>
                <DialogDescription>
                  Do you want to disburse all selected cash requests?
                </DialogDescription>
                <p class="text-xs text-destructive">This action is irreversable</p>
                <div class="flex gap-4">
                  <DialogClose>
                    <Button
                      @click="disburse"
                      :disabled="selectedRequests.length === 0 || !canDisburse"
                      >Disburse Selection</Button
                    >
                    <!-- <Button v-if="item.status === 'APPROVED'"  :class='stageGroup.length > 1 ? "bg-gray-400 cursor-not-allowed" : "bg-[#00C37F]"' class='text-white' @click='()=> disburse(item._id)'> Disburse </Button> -->
                  </DialogClose>
                  <DialogClose variant="">
                    <Button variant="outline" class="rounded-md"> Cancel </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div v-if="payout && payout.length !== 0" class="overflow-auto bg-white rounded-lg shadow">
          <Table class="lg:w-full w-[800px] min-h-52">
            <TableHeader>
              <TableRow
                class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
              >
                <TableHead>Select</TableHead>
                <TableHead>Recipient </TableHead>
                <TableHead>
                  <div class="flex items-center">
                    Requested Amount
                    <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                  </div>
                </TableHead>
                <TableHead>
                  <div class="flex items-center">
                    Resquest Date
                    <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                  </div>
                </TableHead>
                <!-- <TableHead>
                      <div class="flex items-center">
                        Disbursals
                        <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                      </div>
                    </TableHead> -->

                <TableHead>
                  <div class="flex items-center">
                    Status
                    <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                  </div>
                </TableHead>
                <TableHead v-if="createRole"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody class="min-h-52">
              <TableRow v-for="(item, key) in payout" :key="item._id" class="text-nowrap">
                <TableCell>
                  <div class="flex items-center justify-center w-full h-full">
                    <input
                      type="checkbox"
                      class="p-2 accent-[#020721] border-2"
                      @click="updateStageArray(item._id, payout, stageGroup, key)"
                    />
                  </div>
                </TableCell>
                <TableCell class="text-xs md:text-sm lg:text-sm"
                  >{{ item?.vendorId.companyName }}
                </TableCell>
                <TableCell class="text-xs md:text-sm lg:text-sm"
                  >₦ {{ item.payoutAmount.toLocaleString() }}
                </TableCell>
                <TableCell class="text-xs md:text-sm lg:text-sm">
                  {{ item.createdAt.split('T')[0] }}
                </TableCell>
                <TableCell>
                  <Badge
                    class="text-white rounded-full bg-gray-500"
                    v-if="item.status.toUpperCase() === 'REQUESTED'"
                    >{{ item.status.toUpperCase() }}</Badge
                  >
                  <Badge
                    class="text-white rounded-full bg-yellow-400"
                    v-if="item.status.toUpperCase() === 'PENDING'"
                    >{{ item.status.toUpperCase() }}</Badge
                  >
                  <Badge
                    class="text-white rounded-full bg-[#020721]"
                    v-if="item.status.toUpperCase() === 'DISBURSED'"
                    >{{ item.status.toUpperCase() }}</Badge
                  >
                  <Badge
                    class="text-white rounded-full bg-red-500"
                    v-if="item.status.toUpperCase() === 'REJECTED'"
                    >{{ item.status.toUpperCase() }}</Badge
                  >
                  <Badge
                    class="text-white rounded-full bg-[#00C37F]"
                    v-if="item.status.toUpperCase() === 'APPROVED'"
                  >
                    {{ item.status.toUpperCase() }}
                  </Badge></TableCell
                >
                <TableCell
                  v-if="createRole && (item.status.toUpperCase() === 'REQUESTED' || item.status.toUpperCase() === 'PENDING')"
                >
                  <svg
                    @click="singleRequest(item._id, payout, stage, key)"
                    width="20"
                    height="50"
                    viewBox="0 0 20 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 31L12.5118 26.0606C13.1627 25.4773 13.1627 24.5227 12.5118 23.9394L7 19"
                      stroke="#54586D"
                      stroke-opacity="0.8"
                      stroke-width="2"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div v-else class="flex h-full w-full flex-col gap-4 items-center justify-center px-2 sm:px-4 py-4">
          <img src="https://res.cloudinary.com/drykej1am/image/upload/v1757871471/weershr-vendor/empty-cart_x2itw9.png" class="w-60 h-60" alt="">
          <h1 class="text-2xl font-semibold animate-pulse">No Requests Yet</h1>
        </div>
        <div
          class="hidden flex gap-2 max-w-full flex-wrap justify-end mt-8 mr-4 items-center text-[15px]"
          v-if="payout.length !== 0"
        >
          <Pagination
            :total="totalPages"
            :sibling-count="1"
            show-edges
            :default-page="1"
            @change="store.handlePageChange"
          >
            <PaginationList class="flex items-center gap-1">
              <PaginationFirst @click="store.handlePageChange(1)" />
              <PaginationPrev @click="store.handlePageChange(Math.max(currentPage - 1, 1))" />
              <template v-for="(item, index) in paginationItems" :key="index">
                <PaginationListItem v-if="item.type === 'page'" :value="item.value" as-child>
                  <Button
                    class="w-10 h-10 p-0"
                    :variant="item.value === currentPage ? 'default' : 'outline'"
                    @click="store.handlePageChange(item.value)"
                  >
                    {{ item.value }}
                  </Button>
                </PaginationListItem>
                <PaginationEllipsis v-else :index="index" />
              </template>
              <PaginationNext
                @click="store.handlePageChange(Math.min(currentPage + 1, totalPages))"
              />
              <PaginationLast @click="store.handlePageChange(totalPages)" />
            </PaginationList>
          </Pagination>
        </div>
      </Card>

      <Sheet v-model:open="openRequestSheet">
        <SheetContent class="">
          <SheetHeader
            class="flex flex-col items-center w-full h-full py-5 border rounded-2xl overflow-y-auto mt-5"
          >
            <SheetTitle>Disburse Status</SheetTitle>
            <SheetDescription>
              <div
                v-for="(item, index) in selectedPayout"
                :key="index"
                class="border border-black rounded-2xl w-fit p-2 text-center shadow-md flex gap-2 items-center mb-2"
              >
                <Icon
                  :icon="item.error ? 'line-md:cancel' : 'line-md:check-all'"
                  width="35"
                  height="35"
                  style="color: #fd1414"
                />
                <div>
                  <p v-if="item.error" class="text-xs text-red-500">{{ item.error }}</p>
                  <p>
                    Recipient: <span class="font-bold">{{ item.recipient }}</span>
                  </p>
                </div>
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
    <DashboardFooter />
  </div>
</template>

<script lang="ts" setup>
import MainNav from '@/components/MainNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { ref, computed, readonly } from 'vue'
import Search from '@/components/UseSearch.vue'
import { Badge } from '@/components/ui/badge'
import { ability, defineAbilities, verifyAbilities } from '@/lib/ability'
import axios from '@/services/ApiService'
import { toast } from '@/components/ui/toast'
// import { usePayoutStore } from '@/stores/vendor/payout'
import { useVendorPayoutStore, type Payout } from '@/stores/vendor/payout'
import VendorPaymentApproval from '../VendorPaymentApproval.vue'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'

defineAbilities()
const createRole = ability.can('create', 'wallet-payouts')
const createStyle = computed(() => {
  return createRole
    ? `text-white my-2 sm:my-0 ${stageGroup.value.length !== 0 ? '' : 'cursor-not-allowed'}`
    : 'cursor-not-allowed opacity-20 text-white my-2 sm:my-0'
})
import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev
} from '@/components/ui/pagination'

interface SelectedReq {
  id: string
  recipient: string
}

interface SelectedPayout extends SelectedReq {
  success: boolean
  error: string | null
}

const store = useVendorPayoutStore()
store.getPayout(store.page, 'Page: '+store.page)
const modal = ref(false)
const canDisburse = ref<boolean>(false)
const canApprove = ref<boolean>(false)
const selectedRequests = ref<SelectedReq[]>([])
const selectedPayout = ref<SelectedPayout[]>([])
const openRequestSheet = ref<boolean>(false)

const payout = computed(() => {
  return store.payout
})
const groupModal = ref(false)
const handleModal = () => {
  modal.value = !modal.value
}
const handleGroupModal = () => {
  groupModal.value = !groupModal.value
}

const stage = ref<Stage[]>([])
const stageGroup = ref<Stage[]>([])
// const page = computed(()=>{
//   return store.page
// })
const currentPage = computed(() => {
  return store.currentPage
})
const totalPages = computed(() => {
  return store.totalPages
})
const paginationItems = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push({ type: 'page', value: i })
  }
  return pages
})

interface Stage {
  id: number
  name: string
  amount: number
  _id: string
}

function updateStageArray(id: string, sourceArray: Payout[], stageArray: Stage[], key: number): void {
  // Find the item in the source array using the provided id
  const item = sourceArray.find((obj) => obj._id === id)

  if (!item) {
    console.error(`Item with id ${id} not found in sourceArray.`)
    return
  }

  // If the checkbox is checked, add the item to the stage array if it doesn't exist
  if (!stageArray.some((obj) => obj._id === id)) {
    const tempObj = {
      id: key,
      _id: id,
      name: item.vendorId.companyName,
      amount: item.payoutAmount
    }
    stageArray.push(tempObj)
    // if (item.status.toUpperCase() === 'APPROVED') {
      selectedRequests.value.push({
        id: id,
        recipient: item.vendorId.companyName
      })
    // }
  } else {
    // If the checkbox is unchecked, remove the item from the stage array
    const index = stageArray.findIndex((obj) => obj._id === id)
    if (index !== -1) {
      stageArray.splice(index, 1)
      selectedRequests.value.splice(index, 1)
    }
  }

  const allApproved = stageArray.every((stagedId) => {
    const stagedItem = sourceArray.find((item) => item._id === stagedId._id)
    return stagedItem?.status.toUpperCase() === 'APPROVED'
  })
  const allPending = stageArray.every((stagedId) => {
    const stagedItem = sourceArray.find((item) => item._id === stagedId._id)
    return stagedItem?.status.toUpperCase() === 'REQUESTED' || stagedItem?.status.toUpperCase() === 'PENDING'
  })
  canApprove.value = allPending
  canDisburse.value = allApproved
}

const reqIDs = computed(() => {
  return selectedRequests.value.map((req) => req.id)
})

const disburse = async () => {
  toast({
    description: 'Loading...',
    variant: 'loading'
  })
  try {
    const response = await axios.post(`/api/v1/admin/market/payouts/disburse`, {
      payoutIds: reqIDs.value
    })

    const data = response.data.data.data
    if (response.data.code === 200 || response.data.code === 201) {
      selectedPayout.value = selectedRequests.value.map((item) => {
        const payoutReq = data.find((result: { payout_id: string }) => result.payout_id === item.id)

        return {
          ...item,
          success: payoutReq?.success,
          error: payoutReq?.error ?? null
        }
      })
      toast({
        description: 'Disbursement processed!',
        variant: 'success'
      })
      openRequestSheet.value = true
    }
  } catch (error: any) {
    toast({
      description: 'Bad Request',
      variant: 'destructive'
    })
  }
}

const approveGroup = () => {
  verifyAbilities('create', 'wallet-payouts')
  if (createRole) {
    groupModal.value = !groupModal.value
  }
}

const singleRequest = (id: string, sourceArray: Payout[], stageArray: Stage[], key: number) => {
  const item = sourceArray.find((obj) => obj._id === id)
  selectedRequests.value = []

  if (!item) {
    toast({
      description: `Item with id ${id} not found in sourceArray.`,
      variant: 'destructive'
    })
    return
  }
  const tempObj: Stage = {
    _id: id,
    name: item.vendorId.companyName,
    amount: item.payoutAmount,
    id: key
  }
  stageArray.splice(0, stageArray.length, tempObj)
  selectedRequests.value.push({
    id: id,
    recipient: item.vendorId.companyName
  })
  if (createRole) {
    modal.value = !modal.value
  }
}
</script>
