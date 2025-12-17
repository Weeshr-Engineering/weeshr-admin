<script setup lang="ts">
import Search from '@/components/UseSearch.vue'
import { onMounted, ref } from 'vue'
import VendorsCards from '@/components/VendorsCards.vue'
import VendorNav from '@/components/VendorNav.vue'
import 'vue-tel-input/vue-tel-input.css'
import PagePagination from '@/components/PagePagination.vue'
import VendorAdd from './VendorAdd.vue'
import DashboardFooter from '@/components/DashboardFooter.vue';
import { Card, CardContent } from '@/components/ui/card'
import { catchErr } from '@/composables/catchError'
import { toast } from '@/components/ui/toast'
import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'
import Badge from '@/components/ui/badge/Badge.vue'
import axios from 'axios'
import type { VendorAnalytics } from '@/stores/vendor/vendor-transactions'
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import ProxyNav from '@/components/ProxyNav.vue'
// import { toast } from '@/components/ui/toast'
// import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
// import { useGeneralStore } from '@/stores/general-use'

// 2: Object { _id: "68fe0e3e6cfdca39099fa39e", rcNumber: 9000, companyName: "Cadbury", … }
// 3: Object { _id: "68fe175da98f5d209988f4b7", rcNumber: 23935, companyName: "Wakame Restaurant", … }
// 4: Object { _id: "68fe1772a98f5d209988f4c1", rcNumber: 239350, companyName: "Wakame Restaurant", … }
// 5: Object { _id: "68fe1791a98f5d209988f4cd", rcNumber: 239353, companyName: "Wakame Restaurant", … }
// 6: Object { _id: "68fe17b8a98f5d209988f4d5", rcNumber: 2393523, companyName: "Shiro Lagos", … }
// 7: Object { _id: "68fe1807a98f5d209988f4e0", rcNumber: 23910456, companyName: "Z Kitchen Lagos", … }
// 8: Object { _id: "68fe1816a98f5d209988f4ea"
export interface Product {
  _id: string
  name: string
  description: string
  amount: number
  qty: number
  status: 'draft' | 'published' | 'archived' | string
  tat: string // ISO date string
  isDeleted: boolean
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  vendorId: string
  tag: { name: string; [key: string]: any }[]
  image: {
    public_id: string
    version: number
    signature: string
    api_key: string
    asset_id: string
    bytes: number
    created_at: string
    etag: string
    folder: string
    format: string
    height: number
    original_filename: string
    placeholder: boolean
    resource_type: string
    secure_url: string
    tags: string[]
    type: string
    url: string
    version_id: string
    width: number
  }
}

interface OrderItem {
  productId: string,
  quantity: number,
  price: number,
}

interface Order {
  _id: string;
  userId: string,
  "vendorTotal": 0,
  "deliveryFee": 0,
  vendorId: string,
  items: OrderItem[],
  status: string,
  "phoneNumber": "08143106496",
  "recieverName": "ss",
  paymentStatus: string,
  totalAmount: string,
  payoutMethod?: string,
  shippingAddress?: string,
  isDeleted: boolean,
  deletedAt?: Date | null,
  createdAt?: Date | string,
  updatedAt?: Date | null
}

const id = useSuperAdminStore().vendorId;
// Define a ref to hold the users data
const orders = ref<Order[]>([])
const analytics = ref<VendorAnalytics>()

const products = ref<Product[]>([])

const loading = ref(false)


