<script setup lang="ts">
import Search from '@/components/UseSearch.vue'
import { ref } from 'vue'
import MainNav from '@/components/MainNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import { Card} from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import { Icon } from '@iconify/vue'

import {
    Table,
    TableRow,
    TableBody,
    TableHeader,
    TableCell,
    TableHead
} from '@/components/ui/table'

// Define a ref to hold the users data
// const users = ref([]);
const users = ref<any[]>([
  {
    _id: 1,
    fullname: 'Alisha Christian',
    name: 'iphone 15 Pro Max',
    dateFul: '01 Nov 1978',
    dateDel: '01 Nov 1978',
    price: '₦ 1,565,987.00',
    status: 'purchase eligible'
  },
  {
    _id: 2,
    fullname: 'Dairo Rasmussen',
    name: 'Mary K Facial Cleanser',
    dateFul: '03 Nov 1995',
    dateDel: '03 Nov 1995',
    price: '₦ 51,000,087.66',
    status: 'cost above price'
  },
  {
    _id: 3,
    fullname: 'Sidney McLaughin',
    name: '2014 Honda Accord',
    dateFul: '25 Aug 1994',
    dateDel: '25 Aug 1994',
    price: '₦ 1,927.05',
    status: 'out of stock'
  },
  {
    _id: 4,
    fullname: 'Kemi Keller',
    name: 'Lacoste White Sneakers',
    dateFul: '06 Apr 1991',
    dateDel: '06 Apr 1991',
    price: '₦ 1,565,987.00',
    status: 'cost below price'
  },
  {
    _id: 5,
    fullname: 'Cristopher Sade',
    name: 'Money',
    dateFul: '28 Dec 1988',
    dateDel: '28 Dec 1988',
    price: '₦ 1,565,987.00',
    status: 'unattended'
  },
  {
    _id: 6,
    fullname: 'Ufy Ohwo',
    name: 'Maldives Invaders',
    dateFul: '21 Jun 2024',
    dateDel: '21 Jun 2024',
    price: '₦ 4,343,021.00',
    status: 'procured'
  }

])

const statusBg = (status: string) => {
  switch (status) {
    case 'unattended':
      return 'bg-[#000000]';
    case 'cost above price':
      return 'bg-[#ee9f39]';
    case 'cost below price':
      return 'bg-[#6a70ff]';
    case 'procured':
      return 'bg-[#00c37f]';
    case 'out of stock':
      return 'bg-[#ea5044]';
    case 'purchase eligible':
      return 'bg-[#6a70ff]';
    default:
      return '';
  }
}
const statusIcon = (status: string) => {
    switch (status) {
        case 'unattended':
            return 'solar:bill-broken';
        case 'cost above price':
            return 'hugeicons:wallet-remove-02';
        case 'cost below price':
            return 'hugeicons:wallet-done-02';
        case 'procured':
            return 'tabler:basket-down';
        case 'out of stock':
            return 'tabler:basket-cancel';
        case 'purchase eligible':
            return 'hugeicons:shopping-cart-check-01';
        default:
      return '';
    }
}

</script>

<template >
    <div class="flex-col flex bg-[#f0f8ff] h-[400px] px-4 sm:px-10 pb-10">
        <MainNav class="mx-6" headingText="Weeshes" />
        <Card class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-6 mb-4">
        <div class="flex flex-col sm:flex-row items-center justify-between py-4">
            <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-2 sm:mb-0">
            Fulfilled Weeshes
            <p class="text-xs sm:text-sm font-normal text-[#02072199]">List of fulfilled Weeshr</p>
          </div>
          <Search class="mt-3 lg:mt-0" />
        </div>
  
        <div class="overflow-auto bg-white rounded-lg shadow">
          <Table class="lg:w-full w-[800px]">
            <TableHeader>
              <TableRow
                class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
              >
                <TableHead> Full Name </TableHead>
                <TableHead>Name of Weesh</TableHead>
                <TableHead>
                  <div class="flex items-center">
                    Price
                    <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1"/>
                  </div>
                </TableHead>
                <TableHead>
                  <div class="flex items-center">
                    Date Fufilled
                    <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1"/>
                  </div>
                </TableHead>
                <TableHead>
                  <div class="flex items-center">
                    Delivery Date
                    <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1"/>
                  </div>
                </TableHead>
                <TableHead>
                  <div class="flex items-center">
                    Status
                    <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1"/>
                  </div>
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="user in users" :key="user._id">
                <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.fullname }} </TableCell>
                <TableCell class="text-xs md:text-sm lg:text-sm"
                  >{{ user.name }}</TableCell
                >
                <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.price }} </TableCell>
                <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.dateFul }} </TableCell>
                <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.dateDel }}</TableCell>
                <TableCell>
                    <div :class="statusBg(user.status)" class="rounded-[15px] w-fit px-3 py-1 text-white text-sm capitalize flex items-center">
                    <Icon :icon="statusIcon(user.status)" width="24px" height="24px" class="me-2"/>
                    {{ user.status }}
                    </div>
                </TableCell>
                <TableCell>
                  <router-link :to="`/usersdetails/${user._id}`">
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
                  </router-link>
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
          <Button variant="outline"> 57 </Button>
          <Button variant="outline"> 58 </Button>
          <Button variant="outline"> <Icon icon="radix-icons:chevron-right" /> </Button>
          <a href="#"><p class="text-[blue]">See all</p></a>
        </div>
      </Card>
      <DashboardFooter/>
    </div>
</template>

