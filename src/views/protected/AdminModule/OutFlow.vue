// eslint-disable-next-line vue/multi-word-component-names
<template>
  <div class="bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10">
    <MainNav headingText="Bank / Outflow" class="" />

    <div class="w-full grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 pt-6 text-nowrap">
      <Card class="h-[150px] rounded-[24px] bg-[#FFFFFF] cardShadow1 border-transparent">
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#020721]">Balance</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon icon="solar:book-bold" width="24px" height="24px" color="#020721" />
            </div>
            <p
              class="text-2xl md:text-xl xl:text-3xl font-medium text-[#020721] absolute bottom-2 left-5"
            >
              <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
              <span v-else
                >{{ currencySymbol(currency) }} {{ balance.toLocaleString('en-US') }}</span
              >
            </p>
          </CardContent>
        </div>
      </Card>


      <RouterLink to="/bank">
      <Card class="h-[150px] rounded-[24px] bg-[#00C37F] cardShadow2 border-transparent transition-transform transform hover:scale-105">
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Inflow</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon
                icon="mingcute:arrow-left-down-line"
                width="24px"
                height="24px"
                color="#00C37F"
              />
            </div>

            <p
              class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5"
            >
              <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
              <span v-else
                >{{ currencySymbol(totalTransaction.currency) }}
                {{ totalTransaction.amount.toLocaleString() }}</span
              >
            </p>
          </CardContent>
        </div>
      </Card>
    </RouterLink>


      
        <Card
          class="h-[150px] rounded-[24px] bg-[#EE9F39] cardShadow3 border-transparent "
        >
          <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
            <CardContent class="flex items-center justify-between space-y-0">
              <p class="text-l font-medium text-[#ffffff]">Transfers</p>
              <div class="weeshr-icon2 rounded-[7px]">
                <Icon icon="heroicons:bars-3" width="24px" height="24px" color="#EE9F39" />
              </div>

              <p
                class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5"
              >
                <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
                <span v-else
                  >{{ currencySymbol(totalTransfers.currency) }}
                  {{ totalTransfers.amount.toLocaleString() }}</span
                >
              </p>
            </CardContent>
          </div>
        </Card>
     
    </div>
    <div>
      <Card
        class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-14 mb-4"
      >
        <div class="flex flex-col sm:flex-row items-center justify-between py-4">
          <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-2 sm:mb-0">
            Bank Outflow
            <p class="text-xs sm:text-sm font-normal text-[#02072199]">List of Outflow</p>
          </div>
          <Search class="mt-3 lg:mt-0" />
        </div>
        <div class="overflow-auto bg-white rounded-lg shadow">
          <Table class="lg:w-full w-[800px] min-h-52">
            <TableHeader>
              <TableRow
                class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200 text-nowrap"
              >
                <TableHead>Transfer Code</TableHead>
                <TableHead>Description </TableHead>
                <TableHead>
                  <div class="flex items-center">
                    Amount
                    <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                  </div>
                </TableHead>
                <TableHead>
                  <div class="flex items-center">
                    Created At
                    <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                  </div>
                </TableHead>
                <TableHead>
                  <div class="flex items-center">
                    Recepient Name
                    <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                  </div>
                </TableHead>
                <TableHead>
                  <div class="flex items-center">
                    Recepient Status
                    <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                  </div>
                </TableHead>
                <TableHead> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody class="min-h-52">
              <TableRow v-for="(item, key) in outflow" :key="key" class="text-nowrap">
                <TableCell class="text-xs md:text-sm lg:text-sm"
                  >{{ item?.transfer_code }}
                </TableCell>
                <TableCell class="text-xs md:text-sm lg:text-sm">{{ item.reason }}</TableCell>
                <TableCell class="text-xs md:text-sm lg:text-sm"
                  >{{ item.currency }} {{ item.amount.toLocaleString() }}
                </TableCell>
                <TableCell class="text-xs md:text-sm lg:text-sm">
                  {{ item.createdAt.split('T')[0] }}
                </TableCell>
                <TableCell class="text-xs md:text-sm lg:text-sm">
                  {{ item.recipient.name }}
                </TableCell>
                <!-- <TableCell class="text-xs md:text-sm lg:text-sm"> {{ item.tat[0].toString().padStart(2, '0') }}<span class='font-bold'>D</span>{{ item.tat[1].toString().padStart(2, '0') }}:<span class='font-bold'>H</span>{{ item.tat[2].toString().padStart(2, '0') }}:<span class='font-bold'>M</span> </TableCell> -->
                <TableCell
                  ><Badge
                    :class="{
                      'bg-[#00C37F]': item.recipient.active === true,
                      'bg-[#020721]': item.recipient.active === false
                    }"
                    class="text-white rounded-full"
                    >{{ item.recipient.active === true ? 'Active' : 'Disabled' }}</Badge
                  ></TableCell
                >
                <TableCell class="text-xs md:text-sm lg:text-sm">
                  <Sheet>
                    <SheetTrigger as-child>
                      <div class="flex items-center gap-2">
                        View Details
                        <svg
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
                      </div>
                    </SheetTrigger>
                    <SheetContent class="overflow-y-scroll">
                      <SheetHeader>
                        <h3 class="text-2xl font-medium">Recipient Details</h3>
                        <SheetDescription>
                          {{ item.reason }}
                        </SheetDescription>
                      </SheetHeader>
                      <Card class="p-2 flex flex-col items-center gap-4 my-4 overflow-x-scroll">
                        <div
                          class="grid grid-cols-2 border-b border-gray-400 w-full gap-4 md:gap-2"
                        >
                          <div class="col-span-1">Name</div>
                          <div class="col-span-1">{{ item.recipient.name }}</div>
                        </div>
                        <div
                          class="grid grid-cols-2 border-b border-gray-400 w-full gap-4 md:gap-2"
                        >
                          <div class="col-span-1">Reference number</div>
                          <div class="col-span-1">{{ item.recipient.recipient_code }}</div>
                        </div>
                        <div
                          class="grid grid-cols-2 border-b border-gray-400 w-full gap-4 md:gap-2"
                        >
                          <div class="col-span-1">Email</div>
                          <div class="col-span-1">{{ item.recipient.email }}</div>
                        </div>
                        <div
                          class="grid grid-cols-2 border-b border-gray-400 w-full gap-4 md:gap-2"
                        >
                          <div class="col-span-1">Type</div>
                          <div class="col-span-1">{{ item.recipient.type }}</div>
                        </div>
                        <div
                          class="grid grid-cols-2 border-b border-gray-400 w-full gap-4 md:gap-2"
                        >
                          <div class="col-span-1">Account Name</div>
                          <div class="col-span-1">{{ item.recipient.details.account_name }}</div>
                        </div>
                        <div
                          class="grid grid-cols-2 border-b border-gray-400 w-full gap-4 md:gap-2"
                        >
                          <div class="col-span-1">Account Number</div>
                          <div class="col-span-1">{{ item.recipient.details.account_number }}</div>
                        </div>
                        <div
                          class="grid grid-cols-2 border-b border-gray-400 w-full gap-4 md:gap-2"
                        >
                          <div class="col-span-1">Bank</div>
                          <div class="col-span-1">{{ item.recipient.details.bank_name }}</div>
                        </div>
                        <div
                          class="grid grid-cols-2 border-b border-gray-400 w-full gap-4 md:gap-2"
                        >
                          <div class="col-span-1">Bank Code</div>
                          <div class="col-span-1">{{ item.recipient.details.bank_code }}</div>
                        </div>
                        <div
                          class="grid grid-cols-2 border-b border-gray-400 w-full gap-4 md:gap-2"
                        >
                          <div class="col-span-1">Integration</div>
                          <div class="col-span-1">{{ item.recipient.integration }}</div>
                        </div>
                      </Card>

                      <div class="w-full flex items-center justify-center">
                        <SheetClose><Button>Close</Button></SheetClose>
                      </div>
                    </SheetContent>
                  </Sheet>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div
          class="flex gap-2 max-w-full flex-wrap justify-end mt-8 mr-4 items-center text-[15px]"
          v-if="outflow.length !== 0"
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
    </div>
    <DashboardFooter />
  </div>
