<script setup lang="ts">
import Search from '@/components/UseSearch.vue'
import { ref } from 'vue'
import MainNav from '@/components/MainNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import { Icon } from '@iconify/vue'
import axios from 'axios'
import router from '@/router'

import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'

// import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import { useGeneralStore } from '@/stores/general-use'

const loading = ref(false)
const superAdminStore = useSuperAdminStore()
const token = sessionStorage.getItem('token') || ''

// Define a ref to hold the users data
// const users = ref([]);
const users = ref<any[]>([
  {
    _id: 1,
    firstName: 'Abiola',
    lastName: 'Tendo',
    dob: '01 Nov 1974',
    gender: 'female',
    balance: '$11,111',
    status: ['Regular', 'BlueVerified', 'Featured']
  },
  {
    _id: 2,
    firstName: 'Saloni',
    lastName: 'Smith',
    dob: '30 Nov 2001',
    gender: 'male',
    balance: '$1,111',
    status: ['PublicFigure', 'Influencer', 'WeeshrVerified', 'Featured']
  },
  {
    _id: 3,
    firstName: 'Bada',
    lastName: 'Right',
    dob: '01 Nov 1974',
    gender: 'male',
    balance: '$19,611',
    status: ['Regular', 'NonVerified', 'Featured']
  },
  {
    _id: 4,
    firstName: 'Emily',
    lastName: 'Stone',
    dob: '01 Nov 1974',
    gender: 'female',
    balance: '$11,111',
    status: ['Regular', 'NonVerified']
  },
  {
    _id: 5,
    firstName: ' Kunle',
    lastName: 'Blue',
    dob: '01 Nov 1974',
    gender: 'female',
    balance: '$11,111',
    status: ['Staff', 'NonVerified']
  }
])
// / Define a function to get the URL of the status icon based on the status value
const getStatusIconUrl = (status: string) => {
  // Define a mapping of status values to image URLs
  const statusIconUrls: Record<string, string> = {
    Featured:
      'https://res.cloudinary.com/dufimctfc/image/upload/v1712910733/UserFeaturing_rj4fnp.svg',
    NonVerified:
      'https://res.cloudinary.com/dufimctfc/image/upload/v1713424079/Property_1_Not_Verified_tlgd9k.svg',
    BlueVerified:
      'https://res.cloudinary.com/dufimctfc/image/upload/v1712910733/UserVerificationStatus_oglh0k.svg',
    WeeshrVerified:
      'https://res.cloudinary.com/dufimctfc/image/upload/v1712910733/Property_1_Weeshr_Verified_th0oq2.svg',
    Staff:
      'https://res.cloudinary.com/dufimctfc/image/upload/v1713424079/Property_1_Staff_c49bd5.svg',
    PublicFigure:
      'https://res.cloudinary.com/dufimctfc/image/upload/v1712910732/Property_1_Public_Figure_wbek9n.svg',
    Regular:
      'https://res.cloudinary.com/dufimctfc/image/upload/v1712910732/Property_1_Regular_smttkj.svg',
    Influencer: 'https://res.cloudinary.com/dufimctfc/image/upload/v1712910732/UserTypeI_lfcvbw.svg'
    // Add more mappings as needed
  }

  // Return the corresponding icon URL based on the status value
  return statusIconUrls[status] || '' // Default to empty string if status is not found
}
// Define a function to fetch users data
const fetchUsersData = async () => {
  toast({
    title: 'Loading Data',
    description: 'Fetching data...',
    duration: 0 // Set duration to 0 to make it indefinite until manually closed
  })

  // useGeneralStore().setLoading(true)
  try {
    // Set loading to true

    const response = await axios.get(
      'https:{{host}}/administrators?search=test_admin&disabled_status=disabled',
      {
        // params: {
        //   search: 'test_admin',
        //   disabled_status: 'disabled'
        // },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (response.status === 200 || response.status === 201) {
      useGeneralStore().setLoadingToFalse()
      // Show success toast
      toast({
        title: 'Success',
        description: `data fetched`,
        variant: 'success'
      })

      console.log('jiji' + JSON.stringify(response.data))
    }

    // Update the users data with the response

    users.value = response.data.data.data
  } catch (error: any) {
    if (error.response.status === 401) {
      sessionStorage.removeItem('token')
      // Clear token from superAdminStore
      superAdminStore.setToken('')

      setTimeout(() => {
        router.push({ name: 'super-admin-login' })
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
} // Call the fetchUsersData function when the component is mounted

// onMounted(fetchUsersData);

// onMounted(async () => {
//   // useGeneralStore().setLoading(true);
//   fetchUsersData()
// })


</script>

<template>
  <div class="flex-col flex bg-[#f0f8ff] h-[400px] px-4 sm:px-10 pb-10">
    <MainNav class="mx-6" headingText="Dashboard" />
    <div class="w-full grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        <Card class="h-[210px] rounded-[24px] shadow-md transition-transform transform hover:scale-105">
            <div class="h-[130px] pt-4 bg-[#00e19d] bg-opacity-20 relative rounded-tr-[24px] rounded-tl-[24px]">
                <CardContent class="flex items-center justify-between space-y-0">
                    <p class="text-[16px] font-medium text-[#020721]">Weeshes</p>
                    <img
                      class="h-[24px] w-[24px]"
                      src="https://res.cloudinary.com/dotojp6xu/image/upload/v1715162947/menu_mvjoy6.svg"
                      alt="gradient"
                    />
      
                    <p class="text-[32px] font-medium text-[#020721] absolute bottom-2 left-5">1,648,975,865</p>
                  </CardContent>
            </div>
            <div class="bg-[#020721] pt-2 h-[80px] rounded-bl-[24px] rounded-br-[24px]">
                <CardContent class="flex flex-col space-y-0">
                    <p class="text-[16px] font-normal text-[#F8F9FFB2]">Delivered</p>
                    <p class="text-[24px] font-normal text-white">275,865</p>
                  </CardContent>
            </div>
        </Card>

        <Card class="h-[210px] rounded-[24px] shadow-md transition-transform transform hover:scale-105">
            <div class="h-[130px] pt-4 bg-[#6A70FF] bg-opacity-20 relative rounded-tr-[24px] rounded-tl-[24px]">
                <CardContent class="flex items-center justify-between space-y-0">
                    <p class="text-[16px] font-medium text-[#020721]">Total wallet balance</p>
                    <img
                      class="h-[24px] w-[24px]"
                      src="https://res.cloudinary.com/dotojp6xu/image/upload/v1715162926/wallet-3_fbkk9u.svg"
                      alt="gradient"
                    />
      
                    <p class="text-[32px] font-medium text-[#020721] absolute bottom-2 left-5">₦ 2,986,004.07</p>
                  </CardContent>
            </div>
            <div class="bg-[#020721] pt-2 h-[80px] rounded-bl-[24px] rounded-br-[24px]">
                <CardContent class="flex flex-col space-y-0">
                    <p class="text-[16px] font-normal text-[#F8F9FFB2]">Invested</p>
                    <p class="text-[24px] font-normal text-white">₦ 0.00</p>
                  </CardContent>
            </div>
        </Card>

        <Card class="h-[210px] rounded-[24px] shadow-md transition-transform transform hover:scale-105">
            <div class="h-[130px] pt-4 bg-[#00BBD4] bg-opacity-20 relative rounded-tr-[24px] rounded-tl-[24px]">
                <CardContent class="flex items-center justify-between space-y-0">
                    <p class="text-[16px] font-medium text-[#020721]">Users</p>
                    <img
                      class="h-[24px] w-[24px]"
                      src="https://res.cloudinary.com/dotojp6xu/image/upload/v1715162907/profile-2user_stezwz.svg"
                      alt="gradient"
                    />
      
                    <p class="text-[32px] font-medium text-[#020721] absolute bottom-2 left-5">586,004</p>
                  </CardContent>
            </div>
            <div class="bg-[#020721] pt-2 h-[80px] rounded-bl-[24px] rounded-br-[24px]">
                <CardContent class="flex flex-col space-y-0">
                    <p class="text-[16px] font-normal text-[#F8F9FFB2]">Active</p>
                    <p class="text-[24px] font-normal text-white">365,987</p>
                  </CardContent>
            </div>
        </Card>

        <Card class="h-[210px] rounded-[24px] shadow-md transition-transform transform hover:scale-105">
            <div class="h-[130px] pt-4 bg-[#AEE219] bg-opacity-20 relative rounded-tr-[24px] rounded-tl-[24px]">
                <CardContent class="flex items-center justify-between space-y-0">
                    <p class="text-[16px] font-medium text-[#020721]">Tickets</p>
                    <img
                      class="h-[24px] w-[24px]"
                      src="https://res.cloudinary.com/dotojp6xu/image/upload/v1715162881/ticket_etur0t.svg"
                      alt="gradient"
                    />
      
                    <p class="text-[32px] font-medium text-[#020721] absolute bottom-2 left-5">1,375</p>
                </CardContent>
            </div>
            <div class="bg-[#020721] h-[80px] pt-2 rounded-bl-[24px] rounded-br-[24px]">
                <CardContent class="flex flex-col space-y-0">
                    <p class="text-[16px] font-normal text-[#F8F9FFB2]">Pending</p>
                    <p class="text-[24px] font-normal text-white">15</p>
                  </CardContent>
            </div>
        </Card>
    </div>
    <Card class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-6 mb-4">
      <div class="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 py-4">
        <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-2 sm:mb-0">
          Users
          <p class="text-xs sm:text-sm text-[#02072199]">List of Weeshr App Users</p>
        </div>
        <Search class="mt-3 lg:mt-0" />
      </div>

      <div class="overflow-auto bg-white rounded-lg shadow">
        <Table class="lg:w-full w-[800px]">
          <TableHeader>
            <TableRow
              class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
            >
              <TableHead> Weeshr name </TableHead>
              <TableHead>Fullname</TableHead>
              <TableHead>Birthday</TableHead>
              <TableHead> Gender</TableHead>
              <TableHead>Wallet Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="user in users" :key="user._id">
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.firstName }} </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm"
                >{{ user.firstName }} {{ user.lastName }}</TableCell
              >
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.dob }} </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.gender }} </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.balance }}</TableCell>
              <TableCell class="flex">
                <!-- Render multiple status icons based on user's status array -->
                <template v-for="status in user.status" :key="status">
                  <img
                    :src="getStatusIconUrl(status)"
                    :alt="status"
                    class="h-[20px] lg:h-[20px] w-auto mr-1"
                  />
                </template>
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
@/stores/super-admin/super-admin@/stores/super-admin/super-admin
