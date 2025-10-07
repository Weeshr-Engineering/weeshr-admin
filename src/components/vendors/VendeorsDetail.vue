<script setup lang="ts">
import { ref, watch, reactive, onMounted, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardDescription, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableHead,
  TableCell
} from '@/components/ui/table'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
// import {
//   getUser,
//   getUserLog,
//   getUserWallet,
//   getUserWalletList,
//   getUserWeeshes,
//   getUserPayout
// } from '@/composables/getUser'
import { useRoute } from 'vue-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import type { Weeshes } from '@/composables/getUser'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { Filter } from '@/composables/getUser'
import CardContent from '@/components/ui/card/CardContent.vue'
import PagePagination from '@/components/PagePagination.vue'
import PaymentApproval from '@/components/PaymentApproval.vue'
import axios from '@/services/ApiService'
import { toast } from '@/components/ui/toast'
import { useUserhubStore } from '@/stores/userhub-details/userhub-details'
import { ability, defineAbilities, verifyAbilities } from '@/lib/ability'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
// import CountryCodes from '@/lib/CountryCodes'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { catchErr } from '@/composables/catchError'
import VendorNav from '@/components/VendorNav.vue'
import { Badge } from '@/components/ui/badge'
import { Label } from '../ui/label'

defineAbilities()
const update = true//ability.can('update', 'users')
const editStyle = computed(() => {
  return update ? 'flex' : 'flex cursor-not-allowed opacity-20'
})

interface Resource {
  asset_id: string
  secure_url: string
}

interface CoverImage {
  resource: Resource
}

interface Logo {
  resource: Resource
}

interface PhoneNumber {
  normalizedNumber: string
}

interface WorkingDay {
  day: string
  time: string
  active: boolean
}

interface WorkingHours {
  scheduled: boolean
  generalTime: string
  days: WorkingDay[]
}

interface AppUser {
  id: string
  firstName: string
  middleName: string | null
  lastName: string
  userName: string
  coverImg: CoverImage
  logo: Logo
  phoneNumber: PhoneNumber
  onboarded: string
  policyLink: string
  productCategory: string[]
  deliveryCoverage: string[]
  deliveryType: string
  deliveryTime: string
  maxDeliveryCost: number
  workingHours: WorkingHours
  bankName: string
  accountNumber: string
  payoutFrequency: string
  accountVerified: boolean
  rcNumber: string
  companyName: string
  companyType: string
  comanyEmail: string
  companyAddress: string
  companyState: string
  dob: string
  gender: string
  email: string
  isLive: boolean
}
//get User

const appUser = ref<AppUser>({
  id: '011',
  firstName: "Ruby",
  middleName: null,
  lastName: "Stone",
  userName: "ruby.dev",
  coverImg: {
      resource: {
        asset_id: "img12345",
        secure_url: "https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg",
      },
  },
  logo: {
    resource: {
      asset_id: "img12345",
      secure_url: "https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg",
    },
  },
  phoneNumber: {
    normalizedNumber: "+2348012345678",
  },
  onboarded: '1995-05-12',
  policyLink: 'https://google.com',
  productCategory: [''],
  deliveryCoverage: [''],
  deliveryType: '',
  deliveryTime: '1hr',
  maxDeliveryCost: 3000,
  workingHours: {
    scheduled: true,
    generalTime: '9-6',
    days: [
      {
        day: 'Monday',
        time: '9-6',
        active: true
      },
      {
        day: 'Tuesday',
        time: '9-6',
        active: true
      },
      {
        day: 'Wednesday',
        time: '9-6',
        active: true
      },
      {
        day: 'Thursday',
        time: '9-6',
        active: true
      },
      {
        day: 'Friday',
        time: '9-6',
        active: true
      },
      {
        day: 'Saturday',
        time: '9-6',
        active: true
      },
      {
        day: 'Sunday',
        time: '9-6',
        active: true
      },
    ],
  },
  bankName: 'First Bank',
  accountNumber: '3133386728',
  payoutFrequency: 'Weekly',
  accountVerified: false,
  rcNumber: 'RC1838790',
  companyName: 'Dang!',
  companyType: 'Limited Liability Company',
  comanyEmail: 'danglimited@gmail.com',
  companyAddress: 'No. 51, Briswood Ipaja Rd, Ikeja',
  companyState: 'Lagos',
  dob: "1995-05-12",
  gender: "male",
  email: "ruby.stone@example.com",
  isLive: true
})

