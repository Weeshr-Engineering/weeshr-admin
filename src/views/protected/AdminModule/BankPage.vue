<template>
  <div class="flex-col flex bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10">
    <MainNav class="mx-6" headingText="Bank" />

    <div class="w-full grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 pt-6 text-nowrap">
      <Card class="h-[150px] rounded-[24px] bg-[#FFFFFF] cardShadow1 border-transparent">
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#020721]">Balance</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon icon="solar:book-bold" width="24px" height="24px" color="#020721" />
            </div>
            <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#020721] absolute bottom-2 left-5">
              <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
              <span v-else>{{ currencySymbol(currency) }} {{ balance.toLocaleString('en-US') }}</span>
            </p>
          </CardContent>
        </div>
      </Card>

      <Card class="h-[150px] rounded-[24px] bg-[#00C37F] cardShadow2 border-transparent">
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Inflow</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon icon="mingcute:arrow-left-down-line" width="24px" height="24px" color="#00C37F" />
            </div>

            <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
              <span v-else>{{ currencySymbol(totalTransaction.currency) }}
                {{ totalTransaction.amount.toLocaleString() }}</span>
            </p>
          </CardContent>
        </div>
      </Card>

      <RouterLink to="/bank/outflow">
        <Card
          class="h-[150px] rounded-[24px] bg-[#EE9F39] cardShadow3 border-transparent transition-transform transform hover:scale-105">
          <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
            <CardContent class="flex items-center justify-between space-y-0">
              <p class="text-l font-medium text-[#ffffff]">Transfers</p>
              <div class="weeshr-icon2 rounded-[7px]">
                <Icon icon="heroicons:bars-3" width="24px" height="24px" color="#EE9F39" />
              </div>

              <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
                <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
                <span v-else>{{ currencySymbol(totalTransfers.currency) }}
                  {{ totalTransfers.amount.toLocaleString() }}</span>
              </p>
            </CardContent>
          </div>
        </Card>
      </RouterLink>
    </div>

    <!-- Account -->
    <div v-if="readRole"
      class="w-full px-6 py-4 flex flex-col gap-8 md:gap-0 md:flex-row items-start md:items-center justify-between bg-[#E4E6F5] rounded-xl mt-4 md:mt-6">
      <div class="flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14.7906 23.2841C15.1111 23.3587 15.1405 23.7785 14.8283 23.8826L12.985 24.4892C8.3533 25.9826 5.91497 24.7342 4.40997 20.1026L2.91664 15.4942C1.4233 10.8626 2.65997 8.41255 7.29164 6.91922L8.0723 6.66069C8.47517 6.52727 8.86472 6.9304 8.74591 7.33781C8.66197 7.62565 8.58233 7.92946 8.50497 8.24922L7.36164 13.1376C6.0783 18.6326 7.95664 21.6659 13.4516 22.9726L14.7906 23.2841Z"
            fill="#020721" />
          <path
            d="M20.0317 3.7446L18.0833 3.2896C14.1867 2.36794 11.865 3.12627 10.5 5.9496C10.15 6.66127 9.87001 7.5246 9.63667 8.51627L8.49334 13.4046C7.35001 18.2813 8.85501 20.6846 13.72 21.8396L15.68 22.3063C16.3567 22.4696 16.9867 22.5746 17.57 22.6213C21.21 22.9713 23.1467 21.2679 24.1267 17.0563L25.27 12.1796C26.4133 7.30294 24.92 4.88794 20.0317 3.7446ZM17.8383 15.5513C17.7333 15.9479 17.3833 16.2046 16.9867 16.2046C16.9167 16.2046 16.8467 16.1929 16.765 16.1813L13.37 15.3179C12.9033 15.2013 12.6233 14.7229 12.74 14.2563C12.8567 13.7896 13.335 13.5096 13.8017 13.6263L17.1967 14.4896C17.675 14.6063 17.955 15.0846 17.8383 15.5513ZM21.2567 11.6079C21.1517 12.0046 20.8017 12.2613 20.405 12.2613C20.335 12.2613 20.265 12.2496 20.1833 12.2379L14.525 10.8029C14.0583 10.6863 13.7783 10.2079 13.895 9.74127C14.0117 9.2746 14.49 8.9946 14.9567 9.11127L20.615 10.5463C21.0933 10.6513 21.3733 11.1296 21.2567 11.6079Z"
            fill="#020721" />
        </svg>
        <p>Cash Request</p>
      </div>
      <div class="flex items-center gap-2 text-nowrap">
        <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
        <p v-else class="text-lg md:text-2xl">₦ {{payout.toLocaleString()}}</p>
        <RouterLink to="/bank/cash-request"><svg width="35" height="35" class="h-6 w-6 md:w-auto md:h-auto"
            viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15 36.6673H25C33.3334 36.6673 36.6667 33.334 36.6667 25.0007V15.0007C36.6667 6.66732 33.3334 3.33398 25 3.33398H15C6.66671 3.33398 3.33337 6.66732 3.33337 15.0007V25.0007C3.33337 33.334 6.66671 36.6673 15 36.6673Z"
              stroke="#020721" stroke-opacity="0.6" stroke-width="3.0625" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M17.9 25.8839L23.7667 20.0005L17.9 14.1172" stroke="#020721" stroke-opacity="0.6"
              stroke-width="3.0625" stroke-linecap="round" stroke-linejoin="round" />
          </svg></RouterLink>
      </div>
    </div>

    <Card class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-14 mb-4">
      <div class="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
        <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-2 sm:mb-0 w-full lg:w-1/4">
          Bank Inflow
          <p class="text-xs sm:text-sm font-normal text-[#02072199]">List of Inflow</p>
        </div>
        <div class="flex gap-2 items-center flex-wrap px-4">
          <DropdownMenu>
            <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5]">
              <Button variant="outline">
                <div class="flex items-center text-[10px] md:text-xs capitalize">
                  {{ filter.status || 'Status' }}
                  <Icon icon="ion:chevron-down-outline" class="ml-1" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="item-center justify-between">
              <DropdownMenuCheckboxItem @click="() => handleClick('')">
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem @click="() => handleClick('success')">
                Success
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem @click="() => handleClick('failed')">
                Failed
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem @click="() => handleClick('abandoned')">
                Abandoned
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            class="flex-grow-0 bg-gray-50 text-gray-900 text-sm rounded-2xl dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
            <span>From: </span>
            <Input type="date" @change="updateFromDate" class="bg-transparent text-white ms-2" />
          </Button>
          <Button
            class="flex-grow-0 bg-gray-50 text-gray-900 text-sm rounded-2xl dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
            <span>To: </span>
            <Input type="date" @change="updateToDate" class="bg-transparent text-white ms-2" />
          </Button>
          <Button
            class="bg-gray-50 text-gray-900 text-sm rounded-2xl dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white">
            <Input type="number" @keydown="filterAmount" class="bg-transparent text-white ms-2" placeholder="Amount"
              :value="inputValue" @input="updateInputValue" />
          </Button>
          <Button variant="outline" class="rounded-2xl bg-[#EEEFF5] text-sm" @click="() => resetFilters()">
            Clear filter
          </Button>
          <Search class="mt-3 lg:mt-0 flex-grow" />
        </div>
      </div>
      <div class="overflow-auto bg-white rounded-lg shadow">
        <Table class="lg:w-full w-[800px]">
          <TableHeader>
            <TableRow class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200">
              <TableHead>Recipient </TableHead>
              <!-- <TableHead>Weeshes</TableHead> -->
              <TableHead>Weesher</TableHead>
              <TableHead> Date </TableHead>
              <TableHead> Amount </TableHead>
              <TableHead> Channel </TableHead>
              <TableHead> Status </TableHead>
              <TableHead> Gateway Response </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="transaction in bank" :key="transaction._id">
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ !transaction.metadata.user ? '--' :
                transaction.metadata.user.email }}
              </TableCell>
              <!-- <TableCell class="text-xs md:text-sm lg:text-sm">
                {{ }}</TableCell
              > -->
              <TableCell class="text-xs md:text-sm lg:text-sm">{{
                !transaction.customer.email || transaction.customer.isAnonymous
                  ? '--'
                  : transaction.customer.email
              }}</TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm text-nowrap min-w-fit">{{ transaction.created_at ?
                dateFormat(transaction.created_at) : '--' }}
              </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm text-nowrap min-w-fit"
                >{{ currencySymbol(transaction.currency) }}
                {{ transaction.amount.toLocaleString() }}
              </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">
                {{ transaction.channel }}
              </TableCell>
              <TableCell>
                <div class="rounded-[10px] w-fit px-2 py-0.5 text-white text-sm capitalize"
                  :class="statusBg(transaction.status)">
                  {{ transaction.status }}
                </div>
              </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm text-nowrap">
                {{ transaction.gateway_response }}
              </TableCell>
            </TableRow>
            <TableRow v-if="bank.length === 0" :key="0"> No transactions are available </TableRow>
          </TableBody>
        </Table>
      </div>
      <PagePagination :page-total="pagination.pageCount" :page-current="filter.page" @pagination="handlePageChange" />
    </Card>
    <DashboardFooter />
  </div>
