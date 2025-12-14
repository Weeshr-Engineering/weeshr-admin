<template>
  <div class="flex-col flex bg-[#f0f8ff] h-screen px-4 sm:px-10 pb-10">
    <ProxyNav/>
    <VendorNav class="mx-6" headingText="Transactions"/>

    <div class="container w-full grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-2 pt-6 text-nowrap">
      <Card class="h-[150px] rounded-[24px] bg-[#00C37F] cardShadow4 border-transparent transition-transform transform hover:scale-105">
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Total Payouts</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon icon="mingcute:arrow-left-down-line" width="24px" height="24px" color="#00C37F" />
            </div>

            <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              <!-- <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" /> -->
              <span>₦
                {{ analytic?.vendorPayoutAnalytics.totalCompletedPayout || 0 }}</span>
            </p>
          </CardContent>
        </div>
      </Card>

      <!-- <RouterLink to="/bank/outflow"> -->
        <Card
          class="h-[150px] rounded-[24px] bg-[#EE9F39] cardShadow2 border-transparent transition-transform transform hover:scale-105">
          <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
            <CardContent class="flex items-center justify-between space-y-0">
              <p class="text-l font-medium text-[#ffffff]">Pending Payouts</p>
              <div class="weeshr-icon2 rounded-[7px]">
                <Icon icon="heroicons:bars-3" width="24px" height="24px" color="#EE9F39" />
              </div>

              <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
                <!-- <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" /> -->
                <!-- <span v-else>{{ currencySymbol(totalTransfers.currency) }}
                  {{ totalTransfers.amount.toLocaleString() }}</span> -->
                   <span>₦
                {{ analytic?.vendorPayoutAnalytics.totalPendingPayout || 0 }}</span>
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
          History
          <p class="text-xs sm:text-sm font-normal text-[#02072199]">
            Details of all transactions
          </p>
        </div>
        <div v-if="transactions.length !== 0" class="flex items-center flex-col md:flex-row gap-4">
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
        <Table v-if="payouts && payouts.length !== 0" class="lg:w-full w-[800px]">
          <TableHeader>
            <TableRow
              class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
            >
                <TableHead>Recipient </TableHead>
                <TableHead>Recipient Phone </TableHead>
                <TableHead>Recipient Address</TableHead>
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
              <TableHead>Transaction ID</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(item) in payouts" :key="item._id" class="text-nowrap">
                <TableCell class="text-xs md:text-sm lg:text-sm"
                  >{{ item.orderId.recieverName }}
                </TableCell>
                <TableCell class="text-xs md:text-sm lg:text-sm"
                  >{{ item.orderId.phoneNumber }}
                </TableCell>
                <TableCell class="text-xs md:text-sm lg:text-sm"
                  >{{ item.orderId.shippingAddress }}
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
                    >{{ item.status }}</Badge
                  >
                  <Badge
                    class="text-white rounded-full bg-yellow-400"
                    v-if="item.status.toUpperCase() === 'PENDING'"
                    >{{ item.status }}</Badge
                  >
                  <Badge
                    class="text-white rounded-full bg-[#00C37F]"
                    v-if="item.status.toUpperCase() === 'DISBURSED'"
                    >{{ item.status }}</Badge
                  >
                  <Badge
                    class="text-white rounded-full bg-red-500"
                    v-if="item.status.toUpperCase() === 'REJECTED'"
                    >{{ item.status }}</Badge
                  >
                  <Badge
                    class="text-white rounded-full bg-[#020721]"
                    v-if="item.status.toUpperCase() === 'APPROVED'"
                  >
                    {{ item.status }}
                  </Badge></TableCell
                >
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ item._id}} </TableCell>
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
                      <h3 class="text-2xl font-medium">{{ item.transactionId }}</h3>
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
                                {{ formatDate(item.createdAt) }} - {{ formatDate(item.payoutDate) }}<!-- {{ transaction.createdAt && formatDate(transaction.createdAt) }} - {{ formatDate(transaction.createdAt) }} -->
                              </Badge>
                            </div>
                            <p class="text-lg my-2 md:my-0 text-primary font-bold text-[#000000]">
                              <!-- {{ formatDate(transaction?.createdAt) }} -->{{ formatDate(item.createdAt) }}
                            </p>
                          </div>
                        </span>
                      <div class="flex items-center gap-4 bg-success">
                        <Badge variant="outline" :class="statusBg(item.status)" class="text-xs text-white">{{ item.status }}</Badge>
                      </div>
                      </CardContent>
                    </Card>
                    <Card Content class="rounded-lg px-0">
                      <CardHeader>
                        <div class="flex flex-col md:flex-row md:items-center justify-between w-full">
                          <div class="flex items-center gap-4">
                            <h2 class="font-bold md:text-lg">Transaction Summary</h2>
                            <Badge class="bg-[#E9F4D1] text-primary">{{ item.productCount }}</Badge>
                          </div>
                          <h1 class="font-bold text-xl">₦{{ item.payoutAmount }}</h1>
                        </div>
                      </CardHeader>
                      <CardContent class="px-4">
                        <!-- <div class="bg-[#F6F6F6] rounded-lg mb-4 flex flex-col items-center hover:shadow-md">
                          <div class="bg-white border flex items-center justify-between w-full py-2 px-2 rounded-lg">
                            <span class="flex gap-2 items-center"><div
                                class="inline-block text-[#F8F9FF] w-14 h-14"
                              >
                                <img src='https://res.cloudinary.com/drykej1am/image/upload/v1697377875/weehser%20pay/Weeshr_Light_lrreyo.svg' class="w-full h-full rounded-sm"/>
                              </div>
                              <div class="flex flex-col">
                                <p class="md:text-lg text-primary font-semibold">
                                  {{ item. }}
                                </p>
                                <p class="text-sm text-muted-foreground text-[#000000]">
                                  ₦{{ item.amount }}
                                </p>
                              </div>
                            </span>
                            <div class="flex items-center gap-4">
                              <Badge variant="outline">100ml</Badge>
                            </div>
                          </div>
                          <div class="w-full flex items-center justify-between py-3 px-4">
                            <h3 class="text-xs font-semibold text-muted-foreground">Unit x{{ item.productCount }}</h3>
                            <h2 class="text-md text-primary font-semibold">₦{{ item.payoutAmount }}</h2>
                          </div>
                        </div> -->
                        <div class="rounded-lg overflow-hidden flex flex-col mt-6">
                          <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2">
                            <div class="flex items-center gap-4">
                              <h2 class="text-xs font-semibold text-muted-foreground">Total Value</h2>
                            </div>
                            <h1 class="text-md text-primary font-semibold">₦{{ item.payoutAmount.toLocaleString() }}</h1>
                          </div>
                          <!-- <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2 my-1">
                            <div class="flex items-center gap-4">
                              <h2 class="text-xs font-semibold text-muted-foreground">Delivery Charge</h2>
                            </div>
                            <h1 class="text-md text-primary font-semibold">₦{{ item. }}</h1>
                          </div> -->
                          <!-- <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2">
                            <div class="flex items-center gap-4">
                              <h2 class="text-xs font-semibold text-muted-foreground">Discount</h2>
                            </div>
                            <h1 class="text-md text-primary font-semibold">₦{{ transaction.discount.toLocaleString() }}</h1>
                          </div> -->
                          <!-- <div class="bg-[#02072199] flex items-center justify-between w-full px-4 py-2">
                            <div class="flex items-center gap-4">
                              <h2 class="text-xs font-semibold text-[#F8F9FFB2]">Payout Value</h2>
                            </div>
                            <h1 class="text-md font-semibold text-white">₦{{ tran.payoutAmount.toLocaleString() }}</h1>
                          </div> -->
                        </div>
                        <Card class="px-2 py-4 w-full rounded-xl shadow-md">
                          <Tabs default-value="receiver" class="space-y-2">
                            <TabsList class="w-full bg-transparent">
                              <TabsTrigger
                                value="receiver"
                                class="text-[#000000] data-[state=active]:border-[#6A70FF]"
                              >
                                Receiver
                              </TabsTrigger>
                              <!-- <TabsTrigger
                                value="sender"
                                class="text-[#000000] data-[state=active]:border-[#6A70FF]"
                              >
                                Sender
                              </TabsTrigger>
                              <TabsTrigger
                                value="vendor"
                                class="text-[#000000] data-[state=active]:border-[#6A70FF]"
                              >
                                Vendor
                              </TabsTrigger> -->
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
                                  <h1 class="text-xs text-primary font-semibold">{{ item.orderId.shippingAddress }}</h1>
                                </div>
                                <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2 my-1">
                                  <div class="flex items-center gap-4">
                                    <h2 class="text-xs font-semibold text-muted-foreground">Phone Number</h2>
                                  </div>
                                  <h1 class="text-xs text-primary font-semibold">{{ item.orderId.phoneNumber }}</h1>
                                </div>
                                <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2">
                                  <div class="flex items-center gap-4">
                                    <h2 class="text-xs font-semibold text-muted-foreground">Shipping Address</h2>
                                  </div>
                                  <h1 class="text-xs text-primary font-semibold">{{ item.orderId.shippingAddress }}</h1>
                                </div>
                              </div>
                            </TabsContent>
                            <!-- <TabsContent value="sender">
                              <div class="rounded-lg overflow-hidden flex flex-col mt-6">
                                <div class="w-full mb-4 px-4">
                                  <h1 class="text-xl font-bold">{{ item.orderId. }}</h1>
                                </div>
                                <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2">
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
                                </div>
                                <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2">
                                  <div class="flex items-center gap-4">
                                    <h2 class="text-xs font-semibold text-muted-foreground">Email</h2>
                                  </div>
                                  <h1 class="text-xs text-primary font-semibold">{{ item. }}</h1>
                                </div>
                              </div>
                            </TabsContent> -->
                            <!-- <TabsContent value="vendor">
                              <div class="rounded-lg overflow-hidden flex flex-col mt-6">
                                <div class="w-full mb-4 px-4">
                                  <h1 class="text-xl font-bold">{{ transaction.vendor.companyName }}</h1>
                                </div>
                                <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2">
                                  <div class="flex items-center gap-4">
                                    <h2 class="text-xs font-semibold text-muted-foreground">Address</h2>
                                  </div>
                                  <h1 class="text-xs text-primary font-semibold">₦{{ transaction.vendor.address }}</h1>
                                </div>
                                <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2 my-1">
                                  <div class="flex items-center gap-4">
                                    <h2 class="text-xs font-semibold text-muted-foreground">Phone Number</h2>
                                  </div>
                                  <h1 class="text-xs text-primary font-semibold">{{ transaction.vendor.phone }}</h1>
                                </div>
                                <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2">
                                  <div class="flex items-center gap-4">
                                    <h2 class="text-xs font-semibold text-muted-foreground">Email</h2>
                                  </div>
                                  <h1 class="text-xs text-primary font-semibold">{{ transaction.vendor.companyEmail }}</h1>
                                </div>
                              </div>
                            </TabsContent> -->
                          </Tabs>
                        </Card>
                      </CardContent>
                    </Card>
                  </SheetContent>
                </Sheet>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div v-else class="flex h-full w-full flex-col gap-4 items-center justify-center px-2 sm:px-4 py-4">
          <img src="https://res.cloudinary.com/drykej1am/image/upload/v1757871471/weershr-vendor/empty-cart_x2itw9.png" class="w-60 h-60" alt="">
          <h1 class="text-2xl font-semibold animate-pulse">No Transaction yet</h1>
        </div>
      </div>
      <!-- <div class="hidden gap-2 max-w-full flex-wrap justify-end mt-8 mr-4 items-center text-[15px]">
        <Button variant="secondary"> <Icon icon="radix-icons:chevron-left" /> </Button>
        <Button variant="secondary" class="bg-[#020721] text-gray-400"> 1 </Button>
        <Button variant="outline"> 2 </Button>
        <Button variant="outline"> &#8230; </Button>
        <Button variant="outline"> 4 </Button>
        <Button variant="outline"> 5 </Button>
        <Button variant="outline"> <Icon icon="radix-icons:chevron-right" /> </Button>
        <a href="#"><p class="text-[blue]">See all</p></a>
      </div> -->
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
import { Icon } from '@iconify/vue'
import Search from '@/components/UseSearch.vue'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import VendorNav from '@/components/VendorNav.vue'
import { useVendorTransactionStore } from '@/stores/vendor/vendor-transactions'
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import { useVendorPayoutStore } from '@/stores/vendor/payout'
import ProxyNav from '@/components/ProxyNav.vue'