const fetchOrders = async (msg: string) => {
  toast({
    title: 'Loading Data',
    description: 'Fetching data...',
    duration: 0 // Set duration to 0 to make it indefinite until manually closed
  })

  try {
    // Set loading to true
    // useGeneralStore().setLoading(true)
    const response = await axios.get(`/api/v1/admin/market/orders/vendor/${id}`)

    if (response.status === 200 || response.status === 201) {
      // Update the users data with the response
      // console.log(response.data.data)
      orders.value = response.data.data;
      // const responseData = response.data.data[0]
      // const phoneData = response.data.data[0].phoneNumber.normalizedNumber
      // const data = { ...responseData, phone: phoneData }
      // Show success toast
      toast({
        title: 'Success',
        description: `${msg}`,
        variant: 'success'
      })
    }
    // set Loading to false
    // useGeneralStore().setLoading(false)
  } catch (error: any) {
    catchErr(error)
    if (error.response.status === 401) {
      // sessionStorage.removeItem('token')
      // Clear token from superAdminStore
      // superAdminStore.setToken('')

      setTimeout(() => {
        // router.push({ name: 'super-admin-login' })
      }, 3000)

      toast({
        title: 'Unauthorized',
        description: 'You are not authorized to perform this action. Redirecting to home page...',
        variant: 'destructive'
      })
      // Redirect after 3 seconds
    } else {
      toast({
        title: error.response.data.message || 'An error occurred',
        variant: 'destructive'
      })
    }
  }
}

const fetchProducts = async (msg: string) => {
  toast({
    title: 'Loading Data',
    description: 'Fetching data...',
    duration: 0 // Set duration to 0 to make it indefinite until manually closed
  })

  try {
    // Set loading to true
    // useGeneralStore().setLoading(true)
    const response = await axios.get('/api/v1/admin/market/products/', {
      params: {
        vendorId:  useSuperAdminStore().vendorId,
        // page: params?.page || 1,
        // limit: params?.limit || 10,
        // search: params?.search || '',
        // sortBy: params?.sortBy || 'name',
        // status: params?.status || 'all'
      }
    })

    if (response.status === 200 || response.status === 201) {
      // Update the users data with the response
      // console.log(response)
      products.value = response.data.data.data;
      // const responseData = response.data.data[0]
      // const phoneData = response.data.data[0].phoneNumber.normalizedNumber
      // const data = { ...responseData, phone: phoneData }
      // Show success toast
      toast({
        title: 'Success',
        description: `${msg}`,
        variant: 'success'
      })
    }
    // set Loading to false
    // useGeneralStore().setLoading(false)
  } catch (error: any) {
    catchErr(error)
    if (error.response.status === 401) {
      // sessionStorage.removeItem('token')
      // Clear token from superAdminStore
      // superAdminStore.setToken('')

      setTimeout(() => {
        // router.push({ name: 'super-admin-login' })
      }, 3000)

      toast({
        title: 'Unauthorized',
        description: 'You are not authorized to perform this action. Redirecting to home page...',
        variant: 'destructive'
      })
      // Redirect after 3 seconds
    } else {
      toast({
        title: error.response.data.message || 'An error occurred',
        variant: 'destructive'
      })
    }
  }
}

const fetchAnalytics = async (msg: string) => {
  toast({
    title: 'Loading Data',
    description: 'Fetching data...',
    duration: 0 // Set duration to 0 to make it indefinite until manually closed
  })

  try {
    // Set loading to true
    // useGeneralStore().setLoading(true)
    const response = await axios.get(`/api/v1/admin/market/vendor/dashboard/${id}`)

    if (response.status === 200 || response.status === 201) {
      // Update the users data with the response
      // products.value = response.data.data.data;
      // console.log(response)
      analytics.value = response.data.data;
      // const phoneData = response.data.data[0].phoneNumber.normalizedNumber
      // const data = { ...responseData, phone: phoneData }
      // Show success toast
      toast({
        title: 'Success',
        description: `${msg}`,
        variant: 'success'
      })
    }
    // set Loading to false
    // useGeneralStore().setLoading(false)
  } catch (error: any) {
    catchErr(error)
    // console.log(error)
    if (error.response.status === 401) {
      // sessionStorage.removeItem('token')
      // Clear token from superAdminStore
      // superAdminStore.setToken('')

      setTimeout(() => {
        // router.push({ name: 'super-admin-login' })
      }, 3000)

      toast({
        title: 'Unauthorized',
        description: 'You are not authorized to perform this action. Redirecting to home page...',
        variant: 'destructive'
      })
      // Redirect after 3 seconds
    } else {
      toast({
        title: error.response.data.message || 'An error occurred',
        variant: 'destructive'
      })
    }
  }
}

