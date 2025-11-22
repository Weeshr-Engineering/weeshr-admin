<template>
  <div class="flex-col flex bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10">
    <VendorNav class="mx-6" headingText="Orders"/>

    <div class="w-full grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-5 pt-6">
      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#DF6C50]  border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Overdue</p>
            <div >
              <SquareArrowOutUpRight width="24px" height="24px" color="#ffffff" />
            </div>
            <p class="text-2xl lg:text-3xl font-medium text-[#FFFFFF] absolute bottom-2 left-5">
              {{ orderStore.analytics.overdue }}
            </p>
          </CardContent>
        </div>
      </Card>

      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#3A8EE5]  border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">New</p>
            <div >
              <RefreshCcw  width="24px" height="24px" color="#3A8EE5"   class="bg-[white] rounded-sm"/>
            </div>
            <p class="text-2xl lg:text-3xl font-medium text-[#FFFFFF] absolute bottom-2 left-5">
              {{ orderStore.analytics.new }}
            </p>
          </CardContent>
        </div>
      </Card>

      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#6A70FF]  border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Processing</p>
            <div >
              <SlidersVertical  width="24px" height="24px" color="#3A8EE5"   class="bg-[white] rounded-sm"/>
            </div>
            <p class="text-2xl lg:text-3xl font-medium text-[#FFFFFF] absolute bottom-2 left-5">
              {{ orderStore.analytics.processing }}
            </p>
          </CardContent>
        </div>
      </Card>

      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#EE9F39]  border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Outbound</p>
            <div >
              <Truck width="24px" height="24px" color="#ffffff" />
            </div>
            <p class="text-2xl lg:text-3xl font-medium text-[#FFFFFF] absolute bottom-2 left-5">
              {{ orderStore.analytics.outbound }}
            </p>
          </CardContent>
        </div>
      </Card>

      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#00C37F] cardShadow1 border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#FFFFFF]">Delivered</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Check width="24px" height="24px" color="#00C37F"  />
            </div>
            <p class="text-2xl lg:text-3xl font-medium text-[#FFFFFF] absolute bottom-2 left-5">
              {{ orderStore.analytics.delivered }}
            </p>
          </CardContent>
        </div>
      </Card>
    </div>

    <Card
      class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-14 mb-4"
    >
      <div class="flex flex-col sm:flex-row items-center justify-between py-4">
        <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-2 sm:mb-0">
         Order Sheet
          <p class="text-xs sm:text-sm font-normal text-[#02072199]">
            Details of all orders
          </p>
        </div>
        <div class="flex items-center flex-col md:flex-row gap-4">
          <Search @search="handleSearch" class="mt-3 lg:mt-0" />
          <button class="bg-[#020721] px-4 py-2 rounded-xl w-50 h-12" @click="downloadReport">
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

      <!-- Loading State -->
      <div v-if="orderStore.loading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="orderStore.error" class="text-red-500 text-center py-4">
        {{ orderStore.error }}
        <button @click="clearError" class="ml-2 text-blue-600 underline">Try Again</button>
      </div>

      <!-- Orders Table -->
      <div v-else class="overflow-auto bg-white rounded-lg shadow">
        <Table class="lg:w-full w-[800px]">
          <TableHeader>
            <TableRow
              class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
            >
              <TableHead>
                <div class="flex items-center">
                  Order Date
                </div>
              </TableHead>
              <TableHead>
                <div class="flex items-center">
                  Total Amount
                </div>
              </TableHead>
              <TableHead>
                <div class="flex items-center">
                  Item Count
                </div>
              </TableHead>
              <TableHead @click="sortByProductCount">
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
              <TableHead>Order ID</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="order in orderStore.filteredOrders" :key="order._id">
              <TableCell class="text-xs md:text-sm lg:text-sm">
                {{ formatDate(order.createdAt) }}
              </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">
                ₦{{ order.totalAmount?.toLocaleString() || '0' }}
              </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">
                {{ order.items?.length || 0 }}
              </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">
                {{ order.items?.length || 0 }}
              </TableCell>
              <TableCell>
                <div
                  :class="statusBg(order.status)"
                  class="rounded-[10px] w-fit px-2 py-0.5 text-white text-sm capitalize"
                >
                  {{ order.status }}
                </div>
              </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ order._id }}</TableCell>
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
                        Order ID.
                      </SheetDescription>
                      <h3 class="text-2xl font-medium">{{ order._id }}</h3>
                    </SheetHeader>
                    <Card Content class="rounded-lg my-4 hover:shadow-xl px-2 md:px-0">
                      <CardContent class="flex flex-col md:flex-row items-start md:items-center justify-between px-2 sm:px-6 py-4">
                        <span class="flex gap-2 items-center">
                          <div class="flex flex-col items-start gap-2">
                            <div class="flex flex-col items-start md:flex-row gap-4">
                              <p class="text-sm text-muted-foreground text-nowrap text-center text-[#000000]">
                               Initiated Date
                              </p>
                            </div>
                            <p class="text-lg my-2 md:my-0 text-primary font-bold text-[#000000]">
                              {{ formatDate(order.createdAt) }}
                            </p>
                          </div>
                        </span>
                      <div class="flex items-center gap-4 bg-success">
                        <Badge variant="outline" :class="statusBg(order.status)" class="text-xs text-white">{{ order.status }}</Badge>
                      </div>
                      </CardContent>
                    </Card>
                    <Card Content class="rounded-lg px-0">
                      <CardHeader>
                        <div class="flex flex-col md:flex-row md:items-center justify-between w-full">
                          <div class="flex items-center gap-4">
                            <h2 class="font-bold md:text-lg">Orders</h2>
                            <Badge class="bg-[#E9F4D1] text-primary">{{ order.items?.length || 0 }}</Badge>
                          </div>
                          <h1 class="font-bold text-xl">₦{{ order.totalAmount?.toLocaleString() || '0' }}</h1>
                        </div>
                      </CardHeader>
                      <CardContent class="px-4">
                        <div 
                          class="bg-[#F6F6F6] rounded-lg mb-4 flex flex-col items-center hover:shadow-md" 
                          v-for="(item, index) in order.items" 
                          :key="index"
                        >
                          <div class="bg-white border flex items-center justify-between w-full py-2 px-2 rounded-lg">
                            <span class="flex gap-2 items-center">
                              <div class="inline-block text-[#F8F9FF] w-14 h-14">
                                <img :src="item.image || 'https://res.cloudinary.com/drykej1am/image/upload/v1721874426/weesh/categories/AWFAGiROM7oxB4ZJWhnaAYkP.jpg'" class="w-full h-full rounded-sm"/>
                              </div>
                              <div class="flex flex-col">
                                <p class="md:text-lg text-primary font-semibold">
                                  {{ item.name || 'Product' }}
                                </p>
                                <p class="text-sm text-muted-foreground text-[#000000]">
                                  ₦{{ item.price?.toLocaleString() || '0' }}
                                </p>
                              </div>
                            </span>
                            <div class="flex items-center gap-4">
                              <Badge variant="outline">100ml</Badge>
                            </div>
                          </div>
                          <div class="w-full flex items-center justify-between py-3 px-4">
                            <h3 class="text-xs font-semibold text-muted-foreground">Unit x{{ item.quantity || 1 }}</h3>
                            <h2 class="text-md text-primary font-semibold">
                              ₦{{ ((item.price || 0) * (item.quantity || 1)).toLocaleString() }}
                            </h2>
                          </div>
                        </div>
                        <div class="rounded-lg overflow-hidden flex flex-col mt-6">
                          <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2">
                            <div class="flex items-center gap-4">
                              <h2 class="text-xs font-semibold text-muted-foreground">Total Value</h2>
                            </div>
                            <h1 class="text-md text-primary font-semibold">
                              ₦{{ order.totalAmount?.toLocaleString() || '0' }}
                            </h1>
                          </div>
                          <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2 my-1">
                            <div class="flex items-center gap-4">
                              <h2 class="text-xs font-semibold text-muted-foreground">Delivery Charge</h2>
                            </div>
                            <h1 class="text-md text-primary font-semibold">
                              ₦{{ (order.deliveryCharge || 0).toLocaleString() }}
                            </h1>
                          </div>
                          <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2">
                            <div class="flex items-center gap-4">
                              <h2 class="text-xs font-semibold text-muted-foreground">Discount</h2>
                            </div>
                            <h1 class="text-md text-primary font-semibold">
                              ₦{{ (order.discount || 0).toLocaleString() }}
                            </h1>
                          </div>
                          <div class="bg-[#02072199] flex items-center justify-between w-full px-4 py-2">
                            <div class="flex items-center gap-4">
                              <h2 class="text-xs font-semibold text-[#F8F9FFB2]">Payout Value</h2>
                            </div>
                            <h1 class="text-md font-semibold text-white">
                              ₦{{ ((order.totalAmount || 0) - (order.discount || 0)).toLocaleString() }}
                            </h1>
                          </div>
                        </div>
                        <CardContent class="px-4 flex justify-end mt-6">
                          <Button 
                            @click="updateOrderStatus(order._id, 'processing')"
                            class="bg-[#6A70FF] px-4 py-2 rounded-xl w-fit h-12"
                          >
                            <div class="text-base text-[#F8F9FF] text-center flex items-center">
                              Start Process
                              <CircleChevronRight class="ml-2"/>
                            </div>
                          </Button>
                        </CardContent>
                      </CardContent>
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
import { onMounted } from 'vue';
import { useOrderStore } from '@/stores/order-store/orderStore';