// const open = ref<boolean>(false)
// const id = ref<string>('0')

const id = useSuperAdminStore().vendorId;
const statusBg = (status: string) => {
  switch (status) {
    case 'failed':
      return 'bg-[#E45044]'
    case 'pending':
      return 'bg-[#EE9F39]'
    case 'complete':
      return 'bg-[#00C37F]'
    default:
      return ''
  }
}

const formatDate = (dateStr: string | Date | undefined) => {
  if (!dateStr) return 'N/A'
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return 'Invalid Date'
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  } catch (error) {
    return 'Invalid Date'
  }
}


const analytic = computed(()=>{
  return useVendorTransactionStore().analytics
})

enum PayoutStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  PROCESSING = "processing",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface VendorPayout {
  _id: string,
  vendorId: string;
  payoutAmount: number;
  payoutDate: Date;
  unitCount: number;
  productCount: number;
  orders: string[];
  status: PayoutStatus;
  transactionId?: string | null;
  decidedBy?: string;
  note?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date | null;
}

// interface Products {
//   name: string;
//   amount: number;
//   unit: number;
//   unit_price: number;
//   image: string;
// }

// interface Transaction {
//   id: string;
//   completed_date: string | null;
//   created_at: string;
//   payout: number;
//   total_Unit: number;
//   total_price: number;
//   product_count: number;
//   status: 'complete' | 'pending' | 'failed';
//   delivery_charge: number;
//   payment_price: number;
//   discount: number;
//   products: Products[];
// }