const statusBg = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'failed':
    case 'cancelled':
      return 'bg-[#E45044]'
    case 'pending':
    case 'new':
      return 'bg-[#EE9F39]'
    case 'processing':
      return 'bg-[#6A70FF]'
    case 'outbound':
    case 'shipped':
      return 'bg-[#3A8EE5]'
    case 'delivered':
    case 'completed':
      return 'bg-[#00C37F]'
    case 'overdue':
      return 'bg-[#DF6C50]'
    default:
      return 'bg-gray-500'
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


onMounted(() => {
  fetchOrders('data fetched')
  fetchProducts('Products are available')
  fetchAnalytics('Success')
})
</script>

<template>
  <div class="flex-col flex bg-[#f0f8ff] min-h-[400px] px-4 sm:px-10 pb-10">
    <!-- <MainNav class="mx-6" headingText="Dashboard" /> -->
    <ProxyNav/>
    <VendorNav class="mx-6" headingText="Dashboard"/>
    <div class="w-full grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
      <VendorsCards
        type="payouts"
        :loading="loading"
        :value='analytics?.vendorPayoutAnalytics.totalCompletedPayout || 0'
        :subvalue='analytics?.vendorPayoutAnalytics.totalPendingPayout || 0'
      />
      <VendorsCards
        type="orders"
        :loading="loading"
        :value='analytics?.deliveredAnalytics.totalDeliveredOrders || 0'
        :subvalue='analytics?.overdueAndUndelivered.overdueCount || 0'
      />
      <VendorsCards
        type="totalFulfilment"
        :loading="loading"
        :value='analytics?.deliveredAnalytics.totalDeliveredOrders || 0'
        :subvalue='analytics?.deliveredAnalytics.totalDeliveredAmount || 0'
      />
      <VendorsCards
        type="products"
        :loading="loading"
        :value='analytics?.productAnalytics.total_products || 0'
        :subvalue='analytics?.productAnalytics.no_of_published || 0'
      />
    </div>

   <div class="grid grid-cols-10 gap-4 md:gap-8 my-8">
     <Card class="shadow-none container col-span-10 md:col-span-6 px-4 py-6 pb-10 mx-auto sm:px-6 lg:px-8 h-full bg-[#FFFFFF] rounded-2xl">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="text-2xl font-bold tracking-tight text-[#020721]">
            Orders
            <p class="text-xs text-[#02072199] py-2">List of Orders</p>
          </div>
          <Search />
        </div>

        <div class="overflow-y-scroll h-[50dvh] bg-white rounded-lg">
          <Table class="h-[20dvh] overflow-y-scroll" v-if="orders.length !== 0">
            <TableHeader>
              <TableRow
                class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
              >
                <TableHead>
                <div class="flex items-center">Order Date</div>
              </TableHead>
              <TableHead>
                <div class="flex items-center">Receiver</div>
              </TableHead>
              <TableHead>
                <div class="flex items-center">Total Amount</div>
              </TableHead>
              <TableHead>
                <div class="flex items-center">Item Count</div>
              </TableHead>
              <TableHead>
                <div class="flex items-center">Payment Status</div>
              </TableHead>
              <TableHead>
                <div class="flex items-center">Status</div>
              </TableHead>
              <TableHead>Order ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-for="order in orders" :key="order._id">
                <router-link :to="`/order?id=${order._id}`" custom v-slot="{ navigate }">
                  <TableRow @click="navigate" class="cursor-pointer hover:bg-muted/30">
                    <TableCell class="text-xs md:text-sm lg:text-sm">
                      {{ formatDate(order.createdAt) }}
                    </TableCell>

                    <TableCell class="text-xs md:text-sm lg:text-sm">
                      {{ order.recieverName || 'N/A' }}
                    </TableCell>

                    <TableCell class="text-xs md:text-sm lg:text-sm">
                      ₦{{ order.vendorTotal?.toLocaleString() || '0' }}
                    </TableCell>

                    <TableCell class="text-xs md:text-sm lg:text-sm">
                      {{ order.items?.length || 0 }}
                    </TableCell>

                    <TableCell class="text-xs md:text-sm lg:text-sm capitalize">
                      {{ order.paymentStatus || 'pending' }}
                    </TableCell>

                    <TableCell>
                      <div
                        :class="statusBg(order.status)"
                        class="rounded-[10px] w-fit px-2 py-0.5 text-white text-sm capitalize"
                      >
                        {{ order.status }}
                      </div>
                    </TableCell>

                    <TableCell class="text-xs md:text-sm lg:text-sm">
                      {{ order._id?.substring(0, 8) }}...
                    </TableCell>
                  </TableRow>
                </router-link>
              </template>
            </TableBody>
          </Table>
          <div v-else class="flex h-full flex-col gap-4 items-center justify-center px-2 sm:px-4 py-4">
            <img src="https://res.cloudinary.com/drykej1am/image/upload/v1757871471/weershr-vendor/empty-cart_x2itw9.png" class="w-60 h-60" alt="">
            <h1 class="text-2xl font-semibold animate-pulse">No Order yet</h1>
          </div>
        </div>
        <div class="w-full md:flex flex-col md:flex-row items-end justify-center gap-4" v-if="orders.length !== 0">
          <!-- <PagePagination :page-total="1" :page-current="1" @pagination="()=> console.log('trigger page change')" /> -->
          <div class="h-10 w-full md:w-fit flex items-center justify-center text-blue-500">
            <router-link to="/order">See all</router-link>
          </div>
        </div>
      </Card>
       <Card class="container shadow-none col-span-10 md:col-span-4 relative px-4 pt-6 md:pt-0 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl">
          <div class="flex items-center justify-between px-2 py-8">
            <div class="text-2xl font-bold tracking-tight text-[#020721]">
              Our Products
              <p class="text-xs text-[#02072199] py-2">List of our published products</p>
            </div>
            <VendorAdd v-if="products.length !== 0"/>
          </div>

          <div v-if="products.length !== 0" class="overflow-y-scroll bg-white pb-4 flex flex-col space-y-2 h-[50dvh]">
            <Card Content class="border rounded-lg hover:shadow-xl" v-for="(product, key) in products" :key="key">
              <router-link to="/product">
                <CardContent
                  class="flex items-center justify-between px-2 sm:px-4 py-4"
                >
                  <span class="flex gap-2 items-center"><div
                    class="inline-block text-[#F8F9FF] w-14 h-14"
                  >
                    <img :src='product.image.secure_url' class="w-full h-full rounded-sm"/>
                  </div>
                  <div class="flex flex-col items-start justify-between">
                    <p class="text-sm text-muted-foreground text-center text-[#000000]">
                      {{product.name}}
                    </p>
                    <p class="text-sm text-muted-foreground text-center text-[#000000]">
                      ₦ {{product.amount}}
                    </p>
                  </div>
                </span>
                <div class="flex items-center gap-4">
                  <Badge variant="outline">QTY - {{ product.qty }}</Badge>
                </div>
                </CardContent>
              </router-link>
            </Card>
            <div class="text-center text-blue-500 absolute bottom-4 w-full place-self-center">
              <router-link to="/product">See all</router-link>
            </div>
          </div>
          <div v-else class="h-full flex items-center justify-center">
            <!-- <Card> -->
              <div class="flex shadow-none flex-col gap-4 items-center justify-center px-2 sm:px-4 py-4">
                <img src="https://res.cloudinary.com/drykej1am/image/upload/v1757871412/weershr-vendor/ecommerce_xrvr9h.png" class="w-48 h-48" alt="">
                <h1>No products to display</h1>
                <div class="w-full flex items-center justify-center">
                  <span class="animate-bounce"><VendorAdd/></span>
                </div>
              </div>
            <!-- </Card> -->
          </div>
        </Card>
   </div>
   <DashboardFooter/>
  </div>
</template>
@/stores/super-admin/super-admin@/stores/super-admin/super-admin
<!-- <a href="https://www.flaticon.com/free-stickers/purchase" title="purchase stickers">Purchase stickers created by kerismaker - Flaticon</a> -->