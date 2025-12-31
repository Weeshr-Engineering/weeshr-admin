<script setup lang="ts">
import Search from '@/components/UseSearch.vue'
import { computed, onMounted, ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
// import { useDateFormat, useNow } from '@vueuse/core'
import MainNav from '@/components/MainNav.vue'
// import VueTelInput from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'
// import axios from "@/services/ApiService";
import { Loader2 } from 'lucide-vue-next'
import CountryCodes from '@/lib/CountryCodes'
// import { CardContent } from '@/components/ui/card'
// import router from '@/router'
import { Textarea } from '@/components/ui/textarea'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet'

import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev
} from '@/components/ui/pagination'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'

// import { toast } from '@/components/ui/toast'
// import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import { useVendorListStore } from '@/stores/vendor/vendor-list'
import axios from '@/services/ApiService'
import { toast } from '@/components/ui/toast/use-toast'
import { catchErr } from '@/composables/catchError'
// import { useGeneralStore } from '@/stores/general-use'

interface CompanyType {
  name: string
  value: string
}

interface VendorData {
    "_id": string,
    "firstName": string,
    "lastName": string,
    "email": string,
    "phoneNumber": {
        "countryCode": string, 
        "phoneNumber": string,
        "normalizedNumber": string|null
    },
    "vendorId": string,
    "invitedBy": string,
    "acceptedAt": string,
    "createdAt": string,
    "updatedAt": string,
}


const companyTypes: CompanyType[] = [
  { name: 'Sole Proprietorship', value: 'Sole Proprietorship' },
  { name: 'Business', value: 'BUSINESS' },
  { name: 'Company', value: 'COMPANY' },
  { name: 'Partnership', value: 'Partnership' },
  { name: 'Limited Liability Company (LLC)', value: 'Limited Liability Company (LLC)' },
  { name: 'Corporation', value: 'Corporation' },
  { name: 'S Corporation', value: 'S Corporation' },
  { name: 'Nonprofit Organization', value: 'Nonprofit Organization' },
  { name: 'Cooperative', value: 'Cooperative' }
]
const formSchema = toTypedSchema(
  z.object({
    rcNumber: z.number(),
    companyName: z.string(),
    companyType: z.union([z.literal('COMPANY'), z.string()]),
    companyEmail: z.string().email(),
    companyAddress: z.string(),
    companyState: z.string(),
    status: z.union([z.literal('published'), z.literal('draft'), z.string()]),
    invite: z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      countryCode: z
        .string()
        .regex(/^\+\d+$/, 'Invalid country code')
        .optional(),
      phoneNumber: z.string().regex(/^\d+$/, 'Invalid phone number')
    })
  })
)
const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema
})

const newUser = ref({
  vendor: '',
  userEmail: '',
  category: ''
})
const sheetOpen = ref(false)
const loading = ref(false)
const vendorLoading = ref(false)
const searchQuery = ref('')
const vendorListStore = useVendorListStore()
const { fetchVendors, saveUserData } = useVendorListStore()
const vendor = ref<VendorData>()
const error = ref<string | null>(null)
const deleteModal = ref(false)
const pDeleteModal = ref(false)
const viewInviteModal = ref(false)
const currentVendor = ref('')
const currentID = ref('')
const understand = ref('')

// Filtered vendors based on search query (searches by name, type, and email)
const filteredVendors = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) {
    return vendorListStore.vendors
  }
  return vendorListStore.vendors.filter((vendor) => {
    const companyName = vendor.companyName?.toLowerCase() || ''
    const companyType = vendor.companyType?.toLowerCase() || ''
    const companyEmail = vendor.companyEmail?.toLowerCase() || ''
    return (
      companyName.includes(query) || companyType.includes(query) || companyEmail.includes(query)
    )
  })
})

// const vendors = computed(() => {
//   return vendorListStore.vendors
// })
// const superAdminStore = useSuperAdminStore()

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  const admin = localStorage.getItem('user')
  let data
  if (admin) {
    data = JSON.parse(admin)
  } else {
    return
  }

  const user = {
    rcNumber: values.rcNumber,
    companyName: values.companyName,
    companyType: values.companyType,
    companyEmail: values.companyEmail,
    companyAddress: values.companyAddress,
    companyState: values.companyState,
    status: values.status,
    invite: {
      firstName: values.invite.firstName,
      lastName: values.invite.lastName,
      email: values.invite.email,
      invitedBy: data.id,
      phoneNumber: {
        countryCode: values.invite.countryCode || '+234',
        phoneNumber: values.invite.phoneNumber
      }
    }
  }

  await saveUserData(user)

  // users.value.push(user)

  sheetOpen.value = false

  // Show success toast

  // Reset form fields
  newUser.value = {
    vendor: '',
    userEmail: '',
    category: ''
  }
  resetForm()
})

