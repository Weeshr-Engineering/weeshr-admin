<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/toast'
import axios from '@/services/ApiService'
import { useRoute } from 'vue-router'
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import { useAdminListStore } from '@/stores/admin-list/admin-list'
import { Loader2 } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Button } from '@/components/ui/button'
import * as z from 'zod'
import router from '@/router'
import { Badge } from '@/components/ui/badge'
import CountryCodes from '@/lib/CountryCodes'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
// import {
//   Pagination,
//   PaginationEllipsis,
//   PaginationFirst,
//   PaginationLast,
//   PaginationList,
//   PaginationListItem,
//   PaginationNext,
//   PaginationPrev,
// } from '@/components/ui/pagination';

import { ability, defineAbilities, verifyAbilities } from '@/lib/ability'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { Icon } from '@iconify/vue'

defineAbilities()

const edit = ability.can('update', 'admins')
const activity = ability.can('read', 'activity-logs')
const editStyle = computed(() => {
  return edit ? 'flex' : 'flex cursor-not-allowed opacity-20'
})

const deleteAdmin = ability.can('delete', 'admins')
const deleteStyle = computed(() => {
  return deleteAdmin ? 'flex' : 'cursor-not-allowed opacity-20 flex'
})

const route = useRoute()
const id = route.params.Id
const superAdminStore = useSuperAdminStore()
const user = ref<any>({})
const dobFormat = ref('')
const loading = ref(false)
const adminListStore = useAdminListStore()
const activityLog = computed(() => {
  return adminListStore.activityLog
})
// const currentPage = computed(()=>{
//   return adminListStore.currentPage
// });
// const totalPages = computed(()=>{
//   return adminListStore.totalPages
// })

// const paginationItems = computed(() => {
//   const pages = [];
//   for (let i = 1; i <= totalPages.value; i++) {
//     pages.push({ type: 'page', value: i });
//   }
//   return pages;
// });
const roleLoading = ref(false)
const roles = ref<any[]>([])
const defaultRole = ref<any[]>([])

