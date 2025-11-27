<template>
  <div class="flex-col flex bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10">
    <MainNav class="mx-6" headingText="Geeftr Ops" />
    <ProxyNav/>

    <div class="container w-full grid gap-4 md:grid-cols-5 md:gap-6 pt-6 text-nowrap">
      <Card class="h-[150px] rounded-[24px] bg-[#DF6C50] shadow-lg shadow-[#DF6C50] border-transparent transition-transform transform hover:scale-105">
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Overdue</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon icon="mingcute:arrow-left-down-line" width="24px" height="24px" color="#DF6C50" />
            </div>

            <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              <!-- <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" /> -->
              <span>
                {{ analytics?.overdueAndUndelivered.overdueCount || 0 }}</span>
            </p>
          </CardContent>
        </div>
      </Card>

      <Card class="h-[150px] rounded-[24px] bg-[#3A8EE5] shadow-lg shadow-[#3A8EE5] border-transparent transition-transform transform hover:scale-105">
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">New</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon icon="mingcute:arrow-left-down-line" width="24px" height="24px" color="#3A8EE5" />
            </div>

            <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              <!-- <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" /> -->
              <span>
                {{ analytics?.vendorPayoutAnalytics.recentPayouts.length || 0 }}</span>
            </p>
          </CardContent>
        </div>
      </Card>

      <Card class="h-[150px] rounded-[24px] bg-[#6A70FF] shadow-lg shadow-[#6A70FF] border-transparent transition-transform transform hover:scale-105">
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Processing</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon icon="mingcute:arrow-left-down-line" width="24px" height="24px" color="#6A70FF" />
            </div>

            <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              <!-- <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" /> -->
              <span>
                {{ analytics?.vendorPayoutAnalytics.totalPendingPayout || 0 }}</span>
            </p>
          </CardContent>
        </div>
      </Card>

      <Card class="h-[150px] rounded-[24px] bg-[#EE9F39] cardShadow2 border-transparent transition-transform transform hover:scale-105">
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Outbound</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon icon="mingcute:arrow-left-down-line" width="24px" height="24px" color="#EE9F39" />
            </div>

            <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              <!-- <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" /> -->
              <span>
                {{ analytics?.overdueAndUndelivered.notDeliveredCount || 0 }}</span>
            </p>
          </CardContent>
        </div>
      </Card>

      <!-- <RouterLink to="/bank/outflow"> -->
        <Card
          class="h-[150px] rounded-[24px] bg-[#00C37F] cardShadow4 border-transparent transition-transform transform hover:scale-105">
          <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
            <CardContent class="flex items-center justify-between space-y-0">
              <p class="text-l font-medium text-[#ffffff]">Delivered</p>
              <div class="weeshr-icon2 rounded-[7px]">
                <Icon icon="heroicons:bars-3" width="24px" height="24px" color="#00C37F" />
              </div>

              <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
                <!-- <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" /> -->
                <!-- <span v-else>{{ currencySymbol(totalTransfers.currency) || 0 }}
                  {{ totalTransfers.amount.toLocaleString() || 0 }}</span> -->
                   <span>
                {{ analytics?.deliveredAnalytics.totalDeliveredOrders || 0 }}</span>
              </p>
            </CardContent>
          </div>
        </Card>
      <!-- </RouterLink> -->
    </div>
    <Card
      class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-14 mb-4"
    >
      <div class="flex flex-col sm:flex-row items-center justify-between py-4">
        <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-2 sm:mb-0">
          Global Order Sheet
          <p class="text-xs sm:text-sm font-normal text-[#02072199]">
            Details of all orders
          </p>
        </div>
        <div class="flex items-center flex-col md:flex-row gap-4">
          <!--  -->
          <div class="h w-44">
            <Select @update:modelValue="onStatusChange">
              <SelectTrigger>
                <div class="text-base text-[#020721] text-center flex items-center">
                  <span class="flex items-center gap-4 text-sm">
                    <Icon icon="mdi:filter-outline" width="24px" height="24px" color="#020721" />
                     {{ selectedStatus === 'all' ? 'All Vendors' : selectedStatus.toUpperCase() }}
                  </span>
                </div>                  
              </SelectTrigger>
              <SelectContent class="w- w-56">
                <SelectGroup>
                  <SelectItem value="all">All Vendors</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="outbound">Outbound</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Search class="mt-3 lg:mt-0" />
          <button class="bg-[#020721] px-4 py-2 rounded-xl w-50 h-12">
            <div class="text-base text-[#F8F9FF] text-center flex items-center">
              Download Report
              <svg
                width="20"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="ml-6"
              >
                <path
                  d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16 12.75H12.75V16C12.75 16.41 12.41 16.75 12 16.75C11.59 16.75 11.25 16.41 11.25 16V12.75H8C7.59 12.75 7.25 12.41 7.25 12C7.25 11.59 7.59 11.25 8 11.25H11.25V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V11.25H16C16.41 11.25 16.75 11.59 16.75 12C16.75 12.41 16.41 12.75 16 12.75Z"
                  fill="#F8F9FF"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>

      <div class="overflow-auto bg-white rounded-lg shadow">
        <Table class="lg:w-full w-[800px]">
          <TableHeader>
            <TableRow
              class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
            >
              <TableHead @click="sortByDate">
                <div class="flex items-center">
                  Sender Email
                  <!-- <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" /> -->
                </div>
              </TableHead>
              <TableHead @click="sortByDate">
                <div class="flex items-center">
                  Receiver Address
                  <!-- <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" /> -->
                </div>
              </TableHead>
              <TableHead @click="sortByDate">
                <div class="flex items-center">
                  Vendor
                  <!-- <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" /> -->
                </div>
              </TableHead>
              <!-- <TableHead @click="sortByPayout">
                <div class="flex items-center">
                  Price
                  <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                </div>
              </TableHead> -->
              <TableHead @click="sortByProductCount">
                <div class="flex items-center">
                  Item Count
                  <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                </div>
              </TableHead>
              <TableHead @click="sortByPayout">
                <div class="flex items-center">
                  Price
                  <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                </div>
              </TableHead>

              <TableHead>
                <div class="flex items-center">
                  Status
                  <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                </div>
              </TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="transaction in filteredList" :key="transaction._id">
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ transaction.user.email }} </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ transaction.shippingAddress }} </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ transaction.vendor.companyName }} </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ transaction.items.length }}</TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">₦{{ transaction.totalAmount }} </TableCell>
              <TableCell>
                <div
                  :class="statusBg(transaction.status)"
                  class="rounded-[10px] w-fit px-2 py-0.5 text-white text-sm capitalize"
                >
                  {{ transaction.status }}
                </div>
              </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ transaction._id }} </TableCell>
              <TableCell>
                <Sheet>
                  <SheetTrigger>
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
                  </SheetTrigger>
                  <SheetContent length="mid_low" class="flex flex-col space-y-0 overflow-y-scroll">
                    <SheetHeader class="flex flex-col items-start px-4">
                      <SheetDescription>
                        Payout ID.
                      </SheetDescription>
                      <h3 class="text-2xl font-medium">{{ transaction._id }}</h3>
                    </SheetHeader>
                    <Card Content class="rounded-lg my-4 hover:shadow-xl px-2 md:px-0">
                      <CardContent class="flex flex-col md:flex-row items-start md:items-center justify-between px-2 sm:px-6 py-4">
                        <span class="flex gap-2 items-center">
                          <div class="flex flex-col items-start gap-2">
                            <div class="flex flex-col items-start md:flex-row gap-4">
                              <p class="text-sm text-muted-foreground text-nowrap text-center text-[#000000]">
                                Payout Date
                              </p>
                              <Badge variant="outline" class="text-muted-foreground w-full">
                                {{ formatDate(transaction.createdAt) }} - {{ formatDate(transaction.updatedAt) }}
                              </Badge>
                            </div>
                            <p class="text-lg my-2 md:my-0 text-primary font-bold text-[#000000]">
                              {{ formatDate(transaction.createdAt) }}
                            </p>
                          </div>
                        </span>
                      <div class="flex items-center gap-4 bg-success">
                        <Badge variant="outline" :class="statusBg(transaction.status)" class="text-xs text-white">{{ transaction.status }}</Badge>
                      </div>
                      </CardContent>
                    </Card>
                    <Card Content class="rounded-lg px-0">
                      <CardHeader>
                        <div class="flex flex-col md:flex-row md:items-center justify-between w-full">
                          <div class="flex items-center gap-4">
                            <h2 class="font-bold md:text-lg">Order</h2>
                            <Badge class="bg-[#E9F4D1] text-primary">{{ transaction.items.length }}</Badge>
                          </div>
                          <h1 class="font-bold text-xl">₦{{ transaction.totalAmount }}</h1>
                        </div>
                      </CardHeader>
                      <CardContent class="px-4">
                        <div class="bg-[#F6F6F6] rounded-lg mb-4 flex flex-col items-center hover:shadow-md" v-for="(item, newkey) in transaction.items" :key="newkey">
                          <div class="bg-white border flex items-center justify-between w-full py-2 px-2 rounded-lg">
                            <span class="flex gap-2 items-center"><div
                                class="inline-block text-[#F8F9FF] w-14 h-14"
                              >
                                <!-- <img :src='item.image' class="w-full h-full rounded-sm"/> -->
                              </div>
                              <div class="flex flex-col">
                                <p class="md:text-lg text-primary font-semibold">
                                  {{ item.productId }}
                                </p>
                                <p class="text-sm text-muted-foreground text-[#000000]">
                                  ₦{{ item.price }}
                                </p>
                              </div>
                            </span>
                            <div class="flex items-center gap-4">
                              <Badge variant="outline">{{ item.quantity }}</Badge>
                            </div>
                          </div>
                          <!-- <div class="w-full flex items-center justify-between py-3 px-4">
                            <h3 class="text-xs font-semibold text-muted-foreground">Unit x{{ item.unit }}</h3>
                            <h2 class="text-md text-primary font-semibold">₦{{ item.unit_price }}</h2>
                          </div> -->
                        </div>
                        <div class="rounded-lg overflow-hidden flex flex-col mt-6">
                          <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2">
                            <div class="flex items-center gap-4">
                              <h2 class="text-xs font-semibold text-muted-foreground">Total Value</h2>
                            </div>
                            <h1 class="text-md text-primary font-semibold">₦{{ transaction.totalAmount.toLocaleString() }}</h1>
                          </div>
                          <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2 my-1">
                            <div class="flex items-center gap-4">
                              <h2 class="text-xs font-semibold text-muted-foreground">Delivery Charge</h2>
                            </div>
                            <!-- <h1 class="text-md text-primary font-semibold">₦{{ transaction.delivery_charge.toLocaleString() }}</h1> -->
                          </div>
                          <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2">
                            <div class="flex items-center gap-4">
                              <h2 class="text-xs font-semibold text-muted-foreground">Discount</h2>
                            </div>
                            <!-- <h1 class="text-md text-primary font-semibold">₦{{ transaction.discount.toLocaleString() }}</h1> -->
                          </div>
                          <div class="bg-[#02072199] flex items-center justify-between w-full px-4 py-2">
                            <div class="flex items-center gap-4">
                              <h2 class="text-xs font-semibold text-[#F8F9FFB2]">Payout Value</h2>
                            </div>
                            <h1 class="text-md font-semibold text-white">₦{{ transaction.totalAmount.toLocaleString() }}</h1>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card class="px-2 py-4 w-full rounded-xl shadow-md">
                      <Tabs default-value="receiver" class="space-y-2">
                        <TabsList class="w-full bg-transparent">
                          <TabsTrigger
                            value="receiver"
                            class="text-[#000000] data-[state=active]:border-[#6A70FF]"
                          >
                            Receiver
                          </TabsTrigger>
                          <TabsTrigger
                            value="sender"
                            class="text-[#000000] data-[state=active]:border-[#6A70FF]"
                          >
                            Sender
                          </TabsTrigger>
                          <!-- <TabsTrigger value="support" class="text-[#000000] data-[state=active]:border-[#6A70FF]"
                            >Support
                          </TabsTrigger> -->
                          <TabsTrigger
                            value="vendor"
                            class="text-[#000000] data-[state=active]:border-[#6A70FF]"
                          >
                            Vendor
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="receiver" class="">
                          <div class="rounded-lg overflow-hidden flex flex-col mt-6">
                            <div class="w-full mb-4 px-4">
                              <!-- <h1 class="text-xl font-bold">{{ transaction.receiver.name }}</h1> -->
                            </div>
                            <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2">
                              <div class="flex items-center gap-4">
                                <h2 class="text-xs font-semibold text-muted-foreground">Address</h2>
                              </div>
                              <h1 class="text-xs text-primary font-semibold">₦{{ transaction.shippingAddress }}</h1>
                            </div>
                            <!-- <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2 my-1">
                              <div class="flex items-center gap-4">
                                <h2 class="text-xs font-semibold text-muted-foreground">Phone Number</h2>
                              </div>
                              <h1 class="text-xs text-primary font-semibold">{{ transaction.receiver.phone }}</h1>
                            </div>
                            <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2">
                              <div class="flex items-center gap-4">
                                <h2 class="text-xs font-semibold text-muted-foreground">Email</h2>
                              </div>
                              <h1 class="text-xs text-primary font-semibold">{{ transaction.receiver.email }}</h1>
                            </div> -->
                          </div>
                        </TabsContent>
                        <TabsContent value="sender">
                          <div class="rounded-lg overflow-hidden flex flex-col mt-6">
                            <div class="w-full mb-4 px-4">
                              <!-- <h1 class="text-xl font-bold">{{ transaction.sender.name }}</h1> -->
                            </div>
                            <!-- <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2">
                              <div class="flex items-center gap-4">
                                <h2 class="text-xs font-semibold text-muted-foreground">Address</h2>
                              </div>
                              <h1 class="text-xs text-primary font-semibold">₦{{ transaction.sender.address }}</h1>
                            </div>
                            <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2 my-1">
                              <div class="flex items-center gap-4">
                                <h2 class="text-xs font-semibold text-muted-foreground">Phone Number</h2>
                              </div>
                              <h1 class="text-xs text-primary font-semibold">{{ transaction.sender.phone }}</h1>
                            </div> -->
                            <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2">
                              <div class="flex items-center gap-4">
                                <h2 class="text-xs font-semibold text-muted-foreground">Email</h2>
                              </div>
                              <h1 class="text-xs text-primary font-semibold">{{ transaction.user.email }}</h1>
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="vendor">
                          <div class="rounded-lg overflow-hidden flex flex-col mt-6">
                            <div class="w-full mb-4 px-4">
                              <h1 class="text-xl font-bold">{{ transaction.vendor.companyName }}</h1>
                            </div>
                            <!-- <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2">
                              <div class="flex items-center gap-4">
                                <h2 class="text-xs font-semibold text-muted-foreground">Address</h2>
                              </div>
                              <h1 class="text-xs text-primary font-semibold">₦{{ transaction.vendor.address }}</h1>
                            </div> -->
                            <!-- <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2 my-1">
                              <div class="flex items-center gap-4">
                                <h2 class="text-xs font-semibold text-muted-foreground">Phone Number</h2>
                              </div>
                              <h1 class="text-xs text-primary font-semibold">{{ transaction.vendor.phone }}</h1>
                            </div> -->
                            <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2">
                              <div class="flex items-center gap-4">
                                <h2 class="text-xs font-semibold text-muted-foreground">Email</h2>
                              </div>
                              <h1 class="text-xs text-primary font-semibold">{{ transaction.vendor.companyEmail }}</h1>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </Card>
                  </SheetContent>
                </Sheet>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div class="flex gap-2 max-w-full flex-wrap justify-end mt-8 mr-4 items-center text-[15px]">
        <Button variant="secondary"> <Icon icon="radix-icons:chevron-left" /> </Button>
        <Button variant="secondary" class="bg-[#020721] text-gray-400"> 1 </Button>
        <Button variant="outline"> 2 </Button>
        <Button variant="outline"> &#8230; </Button>
        <Button variant="outline"> 4 </Button>
        <Button variant="outline"> 5 </Button>
        <Button variant="outline"> <Icon icon="radix-icons:chevron-right" /> </Button>
        <a href="#"><p class="text-[blue]">See all</p></a>
      </div>
    </Card>
    <DashboardFooter />
  </div>
