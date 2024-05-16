<script setup lang="ts">
import { ref } from 'vue'
import { Switch } from '@/components/ui/switch'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'

const editProfile = () => {
  // Your logic for handling the edit click goes here
  console.log('Edit clicked!')
}

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
</script>
<template>
  <div class="container lg:px-0 mx-auto">
    <div class=" flex-col  lg:flex lg:flex-row justify-evenly">
      <Card
        class="sm:col-span-3 md:col-span-3 bg-[#F8F9FF] sm:items-center shadow-2xl mb-auto mr-auto"
      >
        <CardHeader>
          <CardTitle class="text-2xl font-medium text-[#000000]">User Profile</CardTitle>
          <CardDescription>
            <div class="grid gap-2 grid-cols-3 md:grid-cols-3 lg:grid-cols-5">
              <img
                class="max-w-[60.66px] h-auto"
                src="https://res.cloudinary.com/dufimctfc/image/upload/v1710684025/images1_wbbxb5.svg"
                alt="gradient"
              />
              <img
                class="max-w-[60.66px] h-auto"
                src="https://res.cloudinary.com/dufimctfc/image/upload/v1710684023/images2_ma998k.svg"
                alt="gradient"
              />
              <img
                class="max-w-[60.66px] h-auto"
                src="https://res.cloudinary.com/dufimctfc/image/upload/v1710693199/image5_lwx2g1.svg"
                alt="gradient"
              />
              <img
                class="max-w-[60.66px] h-auto"
                src="https://res.cloudinary.com/dufimctfc/image/upload/v1710684024/image4_v8krvl.svg"
                alt="gradient"
              />
              <img
                class="max-w-[60.66px] h-auto"
                src="https://res.cloudinary.com/dufimctfc/image/upload/v1710684023/images2_ma998k.svg"
                alt="gradient"
              />
            </div>
            <div class="flex justify-between px-6 my-2">
              <span class="text-base font-medium lg:text-base text-[#020721]">Identity</span>
              <div class="flex">
                <img
                  class="max-w-[18.05px] max-h-[24px]"
                  src="https://res.cloudinary.com/dufimctfc/image/upload/v1714310908/edit-4-svgrepo-com_1_iy2nwu.svg"
                  alt="gradient"
                />
                <span class="text-sm font-medium text-[#02072199]">
                  <a href="#" @click="editProfile">Edit</a>
                </span>
              </div>
            </div>

            <Card class="rounded-md">
              <div class="flex justify-between px-6 md:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Full Name</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">Tochukwu Felix Onwuelo</p>
              </div>
              <div class="flex justify-between px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Preferred</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">Felixont</p>
              </div>
              <div class="flex justify-between px-6 py-2 border-b">
                <p class="flex grow text-[#02072199] text-xs md:text-sm lg:text-sm">Birthday</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">July 28</p>
              </div>
              <div class="flex justify-between px-6 py-2 border-b">
                <p class="flex grow text-[#02072199] text-xs md:text-sm lg:text-sm">Gender</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">Female</p>
              </div>
            </Card>
            <div class="flex justify-between px-6 my-2">
              <span class="text-base font-medium lg:text-base text-[#020721]">Contact</span>
              <div class="flex">
                <img
                  class="max-w-[18.05px] max-h-[24px]"
                  src="https://res.cloudinary.com/dufimctfc/image/upload/v1714310908/edit-4-svgrepo-com_1_iy2nwu.svg"
                  alt="gradient"
                />
                <span class="text-sm font-medium text-[#02072199]">
                  <a href="#" @click="editProfile">Edit</a>
                </span>
              </div>
            </div>
            <Card class="rounded-md">
              <div class="flex justify-between px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Email</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">felixont@email.uk</p>
              </div>
              <div class="flex justify-between px-3 lg:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">phone.no</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">+234 818 100 8221</p>
              </div>
              <div class="flex justify-between px-5 lg:px-6 py-2 border-b">
                <p class="flex grow text-[#02072199] text-xs md:text-sm lg:text-sm">Address:</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">
                  No. 51, Briswood Ipaja Rd, Ikeja
                </p>
              </div>
            </Card>

            <Card class="rounded-md my-5">
              <div class="flex justify-between px-3 lg:px-6 py-2">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Profile Privacy</p>
           
              </div>
              
            </Card>
            <div>
              <Card class="rounded-md">
                <div class="flex justify-between px-5 lg:px-6 py-2">
                  <p class="flex grow text-[#02072199] text-xs md:text-sm lg:text-sm">
                    User Status
                  </p>
                  <div class="flex gap-1 grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
                    <img
                      class="max-w-[28px] max-h-[28px]"
                      src="https://res.cloudinary.com/dufimctfc/image/upload/v1712910732/Property_1_Public_Figure_wbek9n.svg"
                      alt="gradient"
                    />
                    <img
                      class="max-w-[28px] max-h-[28px]"
                      src="https://res.cloudinary.com/dufimctfc/image/upload/v1712910733/Property_1_Weeshr_Verified_th0oq2.svg"
                      alt="gradient"
                    />
                    <img
                      class="max-w-[77px] max-h-[28px]"
                      src="https://res.cloudinary.com/dufimctfc/image/upload/v1712910733/UserFeaturing_rj4fnp.svg"
                      alt="gradient"
                    />
                  </div>
                </div>
              </Card>
              <div class="flex justify-between px-3 lg:px-6 py-2">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Public Figure</p>
                <Switch/>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">Influencer</p>
                <Switch />
              </div>
              <div class="flex justify-between px-3 lg:px-6 py-2">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Featured</p>
                <Switch />
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">Verified</p>
                <Switch />
              </div>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>

      <div class="my-9 lg:mx-auto">
        <Tabs default-value="weeshes" class="space-y-1">
          <TabsList
            class=" border-[#DEDFE8] bg-transparent  lg:w-[560px] lg:flex lg:justify-between px-0 lg:px-6 md:px-6 py-2"
          >
            <TabsTrigger value="weeshes" class="text-[#000000] "> Weeshes </TabsTrigger>
            <TabsTrigger value="bank" class="text-[#000000] "> Bank </TabsTrigger>
            <TabsTrigger value="support" class="text-[#000000]">Support </TabsTrigger>
            <TabsTrigger value="activity" class="text-[#000000]"> Activity log </TabsTrigger>
          </TabsList>
          <TabsContent value="weeshes" class="space-y-4">
            <div class="overflow-auto bg-white rounded-lg shadow">
              <Table class="lg:w-[802px] w-[700px]">
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
                        <span
                          :class="{
                            'bg-[#6A70FF] text-[#F8F9FF]': status === 'Fulfiled',
                            'bg-[#373B4D] text-[#F8F9FF]': status === 'Added',
                            'bg-[#EE9F39] text-[#F8F9FF]': status === 'Initiated',
                            'bg-[#00C37F] text-[#F8F9FF]': status === 'Delivered'
                          }"
                          class="inline-block bg-[#373B4D] text-[#F8F9FF] rounded-full px-2 py-1 text-sm"
                          >{{ status }}</span
                        >
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
              <Table class="w-[802px]">
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
                        <span
                          :class="{
                            'bg-[#00C37F] text-[#F8F9FF]': status === 'Successful',
                            'bg-[#373B4D] text-[#F8F9FF]': status === ' Pending',
                            'bg-[#EE9F39] text-[#F8F9FF]': status === 'Failed'
                          }"
                          class="inline-block bg-[#373B4D] text-[#F8F9FF] rounded-full px-2 py-1 text-sm"
                          >{{ status }}</span
                        >
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
          <TabsContent value="support" class="space-y-4 w-[802px]">
          </TabsContent>
          <TabsContent value="activity" class="space-y-4 w-[802px]">
          </TabsContent>
                    </Tabs>
      </div>
    </div>
  </div>
</template>