</template>

<script lang="ts" setup>
import Search from '@/components/UseSearch.vue'
import MainNav from '@/components/MainNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import { Card, CardContent } from '@/components/ui/card'
import { ability, defineAbilities } from '@/lib/ability'
import { useBankBalanceStore, type FilterSort } from '@/stores/bank/bank-balance'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'
import { Loader2 } from 'lucide-vue-next'
import { computed, onMounted, reactive, ref } from 'vue'
import PagePagination from '@/components/PagePagination.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

defineAbilities()
const readRole = ability.can('read', 'wallet-payouts')

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

const dateFormat = (date: string): string => {
  const newDate = new Date(date)

  const day = String(newDate.getUTCDate()).padStart(2, '0')

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  const month = monthNames[newDate.getUTCMonth()]
  const year = newDate.getUTCFullYear()

  const formattedDate = `${day} - ${month} - ${year}`

  return formattedDate
}

const statusBg = (status: string) => {
  switch (status) {
    case 'abandoned':
      return 'bg-[#EE9F39]'
    case 'failed':
      return 'bg-[#E45044]'
    case 'success':
      return 'bg-[#00c37f]'
    default:
      return ''
  }
}

const store = useBankBalanceStore()

const balance = computed(() => {
  return store.balance
})

const currency = computed(() => {
  return store.currency
})