</template>
<script lang="ts" setup>
import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { computed, onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import Search from '@/components/UseSearch.vue'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from '@/components/ui/badge'
import MainNav from '../MainNav.vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useVendorTransactionStore } from '@/stores/vendor/vendor-transactions'
import ProxyNav from '../ProxyNav.vue'
import type { Order } from '@/stores/vendor/vendor-transactions'

// const open = ref<boolean>(false)
// const id = ref<string>('0')
const orders = computed(()=>{
  return useVendorTransactionStore().orders;
})

const statusBg = (status: string) => {
  switch (status) {
    case 'overdue':
      return 'bg-[#DF6C50]'
    case 'new':
      return 'bg-[#3A8EE5]'
    case 'processing':
      return 'bg-[#6A70FF]'
    case 'outbound':
      return 'bg-[#EE9F39]'
    case 'delivered':
      return 'bg-[#00C37F]'
    default:
      return ''
  }
}


interface Party{
  id: string
  name: string
  phone: string
  address: string
  email: string
}

interface Products {
  name: string;
  amount: number;
  unit: number;
  unit_price: number;
  image: string;
}

interface Transaction {
  id: string;
  completed_date: string | null;
  created_at: string;
  payout: number;
  total_Unit: number;
  total_price: number;
  product_count: number;
  status: 'overdue' | 'new' | 'processing' | 'outbound' | 'delivered';
  delivery_charge: number;
  payment_price: number;
  discount: number;
  products: Products[];
  vendor: Party;
  sender: Party;
  receiver: Party
}

const transactions = ref<Transaction[]>([])

const filteredList = ref<Order[] | null>(orders.value)
const analytics = computed(()=>{
  return useVendorTransactionStore().analytics
})

// Keep track of sort directions per field
const sortState: Record<string, "asc" | "desc"> = {
  date: "asc",
  payout: "asc",
  unit: "asc",
  productCount: "asc",
};

// Sort by created_at
function sortByDate() {
  const order = sortState.date === "asc" ? "desc" : "asc";
  sortState.date = order;

  return [...transactions.value].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return order === "asc" ? dateA - dateB : dateB - dateA;
  });
}

