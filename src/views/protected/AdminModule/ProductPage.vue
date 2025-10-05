<template>
  <div class="flex-col flex bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10">
    <MainNav class="mx-6" headingText="Products" />

    <div class="w-full grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4 pt-6">
      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#00C37F] cardShadow1 border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#FFFFFF]">Published</p>
            <div class="weeshr-icon2 rounded-[7px]">
               <Check width="24px" height="24px" color="#00C37F"  />
            </div>
            <p class="text-2xl lg:text-3xl font-medium text-[#FFFFFF] absolute bottom-2 left-5">
              19
            </p>
          </CardContent>
        </div>
    
      </Card>

      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#6A70FF]  border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Draft</p>
            <div >
                <ScrollText width="24px" height="24px" color="#ffffff" />

            </div>

                        <p class="text-2xl lg:text-3xl font-medium text-[#FFFFFF] absolute bottom-2 left-5">
            4
            </p>
          </CardContent>
        </div>
       
      </Card>

 <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#3A8EE5]  border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Archived</p>
            <div >
  <Archive width="24px" height="24px" color="#ffffff" />

            </div>

                        <p class="text-2xl lg:text-3xl font-medium text-[#FFFFFF] absolute bottom-2 left-5">
            1
            </p>
          </CardContent>
        </div>
       
      </Card>

      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#DF6C50]  border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Out of Stock</p>
            <div >
  
  <Battery width="24px" height="24px" color="#ffffff" />

            </div>

                        <p class="text-2xl lg:text-3xl font-medium text-[#FFFFFF] absolute bottom-2 left-5">
            2
            </p>
          </CardContent>
        </div>
       
      </Card> 
    
    </div>

    <Card
      class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-14 mb-4"
    >
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
        <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721]">
          Product List
          <p class="text-xs sm:text-sm font-normal text-[#02072199]">
            Details of all transactions
          </p>
        </div>
        <div class="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" class="flex items-center gap-2 w-full sm:w-auto bg-[#EEEFF5]">
              <ListFilter class="w-4 h-4"/>

            All
            <Icon icon="mdi:chevron-down" class="w-4 h-4" />
          </Button>
          <div class="relative w-full sm:w-64 bg-[#EEEFF5]">
            <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#EEEFF5]" />

            <input
              type="text"
              placeholder="Product name"
              class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button class="bg-[#020721] text-white hover:bg-[#020721]/90 w-full sm:w-auto ">
            <Icon icon="mdi:plus" class="w-4 h-4 mr-2" />
            Add product
          </Button>
        </div>
      </div>

  <div class="overflow-auto bg-white rounded-lg">
        <Table class="lg:w-full w-[800px]">
          <TableHeader>
            <TableRow
              class="text-xs sm:text-sm text-[#8B8D97] font-medium border-b border-gray-200"
            >
              <TableHead class="font-medium">Picture</TableHead>
              <TableHead class="font-medium">Name</TableHead>
              <TableHead class="font-medium">Description</TableHead>
              <TableHead class="font-medium">
                <div class="flex items-center">
                  Amount
                  <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                </div>
              </TableHead>
              <TableHead class="font-medium">
                <div class="flex items-center">
                  Delivery TAT
                  <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                </div>
              </TableHead>
              <TableHead class="font-medium">
                <div class="flex items-center">
                  Avail. Qty
                  <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                </div>
              </TableHead>
              <TableHead class="font-medium">Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="user in users" :key="user._id" class="border-b border-gray-100">
              <TableCell class="py-4">
                <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img v-if="user.image" :src="user.image" :alt="user.name" class="w-full h-full object-cover" />
                  <Icon v-else icon="mdi:package-variant" class="w-6 h-6 text-gray-400" />
                </div>
              </TableCell>
              <TableCell class="text-sm font-medium text-[#020721]">{{ user.fullname }}</TableCell>
              <TableCell class="text-sm text-[#8B8D97] max-w-[200px] truncate">{{ user.description }}</TableCell>
              <TableCell class="text-sm font-medium text-[#020721]">{{ user.price }}</TableCell>
              <TableCell class="text-sm text-[#8B8D97]">{{ user.deliveryTime }}</TableCell>
              <TableCell class="text-sm text-[#8B8D97] text-center">{{ user.quantity }}</TableCell>
              <TableCell>
                <div
                  :class="statusBg(user.status)"
                  class="rounded-full w-fit px-3 py-1 text-white text-xs font-medium capitalize"
                >
                  {{ user.status }}
                </div>
              </TableCell>
              <TableCell>
                <router-link :to="`/usersdetails/${user._id}`">
                  <Icon icon="mdi:dots-vertical" class="w-5 h-5 text-gray-400 cursor-pointer" />
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
        <Button variant="outline"> 4 </Button>
        <Button variant="outline"> 5 </Button>
        <Button variant="outline"> <Icon icon="radix-icons:chevron-right" /> </Button>
        <a href="#"><p class="text-[blue]">See all</p></a>
      </div>
    </Card>
    <DashboardFooter />
  </div>