const transactions= ref<VendorPayout[]>([]);
const payouts = computed(()=>{
  return useVendorPayoutStore().vendorPayout;
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
    const dateA = new Date(a.createdAt!).getTime();
    const dateB = new Date(b.createdAt!).getTime();
    // if(dateA && dateB)
     return order === "asc" ? dateA - dateB : dateB - dateA;
    // else return 
  });
}

// Sort by payout
function sortByPayout() {
  const order = sortState.payout === "asc" ? "desc" : "asc";
  sortState.payout = order;

  const newArr = [...transactions.value].sort((a, b) =>
    order === "asc" ? a.payoutAmount - b.payoutAmount : b.payoutAmount - a.payoutAmount
  );
  transactions.value = newArr;
}

// Sort by total units
function sortByUnit() {
  const order = sortState.unit === "asc" ? "desc" : "asc";
  sortState.unit = order;

  const newArr = [...transactions.value].sort((a, b) =>
    order === "asc" ? a.unitCount - b.unitCount : b.unitCount - a.unitCount
  );
  transactions.value = newArr;
}

// Sort by product count
function sortByProductCount() {
  const order = sortState.productCount === "asc" ? "desc" : "asc";
  sortState.productCount = order;

  const newArr = [...transactions.value].sort((a, b) =>
    order === "asc"
      ? a.productCount - b.productCount
      : b.productCount - a.productCount
  );

  transactions.value = newArr;
}

// function formatDate(dateStr: string | null): string | null {
//   if (!dateStr) return null;
//   const date = new Date(dateStr);
//   return new Intl.DateTimeFormat("en-GB", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   }).format(date);
// }

onMounted(async () => {
  useVendorPayoutStore().fetchTransactions('Success', id)
  await useVendorTransactionStore().fetchAnalytics('Analytics', id)
  // fetchAnalytics('Products are available')
})

</script>