function filterByStatus(status: string) {
  if (status.toLowerCase() === "all") return transactions.value
  return transactions.value.filter(
    (tx) => tx.status.toLowerCase() === status.toLowerCase()
  )
}

const selectedStatus = ref("all")
function onStatusChange(value: string) {
  selectedStatus.value = value
  // filteredList.value = filterByStatus(value)
}


// Sort by payout
function sortByPayout() {
  const order = sortState.payout === "asc" ? "desc" : "asc";
  sortState.payout = order;

  const newArr = [...transactions.value].sort((a, b) =>
    order === "asc" ? a.payout - b.payout : b.payout - a.payout
  );
  transactions.value = newArr;
}

// Sort by total units
// function sortByUnit() {
//   const order = sortState.unit === "asc" ? "desc" : "asc";
//   sortState.unit = order;

//   const newArr = [...transactions.value].sort((a, b) =>
//     order === "asc" ? a.total_Unit - b.total_Unit : b.total_Unit - a.total_Unit
//   );
//   transactions.value = newArr;
// }

// Sort by product count
function sortByProductCount() {
  const order = sortState.productCount === "asc" ? "desc" : "asc";
  sortState.productCount = order;

  const newArr = [...transactions.value].sort((a, b) =>
    order === "asc"
      ? a.product_count - b.product_count
      : b.product_count - a.product_count
  );

  transactions.value = newArr;
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

onMounted(()=>{
  useVendorTransactionStore().fetchAllTransactions('Analytics')
  useVendorTransactionStore().fetchAllOrders('Orders')
})

</script>