import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/vue';
import Search from '@/components/UseSearch.vue';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from '@/components/ui/badge';
import VendorNav from '@/components/VendorNav.vue';
import DashboardFooter from '@/components/DashboardFooter.vue';
import { Check, SquareArrowOutUpRight, RefreshCcw, SlidersVertical, Truck, CircleChevronRight } from 'lucide-vue-next';

// Store
const orderStore = useOrderStore();

// Mock vendor ID - replace with actual vendor ID from auth store
const vendorId = 'vendor123';

// Lifecycle
onMounted(() => {
  loadOrders();
});

// Methods
const loadOrders = async () => {
  await Promise.all([
    orderStore.fetchVendorOrders(vendorId),
    orderStore.fetchVendorAnalytics(vendorId)
  ]);
};

const handleSearch = (searchTerm: string) => {
  orderStore.setFilters({ search: searchTerm });
};

const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    await orderStore.updateOrderStatus(orderId, newStatus);
    // Refresh analytics to get updated counts
    await orderStore.fetchVendorAnalytics(vendorId);
  } catch (error) {
    console.error('Failed to update order status:', error);
  }
};

const downloadReport = () => {
  // Implement download report functionality
};

const clearError = () => {
  orderStore.clearError();
  loadOrders();
};

const statusBg = (status: string) => {
  switch (status) {
    case 'failed':
      return 'bg-[#E45044]';
    case 'pending':
      return 'bg-[#EE9F39]';
    case 'processing':
      return 'bg-[#6A70FF]';
    case 'outbound':
      return 'bg-[#EE9F39]';
    case 'delivered':
      return 'bg-[#00C37F]';
    case 'overdue':
      return 'bg-[#E45044]';
    case 'cancelled':
      return 'bg-[#E45044]';
    default:
      return 'bg-gray-500';
  }
};

const formatDate = (dateStr: string | Date | undefined) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const sortByProductCount = () => {
  // Implement sorting logic if needed
};
</script>