<template>
  <div class="flex-col flex bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10">
    <MainNav class="mx-6" headingText="Bank" />

    <div class="w-full grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4 pt-6 text-nowrap">
      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#FFFFFF] cardShadow1 border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#020721]">Balance</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon icon="solar:book-bold" width="24px" height="24px" color="#020721" />
            </div>
            <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#020721] absolute bottom-2 left-5">
              {{ currency }} {{ balance.toLocaleString() }}
              <Loader2 v-if="balance === ''" class="w-4 h-4 mr-2 text-[#020721] animate-spin" />
            </p>
          </CardContent>
        </div>
      </Card>

      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#00C37F] cardShadow2 border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Inflow</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon
                icon="mingcute:arrow-left-down-line"
                width="24px"
                height="24px"
                color="#00C37F"
              />
            </div>

            <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              ₦ 176,405,287.78
            </p>
          </CardContent>
        </div>
      </Card>

      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#EE9F39] cardShadow3 border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Lieu</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon icon="heroicons:bars-3" width="24px" height="24px" color="#EE9F39" />
            </div>

            <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              ₦ 32,125.00
            </p>
          </CardContent>
        </div>
      </Card>

      <RouterLink to="/bank/outflow"><Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#E45044] cardShadow4 border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Outflow</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon
                icon="mingcute:arrow-right-up-line"
                width="24px"
                height="24px"
                color="#E45044"
              />
            </div>

            <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              ₦ 98,021,339.04
            </p>
          </CardContent>
        </div>
      </Card></RouterLink>
    </div>

    <!-- Account -->
    <div v-if='readRole' class="w-full px-6 py-4 flex flex-col gap-8 md:gap-0 md:flex-row items-start md:items-center justify-between bg-[#E4E6F5] rounded-xl mt-4 md:mt-6">
      <div class='flex items-center gap-2'>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.7906 23.2841C15.1111 23.3587 15.1405 23.7785 14.8283 23.8826L12.985 24.4892C8.3533 25.9826 5.91497 24.7342 4.40997 20.1026L2.91664 15.4942C1.4233 10.8626 2.65997 8.41255 7.29164 6.91922L8.0723 6.66069C8.47517 6.52727 8.86472 6.9304 8.74591 7.33781C8.66197 7.62565 8.58233 7.92946 8.50497 8.24922L7.36164 13.1376C6.0783 18.6326 7.95664 21.6659 13.4516 22.9726L14.7906 23.2841Z" fill="#020721"/>
          <path d="M20.0317 3.7446L18.0833 3.2896C14.1867 2.36794 11.865 3.12627 10.5 5.9496C10.15 6.66127 9.87001 7.5246 9.63667 8.51627L8.49334 13.4046C7.35001 18.2813 8.85501 20.6846 13.72 21.8396L15.68 22.3063C16.3567 22.4696 16.9867 22.5746 17.57 22.6213C21.21 22.9713 23.1467 21.2679 24.1267 17.0563L25.27 12.1796C26.4133 7.30294 24.92 4.88794 20.0317 3.7446ZM17.8383 15.5513C17.7333 15.9479 17.3833 16.2046 16.9867 16.2046C16.9167 16.2046 16.8467 16.1929 16.765 16.1813L13.37 15.3179C12.9033 15.2013 12.6233 14.7229 12.74 14.2563C12.8567 13.7896 13.335 13.5096 13.8017 13.6263L17.1967 14.4896C17.675 14.6063 17.955 15.0846 17.8383 15.5513ZM21.2567 11.6079C21.1517 12.0046 20.8017 12.2613 20.405 12.2613C20.335 12.2613 20.265 12.2496 20.1833 12.2379L14.525 10.8029C14.0583 10.6863 13.7783 10.2079 13.895 9.74127C14.0117 9.2746 14.49 8.9946 14.9567 9.11127L20.615 10.5463C21.0933 10.6513 21.3733 11.1296 21.2567 11.6079Z" fill="#020721"/>
        </svg>
        <p>Cash Request</p>
      </div>
      <div class='flex items-center gap-2 text-nowrap'>
        <p class='text-lg md:text-2xl'>
          ₦ 5,190,500.00
        </p>
        <RouterLink to="/bank/cash-request"><svg width="35" height="35" class='h-6 w-6 md:w-auto md:h-auto' viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 36.6673H25C33.3334 36.6673 36.6667 33.334 36.6667 25.0007V15.0007C36.6667 6.66732 33.3334 3.33398 25 3.33398H15C6.66671 3.33398 3.33337 6.66732 3.33337 15.0007V25.0007C3.33337 33.334 6.66671 36.6673 15 36.6673Z" stroke="#020721" stroke-opacity="0.6" stroke-width="3.0625" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M17.9 25.8839L23.7667 20.0005L17.9 14.1172" stroke="#020721" stroke-opacity="0.6" stroke-width="3.0625" stroke-linecap="round" stroke-linejoin="round"/>
        </svg></RouterLink>
      </div>
     </div>

    <Card
      class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-14 mb-4"
    >
      <div class="flex flex-col sm:flex-row items-center justify-between py-4">
        <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-2 sm:mb-0">
          Bank Inflow
          <p class="text-xs sm:text-sm font-normal text-[#02072199]">List of Inflow</p>
        </div>
        <Search class="mt-3 lg:mt-0" />
      </div>
      <div class="overflow-auto bg-white rounded-lg shadow">
        <Table class="lg:w-full w-[800px]">
          <TableHeader>
            <TableRow
              class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
            >
              <TableHead>Recipient </TableHead>
              <TableHead>Account ID </TableHead>
              <TableHead>Weeshes</TableHead>
              <TableHead>
                <div class="flex items-center">
                  Type
                  <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                </div>
              </TableHead>
              <TableHead>
                <div class="flex items-center">
                  Date
                  <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                </div>
              </TableHead>
              <TableHead>
                <div class="flex items-center">
                  Amount
                  <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                </div>
              </TableHead>

              <TableHead>
                <div class="flex items-center">
                  Status
                  <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                </div>
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="user in users" :key="user._id">
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.recipient }} </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.id }}</TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.weeshes }} </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.type }} </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm text-nowrap">{{ user.date }} </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm text-nowrap">{{ user.amount }} </TableCell>
              <TableCell>
                <div
                  :class="statusBg(user.status)"
                  class="rounded-[10px] w-fit px-2 py-0.5 text-white text-sm capitalize"
                >
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
        <Button variant="outline"> 74</Button>
        <Button variant="outline"> 75 </Button>
        <Button variant="outline"> <Icon icon="radix-icons:chevron-right" /> </Button>
        <a href="#"><p class="text-[blue]">See all</p></a>
      </div>
    </Card>
    <DashboardFooter />
  </div>
