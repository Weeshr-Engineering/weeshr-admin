<script setup lang="ts">
import Search from '@/components/UseSearch.vue'
import { ref, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useDateFormat, useNow } from '@vueuse/core'
import MainNav from '@/components/MainNav.vue'
import axios from 'axios'
import { Loader2 } from 'lucide-vue-next'
import router from '@/router'
import { Button } from "@/components/ui/button"
import { Badge } from '@/components/ui/badge'
import { Icon } from '@iconify/vue'
import CountryCodes from '@/lib/CountryCodes'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet'

import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import { useCreateUserStore } from '@/stores/create-user/create-user'
import { useGeneralStore } from '@/stores/general-use'
import { useAdminListStore } from '@/stores/admin-list/admin-list'

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
    dob: z.string().nonempty('Please enter your date of birth'),
    gender: z.string().nonempty('Please select your gender'),
    phone: z.string().nonempty('Please enter your phone number').min(10, { message: 'Phone number must be 10 characters' }).max(10, { message: 'Phone number must be 10 characters' }).optional(),
    status: z.boolean().optional(),
    countrycode: z.string().optional()
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
  phone: '',
})

const adminListStore = useAdminListStore()
const sheetOpen = adminListStore.sheetOpen
const loading = adminListStore.loading
const currentPage = ref(1)
const totalPage = ref<any[]>([])
const superAdminStore = useSuperAdminStore()
const createUserStore = useCreateUserStore()
const token = sessionStorage.getItem('token') || ''

const onSubmit = handleSubmit(async (values) => {
  adminListStore.loadingControl(true)
// console.log(values)
  const user = {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.userEmail,
    gender: values.gender,
    dob: values.dob,
    phone: {
      countryCode: values.countrycode  || '+234',
      phoneNumber: values.phone
    },
    dateJoined: formattedDate.value,
    disabled: values.status || false
  }

  // console.log(user)
  await saveUserData(user)

  // sheetOpen = false
  adminListStore.sheetControl(false)

  // Show success toast

  // Reset form fields
  newUser.value = {
    firstName: '',
    lastName: '',
    userEmail: '',
    gender: '',
    dob: '',
    phone: '',
  }
})

// Define a ref to hold the users data
const users = ref<any[]>([])

