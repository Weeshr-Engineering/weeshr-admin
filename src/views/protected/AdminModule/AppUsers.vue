<script setup lang="ts">
import Search from '@/components/UseSearch.vue'
import { ref, onMounted, computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import MainNav from '@/components/MainNav.vue'
import { Icon } from '@iconify/vue'
import axios from 'axios'
import { Loader2 } from 'lucide-vue-next'
import router from '@/router'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"




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
    status: z.string().nonempty('Please select Modular Status'),

    handle: z
    .string()
    .min(2, { message: 'User handle must be at least 2 characters long' })
    .max(20, { message: 'User handle cannot be longer than 20 characters' })
    .nonempty('Please enter your handle'),

    role: z.string().nonempty('Please select a role'),

    Address: z.string().nonempty('Please enter your home address')
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

// onMounted(fetchUsersData);\
onMounted(async () => {
  // useGeneralStore().setLoading(true);
  fetchUsersData()
  
});



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
  <div class="flex-col flex bg-[#f0f8ff] h-full px-4 sm:px-10">
    <MainNav class="md:mx-6" headingText="" /> 
    <div class="flex items-center text-xl mx-4 md:mx-10 md:text-3xl mb-4 -mt-8">
      <RouterLink :to="{name: 'user'}" class="text-gray-500">User</RouterLink>
      <Icon icon="tabler:chevron-right" width="22px" height="22px" class="ml-1 pt-1"/>
      <RouterLink :to="{name: 'appuser'}">App Users</RouterLink>
    </div>
    <Sheet>
      <SheetTrigger asChild>
        <div class="flex justify-end ml-3 my-4">
          <Button class="rounded-full px-4 py-6 bg-[#020721] md:px-6 md:text-xl">Create New User
            <Icon icon="mdi:plus-circle" width="26px" height="26px" class="ml-4 pt-1"/>
          </Button>
        </div>
      </SheetTrigger>
      <Card class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl">
        <div class="flex flex-col gap-4 md:flex-row items-center justify-between px-2 sm:px-6 py-4 w-full">
          <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-4 sm:mb-0">
            App Users
            <p class="text-xs sm:text-sm text-[#02072199]">List of Weeshr App Users</p>
          </div>
          <div class="items-center  grid grid-cols-3 md:grid-cols-3 gap-4  flex-row ">
          <DropdownMenu>
            <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5] ">
              <Button variant="outline">
                <div class="flex items-center text-[10px] md:text-xs">
                  Gender
                  <Icon icon="ion:chevron-down-outline" class="ml-1" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="item-center justify-between">
              <DropdownMenuLabel class="item-center justify-center text-center"
                >Gender</DropdownMenuLabel
              >
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup v-model="selectedGender">
                <DropdownMenuRadioItem
                  v-for="(genderOption, index) in genderOptions"
                  :key="index"
                  :value="genderOption"
                  class="item-center text-center"
                >
                  {{ genderOption }}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5] ">
              <Button variant="outline">
                
                <div class="flex items-center text-[9px] md:text-xs">
                 Birth Month
                  <Icon icon="ion:chevron-down-outline" class="ml-1" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="">
              <DropdownMenuLabel class="item-center justify-center text-center"
                >Birth Month</DropdownMenuLabel
              >
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
                <div class="flex items-center text-[10px] md:text-xs">
                Status
                  <Icon icon="ion:chevron-down-outline" class="ml-1" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel class="item-center justify-center text-center"
                >Status</DropdownMenuLabel
              >
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
                <TableHead>
                  <div class="flex items-center">
                    Wallet Balance
                    <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                  </div>
                </TableHead>
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
                <TableCell class="flex items-center">
                  <!-- Render multiple status icons based on user's status array -->
                  <template v-for="status in user.status" :key="status">
                    <img
                      :src="getStatusIconUrl(status)"
                      :alt="status"
                      class="h-[30px] w-auto mr-1 my-1"
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
      </Card>
      <SheetContent class="bg-[#FFFFFF] overflow-y-scroll w-full">
        <h2 class="text-3xl font-bold ml-4 mt-8">Add User</h2>
        <form class="space-y-4 rounded-xl my-8 mx-auto py-4 px-4 border-solid border border-black border-opacity-50" @submit="onSubmit">
          <div class="flex justify-between items-center">
              <h3 class="text-2xl font-medium mb-4 pt-2.5">User Form</h3>
              <div class="flex items-center">
                  <p class="me-2 text-xs font-semibold">Active</p>
                  <Switch class="dark:bg-gray-700"/>
              </div>
          </div>
          <FormField v-slot="{ componentField }" name="firstName">
              <FormItem v-auto-animate>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                  <Input
                      id="text"
                      type="text"
                      placeholder=""
                      class="focus-visible:ring-blue-600 w-full bg-[#000000] bg-opacity-5 p-2 dark:bg-gray-700 dark:text-white rounded-lg"
                      v-bind="componentField"
                  />
                  </FormControl>

                  <FormMessage for="fistName" />
              </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="lastName">
              <FormItem v-auto-animate>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                  <Input
                      id="text"
                      type="text"
                      placeholder=""
                      class="focus-visible:ring-blue-600 w-full bg-[#000000] bg-opacity-5 p-2 dark:bg-gray-700 dark:text-white rounded-lg"
                      v-bind="componentField"
                  />
                  </FormControl>

                  <FormMessage for="lastName" />
              </FormItem>
          </FormField>
          
          <FormField v-slot="{ componentField }" name="handle">
              <FormItem v-auto-animate>
                  <FormLabel>Handle</FormLabel>
                  <FormControl>
                  <Input
                      id="text"
                      type="text"
                      class="focus-visible:ring-blue-600 w-full bg-[#000000] bg-opacity-5 p-2 dark:bg-gray-700 dark:text-white rounded-lg"
                      v-bind="componentField"
                  />
                  </FormControl>

                  <FormMessage for="handle" />
              </FormItem>
          </FormField>
          
          <FormField v-slot="{ componentField }" name="role">
          <FormItem v-auto-animate>
              <FormLabel>Role</FormLabel>
              <Select v-bind="componentField"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <SelectTrigger class="bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <SelectGroup>
                <SelectItem value="role1">Role 1</SelectItem>
                <SelectItem value="role2">Role 2</SelectItem>
                <SelectItem value="role3">Role 3</SelectItem>
              </SelectGroup>
            </SelectContent>
            </Select>
              <FormMessage for="role" />
          </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="userEmail">
              <FormItem v-auto-animate>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                  <Input
                  id="email"
                  type="email"
                  placeholder="weeshr@admin.com"
                  class="focus-visible:ring-blue-600 w-full bg-[#000000] bg-opacity-5 p-2 dark:bg-gray-700 dark:text-white rounded-lg"
                  v-bind="componentField"
                  />
                  </FormControl>

                  <FormMessage for="userEmail"/>
              </FormItem>
          </FormField>

          <div class="flex flex-col lg:flex-row gap-2">
            <FormField v-slot="{ componentField }" name="gender">
            <FormItem>
            <FormLabel>Gender</FormLabel>
            <Select v-bind="componentField">
            <SelectTrigger class="bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="prefer not to say">Prefer not to say</SelectItem>
              </SelectGroup>
            </SelectContent>
            </Select>
            <FormMessage for="gender" />
            </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="birthday">
            <FormItem v-auto-animate>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                <Input
                    id="dob"
                    type="date"
                    class="focus-visible:ring-blue-600 w-full bg-[#000000] bg-opacity-5 p-1.5 dark:bg-gray-700 dark:text-white rounded-lg"
                    v-bind="componentField"
                />
                </FormControl>

                <FormMessage for="dob" />
            </FormItem>
            </FormField>
          </div>

          <FormField v-slot="{ componentField }" name="phone">
          <FormItem v-auto-animate>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
              <div>
                  <Input
                  id="phone"
                  type="tel"
                  placeholder="Phone Number"
                  class="focus-visible:ring-blue-600 w-full bg-[#000000] bg-opacity-5 p-2 dark:bg-gray-700 dark:text-white rounded-lg"
                  v-bind="componentField"
                  />
              </div>
            </FormControl>

            <FormMessage for="phone" />
          </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="address">
              <FormItem v-auto-animate>
                  <FormLabel>Home Address</FormLabel>
                  <FormControl>
                  <Input
                      id="text"
                      type="text"
                      placeholder=""
                      class="focus-visible:ring-blue-600 w-full bg-[#000000] bg-opacity-5 p-2 dark:bg-gray-700 dark:text-white rounded-lg"
                      v-bind="componentField"
                  />
                  </FormControl>

                  <FormMessage for="address" />
              </FormItem>
          </FormField>

          <div class="flex justify-center lg:justify-end">
            <SheetClose asChild>
              <Button class="rounded-lg px-2 py-1 text-black bg-transparent border">
                  Cancel
              </Button>
            </SheetClose>
            <Button :disabled="loading" type="submit" class="rounded-lg px-4 py-1 bg-[#4145a7] ms-2">
            <Loader2
                color="#ffffff"
                v-if="loading"
                class="w-4 h-4 mr-2 text-black animate-spin"
            />
            Save

            <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  </div>
</template>

<style>
</style>

@/stores/super-admin/super-admin@/stores/super-admin/super-admin