</template>

<script setup lang="ts">
import Search from '@/components/UseSearch.vue'
import { computed, ref } from 'vue'
import MainNav from '@/components/MainNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { ability, defineAbilities, verifyAbilities } from '@/lib/ability';
import { useBankStore } from '@/stores/bank/bank'
import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'
import { Loader2 } from 'lucide-vue-next'


defineAbilities()
const readRole = ability.can('read', 'wallet-payouts');

const store = useBankStore()
const balance = computed(()=>{
  return store.balance
})
const currency = computed(()=>{
  return store.currency
})

// if(balance.value === ''){
  store.getBalance()
// }
// Define a ref to hold the users data
// const users = ref([]);
const users = ref<any[]>([
  {
    _id: 1,
    recipient: 'Weeshr Bank',
    id: '@harrison',
    weeshes: 'iphone 15 Pro Max',
    type: 'Inflow',
    date: '01 Nov 1978',
    amount: '₦ 1,565,987.00',
    status: 'successful'
  },
  {
    _id: 2,
    recipient: 'Weeshr Bank',
    id: '@dario',
    weeshes: 'Mary K Facial Cleanser',
    type: 'Inflow',
    date: '03 Sep 1995',
    amount: '₦ 51,000,087.66',
    status: 'successful'
  },
  {
    _id: 3,
    recipient: 'Weeshr Bank',
    id: '@sidney101',
    weeshes: '2014 Honda Accord',
    type: 'Inflow',
    date: '25 Aug 1994',
    amount: '₦ 1,927.0',
    status: 'successful'
  },
  {
    _id: 4,
    recipient: 'Ajax Logistics',
    id: '@kemiller',
    weeshes: 'Lacoste White Sneakers',
    type: 'Outflow',
    date: '06 Apr 1991',
    amount: '₦ 1,565,987.00',
    status: 'pending'
  },
  {
    _id: 5,
    recipient: 'WeeshrBank',
    id: '@saderizder',
    weeshes: 'Money',
    type: 'Inflow',
    date: '28 Dec 1988',
    amount: '₦ 200,000.00',
    status: 'failed'
  },
  {
    _id: 6,
    recipient: 'Middle Men Lagos',
    id: '@vendor_mml',
    weeshes: 'Zara Men Winter Coat',
    type: 'Outflow',
    date: '13 Jul 1982',
    amount: '₦ 231,000.00',
    status: 'failed'
  },
  {
    _id: 7,
    recipient: 'WeeshrBank',
    id: '@ngozero',
    weeshes: 'S&P 500',
    type: 'Inflow',
    date: '25 Jul 1986',
    amount: '₦ 3,523.50',
    status: 'successful'
  },
  {
    _id: 8,
    recipient: 'Middle Men Lagos',
    id: '@vendor_mml',
    weeshes: 'Maldives Invaders',
    type: 'Outflow',
    date: '12 Oct 1987',
    amount: '₦ 4,343,021.00',
    status: 'successful'
  },
  {
    _id: 9,
    recipient: 'Middle Men Lagos',
    id: '@vendor_mml',
    weeshes: 'Hisense Double Door Fridge',
    type: 'Outflow',
    date: '03 Mar 1996',
    amount: '₦ 230,103.34',
    status: 'successful'
  },
  {
    _id: 10,
    recipient: 'WeeshrBank',
    id: '@piurity',
    weeshes: 'Raddison Blue Buffet',
    type: 'Inflow',
    date: '17 May 1999',
    amount: '₦ 0.00',
    status: 'failed'
  }
])

const statusBg = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-[#EE9F39]'
    case 'failed':
      return 'bg-[#E45044]'
    case 'successful':
      return 'bg-[#00c37f]'
    default:
      return ''
  }
}
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
