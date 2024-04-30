<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'

// const users = ref([]);
const users = ref<any[]>([
  {
    _id: 1,
    nameofweeshes: 'iPhone 15 Pro Max',
    category: 'Gadgets',
    price: '₦ 1,565,987.00',
    changes: '₦ 5,987.00',
    status: ['Initiated']
  },
  {
    _id: 2,
    nameofweeshes: 'Mary K Facial Cleanser',
    category: 'Body & Beauty',
    price: '₦ 51,000,087.6',
    changes: '₦ 100,087.21',
    status: ['Added']
  },
  {
    _id: 3,
    nameofweeshes: '2014 Honda Accord',
    category: 'Automobile',
    price: '₦ 1,927.05',
    changes: '₦ 1,230.00',
    status: ['Added']
  },
  {
    _id: 4,
    nameofweeshes: 'Lacoste White Sneakers',
    category: 'Footwear',
    price: '₦ 15,927.05',
    changes: '₦ 230.00',
    status: ['Fulfiled']
  },
  {
    _id: 5,
    nameofweeshes: 'Money',
    category: 'Cash',
    price: '₦ 1,333,230.00',
    changes: '₦ 531,927.05',
    status: ['Delivered']
  },
  {
    _id: 6,
    nameofweeshes: 'Zara Men Winter Coat',
    category: 'Clothing',
    price: '₦ 122,927.05',
    changes: '₦ 17,230.00',
    status: ['Delivered']
  },
  {
    _id: 7,
    nameofweeshes: 'S&P 500',
    category: 'Investments',
    price: '₦ 111,230.00',
    changes: '₦ 1,230.00',
    status: ['Added']
  },
  {
    _id: 8,
    nameofweeshes: 'Maldives Invaders',
    category: 'Trip',
    price: '₦ 900,230.00',
    changes: '₦ 11,230.00',
    status: ['Initiated']
  },
  {
    _id: 9,
    nameofweeshes: 'Hisense Double Door Fri..',
    category: 'Appliance',
    price: '₦ 340,230.00',
    changes: '₦ 17,230.00',
    status: ['Fulfiled']
  },
  {
    _id: 10,
    nameofweeshes: 'Raddison Blue Buffet',
    category: 'Food',
    price: '₦ 1,230.00',
    changes: '₦ 0.00',
    status: ['Fulfiled']
  }
])

const user2s = ref<any[]>([
  {
    _id: 1,
    type: 'Inflow',
    date: '01 Nov 1978',
    amount: '₦ 1,565,987.00',
    changes: '₦ 5,987.00',
    status: ['Successful']
  },
  {
    _id: 2,
    type: 'Inflow',
    date: '03 Sep 1995',
    amount: '₦ 51,000,087.6',
    changes: '₦ 100,087.21',
    status: ['Successful']
  },
  {
    _id: 3,
    type: 'Inflow',
    date: '25 Aug 1994',
    amount: '₦ 1,927.05',
    changes: '₦ 1,230.00',
    status: ['Successful']
  },
  {
    _id: 4,
    type: 'Outflow',
    date: '06 Apr 1991',
    amount: '₦ 15,927.05',
    changes: '₦ 230.00',
    status: ['Pending']
  },
  {
    _id: 5,
    type: 'Inflow',
    date: '28 Dec 1988',
    amount: '₦ 1,333,230.00',
    changes: '₦ 531,927.05',
    status: ['Failed']
  },
  {
    _id: 6,
    type: 'Outflow',
    date: '13 Jul 1982',
    amount: '₦ 122,927.05',
    changes: '₦ 17,230.00',
    status: ['Failed']
  },
  {
    _id: 7,
    type: 'Inflow',
    date: '25 Jul 1986',
    amount: '₦ 111,230.00',
    changes: '₦ 1,230.00',
    status: ['Successful']
  },
  {
    _id: 8,
    type: 'Outflow',
    date: '12 Oct 1987',
    amount: '₦ 900,230.00',
    changes: '₦ 11,230.00',
    status: ['Successful']
  },
  {
    _id: 9,
    type: 'Outflow',
    date: '03 Mar 1996',
    amount: '₦ 340,230.00',
    changes: '₦ 17,230.00',
    status: ['Successful']
  },
  {
    _id: 10,
    type: 'Inflow',
    date: '17 May 1999',
    amount: '₦ 1,230.00',
    changes: '₦ 0.00',
    status: ['Failed']
  }
])