const scheduled = ref(true)
const handleScheduled = ()=>{
  scheduled.value = !scheduled.value
}

const status = ref(true)
const togglePrivacy = async (val: boolean) => {

  try {
    appUser.value = {...appUser.value, isLive: val}
    // const response = await axios.post(`/api/v1/admin/accounts/users/${_id}/profile-privacy`, data)

    // if (response.data.code === 200 || response.data.code === 201) {
    //   // appUser.value = response.data.data
    //   toast({
    //     description: response.data.message,
    //     variant: 'success'
    //   })
    // //   load(_id)
    // }
    status.value= !status.value
  } catch (err: any) {
    // store.catchErr(error)
    // console.log(error);
  }
}

const dateFormat = (dob: string, time?: string): string => {
  const date = new Date(dob)

  const day = String(date.getUTCDate()).padStart(2, '0')

  const monthNames = [
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
  const month = monthNames[date.getUTCMonth()]
  const year = date.getUTCFullYear()

  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')

  const formattedDate = `${day} - ${month} - ${year}`
  const formattedTime = `${hours}:${minutes}:${seconds}`

  const formattedDateTime = `${formattedDate} at ${formattedTime}`

  if (time) {
    return formattedDateTime
  }
  return formattedDate
}

function removeUndefinedKeys<T extends Record<string, any>>(obj: T): Partial<T> {
  // Create a new object to store the filtered keys
  const filteredObject: Partial<T> = {}

  // Iterate through the keys of the input object
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Copy the key-value pair if the value is not undefined
      if (obj[key] !== undefined) {
        filteredObject[key] = obj[key]
      }
    }
  }

  return filteredObject
}

const editProfile = async (values: any) => {
  const adminData = removeUndefinedKeys(values)
}

// const toggleDayActive = (key: string) => {
//   appUser.value.workingHours.days[key].active = 
//   !appUser.value.workingHours.days[key].active
// }

const toggleDayActive = (index: number) => {
  appUser.value.workingHours.days[index].active =
    !appUser.value.workingHours.days[index].active
}

const editDetails = (param: keyof typeof appUser.value, val: string | number | boolean)=>{
  appUser.value = {...appUser.value, [param]: val}
}

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
    userName: z
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
    // phone: z
    //   .string()
    //   .min(10, { message: 'Phone number must be 10 characters' })
    //   .max(10, { message: 'Phone number must be 10 characters' })
    //   .optional(),
    // countrycode: z.string().optional(),
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

const frequency = ['Daily', 'Weekly', 'Monthly', 'Yearly']
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
</script>

