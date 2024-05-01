<script setup lang="ts">
import Search from '@/components/UseSearch.vue'
import { ref, onMounted, computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import MainNav from '@/components/MainNav.vue'

import axios from 'axios'
import { Loader2 } from 'lucide-vue-next'
import router from '@/router'

import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import { useGeneralStore } from '@/stores/general-use'

const formSchema = toTypedSchema(
  z.object({
    firstName: z
      .string()
      .min(2, { message: 'First name must be at least 2 characters long' })
      .max(50, { message: 'First name cannot be longer than 50 characters' })
      .nonempty('Please enter your first name'),
    lastName: z
      .string()
      .min(2, { message: 'Last name must be at least 2 characters long' })
      .max(50, { message: 'Last name cannot be longer than 50 characters' })
      .nonempty('Please enter your last name'),

    userEmail: z.string().email('Please enter a valid email address'),
    phone: z.string().nonempty('Please enter your phone number'),
    gender: z.string().nonempty(''),
    dob: z.string().nonempty('Please enter your Date of birth'),
    status: z.string().nonempty('Please select Modular Status')
  })
)
const { handleSubmit } = useForm({
  validationSchema: formSchema
})
const newUser = ref({
  firstName: '',
  userEmail: '',
  lastName: '',
  gender: '',
  dob: '',
  status: ''
})

const sheetOpen = ref(false)
const loading = ref(false)
const superAdminStore = useSuperAdminStore()
const token = sessionStorage.getItem('token') || ''

const onSubmit = handleSubmit(async (values) => {
  loading.value = true

  const user = {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.userEmail,
    gender: values.gender,
    dob: values.dob,
    phone: {
      countryCode: '+234',
      phoneNumber: values.phone
    },
    disabled: values.status || false
  }
  await saveUserData(user)

  sheetOpen.value = false

  // Show success toast

  // Reset form fields
  newUser.value = {
    firstName: '',
    lastName: '',
    userEmail: '',
    gender: '',
    dob: '',
    status: ''
  }
})

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

// Save user data to the /administrator endpoint
const saveUserData = async (user: any) => {
  loading.value = true
  try {
    const response = await axios.post(
      'https:{{host}}/administrators?search=test_admin&disabled_status=disabled',
      user,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    // Check if response status is 200 or 201
    if (response.status === 200 || response.status === 201) {
      // Show success toast
      toast({
        title: 'Success',
        description: `${user.vendor} User profile created successfully.`,
        variant: 'success'
      })
    }

    console.log(response.data)
    loading.value = false
    // Handle success
  } catch (err: any) {
    loading.value = false
    if (err.response.data.code === 401) {
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
        title: err.response.data.message || 'An error occurred',
        variant: 'destructive'
      })
    }
    // Handle other errors
  }
}

// onMounted(fetchUsersData);

onMounted(async () => {
  // useGeneralStore().setLoading(true);
  fetchUsersData()
})

const selectedGender = ref('')
const genderOptions = computed<string[]>(() => {
  const genders: Set<string> = new Set()
  users.value.forEach((user) => {
    genders.add(user.gender)
  })
  return Array.from(genders)
})

const selectedStatus = ref('')
const statusOptions = computed<string[]>(() => {
  const statuses: Set<string> = new Set()
  users.value.forEach((user) => {
    user.status.forEach((status: string) => {
      statuses.add(status)
    })
  })
  return Array.from(statuses)
})

const selectedMonth = ref('')
const birthMonthOptions = computed<string[]>(() => [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
])
</script>

<template>
  <div class="flex-col flex bg-[#f0f8ff] min-h-[400px] px-4 sm:px-10 pb-10">
    <MainNav class="mx-6" headingText="User > App Users" />

    <Card class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl">
      <div class="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 py-4">
        <div class="text-lg sm:text-xl font-bold tracking-tight text-[#020721] mb-2 sm:mb-0">
          App Users
          <p class="text-xs sm:text-sm text-[#02072199]">List of Weeshr App Users</p>
        </div>
        <div
          class="flex flex-wrap justify-center sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 items-center"
        >
          <div class="items-center space-x-2 md:flex-row md:items-center space-y-4 md:space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5]">
                <Button variant="outline">
                  Gender
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 ml-2 -mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="">
                <DropdownMenuLabel>Gender</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup v-model="selectedGender">
                  <DropdownMenuRadioItem
                    v-for="(genderOption, index) in genderOptions"
                    :key="index"
                    :value="genderOption"
                  >
                    {{ genderOption }}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5]">
                <Button variant="outline">
                  Birth Month
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 ml-2 -mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="">
                <DropdownMenuLabel>Birth Month</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup v-model="selectedMonth">
                  <DropdownMenuRadioItem
                    v-for="(monthOption, index) in birthMonthOptions"
                    :key="index"
                    :value="monthOption"
                  >
                    {{ monthOption }}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5]">
                <Button variant="outline">
                  Status
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 ml-2 -mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup v-model="selectedStatus">
                  <DropdownMenuRadioItem
                    v-for="(statusOption, index) in statusOptions"
                    :key="index"
                    :value="statusOption"
                  >
                    {{ statusOption }}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Search />
        </div>
      </div>

      <div class="overflow-auto bg-white rounded-lg shadow">
        <Table>
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
              <TableCell class="font-medium">{{ user.firstName }} </TableCell>
              <TableCell class="font-medium">{{ user.firstName }} {{ user.lastName }}</TableCell>
              <TableCell class="font-medium">{{ user.dob }} </TableCell>
              <TableCell class="font-medium">{{ user.gender }} </TableCell>
              <TableCell>{{ user.balance }}</TableCell>
              <TableCell class="flex flex-wrap">
                <!-- Render multiple status icons based on user's status array -->
                <template v-for="status in user.status" :key="status">
                  <img :src="getStatusIconUrl(status)" :alt="status" class="h-50 w-auto mr-1" />
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
    </Card>
  </div>
</template>
@/stores/super-admin/super-admin@/stores/super-admin/super-admin
