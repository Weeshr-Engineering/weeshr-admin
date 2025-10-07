<script setup lang="ts">
import Search from '@/components/UseSearch.vue'
import { ref } from 'vue'
import VendorsCards from '@/components/VendorsCards.vue'
import VendorNav from '@/components/VendorNav.vue'
import 'vue-tel-input/vue-tel-input.css'
import PagePagination from '@/components/PagePagination.vue'
import VendorAdd from './VendorAdd.vue'
import DashboardFooter from '@/components/DashboardFooter.vue';
import { Card, CardContent } from '@/components/ui/card'

import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'
import Badge from '@/components/ui/badge/Badge.vue'
// import { toast } from '@/components/ui/toast'
// import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
// import { useGeneralStore } from '@/stores/general-use'



// Define a ref to hold the users data
const users = ref<any[]>([
  { _id: 1, vendor: 'Abiola', category: 'Cash', dateJoined: '03 Jan 2024', deliveryrate: '85%', status: 'Overdue' },
  {
    _id: 2,
    vendor: 'Gitacy',
    category: 'Gift Cash',
    dateJoined: '03 Jan 2024',
    deliveryrate: '90%',
    status: 'Processing'
  },
  {
    _id: 3,
    vendor: 'Ajax Logistics',
    category: 'All category',
    dateJoined: '03 Jan 2024',
    deliveryrate: '99%',
    status: 'Delivered'
  },
  {
    _id: 4,
    vendor: 'Middle Man Abuja',
    category: 'All category',
    dateJoined: '03 Jan 2024',
    deliveryrate: '95%',
    status: 'New'
  },
  {
    _id: 5,
    vendor: ' Middle Man Lagos',
    category: 'All category',
    dateJoined: '03 Jan 2024',
    deliveryrate: '70%',
    status: 'Outbound'
  },
  {
    _id: 6,
    vendor: ' Middle Man Lagos',
    category: 'All category',
    dateJoined: '03 Jan 2024',
    deliveryrate: '70%',
    status: 'New'
  }
])

interface Products {
  name: string,
  image: {
    secure_url: string
  },
  amount: number,
  weight: number,
}

const products = ref<Products[]>([
  {
    name: 'furniture',
    image: {
      secure_url: 'https://res.cloudinary.com/drykej1am/image/upload/v1721874426/weesh/categories/AWFAGiROM7oxB4ZJWhnaAYkP.jpg'
    },
    amount: 30000,
    weight: 220
  },
  {
    name: 'Money',
    image: {
      secure_url: 'https://res.cloudinary.com/drykej1am/image/upload/v1721874693/weesh/categories/0R8A7HYjXsYHickRvdP2eNQ8.jpg'
    },
    amount: 20000,
    weight: 100
  },
  {
    name: 'Game',
    image: {
      secure_url: 'https://res.cloudinary.com/drykej1am/image/upload/v1721874850/weesh/categories/WW18ndBhpeKoy2scWXeVqHBv.jpg'
    },
    amount: 15000,
    weight: 20
  },
  {
    name: 'Cake',
    image: {
      secure_url: 'https://res.cloudinary.com/drykej1am/image/upload/v1721875177/weesh/categories/I9IP1OFoxLzZQpA9Sl12fb_g.jpg'
    },
    amount: 20000,
    weight: 70
  }
])

const loading = ref(false)

</script>