<template>
  <div class="max-h-screen h-screen">
    <VendorNav class="mx-6" heading-text="Profile"/>
  <!-- <div v-if="!appUser">
    <LoadingSpinner />
  </div> -->
    <div class="flex-col lg:flex lg:flex-row gap-1 px-8 mt-9">
      <Card class="lg:w-4/12 bg-[#F8F9FF] sm:items-center shadow-xl">
        <CardHeader>
          <h1 class="font-semibold text-lg">Dang!</h1>
          <CardDescription>
            <div v-if="appUser">
              <h6 class="font-semibold text-primary">Business Logo</h6>
              <div class="mt-2 flex items-center justify-between relative">
                  <div class="ghost w-20 h-20 rounded-xl">

                  </div>
                  <div class="h-full flex items-end justify-end p-2">
                      <Badge variant="outline" class="badge absolute bottom-0 right-2 rounded-full">
                          Upload
                      </Badge>
                  </div>
              </div>
              <div class="border-t border-b pt-6 pb-4 mt-4">
                <h6 class="font-semibold text-primary">Business Cover Image</h6>
                <div class="mt-2">
                    <div class="ghost w-full h-28 rounded-xl relative">
                        <Badge variant="outline" class="badge absolute bottom-2 right-2 rounded-full">
                            Upload
                        </Badge>
                    </div>
                </div>
              </div>            
            </div>
            <div>
              <div class="flex justify-between pt-4">
                <span class="text-base font-bold lg:text-base text-[#020721]">Identity</span>
              </div>
              <div
                class="grid grid-cols-3 py-2 mb-2"
              >
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Username</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">
                  {{ appUser.firstName }} {{ appUser.middleName }} {{ appUser.lastName }}
                </p>
              </div>
              <div
                class="grid grid-cols-3 py-2 my-2 border-t border-b relative"
              >
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Password</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">********</p>
                <Badge variant="outline" class="badge absolute bottom-2 right-2 rounded-full">
                    Change
                </Badge>
              </div>
              <div
                class="grid grid-cols-3 py-2 my-2"
              >
                <p class="flex grow text-[#02072199] text-xs md:text-sm lg:text-sm">Onboarded</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">
                  {{ dateFormat(appUser.dob) }}
                </p>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-base font-bold lg:text-base text-[#020721]">Profile Status</span>
              </div>
              <div
                class="flex justify-between rounded-md w-full"
              >
                <label
                  class="relative inline-flex cursor-pointer items-center w-full"
                  @click="() => editDetails('isLive', !appUser.isLive)"
                >
                  <input
                    type="checkbox"
                    value=""
                    :checked="appUser.isLive"
                    disabled
                    class="peer sr-only"
                  />
                  <div
                    class="peer flex h-10 w-full items-center gap-6 rounded-md bg-[#F6F6F6] text-black after:absolute after:left-1 after:h-8 after:w-[49%] after:rounded-md after:bg-slate-700 after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-focus:outline-none dark:border-[#F6F6F6] dark:bg[#F6F6F6] text-sm peer-checked:text-white justify-between px-[20%] py-4 -mr-2"
                  >
                    <span :class="appUser.isLive ? 'text-[#020721] z-30' : 'text-white z-30'">Draft</span>
                    <span :class="!appUser.isLive ? 'text-[#020721] z-30' : 'text-white z-30'">Live</span>
                  </div>
                </label>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>

      <Card class="px-2 py-4 w-full lg:w-8/12 rounded-xl shadow-md overflow-y-scroll">
        <Tabs default-value="bio" class="space-y-2">
          <TabsList class="w-full bg-transparent">
            <TabsTrigger
              value="bio"
              class="text-[#000000] data-[state=active]:border-[#6A70FF]"
            >
              Bio Data
            </TabsTrigger>
            <TabsTrigger
              value="product"
              class="text-[#000000] data-[state=active]:border-[#6A70FF]"
            >
              Product Ops
            </TabsTrigger>
            <!-- <TabsTrigger value="support" class="text-[#000000] data-[state=active]:border-[#6A70FF]"
              >Support
            </TabsTrigger> -->
            <TabsTrigger
              value="financial"
              class="text-[#000000] data-[state=active]:border-[#6A70FF]"
            >
              Financial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bio" class="">
            <div class="p-4 space-y-2">
              <div class="w-full flex items-center justify-between mb-4">
                <h1 class="text-lg font-medium">Business Information</h1>
              </div>
              <div class="grid md:grid-cols-8 gap-2 md:gap-8">
                <div class="md:col-span-3">
                  <Label class="px-2">RC Number</Label>
                  <Input class="ghost"/>
                </div>
                <div class="md:col-span-5 ">
                  <Label class="px-2">Company Name</Label>
                  <Input class="ghost"/>
                </div>
              </div>
              <div class="grid md:grid-cols-8 gap-2 md:gap-8">
                <div class="md:col-span-3">
                  <Label class="px-2">Company Type</Label>
                  <Input class="ghost"/>
                </div>
                <div class="md:col-span-5 ">
                  <Label class="px-2">Company Email</Label>
                  <Input class="ghost"/>
                </div>
              </div>
              <div class="grid md:grid-cols-8 gap-2 md:gap-8">
                <div class="md:col-span-5">
                  <Label class="px-2">Address</Label>
                  <Input class="ghost"/>
                </div>
                <div class="md:col-span-3 ">
                  <Label class="px-2">State</Label>
                  <Input class="ghost"/>
                </div>
              </div>
              <div class="w-full flex items-center justify-between pt-8">
                <h1 class="text-lg font-medium">Contact Person</h1>
                <Button class="border-2 border-[#020721] text-[#020721] rounded-full px-4 md:px-8 py-2 flex items-center gap-2" variant="outline">
                  Edit                  
                  <Icon
                    icon="mage:edit"
                    class="text-[#020721] font-bold"
                    width="20"
                    height="20"
                  />
                </Button>
              </div>
              <div class="grid md:grid-cols-8 gap-2 md:gap-8">
                <div class="md:col-span-4">
                  <Label class="px-2">First Name</Label>
                  <Input class="ghost"/>
                </div>
                <div class="md:col-span-4 ">
                  <Label class="px-2">Last Name</Label>
                  <Input class="ghost"/>
                </div>
              </div>
              <div class="grid md:grid-cols-8 gap-2 md:gap-8">
                <div class="md:col-span-5">
                  <Label class="px-2">Email</Label>
                  <Input class="ghost"/>
                </div>
                <div class="md:col-span-3 ">
                  <Label class="px-2">Phone Number</Label>
                  <Input class="ghost"/>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="product" class="space-y-4">
            <div class="p-4">
              <div class="w-full flex items-center justify-between mb-4">
                <h1 class="text-lg font-medium">Product & Operation</h1>
              </div>
              <div class="grid md:grid-cols-8 gap-2 md:gap-8">
                <div class="md:col-span-8">
                  <Label class="px-2">Product Category</Label>
                  <Input class="ghost"/>
                </div>
              </div>
              <div class="grid grid-cols-8 gap-2 md:gap-8 my-2 md:my-4 w-full">
                <div class="col-span-8 md:col-span-3 w-full">
                  <Label class="px-2">Delivery Coverage</Label>
                  <Select
                    id="gender"
                    class="bg-gray-900 w-auto mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  >
                      <SelectTrigger class="">
                        <SelectValue placeholder="Weekly" />
                      </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="(code, key) in frequency"
                        :value="code"
                        :key="key"
                        class="flex justify-center items-center gap-2"
                      >
                        {{ code }}                        
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="col-span-8 md:col-span-5 w-full">
                  <Label class="px-2">Delivery Logistics Type</Label>
                  <Select
                    id="gender"
                    class="bg-gray-900 w-auto mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  >
                      <SelectTrigger class="">
                        <SelectValue placeholder="Weekly" />
                      </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="(code, key) in frequency"
                        :value="code"
                        :key="key"
                        class="flex justify-center items-center gap-2"
                      >
                        {{ code }}                        
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div class="grid grid-cols-12 gap-2 md:gap-8 my-2 md:my-4">
                <div class="col-span-12 md:col-span-4">
                  <Label class="px-2">Average Delivery Timeframe</Label>
                  <Select
                    id="gender"
                    class="bg-gray-900 w-auto mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  >
                      <SelectTrigger class="">
                        <SelectValue placeholder="Weekly" />
                      </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="(code, key) in frequency"
                        :value="code"
                        :key="key"
                        class="flex justify-center items-center gap-2"
                      >
                        {{ code }}                        
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="col-span-12 md:col-span-4">
                  <Label class="px-2">Max. Delivery Cost</Label>
                  <Input class="ghost" value="0.00" readonly/>
                </div>
                <div class="col-span-12 md:col-span-4">
                  <Label class="px-2">Link to Return Policy</Label>
                  <Input class="ghost w-full"/>
                </div>
              </div>
              <div class="w-full flex flex-col md:flex-row md:items-center justify-between pt-8 pb-4">
                <h1 class="text-lg font-medium">Working Hours</h1>
                <div class="w-48 mt-2 md:mt-0">
                  <label
                    class="relative w-full justify-between inline-flex cursor-pointer items-center"
                    @click="handleScheduled"
                  >
                    <input
                      type="checkbox"
                      value=""
                      :checked="scheduled"
                      disabled
                      class="peer sr-only"
                    />
                    <div
                      class="peer flex border h-8 items-center gap-6 justify-between rounded-full px-4 text-black after:absolute after:left-1 after: after:h-6 after:w-[48%] after:rounded-full after:bg-slate-700 after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-focus:outline-none dark:border-slate-600 text-sm peer-checked:text-white w-full"
                    >
                      <span :class="scheduled ? 'text-[#020721] z-30' : 'text-white z-30'">Scheduled</span>
                      <span :class="!scheduled ? 'text-[#020721] z-30' : 'text-white z-30'">24hrs</span>
                    </div>
                  </label>
                </div>
              </div>
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-6 md:col-span-3" v-for="(day, key) in days" :key="key">
                  <Label class="px-2 my-1 w-full flex items-center justify-between">
                    <p>{{ day }} </p>
                    <Switch 
                    :checked="appUser.workingHours.days[key].active" :disabled="scheduled"
                    @click="toggleDayActive(key)"
                    />
                    <!-- <Switch :checked="!scheduled" :disabled="scheduled"/> -->
                  </Label>
                  <Input :id="'input'+day" class="ghost" placeholder="9:00am - 6:00pm" readonly :disabled="day === 'Saturday' || day === 'Sunday'"/>
                </div>
              </div>
            </div>
          </TabsContent>

          <!-- <TabsContent value="support" class="space-y-4"> </TabsContent> -->

          <TabsContent value="financial" class="space-y-4">
            <div class="px-4 py-2">
              <div class="w-full flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h1 class="text-lg font-medium">Bank Details</h1>
                <Button class="border-2 mt-2 md:mt-0 border-[#020721] text-[#020721] rounded-full px-4 md:px-8 py-2 flex items-center gap-2" variant="outline">
                  Verify Account
                  <Icon
                    icon="mdi:minus-box-outline"
                    class="verified-icon text-[#020721]"
                    width="20"
                    height="20"
                  />
                </Button>
              </div>
              <div class="grid md:grid-cols-8 gap-2 md:gap-8">
                <div class="md:col-span-5">
                  <Label class="px-2">Bank Name</Label>
                  <Input class="ghost"/>
                </div>
                <div class="md:col-span-3 ">
                  <Label class="px-2">Account Number</Label>
                  <Input class="ghost"/>
                </div>
              </div>
              <div class="grid md:grid-cols-8 gap-2 md:gap-8 my-2 md:my-4">
                <div class="md:col-span-3">
                  <Label class="px-2">Payout Frequency</Label>
                  <Select
                    id="gender"
                    class="bg-gray-900 w-auto mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  >
                      <SelectTrigger class="">
                        <SelectValue placeholder="Weekly" />
                      </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="(code, key) in frequency"
                        :value="code"
                        :key="key"
                        class="flex justify-center items-center gap-2"
                      >
                        {{ code }}                        
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.ghost{
    background-color: #F6F6F6;
}
.timeline::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 98%;
  background: rgb(255, 255, 255);
  background: linear-gradient(132deg, rgba(255, 255, 255, 1) 1%, rgba(186, 239, 35, 1) 58%);
  top: 0;
  left: 5%;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.badge {
    border-color: #6A70FF;
    color: #6A70FF;
}

.verified-icon {
  --icon-background: green; /* spiky circle color */
  --icon-check: white; /* tick color */
}

.verified-icon > svg path:nth-of-type(1) {
  fill: var(--icon-background);
}

.verified-icon > svg path:nth-of-type(2) {
  fill: var(--icon-check);
}

.mainc {
  color: #020721;
}
</style>


<!-- icon-park-outline:transaction-order  -- order -->
 <!-- ph:stack-bold  - products -->
  <!-- jam:ticket   -- Promotions -->
   <!-- ci:building-04  -- profile -->
    <!-- streamline-ultimate:like-chat  --  support -->