</template>

<script setup lang="ts">
// import Search from '@/components/UseSearch.vue'
import { ref } from 'vue'
import MainNav from '@/components/MainNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { useWeeshStore } from '@/stores/weeshes/weeshes-count'
import { ScrollText, Battery ,ListFilter } from 'lucide-vue-next';





import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'
// import { storeToRefs } from 'pinia'
import { Check } from 'lucide-vue-next';
import { Archive } from 'lucide-vue-next';

// Define a ref to hold the users data
// const users = ref([]);
const users = ref<any[]>([
  {
    _id: 1,
    fullname: 'Alisha Christian',
    description: `1 Diffuser jar, 250ml, 5 Charcoal Black Fibre Reed sticks.`,
    name: 'iphone 15 Pro Max',
    category: 'Gadget',
    price: '₦ 1,565,987.00',
    status: 'outbound'
  },
  {
    _id: 2,
    fullname: 'Dario Rasmussen',
    name: 'Mary K Facial Cleanser',
    category: 'Body & Beauty ',
    price: '₦ 51,000,087.66',
    status: 'delivered'
  },
  {
    _id: 3,
    fullname: 'Sidney Mclaughlin',
    name: '2014 Honda Accord',
    category: 'Automobile',
    price: '₦ 1,927.05',
    status: 'delivered'
  },
  {
    _id: 4,
    fullname: 'Awokoya Olawale',
    name: 'Lacoste White Sneakers',
    category: 'Footwear',
    price: '₦ 1,565,987.00',
    status: 'pending'
  },
  {
    _id: 5,
    fullname: 'Cristopher Sade',
    name: 'Money',
    category: 'Cash',
    price: '₦ 1,565,987.00',
    status: 'pending'
  },
  {
    _id: 6,
    fullname: 'Charles Ryland',
    name: 'Zara Men Winter Coat',
    category: 'Clothing',
    price: '₦ 231,000.00',
    status: 'pending'
  },
  {
    _id: 7,
    fullname: 'Ngozi Nylah',
    name: 'S&P 500',
    category: 'Investments',
    price: '₦ 3,523.50',
    status: 'outbound'
  },
  {
    _id: 8,
    fullname: 'Adeyinka Bentley',
    name: 'Maldives Invaders',
    category: 'Trip',
    price: '₦ 4,343,021.00',
    status: 'outbound'
  },
  {
    _id: 9,
    fullname: 'Onyenka Obaji',
    name: 'Hisense Double Door Fridge',
    category: 'Appliance',
    price: '₦ 230,103.34',
    status: 'outbound'
  },
  {
    _id: 10,
    fullname: 'Piu Memphis',
    name: 'Raddison Blue Buffet',
    category: 'Food',
    price: '₦ 0.00',
    status: 'delivered'
  }
])

const statusBg = (status: string) => {
  switch (status) {
    case 'outbound':
      return 'bg-[#EE9F39]'
    case 'pending':
      return 'bg-[#E45044]'
    case 'delivered':
      return 'bg-[#00c37f]'
    default:
      return ''
  }
}

const weeshStore = useWeeshStore()

weeshStore.getWeeshesCount()
</script>

<style scoped>
.cardShadow1 {
  box-shadow:
    0px 31px 30px -23px #dddcdc,
    inset 0px -23px 20px -23px rgba(0, 0, 0, 0.25);
}

.cardShadow2 {
  box-shadow:
    0px 31px 30px -23px #00c37f,
    inset 0px -23px 20px -23px rgba(0, 0, 0, 0.25);
}
.cardShadow3 {
  box-shadow:
    0px 31px 30px -23px #ee9f39,
    inset 0px -23px 30px -23px rgba(0, 0, 0, 0.25);
}

.cardShadow4 {
  box-shadow:
    0px 31px 30px -23px #e45044,
    inset 0px -23px 20px -23px rgba(0, 0, 0, 0.25);
}
.weeshr-icon1 {
  background-color: black;
}
.weeshr-icon2 {
  background-color: white;
}
</style>