// define a ref to hold user status
// const userStatus = ref<any>();

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
      'https://api.staging.weeshr.com/api/v1/admin/administrators?per_page=200',
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
      // Show success toast
      toast({
        title: 'Success',
        description: `data fetched`,
        variant: 'success'
      })

      console.log(response.data)
    }

    // Update the users data with the response
    const data = response.data.data.data
    users.value = data.reverse()
    // adminListStore.setUsers(data.reverse())

    // set page data
    currentPage.value = response.data.data.currentPage
    const totalPageValue = await response.data.data.totalPages
    totalPage.value = new Array(totalPageValue).fill(null)
    
    // close loading screen
    // useGeneralStore().setLoading(false)
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
  adminListStore.loadingControl(true)
  try {
    const response = await axios.post(
      'https://api.staging.weeshr.com/api/v1/admin/administrator',
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
        description: `${user.firstName} User profile created successfully.`,
        variant: 'success'
      })
      fetchUsersData()
    }
    createUserStore.addUser(user)
    adminListStore.loadingControl(false)
    // Handle success
  } catch (err: any) {
    adminListStore.loadingControl(false)
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

const prevPage = ()=>{
  if(currentPage.value > 1){
    console.log(currentPage.value++)
  }
}

const nextPage = ()=>{
  if(currentPage.value < totalPage.value.length - 1){
    console.log(currentPage.value++)
  }
}
// onMounted(fetchUsersData);

onMounted(async () => {
  // useGeneralStore().setLoading(true);
  fetchUsersData()
})

const formattedDate = useDateFormat(useNow(), 'ddd, D MMM YYYY')
</script>

<template>
  <div class="flex-col flex bg-[#f0f8ff] min-h-[400px] px-4 sm:px-10 pb-10">
    <MainNav class="mx-6" headingText="Admin List" />
    <div class="px-10 py-10 ml-auto">
      <Sheet :close="sheetOpen">
        <SheetTrigger as-child>
          <button @click="adminListStore.sheetControl(true)" class="bg-[#020721] px-4 py-2 rounded-xl w-50 h-12">
            <div class="text-base text-[#F8F9FF] text-center flex items-center">
              Add New Admin
              <svg
                width="20"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="ml-6"
              >
                <path
                  d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16 12.75H12.75V16C12.75 16.41 12.41 16.75 12 16.75C11.59 16.75 11.25 16.41 11.25 16V12.75H8C7.59 12.75 7.25 12.41 7.25 12C7.25 11.59 7.59 11.25 8 11.25H11.25V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V11.25H16C16.41 11.25 16.75 11.59 16.75 12C16.75 12.41 16.41 12.75 16 12.75Z"
                  fill="#F8F9FF"
                />
              </svg>
            </div>
          </button>
        </SheetTrigger>
        <SheetContent class="overflow-y-auto">
          <SheetHeader>
            <h3 class="text-2xl font-medium">Create User profile</h3>
            <SheetDescription>
              Add a new profile here. Click submit when you're done.
            </SheetDescription>
          </SheetHeader>
          <CardContent class="grid gap-4 pt-10">
            <form class="space-y-4" @submit.prevent="onSubmit">
              <FormField v-slot="{ componentField }" name="firstName">
                <FormItem v-auto-animate>
                  <FormLabel class="text-blue-900">First Name</FormLabel>
                  <FormControl>
                    <Input
                      id="text"
                      type="text"
                      placeholder="First Name"
                      class="focus-visible:ring-blue-600"
                      v-bind="componentField"
                    />
                  </FormControl>

                  <FormMessage for="firstName" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="lastName">
                <FormItem v-auto-animate>
                  <FormLabel class="text-blue-900">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      id="text"
                      type="text"
                      placeholder="Last Name"
                      class="focus-visible:ring-blue-600"
                      v-bind="componentField"
                    />
                  </FormControl>

                  <FormMessage for="lastName" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="userEmail">
                <FormItem v-auto-animate>
                  <FormLabel class="text-blue-900">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="weeshr@admin.com"
                      class="focus-visible:ring-blue-600"
                      v-bind="componentField"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              </FormField>
              <div class="flex flex-row justify-between gap-2">
                <FormField v-slot="{ componentField }" name="gender" class="w-[40%]">
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    
                      <Select
                      v-bind="componentField"
                      id="gender"
                      class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                      <FormControl>
                        <SelectTrigger class="">
                            <SelectValue placeholder="Gender" />
                          </SelectTrigger>
                      </FormControl>
                        <SelectContent>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Male">Male</SelectItem>
                        </SelectContent>
                      </Select>
                    
                    <FormMessage for="gender" />
                  </FormItem>
                </FormField>

                <div class="w-[70%]">
                  <FormField v-slot="{ componentField }" name="dob">
                    <FormItem v-auto-animate>
                      <FormLabel class="text-blue-900">Date of Birth</FormLabel>
                      <FormControl>
                        <Input
                          id="dob"
                          type="date"
                          placeholder="Date of Birth"
                          class="focus-visible:ring-blue-600"
                          v-bind="componentField"
                        />
                      </FormControl>

                      <FormMessage for="dob" />
                    </FormItem>
                  </FormField>
                </div>
              </div>
              <div class="">
                <h5 class='text-blue-900 text-sm font-medium mb-3'>Phone Number</h5>
                <div class='flex flex-row md:justify-between md:items-center gap-2 relative'>
                  <FormField v-slot="{ componentField }" name="countrycode" class="mt-6 w-[50%]">
                    <FormItem>
                        <Select
                        v-bind="componentField"
                        id="gender"
                        class='bg-gray-50 w-auto mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white'>
                        <FormControl>
                          <SelectTrigger class="">
                              <SelectValue placeholder="+234" />
                            </SelectTrigger>
                        </FormControl>
                          <SelectContent>
                            <SelectItem v-for="(code, key ) in CountryCodes" :value="code.dial_code" :key="key" class='flex justify-center items-center gap-2'>
                              {{code.dial_code}} 
                              <img
                              class="w-[18px] h-[18px] hidden md:inline-block"
                              :src="'https://flagcdn.com/16x12/'+code.code.toLowerCase()+'.png'"
                              alt="gradient"/>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      
                      <FormMessage for="countrycode" />
                    </FormItem>
                  </FormField>
                  <div class='lg:w-[70%]'>
                    <FormField v-slot="{ componentField }" name="phone">
                      <FormItem v-auto-animate>
                        <FormControl>
                          <div>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="Phone Number"
                              class="focus-visible:ring-blue-600"
                              v-bind="componentField"
                            />
                          </div>
                        </FormControl>
      
                        <FormMessage for="phone" />
                      </FormItem>
                    </FormField>
                  </div>
                </div>
              </div>
              
              <FormField v-slot="{ componentField }" name="type">
                <FormItem>
                  <FormLabel>Admin Type</FormLabel>
                  
                    <Select
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    v-bind="componentField"
                    id="type">
                    <FormControl>
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="Select Admin Type" />
                      </SelectTrigger>
                    </FormControl>
                      <SelectContent>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="cxperience">Cxperience</SelectItem>
                        <SelectItem value="flutter">Flutter</SelectItem>
                      </SelectContent>
                  </Select>
                  <FormMessage for="gender" />
                </FormItem>
              </FormField>

              <Button type="submit">
                <Loader2
                  color="#ffffff"
                  v-if="loading"
                  class="w-4 h-4 mr-2 text-black animate-spin"
                />
                Submit

                <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
              </Button>
            </form>
          </CardContent>
        </SheetContent>
      </Sheet>
    </div>

    <Card class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl">
      <div class="flex items-center justify-between px-6 py-4">
        <div class="text-2xl font-bold tracking-tight text-[#020721]">
          Admin
          <p class="text-xs text-[#02072199] py-2">List of Weehr Admin</p>
        </div>
        <div class="flex flex-col"></div>
        <Search />
      </div>

      <div class="overflow-auto min-h-52 bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow
              class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
            >
              <TableHead> Name </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Modular Permission</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="user in users" :key="user._id">
              <TableCell class="font-medium">{{ user.firstName }} {{ user.lastName }}</TableCell>
              <TableCell>{{ user.email }}</TableCell>
              <TableCell>{{ user.gender }}</TableCell>
              <TableCell>{{user.phoneNumber.normalizedNumber}}</TableCell>
              <!-- <TableCell @click="toggleStatus(user._id, user.disabled)">
                <Button v-if="user.disabled" class="bg-gray-300">Disabled</Button>
                <Button v-else class="bg-green-400">Active</Button>
              </TableCell> -->
              <TableCell>
                <Badge
                  :class="{ 'bg-[#00C37F]': !user.disabled, 'bg-[#020721]': user.disabled }"
                  
                >
                  {{ user.disabled ? 'Disabled' : 'Active' }}
              </Badge>
              </TableCell>
              <TableCell>
                <div class="flex flex-wrap gap-2">
                  <!-- Display each permission as a pill -->
                  <!-- <template v-for="permission in users" :key="permission"> -->
                    <span
                      class="inline-block bg-[#373B4D] text-[#F8F9FF] rounded-full px-2 py-1 text-sm"
                      >Dashboard</span
                    >
                  <!-- </template> -->
                </div>
              </TableCell>
              <TableCell>
                <router-link :to="`/admindetails/${user._id}`">
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
        <Button variant="secondary" @click="prevPage"> <Icon icon="radix-icons:chevron-left" /> </Button>
        <span v-for="(item, index) in totalPage" :key="index">
          <Button v-if="(index + 1) == currentPage" variant="secondary" class="bg-[#020721] text-gray-400" > {{ index + 1 }} </Button>
          <Button v-else variant="outline" > {{ index + 1 }} </Button>
        </span>
        <Button variant="secondary" @click="nextPage"> <Icon icon="radix-icons:chevron-right" /> </Button>
        <!-- <a href="#"><p class="text-[blue]">See all</p></a> -->
      </div>
    </Card>
  </div>
</template>
<!-- @/stores/super-admin/super-admin@/stores/super-admin/super-admin admin -->

@/stores/super-admin/super-admin@/stores/super-admin/super-admin