<template>
  <div class="flex-col flex bg-[#f0f8ff] min-h-[400px] px-4 sm:px-10 pb-10">
    <!-- <MainNav class="mx-6" headingText="Dashboard" /> -->
    <VendorNav class="mx-6" headingText="Dashboard"/>
    <div class="w-full grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
      <VendorsCards
        type="payouts"
        :loading="loading"
        :value=50
        :subvalue=50
      />
      <VendorsCards
        type="orders"
        :loading="loading"
        :value=60
        :subvalue=60
      />
      <VendorsCards
        type="totalFulfilment"
        :loading="loading"
        :value=60
        :subvalue=60
      />
      <VendorsCards
        type="products"
        :loading="loading"
        :value=60
        :subvalue=60
      />
    </div>

   <div class="grid grid-cols-10 gap-4 md:gap-8 my-8">
     <Card class="container col-span-10 md:col-span-6 px-4 py-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="text-2xl font-bold tracking-tight text-[#020721]">
            Orders
            <p class="text-xs text-[#02072199] py-2">List of Weeshr Vendors</p>
          </div>
          <Search />
        </div>

        <div class="overflow-auto bg-white rounded-lg shadow">
          <Table class="h-[20dvh] overflow-y-scroll" v-if="users.length !== 0">
            <TableHeader>
              <TableRow
                class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
              >
                <TableHead> Order ID </TableHead>
                <TableHead>Item Count</TableHead>
                <TableHead>Receiver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="user in users" :key="user._id">
                <TableCell class="font-medium">0000{{ user._id }}</TableCell>
                <TableCell>{{ user._id }}</TableCell>
                <TableCell>{{ user.vendor }}</TableCell>
                <TableCell>
                  <button
                    :class="{ 'bg-[#DF6C50]': user.status === 'Overdue', 'bg-[#6A70FF]': user.status === 'Processing', 'bg-[#00C37F]': user.status === 'Delivered', 'bg-[#3A8EE5]': user.status === 'New', 'bg-[#EE9F39]': user.status === 'Outbound' }"
                    class="px-4 py-2 text-sm text-white rounded-md"
                  >
                    {{ user.status }}
                  </button>
                </TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div v-else class="flex h-full flex-col gap-4 items-center justify-center px-2 sm:px-4 py-4">
            <img src="https://res.cloudinary.com/drykej1am/image/upload/v1757871471/weershr-vendor/empty-cart_x2itw9.png" class="w-60 h-60" alt="">
            <h1 class="text-2xl font-semibold">No Order to Display</h1>
          </div>
        </div>
        <div class="w-full md:flex flex-col md:flex-row items-end justify-center gap-4" v-if="users.length !== 0">
          <PagePagination :page-total="1" :page-current="1" @pagination="()=> console.log('trigger page change')" />
          <div class="h-10 w-full md:w-fit flex items-center justify-center text-blue-500">
            <a href="#">See all</a>
          </div>
        </div>
      </Card>
       <Card class="container col-span-10 md:col-span-4 relative px-4 pt-6 md:pt-0 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl">
          <div class="flex items-center justify-between px-2 py-4">
            <div class="text-2xl font-bold tracking-tight text-[#020721]">
              Our Products
              <p class="text-xs text-[#02072199] py-2">List of our published products</p>
            </div>
            <VendorAdd v-if="products.length !== 0"/>
          </div>

          <div v-if="products.length !== 0" class="overflow-auto bg-white pb-4 flex flex-col space-y-2">
            <Card Content class="border rounded-lg hover:shadow-xl" v-for="(product, key) in products" :key="key">
              <CardContent
                class="flex items-center justify-between px-2 sm:px-4 py-4"
              >
                <span class="flex gap-2 items-center"><div
                  class="inline-block text-[#F8F9FF] w-14 h-14"
                >
                  <img :src='product.image.secure_url' class="wfull h-full rounded-sm"/>
                </div>
                <div class="flex flex-col items-center justify-between">
                  <p class="text-sm text-muted-foreground text-center text-[#000000]">
                    {{product.name}}
                  </p>
                  <p class="text-sm text-muted-foreground text-center text-[#000000]">
                    ₦ {{product.amount}}
                  </p>
                </div>
              </span>
              <div class="flex items-center gap-4">
                <Badge variant="outline">{{ product.weight }} ml</Badge>
              </div>
              </CardContent>
            </Card>
            <div class="text-center text-blue-500 absolute bottom-4 w-full place-self-center">
              <a href="#">See all</a>
            </div>
          </div>
          <div v-else>
            <Card>
              <CardContent class="flex flex-col gap-4 items-center justify-center px-2 sm:px-4 py-4">
                <img src="https://res.cloudinary.com/drykej1am/image/upload/v1757871412/weershr-vendor/ecommerce_xrvr9h.png" class="w-48 h-48" alt="">
                <h1>No products to display</h1>
                <div class="w-full flex items-center justify-center">
                  <span class=""><VendorAdd/></span>
                </div>
              </CardContent>
            </Card>
          </div>
        </Card>
   </div>
   <DashboardFooter/>
  </div>
</template>
@/stores/super-admin/super-admin@/stores/super-admin/super-admin
<!-- <a href="https://www.flaticon.com/free-stickers/purchase" title="purchase stickers">Purchase stickers created by kerismaker - Flaticon</a> -->