const payout = computed(()=>{
  return store.payout
})

const bank = computed(() => {
  return store.bank;
})

const loading = computed(() => {
  return store.loading
})

const totalTransaction = computed(() => {
  return { amount: store.totalTransactionsAmount, currency: store.totalTransactionCurrency }
})

const totalTransfers = computed(() => {
  return { amount: store.totalTransfersAmount, currency: store.totalTransfersCurrency }
})

const pagination = computed(() => {
  return { page: store.page, pageCount: store.pageCount }
})

const filter = reactive<FilterSort>({
  page: 1,
  perPage: 40
})

const handlePageChange = (value: number) => {
  filter.page = value
  store.getTransactions(filter)
}

const handleClick = (status: string) => {
  filter.status = status
  store.getTransactions(filter)
}
const updateFromDate = (e: Event) => {
  const target = e.target as HTMLInputElement
  filter.from = target.value
}

const updateToDate = (e: Event) => {
  const target = e.target as HTMLInputElement
  filter.to = target.value
  store.getTransactions(filter)
}

const inputValue = ref('')

const updateInputValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  inputValue.value = target.value
}

const filterAmount = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    const target = e.target as HTMLInputElement
    filter.amount = parseInt(target.value)
    store.getTransactions(filter)
    inputValue.value = ''
  }
}

const resetFilters = () => {
  filter.status = ''
  filter.from = ''
  filter.to = ''
  filter.amount = null
  store.getTransactions(filter)
}

onMounted(async () => {
  store.getPayoutBalance()
  await store.getBalance()
  await store.getTotals()
  await store.getTransactions(filter)
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
