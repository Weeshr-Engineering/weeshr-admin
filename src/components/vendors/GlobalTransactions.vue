<template>
  <div class="flex-col flex bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10">
    <VendorNav class="mx-6" headingText="Geeftr Ops > Transactions" />

    <div class="container w-full grid gap-4 md:grid-cols-4 md:gap-6 pt-6 text-nowrap">
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
                {{ 40000 }}</span>
            </p>
          </CardContent>
        </div>
      </Card>

      <!-- <RouterLink to="/bank/outflow"> -->
        <Card
          class="h-[150px] rounded-[24px] bg-[#6A70FF] cardShadow3 border-transparent transition-transform transform hover:scale-105">
          <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
            <CardContent class="flex items-center justify-between space-y-0">
              <p class="text-l font-medium text-[#ffffff]">Next Weekly Payouts</p>
              <div class="weeshr-icon2 rounded-[7px]">
                <Icon icon="heroicons:bars-3" width="24px" height="24px" color="#6A70FF" />
              </div>

              <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
                <!-- <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" /> -->
                <!-- <span v-else>{{ currencySymbol(totalTransfers.currency) }}
                  {{ totalTransfers.amount.toLocaleString() }}</span> -->
                   <span>₦
                {{ 40000 }}</span>
              </p>
            </CardContent>
          </div>
        </Card>

        <Card
          class="h-[150px] rounded-[24px] bg-[#3A8EE5] cardShadow3 border-transparent transition-transform transform hover:scale-105">
          <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
            <CardContent class="flex items-center justify-between space-y-0">
              <p class="text-l font-medium text-[#ffffff]">Next Payout Date</p>
              <div class="weeshr-icon2 rounded-[7px]">
                <Icon icon="heroicons:bars-3" width="24px" height="24px" color="#3A8EE5" />
              </div>

              <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
                <!-- <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" /> -->
                <!-- <span v-else>{{ currencySymbol(totalTransfers.currency) }}
                  {{ totalTransfers.amount.toLocaleString() }}</span> -->
                   <span>29th Aug</span>
              </p>
            </CardContent>
          </div>
        </Card>

        <Card
          class="h-[150px] rounded-[24px] bg-[#EE9F39] cardShadow2 border-transparent transition-transform transform hover:scale-105">
          <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
            <CardContent class="flex items-center justify-between space-y-0">
              <p class="text-l font-medium text-[#ffffff]">No. of Next Payout Vendor</p>
              <div class="weeshr-icon2 rounded-[7px]">
                <Icon icon="heroicons:bars-3" width="24px" height="24px" color="#EE9F39" />
              </div>

              <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
                <!-- <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" /> -->
                <!-- <span v-else>{{ currencySymbol(totalTransfers.currency) }}
                  {{ totalTransfers.amount.toLocaleString() }}</span> -->
                   <span>
                {{ 4 }}</span>
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
          Global Transaction Sheet
          <p class="text-xs sm:text-sm font-normal text-[#02072199]">
            Details of all transactions
          </p>
        </div>
        <div class="flex items-center flex-col md:flex-row gap-4">
          <Search class="mt-3 lg:mt-0" />
          <button class="border-[#020721] border-2 px-4 py-2 rounded-xl w-50 h-12">
            <div class="text-base text-[#020721] text-center flex items-center">
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
                  fill="#020721"
                />
              </svg>
            </div>
          </button>
          <button class="bg-[#020721] px-4 py-2 rounded-xl w-50 h-12">
            <div class="text-base text-[#F8F9FF] text-center flex items-center">
              Next Payout
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
                  Vendors
                  <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                </div>
              </TableHead>
              <TableHead @click="sortByDate">
                <div class="flex items-center">
                  Date
                  <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                </div>
              </TableHead>
              <TableHead @click="sortByPayout">
                <div class="flex items-center">
                  Payout
                  <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                </div>
              </TableHead>
              <TableHead @click="sortByUnit">
                <div class="flex items-center">
                  Unit Count
                  <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                </div>
              </TableHead>
              <TableHead @click="sortByProductCount">
                <div class="flex items-center">
                  Product Count
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
            <TableRow v-for="transaction in transactions" :key="transaction.id">
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ transaction.vendor.name }} </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ transaction.created_at }} </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">₦{{ transaction.payout }}</TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ transaction.total_Unit }} </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ transaction.product_count }} </TableCell>
              <TableCell>
                <div
                  :class="statusBg(transaction.status)"
                  class="rounded-[10px] w-fit px-2 py-0.5 text-white text-sm capitalize"
                >
                  {{ transaction.status }}
                </div>
              </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ transaction.id }} </TableCell>
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
                      <h3 class="text-2xl font-medium">{{ transaction.id }}</h3>
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
                                {{ formatDate(transaction.created_at) }} - {{ formatDate(transaction.completed_date) }}
                              </Badge>
                            </div>
                            <p class="text-lg my-2 md:my-0 text-primary font-bold text-[#000000]">
                              {{ formatDate(transaction.created_at) }}
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
                            <h2 class="font-bold md:text-lg">Transaction Summary</h2>
                            <Badge class="bg-[#E9F4D1] text-primary">{{ transaction.product_count }}</Badge>
                          </div>
                          <h1 class="font-bold text-xl">₦{{ transaction.total_price }}</h1>
                        </div>
                      </CardHeader>
                      <CardContent class="px-4">
                        <div class="bg-[#F6F6F6] rounded-lg mb-4 flex flex-col items-center hover:shadow-md" v-for="(item, newkey) in transaction.products" :key="newkey">
                          <div class="bg-white border flex items-center justify-between w-full py-2 px-2 rounded-lg">
                            <span class="flex gap-2 items-center"><div
                                class="inline-block text-[#F8F9FF] w-14 h-14"
                              >
                                <img :src='item.image' class="w-full h-full rounded-sm"/>
                              </div>
                              <div class="flex flex-col">
                                <p class="md:text-lg text-primary font-semibold">
                                  {{ item.name }}
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
                            <h3 class="text-xs font-semibold text-muted-foreground">Unit x{{ item.unit }}</h3>
                            <h2 class="text-md text-primary font-semibold">₦{{ item.unit_price }}</h2>
                          </div>
                        </div>
                        <div class="rounded-lg overflow-hidden flex flex-col mt-6">
                          <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2">
                            <div class="flex items-center gap-4">
                              <h2 class="text-xs font-semibold text-muted-foreground">Total Value</h2>
                            </div>
                            <h1 class="text-md text-primary font-semibold">₦{{ transaction.total_price.toLocaleString() }}</h1>
                          </div>
                          <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2 my-1">
                            <div class="flex items-center gap-4">
                              <h2 class="text-xs font-semibold text-muted-foreground">Delivery Charge</h2>
                            </div>
                            <h1 class="text-md text-primary font-semibold">₦{{ transaction.delivery_charge.toLocaleString() }}</h1>
                          </div>
                          <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2">
                            <div class="flex items-center gap-4">
                              <h2 class="text-xs font-semibold text-muted-foreground">Discount</h2>
                            </div>
                            <h1 class="text-md text-primary font-semibold">₦{{ transaction.discount.toLocaleString() }}</h1>
                          </div>
                          <div class="bg-[#02072199] flex items-center justify-between w-full px-4 py-2">
                            <div class="flex items-center gap-4">
                              <h2 class="text-xs font-semibold text-[#F8F9FFB2]">Payout Value</h2>
                            </div>
                            <h1 class="text-md font-semibold text-white">₦{{ transaction.payment_price.toLocaleString() }}</h1>
                          </div>
                        </div>
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
import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ref } from 'vue'
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
import VendorNav from '../VendorNav.vue'