</template>

<script lang="ts" setup>
import MainNav from '@/components/MainNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { computed, onMounted } from 'vue'
import Search from '@/components/UseSearch.vue'
import { Badge } from '@/components/ui/badge'
import { ability, defineAbilities, verifyAbilities } from '@/lib/ability'
import { useBankStore } from '@/stores/bank/bank'
import { useBankBalanceStore } from '@/stores/bank/bank-balance'
import { Loader2 } from 'lucide-vue-next'




defineAbilities()
const createRole = ability.can('create', 'wallet-payouts')
const createStyle = computed(() => {
  return createRole
    ? `text-white bg-[#00C37F] rounded-full my-2 sm:my-0`
    : 'cursor-not-allowed opacity-20 text-white bg-[#00C37F] rounded-full my-2 sm:my-0'
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet'

const store1 = useBankBalanceStore()

const currencySymbol = (currency: string) => {
  switch (currency) {
    case 'USD':
      return '$'
    case 'NGN':
      return '₦'
    default:
      return currency
  }
}


const balance = computed(() => {
  return store1.balance
})

const currency = computed(() => {
  return store1.currency
})

const totalTransaction = computed(() => {
  return { amount: store1.totalTransactionsAmount, currency: store1.totalTransactionCurrency }
})

const totalTransfers = computed(() => {
  return { amount: store1.totalTransfersAmount, currency: store1.totalTransfersCurrency }
})


const store = useBankStore()
const outflow = computed(() => {
  return store.outFlow
})
if (outflow.value.length < 1) {
  store.getoutFlow()
}

const loading = computed(() => {
  return store1.loading
})
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

onMounted(async () => {
  store1.getPayoutBalance()
  await store1.getBalance()
  await store1.getTotals()

  
})


</script>

<style scoped>
.cardShadow1 {
  box-shadow:
    0px 31px 30px -23px #dddcdc,
    inset 0px -23px 20px -23px rgba(0, 0, 0, 0.25);
}

.cardShadow2 {
  box-shadow:
    0px 31px 30px -23px #00c37f,
    inset 0px -23px 20px -23px rgba(0, 0, 0, 0.25);
}

.cardShadow3 {
  box-shadow:
    0px 31px 30px -23px #ee9f39,
    inset 0px -23px 30px -23px rgba(0, 0, 0, 0.25);
}

.cardShadow4 {
  box-shadow:
    0px 31px 30px -23px #e45044,
    inset 0px -23px 20px -23px rgba(0, 0, 0, 0.25);
}

.weeshr-icon1 {
  background-color: black;
}

.weeshr-icon2 {
  background-color: white;
}
</style>