// Define a function to fetch users data
const fetchUsersData = async (msg: string) => {
  adminListStore.setDetailLoading(false)
  toast({
    title: 'Loading Data',
    description: 'Fetching data...',
    duration: 0 // Set duration to 0 to make it indefinite until manually closed
  })

  try {
    // Set loading to true
    // useGeneralStore().setLoading(true)
    const response = await axios.get(`/api/v1/admin/administrator/${id}`)

    if (response.status === 200 || response.status === 201) {
      // Update the users data with the response
      const responseData = response.data.data[0]
      const phoneData = response.data.data[0].phoneNumber.normalizedNumber
      dobFormat.value = formatDate(response.data.data[0].dob)
      const data = { ...responseData, phone: phoneData }
      // fill user data with response data
      user.value = data
      defaultRole.value = await getAllIds(responseData.roles)
      adminListStore.setAdminStatus(responseData.disabled)
      // Show success toast
      toast({
        title: 'Success',
        description: `${data.firstName} ${msg}`,
        variant: 'success'
      })
    }
    adminListStore.setDetailLoading(false)
    // set Loading to false
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

// Function to get all _id values
const getAllIds = async (roles: any[]) => {
  return roles.map((role) => role._id)
}

function formatDate(inputDate: string) {
  const months = [
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
  ]

  const dateObj = new Date(inputDate)
  const month = months[dateObj.getMonth()]
  const day = dateObj.getDate()

  return `${month} ${day}`
}

const editProfile = async (values: any) => {
  const adminProfile = JSON.stringify({
    firstName: values.firstName || user.value.firstName,
    lastName: values.lastName || user.value.lastName,
    gender: values.gender || user.value.gender,
    email: values.email || user.value.email,
    dob: (values.dob && values.dob.substring(0, 10)) || user.value.dob.substring(0, 10),
    phone: {
      countryCode: values.countrycode || user.value.phoneNumber.countryCode,
      phoneNumber: values.phone || user.value.phoneNumber.phoneNumber
    },
    disabled: adminListStore.adminStatus
  })
  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `/api/v1/admin/administrator/${id}`,
    data: adminProfile
  }

  axios
    .request(config)
    .then((response) => {
      fetchUsersData('data updated')
    })
    .catch((error) => {})
}

const getRoles = async () => {
  try {
    const response = await axios.get('/api/v1/admin/roles')

    // Check if response status is 200 or 201
    if (response.status === 200 || response.status === 201) {
      // Show success toast
      toast({
        title: 'Success',
        description: `Roles fetched successfully.`,
        variant: 'success'
      })
      roles.value = response.data.data.data.reverse()
      // fetchUsersData()
    }
  } catch (err: any) {
    // adminListStore.loadingControl(false)
    if (err.response.data.code === 401) {
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

const updateRole = async (roleId: string) => {
  roleLoading.value = true
  const adminRole = await modifyArrayValue(defaultRole.value, roleId)
  let data = JSON.stringify({
    roles: adminRole
  })

  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `/api/v1/admin/administrator/${id}/roles`,
    data: data
  }

  axios
    .request(config)
    .then((response) => {
      toast({
        title: 'Success',
        description: `${user.value.firstName}' s role is updated...'`,
        variant: 'success'
      })
    })
    .catch((error) => {
      toast({
        title: error.response.data.message || 'An error occurred',
        variant: 'destructive'
      })
      fetchUsersData('')
    })
  roleLoading.value = false
}

const modifyArrayValue = async (arr: any[], value: string) => {
  const index = arr.indexOf(value)
  if (index !== -1) {
    // Value is present, remove it
    arr.splice(index, 1)
  } else {
    // Value is not present, add it
    arr.push(value)
  }
  return arr
}

// fetch data on mount
onMounted(() => {
  fetchUsersData('data fetched')
  adminListStore.getActivityLog(id)
  getRoles()
})

const contactFormSchema = toTypedSchema(
  z.object({
    firstName: z
      .string()
      .min(2, {
        message: 'Username must be at least 2 characters.'
      })
      .max(30, {
        message: 'Username must not be longer than 30 characters.'
      })
      .optional(),
    lastName: z
      .string()
      .min(2, {
        message: 'Username must be at least 2 characters.'
      })
      .max(30, {
        message: 'Username must not be longer than 30 characters.'
      })
      .optional(),
    dob: z.string().optional(),
    gender: z.string().optional(),
    phone: z
      .string()
      .min(10, { message: 'Phone number must be 10 characters' })
      .max(10, { message: 'Phone number must be 10 characters' })
      .optional(),
    countrycode: z.string().optional(),
    email: z.string().email({ message: 'Invalid email address' }).optional()
  })
)

const { handleSubmit: contactForm } = useForm({
  validationSchema: contactFormSchema
})

const onSubmit = contactForm((values) => {
  function valueChecker<T extends Record<string, any>>(obj: T): boolean {
    return Object.values(obj).some((value) => value !== undefined)
  }
  if (valueChecker(values)) {
    editProfile(values)
  } else {
    toast({
      title: 'Form Input Is Empty',
      description: `Make a change: There is nothing to update`,
      variant: 'destructive'
    })
  }
})

// function getAllIds(roles: any): any[] | PromiseLike<any[]> {
//   throw new Error('Function not implemented.')
// }
</script>
<template>
  <div class="md:container lg:px-0 mx-auto">
    <div class="lg:flex">
      <Card
        class="md:col-span-3 bg-[#F8F9FF] sm:items-center shadow-xl lg:min-w-[398px] min-h-full"
      >
        <CardHeader>
          <div class="flex items-center">
            <Icon icon="tabler:chevron-left" width="22px" height="22px" class="ml-1 pt-1" />
            <RouterLink :to="{ name: 'admin' }">Admin List</RouterLink>
          </div>
          <CardTitle class="text-2xl font-bold text-[#000000] my-4">Genie On Duty:</CardTitle>
          <p class="-mt-3 font-semibold italic">{{ user.firstName }}</p>
          <CardDescription>
            <div v-if="user.avatar" class="w-7/12 flex justify-center">
              <img
                :src="user.avatar"
                alt="display"
                class="w-full rounded-full border-double border-4 border-[#baef23]"
              />
            </div>
            <div v-else class="flex justify-center">
              <DotLottieVue
                style="width: 250px; height: 250px"
                class="rounded-full border-double border-4 border-[#baef23]"
                autoplay
                loop
                src="https://lottie.host/6cfb5601-78b7-4518-b9b8-5fefd5a0bd8e/YrEesabE44.json"
              />
            </div>
            <div class="flex justify-between px-2 pr-6 mt-5">
              <span class="font-semibold text-base text-[#020721]">Identity</span>

              <Popover>
                <PopoverTrigger>
                  <div :class="editStyle" @click="verifyAbilities('update', 'admins')">
                    <img
                      class="max-w-[18.05px] max-h-[24px]"
                      src="https://res.cloudinary.com/dufimctfc/image/upload/v1714310908/edit-4-svgrepo-com_1_iy2nwu.svg"
                      alt="gradient"
                    />
                    <span class="text-sm font-medium text-[#02072199]">
                      <p>Edit</p>
                    </span>
                  </div>
                </PopoverTrigger>
                <PopoverContent v-if="edit">
                  <form class="space-y-8" @submit="onSubmit">
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
                    <div class="flex flex-row justify-between gap-2">
                      <div class="min-w-[35%]">
                        <FormField v-slot="{ componentField }" name="gender">
                          <FormItem>
                            <FormLabel>Gender</FormLabel>

                            <Select
                              v-bind="componentField"
                              id="gender"
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block min-w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
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
                      </div>

                      <div class="">
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
                    <Button type="submit">
                      <Loader2
                        color="#ffffff"
                        v-if="loading"
                        class="w-4 h-4 mr-2 text-black animate-spin"
                      />
                      Update
                      <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
                    </Button>
                  </form>
                </PopoverContent>
              </Popover>
            </div>

            <Card class="rounded-md">
              <div class="flex justify-between px-2 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">First Name</p>
                <p class="text-xs text-left md:text-sm lg:text-sm text-[#020721]">
                  {{ user.firstName }}
                </p>
              </div>
              <div class="flex justify-between px-2 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Last Name</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{ user.lastName }}</p>
              </div>
              <div class="flex justify-between px-2 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Birthday</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{ dobFormat }}</p>
              </div>
              <div class="flex justify-between px-2 py-2 border-b" v-if="user.middleName">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Handle</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{ user.middleName }}</p>
              </div>
              <div class="flex justify-between px-2 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Gender</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{ user.gender }}</p>
              </div>
              <div class="flex justify-between px-2 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Joined</p>
                <p class="text-xs md:text-sm text-left lg:text-sm text-[#020721]">3 Aug 2023</p>
              </div>
            </Card>

            <div class="flex justify-between px-2 pr-6 mt-5">
              <span class="font-semibold text-base text-[#020721]">Contact</span>

              <Popover>
                <PopoverTrigger>
                  <div :class="deleteStyle" @click="verifyAbilities('update', 'admins')">
                    <img
                      class="max-w-[18.05px] max-h-[24px]"
                      src="https://res.cloudinary.com/dufimctfc/image/upload/v1714310908/edit-4-svgrepo-com_1_iy2nwu.svg"
                      alt="gradient"
                    />
                    <span class="text-sm font-medium text-[#02072199]">
                      <p>Edit</p>
                    </span>
                  </div>
                </PopoverTrigger>
                <PopoverContent v-if="deleteAdmin">
                  <form class="space-y-4" @submit.prevent="onSubmit">
                    <div class="">
                      <h5 class="text-blue-900 text-sm font-medium mb-5">Phone Number</h5>
                      <div
                        class="flex items-start flex-row md:justify-between md:items-start gap-2 relative"
                      >
                        <FormField
                          v-slot="{ componentField }"
                          name="countrycode"
                          class="bg-[teal] mt-6 w-[50%]"
                        >
                          <FormItem>
                            <!-- <FormLabel>
                                <span class="hidden md:inline-block">Country Code</span><span class="md:hidden inline-block">CC</span>
                              </FormLabel> -->
                            <Select
                              v-bind="componentField"
                              id="gender"
                              class="bg-gray-50 w-auto mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            >
                              <FormControl>
                                <SelectTrigger class="">
                                  <SelectValue placeholder="+234" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem
                                  v-for="(code, key) in CountryCodes"
                                  :value="code.dial_code"
                                  :key="key"
                                  class="flex justify-center items-center gap-2"
                                >
                                  {{ code.dial_code }}
                                  <img
                                    class="w-[18px] h-[18px] hidden md:inline-block"
                                    :src="
                                      'https://flagcdn.com/16x12/' +
                                      code.code.toLowerCase() +
                                      '.png'
                                    "
                                    alt="gradient"
                                  />
                                </SelectItem>
                                <!-- <SelectItem value="Male">+44</SelectItem> -->
                              </SelectContent>
                            </Select>

                            <FormMessage for="countrycode" />
                          </FormItem>
                        </FormField>
                        <div class="lg:w-[70%]">
                          <FormField v-slot="{ componentField }" name="phone" class="lg:w-[70%]">
                            <FormItem v-auto-animate>
                              <!-- <FormLabel class="text-blue-900">Phone Number</FormLabel> -->
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

                    <FormField v-slot="{ componentField }" name="email">
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

                    <Button type="submit">
                      <Loader2
                        color="#ffffff"
                        v-if="loading"
                        class="w-4 h-4 mr-2 text-black animate-spin"
                      />
                      Update
                      <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
                    </Button>
                  </form>
                </PopoverContent>
              </Popover>
            </div>

            <Card class="rounded-md">
              <div class="flex justify-between px-2 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Email</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{ user.email }}</p>
              </div>
              <div class="flex justify-between px-2 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Phone no.</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{ user.phone }}</p>
              </div>
            </Card>

            <div class="w-full px-2 pr-6 mt-5">
              <span class="font-semibold text-base text-[#020721]">Status</span>
            </div>

            <Card class="bg-[#F8F9FF] flex justify-between">
              <CardHeader
                ><span v-if="!adminListStore.detailLoading">{{
                  adminListStore.adminStatus ? 'Disabled' : 'Active'
                }}</span>
                <Loader2 v-else class="w-4 h-4 mr-2 text-black animate-spin" />
              </CardHeader>

              <CardContent
                class="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 py-4"
              >
                <Switch
                  v-if="!adminListStore.detailLoading"
                  v-bind:checked="!adminListStore.adminStatus"
                  :onclick="
                    () =>
                      adminListStore.toggleStatus(
                        user._id,
                        adminListStore.adminStatus,
                        user.firstName
                      )
                  "
                  :disabled="!edit"
                />
                <Loader2 v-else class="w-4 h-4 mr-2 text-black animate-spin" />
              </CardContent>
            </Card>
          </CardDescription>
        </CardHeader>
      </Card>

      <div class="mt-9 px-4 lg:px-6 lg:w-4/5 min-h-full">
        <Tabs default-value="role" class="space-y-1">
          <TabsList class="border-[#DEDFE8] bg-transparent w-full">
            <TabsTrigger value="role" class="data-[state=active]:border-[#baef23]">
              Role Permissions
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              :disabled="!activity"
              class="data-[state=active]:border-[#baef23]"
            >
              Activity log
            </TabsTrigger>
          </TabsList>
          <TabsContent value="role">
            <Card>
              <CardHeader>
                <CardTitle>Role Permissions</CardTitle>
                <CardDescription class="flex justify-between items-center">
                  <div>Assign roles to {{ user.firstName }}</div>
                  <Loader2 v-if="roleLoading" class="w-4 h-4 mr-2 text-black animate-spin" />
                </CardDescription>
              </CardHeader>
              <!-- <span v-if="ability.can('update', 'admins')"> -->
              <CardContent
                class="flex items-center justify-between px-2 sm:px-6 py-4 max-h-16"
                v-for="(role, id) in roles"
                :key="id"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="inline-block bg-[#373B4D] text-[#F8F9FF] rounded-full px-3 py-2 text-sm"
                  >
                    {{ role.name[0] }}{{ role.name[role.name.length - 1].toUpperCase() }}
                  </div>
                  <p class="text-sm text-muted-foreground text-center text-[#000000]">
                    {{ role.name }}
                  </p>
                </div>
                <div class="hidden md:inline-block">
                  {{ role.description }}
                </div>
                <div class="flex items-center gap-4">
                  <Switch
                    @click="() => updateRole(role._id)"
                    :checked="defaultRole.includes(role._id) ? true : false"
                    :disabled="!ability.can('update', 'admins')"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <div class="bg-white rounded-lg shadow max-h-[85svh] overflow-y-scroll">
              <Table class="w-full">
                <TableHeader>
                  <TableRow class="text-[#02072199] font-semibold bg-gray-200">
                    <TableHead class="text-sm">
                      <div class="flex items-center cursor-pointer">Timestamp</div>
                    </TableHead>
                    <TableHead class="text-left">User</TableHead>
                    <TableHead class="text-left">Action</TableHead>
                    <TableHead class="text-left">Status</TableHead>
                    <TableHead class="text-left">Description</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody class="overflow-y-scroll">
                  <TableRow v-for="log in activityLog" :key="log.id">
                    <TableCell class="text-xs md:text-sm lg:text-xs"
                      >{{ new Date(log.timestamp).toLocaleString() }}
                    </TableCell>
                    <TableCell class="text-xs md:text-sm lg:text-xs">{{
                      log?.user.extras.lastName + ' ' + log.user.extras.firstName
                    }}</TableCell>
                    <TableCell class="text-xs md:text-sm lg:text-xs">{{ log.action }}</TableCell>
                    <TableCell>
                      <Badge
                        :class="{
                          'bg-[#00C37F]': log.status === 'SUCCESS',
                          'bg-[#020721]': !(log.status === 'SUCCESS')
                        }"
                        class="px-1.5 py-0.5 text-xs capitalize"
                      >
                        {{ log.status }}
                      </Badge>
                    </TableCell>
                    <TableCell class="text-xs md:text-sm lg:text-xs">{{
                      log.description
                    }}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <!-- <div class="flex gap-2 max-w-full flex-wrap justify-end mt-8 mr-4 items-center text-[15px]">
                  <Pagination :total="totalPages" :sibling-count="1" show-edges :default-page="1" @change="adminListStore.handlePageChange">
                    <PaginationList class="flex items-center gap-1">
                      <PaginationFirst @click="adminListStore.handlePageChange(1)" />
                      <PaginationPrev @click="adminListStore.handlePageChange(Math.max(currentPage - 1, 1))" />
                      <template v-for="(item, index) in paginationItems" :key="index">
                        <PaginationListItem v-if="item.type === 'page'" :value="item.value" as-child>
                          <Button class="w-10 h-10 p-0" :variant="item.value === currentPage ? 'default' : 'outline'" @click="adminListStore.handlePageChange(item.value)">
                            {{ item.value }}
                          </Button>
                        </PaginationListItem>
                        <PaginationEllipsis v-else :index="index" />
                      </template>
                      <PaginationNext @click="adminListStore.handlePageChange(Math.min(currentPage + 1, totalPages))" />
                      <PaginationLast @click="adminListStore.handlePageChange(totalPages)" />
                    </PaginationList>
                  </Pagination>
                </div> -->
            <!-- </CardContent> -->
            <!-- </Card> -->
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
</template>