const getStatusIconUrl = (status: string) => {
  // Define a mapping of status values to image URLs
  const statusIconUrls: Record<string, string> = {
    Delivered: 'https://res.cloudinary.com/dufimctfc/image/upload/v1714310908/delieverd_edhvca.svg',
    Fulfiled: 'https://res.cloudinary.com/dufimctfc/image/upload/v1714310921/fulfiled_jntpxx.svg',
    Added: 'https://res.cloudinary.com/dufimctfc/image/upload/v1714310907/added_yxnomq.svg',
    Initiated: 'https://res.cloudinary.com/dufimctfc/image/upload/v1714311148/initiated_p5tnu3.svg',
    Successful:
      'https://res.cloudinary.com/dufimctfc/image/upload/v1714311647/successful_ze93k1.svg',
    Pending: 'https://res.cloudinary.com/dufimctfc/image/upload/v1714311639/pending_dozouo.svg',
    Failed: 'https://res.cloudinary.com/dufimctfc/image/upload/v1714311603/failed_gyjpfg.svg'

    // Add more mappings as needed
  }

  // Return the corresponding icon URL based on the status value
  return statusIconUrls[status] || '' // Default to empty string if status is not found
}
</script>
<template>
  <div class="flex-col flex min-h-[400px] px-4 sm:px-10 pb-10">
    <div>
      <Card>
        <div class="grid gap-4 lg:grid-cols-7">
          <Card class="sm:col-span-3 bg-[#F8F9FF] shadow-2xl">
            <CardHeader>
              <CardTitle class="text-xl font-bold">User Profile</CardTitle>
              <CardDescription>
                <div class="grid gap-2 md:grid-cols-5 lg:grid-cols">
                  <img
                    class=""
                    src="https://res.cloudinary.com/dufimctfc/image/upload/v1710684025/images1_wbbxb5.svg"
                    alt="gradient"
                  />
                  <img
                    class=""
                    src="https://res.cloudinary.com/dufimctfc/image/upload/v1710684023/images2_ma998k.svg"
                    alt="gradient"
                  />
                  <img
                    class=""
                    src="https://res.cloudinary.com/dufimctfc/image/upload/v1710693199/image5_lwx2g1.svg"
                    alt="gradient"
                  />
                  <img
                    class=""
                    src="https://res.cloudinary.com/dufimctfc/image/upload/v1710684024/image4_v8krvl.svg"
                    alt="gradient"
                  />
                  <img
                    class=""
                    src="https://res.cloudinary.com/dufimctfc/image/upload/v1710684023/images2_ma998k.svg"
                    alt="gradient"
                  />
                </div>
                <div class="flex space-x-2 justify-between px-6 py-4">
                  <span class="text-sm text-gray-500">Identity</span>
                  <div class="flex">
                    <img
                      class=""
                      src="https://res.cloudinary.com/dufimctfc/image/upload/v1714310908/edit-4-svgrepo-com_1_iy2nwu.svg"
                      alt="gradient"
                    />
                    <span class="ml-2 text-sm font-medium text-gray-700"> Edit </span>
                  </div>
                </div>

                <Card
                  class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 border border-gray-200 rounded-md px-4 py-4"
                >
                  <dt class="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd class="text-sm text-gray-800">Tochukwu Felix Onwuelo</dd>

                  <dt class="text-sm font-medium text-gray-500">Preferred</dt>
                  <dd class="text-sm text-gray-800">Felixont</dd>

                  <dt class="text-sm font-medium text-gray-500">Birthday</dt>
                  <dd class="text-sm text-gray-800">July 28</dd>

                  <dt class="text-sm font-medium text-gray-500">Gender</dt>
                  <dd class="text-sm text-gray-800">Female</dd>
                </Card>
                <div class="flex space-x-2 justify-between px-6 py-4">
                  <span class="text-sm text-gray-500">Contact</span>
                  <div class="flex">
                    <img
                      class=""
                      src="https://res.cloudinary.com/dufimctfc/image/upload/v1714310908/edit-4-svgrepo-com_1_iy2nwu.svg"
                      alt="gradient"
                    />
                    <span class="ml-2 text-sm font-medium text-gray-700"> Edit </span>
                  </div>
                </div>
                <Card
                  class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 border border-gray-200 rounded-md px-4 py-4"
                >
                  <dt class="text-sm font-medium text-gray-500">Email</dt>
                  <dd class="text-sm text-gray-800">felixont@email.uk</dd>
                  <dt class="text-sm font-medium text-gray-500">phone.no</dt>
                  <dd class="text-sm text-gray-800">felixont@email.uk</dd>
                  <dt class="text-sm font-medium text-gray-500">Address</dt>
                  <dd class="text-sm text-gray-800">No. 51, Briswood Ipaja Rd, Ikeja</dd>
                  <p>User ID: {{ $route.params.userId }}</p>
                </Card>

                <Card
                  class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 border border-gray-200 rounded-md px-4 py-4"
                >
                  <p>Profile privacy</p>
                  <div
                    class="mx-8 shadow rounded-full h-10 mt-4 flex p-1 relative items-center bg-[#373B4D]"
                  >
                    <div class="w-full flex justify-center">
                      <button>Left</button>
                    </div>
                    <div class="w-full flex justify-center">
                      <button>Right</button>
                    </div>
                    <span
                      class="elSwitch bg-indigo-600 shadow text-white flex items-center justify-center w-1/2 rounded-full h-8 transition-all top-[4px] absolute left-1"
                    >
                      Text
                    </span>
                  </div>
                </Card>
              </CardDescription>
            </CardHeader>
          </Card>

          <div class="col-span-4 my-9">
            <Tabs default-value="weeshes" class="space-y-4">
              <TabsList class="text-blue-900">
                <TabsTrigger value="weeshes" class="text-[#000000]"> Weeshes </TabsTrigger>
                <TabsTrigger value="bank"> Bank </TabsTrigger>
                <TabsTrigger value="analytics" disabled>Support </TabsTrigger>
                <TabsTrigger value="analytics" disabled> Activity log </TabsTrigger>
              </TabsList>
              <TabsContent value="weeshes" class="space-y-4">
                <div class="overflow-auto bg-white rounded-lg shadow">
                  <Table>
                    <TableHeader>
                      <TableRow
                        class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
                      >
                        <TableHead> Name of Weesh </TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead> Changes</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow v-for="user in users" :key="user._id">
                        <TableCell class="font-medium">{{ user.nameofweeshes }}</TableCell>
                        <TableCell class="font-medium">{{ user.category }}</TableCell>
                        <TableCell class="font-normal text-xs">{{ user.price }} </TableCell>
                        <TableCell class="font-medium">{{ user.changes }} </TableCell>
                        <TableCell class="">
                          <!-- Render multiple status icons based on user's status array -->
                          <template v-for="status in user.status" :key="status">
                            <img
                              :src="getStatusIconUrl(status)"
                              :alt="status"
                              class="h-5 w-19 mr-1"
                            />
                          </template>
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
                </div>
              </TabsContent>

              <TabsContent value="bank" class="space-y-4">
                <div class="overflow-auto bg-white rounded-lg shadow">
                  <Table>
                    <TableHeader>
                      <TableRow
                        class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
                      >
                        <TableHead> Type </TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow v-for="user2 in user2s" :key="user2._id">
                        <TableCell class="font-medium">{{ user2.type }}</TableCell>
                        <TableCell class="font-medium">{{ user2.date }}</TableCell>
                        <TableCell class="font-normal text-xs">{{ user2.amount }} </TableCell>
                        <TableCell class="">
                          <!-- Render multiple status icons based on user's status array -->
                          <template v-for="status in user2.status" :key="status">
                            <img
                              :src="getStatusIconUrl(status)"
                              :alt="status"
                              class="h-5 w-19 mr-1"
                            />
                          </template>
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
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
