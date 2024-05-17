<template >
    <div class="flex-col flex bg-[#f0f8ff] h-[400px] px-4 sm:px-10 pb-10">
        <MainNav class="mx-6" headingText="Weeshes" />
        <div class="w-full grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          <RouterLink to="/weeshes/fulfullied">
            <Card class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#FFFFFF] cardShadow1 border-transparent">
                <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
                    <CardContent class="flex items-center justify-between space-y-0">
                        <p class="text-l font-medium text-[#020721]">Added</p>
                        <div class="weeshr-icon rounded-[7px]">
                          <Icon icon="mdi:plus" width="24px" height="24px" color="#ffffff" />
                        </div>
                        <p class="text-2xl lg:text-3xl font-medium text-[#020721] absolute bottom-2 left-5">209,958</p>
                    </CardContent>
                </div>
            </Card>
          </RouterLink>
          <RouterLink to="/weeshes/fulfullied">
            <Card class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#EE9F39] cardShadow2 border-transparent ">
                <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
                    <CardContent class="flex items-center justify-between space-y-0">
                        <p class="text-l font-medium text-[#ffffff]">Initiated</p>
                        <div class="weeshr-icon2 rounded-[7px]">
                          <Icon icon="lets-icons:export" width="24px" height="24px" color="#ee9f39" />
                        </div>
  
                        <p class="text-2xl lg:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">114,025</p>
                    </CardContent>
                </div>
            </Card>
          </RouterLink>
          <RouterLink to="/weeshes/fulfullied">
            <Card class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#6A70FF] cardShadow3 border-transparent ">
                <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
                    <CardContent class="flex items-center justify-between space-y-0">
                        <p class="text-l font-medium text-[#ffffff]">Fufilled</p>
                        <div class="weeshr-icon2 rounded-[7px]">
                          <Icon icon="lets-icons:import" width="24px" height="24px" color="#6a70ff" />
                        </div>
        
                        <p class="text-2xl lg:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">29,089</p>
                    </CardContent>
              </div>
            </Card>
          </RouterLink>
          <RouterLink to="/weeshes/fulfullied">
            <Card class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#00C37F] cardShadow4 border-transparent ">
                <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
                    <CardContent class="flex items-center justify-between space-y-0">
                        <p class="text-l font-medium text-[#ffffff]">Delivered</p>
                        <div class="weeshr-icon2 rounded-[7px]">
                          <Icon icon="ic:outline-check" width="24px" height="24px" color="#00c37f" />
                        </div>
        
                        <p class="text-2xl lg:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">19,413</p>
                    </CardContent>
                </div>
            </Card>
          </RouterLink>
        </div>
      
        <Card class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-14 mb-4">
        <div class="flex flex-col sm:flex-row items-center justify-between py-4">
            <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-2 sm:mb-0">
            Weeshes
            <p class="text-xs sm:text-sm font-normal text-[#02072199]">List of users Weeshr</p>
          </div>
          <Search class="mt-3 lg:mt-0" />
        </div>
  
        <div class="overflow-auto bg-white rounded-lg shadow">
          <Table class="lg:w-full w-[800px]">
            <TableHeader>
              <TableRow
                class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
              >
                <TableHead> Weeshrname </TableHead>
                <TableHead>Name of Weesh</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>
                  <div class="flex items-center">
                    Price
                    <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1"/>
                  </div>
                </TableHead>
                <TableHead>
                  <div class="flex items-center">
                    Charges
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
                <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.weeshrname }} </TableCell>
                <TableCell class="text-xs md:text-sm lg:text-sm"
                  >{{ user.name }}</TableCell
                >
                <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.category }} </TableCell>
                <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.price }} </TableCell>
                <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.charges }}</TableCell>
                <TableCell>
                  <div :class="statusBg(user.status)" class="rounded-[10px] w-fit px-2 py-0.5 text-white text-sm capitalize">
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

<script setup lang="ts">
import Search from '@/components/UseSearch.vue'
import { ref } from 'vue'
import MainNav from '@/components/MainNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import { Card, CardContent } from '@/components/ui/card'
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
    weeshrname: '@harrison',
    name: 'iphone 15 Pro Max',
    category: 'Gadget',
    price: '₦ 1,565,987.00',
    charges: '₦ 5,987.00',
    status: 'initiated'
  },
  {
    _id: 2,
    weeshrname: '@dario',
    name: 'Mary K Facial Cleanser',
    category: 'Body & Beauty ',
    price: '₦ 51,000,087.66',
    charges: '₦ 100,087.21',
    status: 'added'
  },
  {
    _id: 3,
    weeshrname: '@sidney101',
    name: '2014 Honda Accord',
    category: 'Automobile',
    price: '₦ 1,927.05',
    charges: '₦ 527.05',
    status: 'added'
  },
  {
    _id: 4,
    weeshrname: '@kemiller',
    name: 'Lacoste White Sneakers',
    category: 'Footwear',
    price: '₦ 1,565,987.00',
    charges: '₦ 5,987.00',
    status: 'delivered'
  },
  {
    _id: 5,
    weeshrname: '@saderizder',
    name: 'Money',
    category: 'Cash',
    price: '₦ 1,565,987.00',
    charges: '₦ 5,987.00',
    status: 'fulfilled'
  },
  {
    _id: 6,
    weeshrname: '@ufy',
    name: 'Maldives Invaders',
    category: 'Trip',
    price: '₦ 4,343,021.00',
    charges: '₦ 9,021',
    status: 'fulfilled'
  }

])

const statusBg = (status: string) => {
  switch (status) {
    case 'added':
      return 'bg-[#000000]';
    case 'initiated':
      return 'bg-[#ee9f39]';
    case 'fulfilled':
      return 'bg-[#6a70ff]';
    case 'delivered':
      return 'bg-[#00c37f]';
    default:
      return '';
  }
}

</script>

<style scoped>
.cardShadow1 {
  box-shadow: 0px 31px 30px -23px #dddcdc,inset 0px -23px 20px -23px rgba(0, 0, 0, 0.25);
}
.cardShadow2 {
  box-shadow: 0px 31px 30px -23px #ee9f39,inset 0px -23px 30px -23px rgba(0, 0, 0, 0.25);
}
.cardShadow3 {
  box-shadow: 0px 31px 30px -23px #6a70ff,inset 0px -23px 30px -23px rgba(0, 0, 0, 0.25);
}
.cardShadow4 {
  box-shadow: 0px 31px 30px -23px #00c37f,inset 0px -23px 20px -23px rgba(0, 0, 0, 0.25);
}
.weeshr-icon {
  background-color: black;
}
.weeshr-icon2 {
  background-color: white;
}
</style>