// const open = ref<boolean>(false)
// const id = ref<string>('0')

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

interface Party {
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
  status: 'complete' | 'pending' | 'failed';
  delivery_charge: number;
  payment_price: number;
  discount: number;
  products: Products[];
  vendor: Party;
  sender: Party;
  receiver: Party
}

const transactions = ref<Transaction[]>([
  {
    id: "tx_001",
    completed_date: "2025-09-01",
    created_at: "2025-08-28",
    payout: 4500,
    total_Unit: 15,
    total_price: 5000,
    product_count: 3,
    status: "complete",
    delivery_charge: 500,
    payment_price: 4700,
    discount: 300,
    vendor: {
      id: "v_001",
      name: "Ruby’s Furniture Co.",
      phone: "+2348011122233",
      address: "12 Adeola St, Ikeja, Lagos",
      email: "sales@rubysfurniture.com",
    },
    sender: {
      id: "s_001",
      name: "Express Logistics",
      phone: "+2348098877665",
      address: "Plot 4, Mainland Way, Lagos",
      email: "dispatch@expresslogistics.ng",
    },
    receiver: {
      id: "r_001",
      name: "Chika Johnson",
      phone: "+2348023344556",
      address: "Flat 3B, Allen Ave, Lagos",
      email: "chika.j@example.com",
    },
    products: [
      { name: "Furniture", amount: 2, unit: 5, unit_price: 800, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721874426/weesh/categories/AWFAGiROM7oxB4ZJWhnaAYkP.jpg" },
      { name: "Cooking Oil", amount: 1, unit: 3, unit_price: 1200, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721875177/weesh/categories/I9IP1OFoxLzZQpA9Sl12fb_g.jpg" },
      { name: "Sugar Pack", amount: 2, unit: 7, unit_price: 300, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721875177/weesh/categories/I9IP1OFoxLzZQpA9Sl12fb_g.jpg" },
    ],
  },
  {
    id: "tx_002",
    completed_date: null,
    created_at: "2025-09-05",
    payout: 2300,
    total_Unit: 8,
    total_price: 2500,
    product_count: 2,
    status: "pending",
    delivery_charge: 200,
    payment_price: 2300,
    discount: 0,
    vendor: {
      id: "v_002",
      name: "Neat Supplies Ltd.",
      phone: "+2348056677889",
      address: "7 Unity Close, Surulere, Lagos",
      email: "orders@neatsupplies.com",
    },
    sender: {
      id: "s_002",
      name: "Swift Dispatch",
      phone: "+2348082233445",
      address: "Opebi Road, Ikeja, Lagos",
      email: "support@swiftdispatch.ng",
    },
    receiver: {
      id: "r_002",
      name: "Adeyemi Folarin",
      phone: "+2348091112233",
      address: "19 Oregun St, Lagos",
      email: "adeyemi.f@example.com",
    },
    products: [
      { name: "Detergent", amount: 1, unit: 3, unit_price: 400, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721875177/weesh/categories/I9IP1OFoxLzZQpA9Sl12fb_g.jpg" },
      { name: "Furniture", amount: 5, unit: 5, unit_price: 300, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721874426/weesh/categories/AWFAGiROM7oxB4ZJWhnaAYkP.jpg" },
    ],
  },
  {
    id: "tx_003",
    completed_date: "2025-09-08",
    created_at: "2025-09-07",
    payout: 10000,
    total_Unit: 20,
    total_price: 11000,
    product_count: 4,
    status: "failed",
    delivery_charge: 1000,
    payment_price: 10500,
    discount: 500,
    vendor: {
      id: "v_003",
      name: "Tech Essentials Hub",
      phone: "+2348012334455",
      address: "Mall 3, Ikeja City Mall, Lagos",
      email: "contact@techhub.ng",
    },
    sender: {
      id: "s_003",
      name: "Lynx Couriers",
      phone: "+2348095566778",
      address: "Iyana Ipaja, Lagos",
      email: "info@lynxcouriers.com",
    },
    receiver: {
      id: "r_003",
      name: "Oluwatobi Akin",
      phone: "+2348029988776",
      address: "14 Elegushi Road, Lekki, Lagos",
      email: "tobi.akin@example.com",
    },
    products: [
      { name: "Laptop Bag", amount: 2, unit: 2, unit_price: 2500, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721874850/weesh/categories/WW18ndBhpeKoy2scWXeVqHBv.jpg" },
      { name: "Furniture", amount: 3, unit: 3, unit_price: 500, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721874426/weesh/categories/AWFAGiROM7oxB4ZJWhnaAYkP.jpg" },
      { name: "Keyboard", amount: 2, unit: 2, unit_price: 1500, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721874850/weesh/categories/WW18ndBhpeKoy2scWXeVqHBv.jpg" },
      { name: "USB Cable", amount: 5, unit: 5, unit_price: 200, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721874850/weesh/categories/WW18ndBhpeKoy2scWXeVqHBv.jpg" },
    ],
  },
  {
    id: "tx_004",
    completed_date: "2025-09-10",
    created_at: "2025-09-09",
    payout: 5200,
    total_Unit: 10,
    total_price: 5700,
    product_count: 3,
    status: "complete",
    delivery_charge: 500,
    payment_price: 5200,
    discount: 500,
    vendor: {
      id: "v_004",
      name: "FreshMart Groceries",
      phone: "+2348076543210",
      address: "22 Bode Thomas St, Surulere, Lagos",
      email: "support@freshmart.ng",
    },
    sender: {
      id: "s_004",
      name: "QuickMove Logistics",
      phone: "+2348094433221",
      address: "Ojodu Berger, Lagos",
      email: "hello@quickmove.ng",
    },
    receiver: {
      id: "r_004",
      name: "Ngozi Okafor",
      phone: "+2348021133445",
      address: "10 Marina Rd, Lagos Island, Lagos",
      email: "ngozi.okafor@example.com",
    },
    products: [
      { name: "Rice Bag", amount: 1, unit: 5, unit_price: 1200, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721874850/weesh/categories/WW18ndBhpeKoy2scWXeVqHBv.jpg" },
      { name: "Groundnut Oil", amount: 2, unit: 3, unit_price: 900, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721875177/weesh/categories/I9IP1OFoxLzZQpA9Sl12fb_g.jpg" },
      { name: "Salt Pack", amount: 5, unit: 2, unit_price: 200, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721875177/weesh/categories/I9IP1OFoxLzZQpA9Sl12fb_g.jpg" },
    ],
  },
  {
    id: "tx_005",
    completed_date: null,
    created_at: "2025-09-11",
    payout: 3800,
    total_Unit: 9,
    total_price: 4000,
    product_count: 2,
    status: "pending",
    delivery_charge: 200,
    payment_price: 3800,
    discount: 0,
    vendor: {
      id: "v_005",
      name: "Glow Beauty Supplies",
      phone: "+2348012347789",
      address: "5 Oba Akran Ave, Ikeja, Lagos",
      email: "orders@glowbeauty.ng",
    },
    sender: {
      id: "s_005",
      name: "ParcelPro",
      phone: "+2348085566778",
      address: "Mushin, Lagos",
      email: "support@parcelpro.ng",
    },
    receiver: {
      id: "r_005",
      name: "Funmi Adewale",
      phone: "+2348076677889",
      address: "15 Ilupeju Rd, Lagos",
      email: "funmi.a@example.com",
    },
    products: [
      { name: "Face Cream", amount: 3, unit: 3, unit_price: 1000, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721874850/weesh/categories/WW18ndBhpeKoy2scWXeVqHBv.jpg" },
      { name: "Body Lotion", amount: 3, unit: 3, unit_price: 700, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721875177/weesh/categories/I9IP1OFoxLzZQpA9Sl12fb_g.jpg" },
    ],
  },
  {
    id: "tx_006",
    completed_date: "2025-09-14",
    created_at: "2025-09-12",
    payout: 9000,
    total_Unit: 18,
    total_price: 9500,
    product_count: 4,
    status: "complete",
    delivery_charge: 500,
    payment_price: 9000,
    discount: 500,
    vendor: {
      id: "v_006",
      name: "Urban Tech Gadgets",
      phone: "+2348091123456",
      address: "Yaba Tech Park, Lagos",
      email: "info@urbantech.ng",
    },
    sender: {
      id: "s_006",
      name: "Speedy Express",
      phone: "+2348082233556",
      address: "CMS, Lagos",
      email: "dispatch@speedyexpress.ng",
    },
    receiver: {
      id: "r_006",
      name: "Kunle Balogun",
      phone: "+2348025566778",
      address: "Victoria Island, Lagos",
      email: "kunle.b@example.com",
    },
    products: [
      { name: "Power Bank", amount: 3, unit: 3, unit_price: 2000, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721874850/weesh/categories/WW18ndBhpeKoy2scWXeVqHBv.jpg" },
      { name: "USB Cable", amount: 5, unit: 5, unit_price: 200, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721875177/weesh/categories/I9IP1OFoxLzZQpA9Sl12fb_g.jpg" },
      { name: "Wireless Mouse", amount: 2, unit: 2, unit_price: 1500, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721875177/weesh/categories/I9IP1OFoxLzZQpA9Sl12fb_g.jpg" },
      { name: "Keyboard", amount: 1, unit: 1, unit_price: 1000, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721874850/weesh/categories/WW18ndBhpeKoy2scWXeVqHBv.jpg" },
    ],
  },
  {
    id: "tx_007",
    completed_date: null,
    created_at: "2025-09-15",
    payout: 6000,
    total_Unit: 12,
    total_price: 6500,
    product_count: 3,
    status: "pending",
    delivery_charge: 500,
    payment_price: 6000,
    discount: 500,
    vendor: {
      id: "v_007",
      name: "Daily Needs Store",
      phone: "+2348053344556",
      address: "Egbeda, Lagos",
      email: "contact@dailyneeds.ng",
    },
    sender: {
      id: "s_007",
      name: "Urban Express",
      phone: "+2348098899777",
      address: "Agege Motor Rd, Lagos",
      email: "logistics@urbanexpress.ng",
    },
    receiver: {
      id: "r_007",
      name: "Bisi Adebayo",
      phone: "+2348024433221",
      address: "Ikeja GRA, Lagos",
      email: "bisi.a@example.com",
    },
    products: [
      { name: "Toothpaste", amount: 3, unit: 3, unit_price: 500, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721875177/weesh/categories/I9IP1OFoxLzZQpA9Sl12fb_g.jpg" },
      { name: "Toilet Paper", amount: 2, unit: 4, unit_price: 300, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721874850/weesh/categories/WW18ndBhpeKoy2scWXeVqHBv.jpg" },
      { name: "Body Soap", amount: 4, unit: 5, unit_price: 700, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721874426/weesh/categories/AWFAGiROM7oxB4ZJWhnaAYkP.jpg" },
    ],
  },
  {
    id: "tx_008",
    completed_date: "2025-09-16",
    created_at: "2025-09-15",
    payout: 15000,
    total_Unit: 25,
    total_price: 16000,
    product_count: 5,
    status: "complete",
    delivery_charge: 1000,
    payment_price: 15000,
    discount: 1000,
    vendor: {
      id: "v_008",
      name: "Mega Electronics",
      phone: "+2348014456677",
      address: "Computer Village, Ikeja",
      email: "info@megaelectronics.ng",
    },
    sender: {
      id: "s_008",
      name: "RapidX Delivery",
      phone: "+2348087766554",
      address: "Ogba, Lagos",
      email: "contact@rapidx.ng",
    },
    receiver: {
      id: "r_008",
      name: "Emeka Ofor",
      phone: "+2348029911223",
      address: "Ajah, Lagos",
      email: "emeka.o@example.com",
    },
    products: [
      { name: "Bluetooth Speaker", amount: 3, unit: 3, unit_price: 2500, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721874850/weesh/categories/WW18ndBhpeKoy2scWXeVqHBv.jpg" },
      { name: "Earphones", amount: 5, unit: 5, unit_price: 800, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721875177/weesh/categories/I9IP1OFoxLzZQpA9Sl12fb_g.jpg" },
      { name: "Smartwatch", amount: 2, unit: 2, unit_price: 3000, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721875177/weesh/categories/I9IP1OFoxLzZQpA9Sl12fb_g.jpg" },
      { name: "Laptop Stand", amount: 3, unit: 3, unit_price: 1000, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721874426/weesh/categories/AWFAGiROM7oxB4ZJWhnaAYkP.jpg" },
      { name: "Mouse Pad", amount: 4, unit: 4, unit_price: 200, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721874850/weesh/categories/WW18ndBhpeKoy2scWXeVqHBv.jpg" },
    ],
  },
  {
    id: "tx_009",
    completed_date: null,
    created_at: "2025-09-18",
    payout: 7200,
    total_Unit: 14,
    total_price: 7500,
    product_count: 3,
    status: "pending",
    delivery_charge: 300,
    payment_price: 7200,
    discount: 300,
    vendor: {
      id: "v_009",
      name: "Elite Kitchenware",
      phone: "+2348094455667",
      address: "Maryland Mall, Lagos",
      email: "support@elitekitchen.ng",
    },
    sender: {
      id: "s_009",
      name: "ParcelNow",
      phone: "+2348076655443",
      address: "Obalende, Lagos",
      email: "info@parcelnow.ng",
    },
    receiver: {
      id: "r_009",
      name: "Amaka Eze",
      phone: "+2348025566778",
      address: "Lekki Phase 1, Lagos",
      email: "amaka.e@example.com",
    },
    products: [
      { name: "Blender", amount: 2, unit: 2, unit_price: 2000, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721874850/weesh/categories/WW18ndBhpeKoy2scWXeVqHBv.jpg" },
      { name: "Frying Pan", amount: 3, unit: 3, unit_price: 1500, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721874426/weesh/categories/AWFAGiROM7oxB4ZJWhnaAYkP.jpg" },
      { name: "Kettle", amount: 4, unit: 4, unit_price: 500, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721875177/weesh/categories/I9IP1OFoxLzZQpA9Sl12fb_g.jpg" },
    ],
  },
  {
    id: "tx_010",
    completed_date: "2025-09-20",
    created_at: "2025-09-19",
    payout: 8500,
    total_Unit: 16,
    total_price: 9000,
    product_count: 4,
    status: "complete",
    delivery_charge: 500,
    payment_price: 8500,
    discount: 500,
    vendor: {
      id: "v_010",
      name: "Campus Essentials",
      phone: "+2348012233445",
      address: "LASU Campus, Lagos",
      email: "hello@campusessentials.ng",
    },
    sender: {
      id: "s_010",
      name: "Student Courier",
      phone: "+2348085544332",
      address: "Yaba, Lagos",
      email: "orders@studentcourier.ng",
    },
    receiver: {
      id: "r_010",
      name: "Samuel Ojo",
      phone: "+2348029988775",
      address: "Unilag Campus, Lagos",
      email: "samuel.o@example.com",
    },
    products: [
      { name: "Notebook", amount: 5, unit: 5, unit_price: 300, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721874850/weesh/categories/WW18ndBhpeKoy2scWXeVqHBv.jpg" },
      { name: "Backpack", amount: 2, unit: 2, unit_price: 2500, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721874426/weesh/categories/AWFAGiROM7oxB4ZJWhnaAYkP.jpg" },
      { name: "Pen Pack", amount: 3, unit: 3, unit_price: 200, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721875177/weesh/categories/I9IP1OFoxLzZQpA9Sl12fb_g.jpg" },
      { name: "Flash Drive", amount: 2, unit: 2, unit_price: 1000, image: "https://res.cloudinary.com/drykej1am/image/upload/v1721874850/weesh/categories/WW18ndBhpeKoy2scWXeVqHBv.jpg" },
    ],
  },
])


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
function sortByUnit() {
  const order = sortState.unit === "asc" ? "desc" : "asc";
  sortState.unit = order;

  const newArr = [...transactions.value].sort((a, b) =>
    order === "asc" ? a.total_Unit - b.total_Unit : b.total_Unit - a.total_Unit
  );
  transactions.value = newArr;
}

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

</script>