<template>
  <div class="flex-col flex bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10">
    <MainNav class="mx-6" headingText="Weeshes" />
    <div class="w-full grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-95 bg-[#FFFFFF] cardShadow1 border-transparent"
        @click="() => handleStatus('ADDED')"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#020721]">Added</p>
            <div class="weeshr-icon rounded-[7px]">
              <Icon icon="mdi:plus" width="24px" height="24px" color="#ffffff" />
            </div>
            <div class="text-2xl lg:text-3xl font-medium text-[#020721] absolute bottom-2 left-5">
              <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
              <p v-if="!loading">{{ addedCount }}</p>
            </div>
          </CardContent>
        </div>
      </Card>
      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-95 delay-150 bg-[#EE9F39] cardShadow2 border-transparent"
        @click="() => handleStatus('INITIATED')"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Initiated</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon icon="lets-icons:export" width="24px" height="24px" color="#ee9f39" />
            </div>
            <div class="text-2xl lg:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
              <p v-if="!loading">{{ initiatedCount }}</p>
            </div>
          </CardContent>
        </div>
      </Card>
      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-95 delay-150 bg-[#6A70FF] cardShadow3 border-transparent"
        @click="() => handleStatus('FULFULLIED')"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Fufilled</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon icon="lets-icons:import" width="24px" height="24px" color="#6a70ff" />
            </div>
            <div class="text-2xl lg:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
              <p v-if="!loading">{{ fufilledCount }}</p>
            </div>
          </CardContent>
        </div>
      </Card>
      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-95 delay-150 bg-[#00C37F] cardShadow4 border-transparent"
        @click="() => handleStatus('DELIVERED')"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Delivered</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon icon="ic:outline-check" width="24px" height="24px" color="#00c37f" />
            </div>
            <div class="text-2xl lg:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
              <p v-if="!loading">{{ deliveredCount }}</p>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>

    <Card
      class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-14 mb-4"
    >
      <div class="flex flex-col sm:flex-row items-center justify-between py-4">
        <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-2 sm:mb-0">
          Weeshes
          <p class="text-xs sm:text-sm font-normal text-[#02072199]">List of users Weeshr</p>
        </div>
        <div class="items-center grid grid-cols-3 md:grid-cols-4 gap-2 flex-row">
          <DropdownMenu>
            <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5]">
              <Button variant="outline">
                <div class="flex items-center text-[10px] md:text-xs">
                  Status
                  <Icon icon="ion:chevron-down-outline" class="ml-1" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="item-center justify-between">
              <DropdownMenuCheckboxItem @click="() => handleStatus('INITIATED')">
                Initiated
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem @click="() => handleStatus('OUTBOUND')">
                Outbound
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem @click="() => handleStatus('PENDING')">
                Pending
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem @click="() => handleStatus('ADDED')">
                Added
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem @click="() => handleStatus('DELIVERED')">
                Delivered
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem @click="() => handleStatus('FULFULLIED')">
                Fulfullied
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5]">
              <Button variant="outline">
                <div class="flex items-center text-[10px] md:text-xs">
                  Fulfilment Status
                  <Icon icon="ion:chevron-down-outline" class="ml-1" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="item-center justify-between">
              <DropdownMenuCheckboxItem @click="() => handleFulfilment('PURCHASE ELIGIBLE')">
                Purchase Eligible
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem @click="() => handleFulfilment('COST ABOVE PRICE')">
                Cost Above Price
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem @click="() => handleFulfilment('OUT OF STOCK')">
                Out Of Stock
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem @click="() => handleFulfilment('PROCURRED')">
                Procurred
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem @click="() => handleFulfilment('UNATTENDED')">
                Unattended
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            class="rounded-2xl bg-[#EEEFF5] col-span-3 md:col-span-1 sticky top-0"
            @click="
              () => {
                loadWeeshes()
              }
            "
          >
            <div class="flex items-center text-[10px] md:text-xs">
              <Icon icon="tdesign:clear" width="15" height="15" class="me-2" />
              Clear Filter
            </div>
          </Button>
          <Button class='bg-[#EEEFF5] rounded-2xl' :disabled='selectedWeeshes.length === 0' variant="outline" @click='()=>exportToExcel(selectedWeeshes)'>
            <div class="flex items-center text-[10px] md:text-xs">
              Export as Excel
              <Icon icon="vscode-icons:file-type-excel" class="ml-2 text-xl text-green-700" />
            </div>
          </Button>
        </div>
        <Search class="mt-3 lg:mt-0" v-model="search" />
      </div>

      <div class="overflow-auto bg-white rounded-lg shadow">
        <div v-if="error" class="text-[#02072199] p-10">
          {{ error }}
        </div>
        <div v-else-if="weeshes.length" class='max-h-screen overflow-y-scroll relative'>
          <Table class="lg:w-full w-[800px]">
            <TableHeader class='sticky top-0 z-30'>
              <TableRow
                class="text-xs sticky top-0 sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
              >
                <TableHead>
                  <div class='flex items-center flex-nowrap sticky top-0 justify-center w-full h-full gap-2'>
                      <input @click='toggleSelectAll' type='checkbox' class='p-2 accent-[#020721] border-2'/>
                      <p class='text-nowrap' >Select all</p>
                  </div>
                </TableHead>
                <TableHead> Weeshrname </TableHead>
                <TableHead>Name of Weesh</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>
                  <div class="flex items-center">Price</div>
                </TableHead>
                <TableHead>
                  <div class="flex items-center">Charges</div>
                </TableHead>
                <TableHead>
                  <div class="flex items-center">Status</div>
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="weesh in weeshes" :key="weesh._id">
                <TableCell>
                  <div class='flex items-center justify-center w-full h-full'>
                      <input :checked="checkValue(weesh)" @click='toggleValue(weesh)' type='checkbox' class='p-2 accent-[#7b7d87] border-2'/>
                  </div>
                </TableCell>
                <TableCell class="text-xs md:text-sm lg:text-sm"
                  >{{ weesh.user.userName }}
                </TableCell>
                <TableCell class="text-xs md:text-sm lg:text-sm">{{ weesh.name }}</TableCell>
                <TableCell v-if="weesh.category" class="text-xs md:text-sm lg:text-sm"
                  >{{ weesh.category.name }}
                </TableCell>
                <TableCell v-else class="text-xs md:text-sm lg:text-sm"> ---- </TableCell>
                <TableCell class="text-xs md:text-sm lg:text-sm"
                  >{{ weesh.currency.code }} {{ formatPrice(weesh.price.price) }}
                </TableCell>
                <TableCell class="text-xs md:text-sm lg:text-sm"
                  >{{ weesh.currency.code }} {{ formatPrice(weesh.price.genieGratuity) }}</TableCell
                >
                <TableCell class="flex items-center mt-4">
                  <div
                    :class="statusBg(weesh.status)"
                    class="rounded-[10px] w-fit px-2 py-0.5 text-white text-sm capitalize me-2"
                  >
                    {{ weesh.status.toLocaleLowerCase() }}
                  </div>
                  <div
                    v-if="weesh.fulfilledStatus"
                    :class="fulfillmentStatusBg(weesh.fulfilledStatus)"
                    class="rounded-[10px] w-fit px-2 py-0.5 text-white text-sm capitalize"
                  >
                    {{ weesh.fulfilledStatus.toLocaleLowerCase() }}
                  </div>
                </TableCell>
                <TableCell>
                  <RouterLink :to="{path:`/weeshes/details/${weesh._id}`, query: route.query}">
                    <svg
                      @click='goToDetails(weesh._id)'
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
                  </RouterLink>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div v-else class="text-[#02072199] p-10">
          <p>No user data available</p>
        </div>
      </div>
      <div v-if="weeshes.length != 0" class="flex flex-col md:flex-row gap-2 w-full flex-wrap justify-between mt-8 mr-4 items-center text-[15px]">
        <div class="flex gap-4 space-x-2 w-15 h-10 border-2 rounded-md p-2 items-center">
          Per Page
          <DropdownMenu>
            <DropdownMenuTrigger
              class='flex items-center gap-2'>{{perPage}}<Icon icon="oui:arrow-down" width="16" height="16"
            /></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                v-for="(item, index) in dropDown"
                v-bind:key="index"
                @click="() => setPerPage(item)"
                >{{ item.toLocaleString() }}</DropdownMenuItem
              >
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div class="flex flex-col md:flex-row gap-2 w-full md:w-fit flex-wrap">
            <Pagination
            :total="pageTotal"
            :sibling-count="1"
            show-edges
            :default-page="1"
            @change="handlePageChange"
          >
            <PaginationList class="flex items-center gap-1">
              <Button
                class="w-10 h-10 p-0"
                variant="outline"
                @click="handlePageChange(1)"
                :disabled="pageCurrent == 1"
              >
                <Icon icon="heroicons:chevron-double-left-20-solid" />
              </Button>
              <Button
                class="w-10 h-10 p-0"
                variant="outline"
                @click="() => handlePageChange(pageCurrent - 1)"
                :disabled="pageCurrent == 1"
              >
                <Icon icon="heroicons:chevron-left-20-solid" />
              </Button>
              <template v-for="(item, index) in visiblePaginationItems" :key="index">
                <PaginationListItem :value="index" as-child>
                  <Button
                    class="w-10 h-10 p-0"
                    :variant="item === currentPage ? 'default' : 'outline'"
                    @click="handlePageChange(item)"
                  >
                    {{ item }}
                  </Button>
                </PaginationListItem>
              </template>

              <Button
                class="w-10 h-10 p-0"
                variant="outline"
                @click="() => handlePageChange(pageCurrent + 1)"
                :disabled="pageCurrent === pageTotal"
              >
                <Icon icon="heroicons:chevron-right-20-solid" />
              </Button>
              <Button
                class="w-10 h-10 p-0"
                variant="outline"
                @click="() => handlePageChange(pageTotal)"
                :disabled="pageCurrent === pageTotal"
              >
                <Icon icon="heroicons:chevron-double-right-20-solid" />
              </Button>
            </PaginationList>
          </Pagination>
          <p class="flex items-center gap-2">Showing
            <input
              id='pageInput'
              class="border-2 appearance-none rounded-md w-10 h-10 text-center placeholder:text-center active:border-none focus:border-none focus:outline-none text-black ms-2"
              ref="pageInput"
              type="number"
              :placeholder="currentPage.toString()"
              @keyup="(e) => handlePageInput(e)"
              :value="pageCurrent"
              min="1"
              :max="pageTotal"
              step="1"
            />
          of {{ pageTotal }} page(s)</p>
        </div>
      </div>
    </Card>
    <DashboardFooter />
  </div>
</template>

<script setup lang="ts">
import Search from '@/components/UseSearch.vue'
import { computed, ref, type Ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainNav from '@/components/MainNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { useWeeshStore } from '@/stores/weeshes/weeshes-count'
import exportToExcel from '@/composables/excelExport'

import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'

import { Pagination, PaginationList, PaginationListItem } from '@/components/ui/pagination'
import { storeToRefs } from 'pinia'
import { Loader2 } from 'lucide-vue-next'
import getWeeshes from '@/composables/getWeeshes'

const statusBg = (status: string) => {
  switch (status) {
    case 'ADDED':
      return 'bg-[#000000]'
    case 'INITIATED':
      return 'bg-[#ee9f39]'
    case 'FULFILLED':
      return 'bg-[#6a70ff]'
    case 'DELIVERED':
      return 'bg-[#00c37f]'
    case 'OUTBOUND':
      return 'bg-[#fc045c]'
    case 'PENDING':
      return 'bg-[#4287f5]'
  }
}
const fulfillmentStatusBg = (status: string) => {
  switch (status) {
    case 'PURCHASE ELIGIBLE':
      return 'bg-[#fc045c]'
    case 'COST ABOVE PRICE':
      return 'bg-[#ee9f39]'
    case 'OUT OF STOCK':
      return 'bg-[#6a70ff]'
    case 'PROCURRED':
      return 'bg-[#fc045c]'
    default:
      return 'bg-[#000000]'
  }
}

const route = useRoute()
const router = useRouter()
const weeshStore = useWeeshStore()
const {setPerPage, getWeeshesCount} = useWeeshStore()
getWeeshesCount()

const { addedCount, initiatedCount, fufilledCount, deliveredCount, loading } =
  storeToRefs(weeshStore)

const { weeshes, error, totalPages, currentPage, loadWeeshes, searchWeeshPage, weeshPerPage } = getWeeshes()


// set router

//search
const search = ref('')
const routeQueryKey = 'page'

watch(search, () => {
  loadWeeshes(search.value)
})

//filter
const handleStatus = (status: string) => {
  loadWeeshes(status)
}

const handleFulfilment = (stats: string) => {
  loadWeeshes(stats)
}

//pagination
const pageTotal = ref(totalPages)
const pageCurrent = computed(()=>{
  return weeshStore.currentPage
})
const perPage = computed(() => {
    return weeshStore.perPage
});

watch(perPage, () => {
  weeshPerPage(perPage.value)
})

watch(currentPage, (newPage) => {
    // Only update if the page param is different
    if (Number(route.query[routeQueryKey]) !== newPage) {
      router.push({
        query: {
          ...route.query,
          [routeQueryKey]: newPage.toString()
        }
      })
    }
  })

onMounted(() => {
  const pageFromQuery = Number(route.query[routeQueryKey])
  if (pageFromQuery && !isNaN(pageFromQuery) && pageFromQuery > 0) {
    // currentPage.value = pageFromQuery
    loadWeeshes(pageFromQuery)
  }else{
    loadWeeshes(pageCurrent.value)
  }
})


const paginationItems = computed(() => {
  const pages = []
  for (let i = 1; i <= pageTotal.value; i++) {
    pages.push(i)
  }
  return pages
})

const visiblePaginationItems = computed(() => {
  const totalItems = paginationItems.value.length
  const currentPage = pageCurrent.value
  if (totalItems <= 3) {
    return paginationItems.value
  } else {
    let start = Math.max(1, currentPage - 1)
    let end = Math.min(totalItems, currentPage + 1)

    if (currentPage === 1 && totalItems > 3) {
      end = Math.min(totalItems, 3)
    }

    return paginationItems.value.slice(start - 1, end)
  }
})

const goToDetails =async (id: string) => {
  try {
    await router.push({
      // name: 'weeshedetails', // If you've defined a route name
      // OR
      path: `/weeshes/details/${id}`,
      query: {
        ...route.query, // Preserve existing query params
      }
    })
  } catch (navigationError) {
    console.error('Navigation failed:', navigationError)
  }
}

const handlePageChange = (page: number) => {
  loadWeeshes(page)
}

const handlePageInput = (e: any) => {
  e.preventDefault()
  if (e.key === 'Enter') {
    const page = parseInt(e.target.value)
    // checks if page is greater than total pages and returns the total page if true, if false, checks if it is less than or equal to zero, returns 1 if true but returns the page number if false
    const pageNum = page > pageTotal.value ? pageTotal.value : page <= 0 ? 1 : page
    searchWeeshPage(pageNum)
  }
}
const formatPrice = (val: string)=>{
  const price = parseInt(val)
  const formattedPrice = new Intl.NumberFormat('en-US').format(price);
  return formattedPrice;
}


const dropDown = [10, 20, 50, 100, 200, 500, 1000, 2000, 4000, 5000, 7000, 10000, 20000];

type Weeshes = {
  _id: string
  name: string
  user: {
    _id: string
    userName: string
  }
  category: {
    name: string
  }
  price: {
    price: string
    genieGratuity: string
  }
  currency: {
    code: string
  }
  status: string
  fulfilledStatus: string
}

type ExtractedData = {
  'Weesh id': string;
  'Weeshr name': string;
  'Name of Weesh': string;
  price: string;
  category: string;
  charges: string;
  status: string;
};

const selectedWeeshes = ref<ExtractedData[]>([])
const selectAll = ref(false)

const clearIds = ()=>{
  selectedWeeshes.value = []
}

const extractIds = () => {
  selectedWeeshes.value = []
  selectedWeeshes.value = extractData(weeshes)
}

const extractData = (data: Ref<Weeshes[]>): ExtractedData[] => {
  return data.value.map((value) => ({
    'Weesh id': value._id,
    'Weeshr name': value.user.userName,
    'Name of Weesh': value.name,
    price: `${value.currency.code} ${formatPrice(value.price.price)}`,
    category: value.category.name,
    charges: `${value.currency.code} ${formatPrice(value.price.genieGratuity)}`,
    status: value.status,
  }));
};

const toggleSelectAll = ()=>{
  if(selectAll.value === false){
    extractIds()
  }else{
    clearIds()
  }
  selectAll.value = !selectAll.value
}

const extractWeeshData = (value: Weeshes)=>{
  return(
    {
      'Weesh id': value._id,
      'Weeshr name': value.user.userName,
      'Name of Weesh': value.name,
      price: `${value.currency.code} ${formatPrice(value.price.price)}`,
      category: value.category.name,
      charges: `${value.currency.code} ${formatPrice(value.price.genieGratuity)}`,
      status: value.status
    }
  )
}

const toggleValue = (value: Weeshes) => {
  const extract = extractWeeshData(value)
  const index = selectedWeeshes.value.findIndex((item) => item['Weesh id'] === extract['Weesh id']);
  if (index !== -1) {
    // If the value exists, remove it
    selectedWeeshes.value.splice(index, 1);
  } else {
    // If the value does not exist, add it
    selectedWeeshes.value.push(extract);
  }
}

function checkValue(value: Weeshes) {
  // const index = selectedWeeshes.value.indexOf(value);
  const extract = extractWeeshData(value)
  const index = selectedWeeshes.value.findIndex((item) => item['Weesh id'] === extract['Weesh id']);
  if (index !== -1) {
    // If the value exists, remove it
    return true
  } else {
    // If the value does not exist, add it
    return false
  }
}

</script>

<style>
.cardShadow1 {
  box-shadow:
    0px 31px 30px -23px #dddcdc,
    inset 0px -23px 20px -23px rgba(0, 0, 0, 0.25);
}
.cardShadow2 {
  box-shadow:
    0px 31px 30px -23px #ee9f39,
    inset 0px -23px 30px -23px rgba(0, 0, 0, 0.25);
}
.cardShadow3 {
  box-shadow:
    0px 31px 30px -23px #6a70ff,
    inset 0px -23px 30px -23px rgba(0, 0, 0, 0.25);
}
.cardShadow4 {
  box-shadow:
    0px 31px 30px -23px #00c37f,
    inset 0px -23px 20px -23px rgba(0, 0, 0, 0.25);
}
.weeshr-icon {
  background-color: black;
}
.weeshr-icon2 {
  background-color: white;
}
</style>