const permanentlyDeleteVendor = async () => {
  if(understand.value.toLowerCase() !== 'i understand'){
    toast({
        title: 'Unauthorized',
        description: 'You must fill the field to continue!',
        variant: 'destructive'
      })
      return;
  }
  toast({
    title: 'Loading Data',
    description: 'Fetching data...',
    variant: 'loading',
    duration: 0 // Set duration to 0 to make it indefinite until manually closed
  })

  try {
    // Set loading to true
    // useGeneralStore().setLoading(true)
    const response = await axios.delete(`/api/v1/admin/market/vendor/${currentID.value}/hard-permanent`)

    if (response.status === 200 || response.status === 201) {
      toast({
        title: 'Success',
        description: `Delete success`,
        variant: 'success'
      })
      // props.refresh('Success')
    }
    pDeleteModal.value = false
    fetchVendors()
    // set Loading to false
  } catch (error: any) {
    catchErr(error)
    if (error.response.status === 401) {
      // sessionStorage.removeItem('token')
      // Clear token from superAdminStore
      // superAdminStore.setToken('')

      setTimeout(() => {
        // router.push({ name: 'super-admin-login' })
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
}

const deleteVendor = async () => {
  toast({
    title: 'Loading Data',
    description: 'Fetching data...',
    variant: 'loading',
    duration: 0 // Set duration to 0 to make it indefinite until manually closed
  })

  try {
    // Set loading to true
    // useGeneralStore().setLoading(true)
    const response = await axios.delete(`/api/v1/admin/market/vendor/${currentID.value}`)

    if (response.status === 200 || response.status === 201) {
      toast({
        title: 'Success',
        description: `Delete success`,
        variant: 'success'
      })
      // props.refresh('Success')
    }
    deleteModal.value = false
    fetchVendors()
    // set Loading to false
  } catch (error: any) {
    catchErr(error)
    if (error.response.status === 401) {
      // sessionStorage.removeItem('token')
      // Clear token from superAdminStore
      // superAdminStore.setToken('')

      setTimeout(() => {
        // router.push({ name: 'super-admin-login' })
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
}

const fetchVendorsData = async (id: string) => {
  vendorLoading.value = true
  // toast({
  //   title: 'Loading Data',
  //   description: 'Fetching data...',
  //   variant: 'loading',
  //   duration: 0 // Set duration to 0 to make it indefinite until manually closed
  // })

  try {
    // Set loading to true
    // useGeneralStore().setLoading(true)
    const response = await axios.get(`/api/v1/admin/market/invites/vendor/${id}`)

    if (response.status === 200 || response.status === 201) {
      // Update the users data with the response
      // console.log(response)
      vendor.value = response.data.data[0];
    }
    vendorLoading.value = false
    // set Loading to false
    // useGeneralStore().setLoading(false)
  } catch (error: any) {
    catchErr(error)
    error.value = error.response.data.message || 'An error occurred while fetching vendor data.'
    vendorLoading.value = false;
    // console.log(error)
    if (error.response.status === 401) {
      setTimeout(() => {
        // router.push({ name: 'super-admin-login' })
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
}

const handleAction = (action: string, id: string, name?: string) => {
  switch (action) {
    case 'invite':
      // startEdit(id)
      currentVendor.value = name || '';
      viewInviteModal.value = true
      fetchVendorsData(id)
      break
    
    case 'deleteModal':
      deleteModal.value = true
      currentID.value = id;
      break
    
    case 'pDeleteModal':
      pDeleteModal.value = true
      currentID.value = id;
      break

    case 'delete':
      // deleteVendor(id)
      // console.log('Delete', bank._id)
      break
  }
}

const currentPage = computed(() => {
  return vendorListStore.currentPage
})
const totalPages = computed(() => {
  return vendorListStore.totalPages
})

const paginationItems = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push({ type: 'page', value: i })
  }
  return pages
})

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',})

onMounted(async () => {
  // useGeneralStore().setLoading(true);
  fetchVendors()
})
</script>

<template>
  <div class="flex-col flex bg-[#f0f8ff] min-h-[400px] px-4 sm:px-10 pb-10">
    <MainNav class="md:mx-6" headingText="" /> 
        <div class="flex items-center text-xl mx-4 md:mx-10 md:text-3xl mb-4 -mt-8">
      <RouterLink :to="{name: 'user'}" class="text-gray-500">User</RouterLink>
      <Icon icon="tabler:chevron-right" width="22px" height="22px" class="ml-1 pt-1"/>
      <RouterLink :to="{name: 'vendors'}">Vendors</RouterLink>
    </div>
    <div class="px-10 py-10 ml-auto">
      <Sheet :close="sheetOpen">
        <SheetTrigger as-child>
          <button @click="sheetOpen = true" class="bg-[#020721] px-4 py-2 rounded-xl w-50 h-12">
            <div class="text-base text-[#F8F9FF] text-center flex items-center">
              Add New Vendor
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
              <!-- RC Number -->
              <FormField v-slot="{ componentField }" name="rcNumber">
                <FormItem v-auto-animate>
                  <FormLabel class="text-blue-900">RC Number</FormLabel>
                  <FormControl>
                    <Input
                      id="rcNumber"
                      type="number"
                      placeholder="Enter RC Number"
                      class="focus-visible:ring-blue-600"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage for="rcNumber" />
                </FormItem>
              </FormField>

              <!-- Company Name -->
              <FormField v-slot="{ componentField }" name="companyName">
                <FormItem v-auto-animate>
                  <FormLabel class="text-blue-900">Company Name</FormLabel>
                  <FormControl>
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="e.g. NIG (THE) CHEMICAL INDUSTRIES NIG LTD"
                      class="focus-visible:ring-blue-600"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage for="companyName" />
                </FormItem>
              </FormField>

              <!-- Company Type -->
              <FormField v-slot="{ componentField }" name="companyType">
                <FormItem v-auto-animate>
                  <FormLabel class="text-blue-900">Company Type</FormLabel>
                  <FormControl>
                    <Select v-bind="componentField" id="companyType">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Company Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          v-for="company in companyTypes"
                          :value="company.value"
                          :key="company.name"
                          class="flex justify-center items-center gap-2"
                        >
                          {{ company.name }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage for="companyType" />
                </FormItem>
              </FormField>

              <!-- Company Email -->
              <FormField v-slot="{ componentField }" name="companyEmail">
                <FormItem v-auto-animate>
                  <FormLabel class="text-blue-900">Company Email</FormLabel>
                  <FormControl>
                    <Input
                      id="companyEmail"
                      type="email"
                      placeholder="company@example.com"
                      class="focus-visible:ring-blue-600"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage for="companyEmail" />
                </FormItem>
              </FormField>

              <!-- Company Address -->
              <FormField v-slot="{ componentField }" name="companyAddress">
                <FormItem v-auto-animate>
                  <FormLabel class="text-blue-900">Company Address</FormLabel>
                  <FormControl>
                    <Textarea
                      id="companyAddress"
                      placeholder="Enter Company Address"
                      class="focus-visible:ring-blue-600"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage for="companyAddress" />
                </FormItem>
              </FormField>

              <!-- Company State -->
              <FormField v-slot="{ componentField }" name="companyState">
                <FormItem v-auto-animate>
                  <FormLabel class="text-blue-900">Company State</FormLabel>
                  <FormControl>
                    <Input
                      id="companyState"
                      type="text"
                      placeholder="e.g. Lagos"
                      class="focus-visible:ring-blue-600"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage for="companyState" />
                </FormItem>
              </FormField>

              <!-- Status -->
              <FormField v-slot="{ componentField }" name="status">
                <FormItem v-auto-animate>
                  <FormLabel class="text-blue-900">Status</FormLabel>
                  <FormControl>
                    <Select v-bind="componentField" id="status">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="drafted">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage for="status" />
                </FormItem>
              </FormField>

              <!-- Invite Section -->
              <h5 class="text-blue-900 text-sm font-semibold mt-6 mb-2">Invite Details</h5>

              <!-- First Name -->
              <FormField v-slot="{ componentField }" name="invite.firstName">
                <FormItem>
                  <FormLabel class="text-blue-900">First Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="First Name"
                      v-bind="componentField"
                      class="focus-visible:ring-blue-600"
                    />
                  </FormControl>
                  <FormMessage for="invite.firstName" />
                </FormItem>
              </FormField>

              <!-- Last Name -->
              <FormField v-slot="{ componentField }" name="invite.lastName">
                <FormItem>
                  <FormLabel class="text-blue-900">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Last Name"
                      v-bind="componentField"
                      class="focus-visible:ring-blue-600"
                    />
                  </FormControl>
                  <FormMessage for="invite.lastName" />
                </FormItem>
              </FormField>

              <!-- Invite Email -->
              <FormField v-slot="{ componentField }" name="invite.email">
                <FormItem>
                  <FormLabel class="text-blue-900">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Invitee's Email"
                      v-bind="componentField"
                      class="focus-visible:ring-blue-600"
                    />
                  </FormControl>
                  <FormMessage for="invite.email" />
                </FormItem>
              </FormField>

              <!-- Phone Number -->
              <div>
                <h5 class="text-blue-900 text-sm font-medium mb-3">Phone Number</h5>
                <div class="flex gap-2">
                  <FormField v-slot="{ componentField }" name="invite.countryCode">
                    <FormItem>
                      <FormControl>
                        <Select
                          v-bind="componentField"
                          id="gender"
                          class="bg-gray-50 w-auto mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        >
                          <SelectTrigger class="">
                            <SelectValue placeholder="+234" />
                          </SelectTrigger>
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
                                  'https://flagcdn.com/16x12/' + code.code.toLowerCase() + '.png'
                                "
                                alt="gradient"
                              />
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage for="invite.countryCode" />
                    </FormItem>
                  </FormField>

                  <FormField v-slot="{ componentField }" name="invite.phoneNumber">
                    <FormItem class="flex-1">
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Phone Number"
                          v-bind="componentField"
                          class="focus-visible:ring-blue-600"
                        />
                      </FormControl>
                      <FormMessage for="invite.phoneNumber" />
                    </FormItem>
                  </FormField>
                </div>
              </div>

              <Button @click="onSubmit" type="submit" class="w-full mt-4">
                <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-white animate-spin" />
                Submit
              </Button>
            </form>
          </CardContent>
        </SheetContent>
      </Sheet>
    </div>

    <Card class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl">
      <div class="flex items-center justify-between px-6 py-4">
        <div class="text-2xl font-bold tracking-tight text-[#020721]">
          Vendors
          <p class="text-xs text-[#02072199] py-2">List of Weeshr Vendors</p>
        </div>
        <Search class="mt-3 lg:mt-0" @search="(query: string) => (searchQuery = query)" />
      </div>

      <div class="overflow-auto bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow
              class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
            >
              <TableHead> Vendor </TableHead>
              <TableHead> Vendor Type</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Onboarded</TableHead>
              <TableHead> RC Number </TableHead>
              <TableHead>Status</TableHead>
              <TableHead> Actions </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="vendor in filteredVendors" :key="vendor._id">
              <TableCell class="font-medium">{{ vendor.companyName }}</TableCell>
              <TableCell class="font-medium">{{ vendor.companyType }}</TableCell>
              <TableCell>{{ vendor.companyEmail }}</TableCell>
              <TableCell>{{ vendor.createdAt.split('T')[0] }}</TableCell>
              <TableCell>{{ vendor.rcNumber }}</TableCell>
              <TableCell>
                <button
                  :class="{
                    'bg-[#00C37F]': vendor.status === 'published',
                    'bg-[#020721]': vendor.status !== 'published'
                  }"
                  class="px-4 py-2 text-sm text-white rounded-md"
                >
                  {{ vendor.status === 'published' ? 'Active' : 'Inactive' }}
                </button>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <button
                      class="p-2 rounded-full hover:bg-gray-200 transition"
                    >
                      <Icon icon="mdi:dots-vertical" width="20" height="20" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent class="w-40">
                    <DropdownMenuItem @click="handleAction('invite', vendor._id, vendor.companyName)">
                      <Icon icon="uil:eye" class="mr-2" /> View Invite
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem class="text-red-600" @click="handleAction('deleteModal', vendor._id)">
                      <Icon icon="mi:delete" class="mr-2" /> Delete
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem class="bg-red-600 text-white" @click="handleAction('pDeleteModal', vendor._id)">
                      <Icon icon="mi:delete" class="mr-2" /> Permanantely Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>
                <router-link :to="`/user/vendors/${vendor._id}`">
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
              <AlertDialog :open="deleteModal" >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone..
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel @click="deleteModal = false">Cancel</AlertDialogCancel>
                    <Button @click="deleteVendor()" class="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
               <AlertDialog :open="pDeleteModal" >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this vendor
                      account and remove its data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div>
                    <Label class="flex flex-col space-x-2 px-6">
                      To continue, input the phrase 'I understand' below:
                      <Input
                        type="text"
                        v-model="understand"
                        placeholder="Type 'I understand' to confirm"
                        class="w-full rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <!-- <span class="text-sm text-gray-700">
                        I understand that this action cannot be undone.
                      </span> -->
                    </Label>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel @click="pDeleteModal = false">Cancel</AlertDialogCancel>
                    <Button :disabled="!understand || understand.toLowerCase() !== 'i understand'" @click="permanentlyDeleteVendor()" class="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div
        class="flex gap-2 max-w-full flex-wrap justify-end mt-8 mr-4 items-center text-[15px]"
        v-if="vendorListStore.vendors.length !== 0"
      >
        <Pagination
          :total="totalPages"
          :sibling-count="1"
          show-edges
          :default-page="1"
          @change="vendorListStore.handlePageChange"
        >
          <PaginationList class="flex items-center gap-1">
            <PaginationFirst @click="vendorListStore.handlePageChange(1)" />
            <PaginationPrev
              @click="vendorListStore.handlePageChange(Math.max(currentPage - 1, 1))"
            />
            <template v-for="(item, index) in paginationItems" :key="index">
              <PaginationListItem v-if="item.type === 'page'" :value="item.value" as-child>
                <Button
                  class="w-10 h-10 p-0"
                  :variant="item.value === currentPage ? 'default' : 'outline'"
                  @click="vendorListStore.handlePageChange(item.value)"
                >
                  {{ item.value }}
                </Button>
              </PaginationListItem>
              <PaginationEllipsis v-else :index="index" />
            </template>
            <PaginationNext
              @click="vendorListStore.handlePageChange(Math.min(currentPage + 1, totalPages))"
            />
            <PaginationLast @click="vendorListStore.handlePageChange(totalPages)" />
          </PaginationList>
        </Pagination>
      </div>

      <Dialog :open="viewInviteModal">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{{ currentVendor }} Invite Details</DialogTitle>
            <DialogDescription>
              Invitation information
            </DialogDescription>
          </DialogHeader>
          <div class="w-full mx-auto mt-10 font-sans">
            <!-- Loading -->
            <div
              v-if="vendorLoading"
              class="flex flex-col items-center justify-center gap-3 py-12"
            >
              <div class="spinner"></div>
              <p class="text-sm text-gray-500">Fetching vendor data…</p>
            </div>

            <!-- Error -->
            <div
              v-else-if="error"
              class="rounded-xl border border-red-200 bg-red-50 p-6 text-center"
            >
              <p class="mb-1 font-semibold text-red-700">Something went wrong</p>
              <p class="text-sm text-red-600">{{ error }}</p>
            </div>

            <!-- Data -->
            <div
              v-else
              class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5"
            >
              <!-- Header -->
              <div class="mb-4 flex items-start justify-between">
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    {{ vendor?.firstName }} {{ vendor?.lastName }}
                  </h2>

                  <span
                    class="mt-1 inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium"
                    :class="
                      vendor?.acceptedAt
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    "
                  >
                    {{ vendor?.acceptedAt ? 'Invite Accepted' : 'Invite Pending' }}
                  </span>
                </div>
              </div>

              <!-- Details -->
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Email</span>
                  <span class="text-gray-900">{{ vendor?.email }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-500">Phone</span>
                  <span class="text-gray-900">
                    +{{ vendor?.phoneNumber.countryCode }}
                    {{ vendor?.phoneNumber.phoneNumber }}
                  </span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-500">Vendor ID</span>
                  <span class="text-gray-900">{{ vendor?.vendorId }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-500">Invited By</span>
                  <span class="text-gray-900">{{ vendor?.invitedBy }}</span>
                </div>

                <div
                  v-if="vendor?.acceptedAt"
                  class="flex justify-between"
                >
                  <span class="text-gray-500">Accepted At</span>
                  <span class="text-gray-900">
                    {{ formatDate(vendor?.acceptedAt) }}
                  </span>
                </div>

                <div v-if="vendor?.acceptedAt" class="flex justify-between text-xs text-gray-400 pt-2">
                  <span>Created</span>
                  <span>{{ formatDate(vendor?.createdAt || '') }}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose @click="()=> viewInviteModal = false">Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  </div>
</template>
<style scoped>
/* Spinner is easier in CSS than Tailwind gymnastics */
.spinner {
  width: 36px;
  height: 36px;
  border: 4px solid #e5e7eb;
  border-top-color: #00C37F;
  border-radius: 9999px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
@/stores/super-admin/super-admin@/stores/super-admin/super-admin