<script setup lang="ts">
import { ref, watch, reactive, onMounted, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardDescription, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useRoute } from 'vue-router'
import axios from '@/services/ApiService'
import { toast } from '@/components/ui/toast'
import { ability, defineAbilities, verifyAbilities } from '@/lib/ability'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
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
const route = useRoute()
const id = route.params.id
const isVendor = ref(true);
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

interface UploadResponse {
  public_id: string
  version: number
  signature: string
  api_key: string
  asset_id: string
  bytes: number
  created_at: string
  etag: string
  folder: string
  format: string
  height: number
  original_filename: string
  placeholder: boolean
  resource_type: string
  secure_url: string
  tags: string[]
  type: string
  url: string
  version_id: string
  width: number
}

interface Vendor {
   logo: UploadResponse | null;
  cover: UploadResponse | null;
  rcNumber: number;
  companyName: string;
  companyType: string;
  companyEmail: string;
  companyAddress: string;
  companyState: string;
  status: 'draft' | 'published' | 'archived' | string;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
//get User
const vendor = ref<Vendor>()
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

const fileInput = ref<HTMLInputElement | null>(null)
const bgFileInput = ref<HTMLInputElement | null>(null)
const imageFile = ref<File | null>(null)
const bgImageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const bgImagePreview = ref<string | null>(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}


const triggerBgFileInput = () => {
  bgFileInput.value?.click()
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file) // preview
}
const handleBgFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  bgImageFile.value = file
  bgImagePreview.value = URL.createObjectURL(file) // preview
}

const status = ref(true)

const statusVal = ref('Suspended') // default state
const isEdit = ref(false)

const cycleStatus = () => {
  if (statusVal.value === 'Suspended') statusVal.value = 'Draft'
  else if (statusVal.value === 'Draft') statusVal.value = 'Live'
  else statusVal.value = 'Suspended'

  // Optional: call backend update
  // editDetails('status', status.value)
}

const fetchUsersData = async (msg: string) => {
  toast({
    title: 'Loading Data',
    description: 'Fetching data...',
    duration: 0 // Set duration to 0 to make it indefinite until manually closed
  })

  try {
    // Set loading to true
    // useGeneralStore().setLoading(true)
    const response = await axios.get(`/api/v1/market/vendor/${id}`)

    if (response.status === 200 || response.status === 201) {
      // Update the users data with the response
      // console.log(response)
      vendor.value = response.data.data;
      // const responseData = response.data.data[0]
      // const phoneData = response.data.data[0].phoneNumber.normalizedNumber
      // const data = { ...responseData, phone: phoneData }
      // Show success toast
      toast({
        title: 'Success',
        description: `Success- ${msg}`,
        variant: 'success'
      })
    }
    // set Loading to false
    // useGeneralStore().setLoading(false)
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
} // Call the fetchUsersData function when the component is mounted

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

const categories = [
  {
    title: "Food",
    image:
      "https://res.cloudinary.com/drykej1am/image/upload/v1757806163/weeshr-marketplace/food_c2n9cf.png",
    color: "bg-[#C6F4EB]",
  },
  {
    title: "Fashion",
    image:
      "https://res.cloudinary.com/drykej1am/image/upload/v1757806164/weeshr-marketplace/fashion_hl0xe1.png",
    color: "bg-[#DCDEFF]",
  },
  {
    title: "Gadgets",
    image:
      "https://res.cloudinary.com/drykej1am/image/upload/v1757806163/weeshr-marketplace/gadget_rzmwyw.png",
    color: "bg-[#E9F4D1]",
  },
  {
    title: "Lifestyle",
    image:
      "https://res.cloudinary.com/drykej1am/image/upload/v1757806163/weeshr-marketplace/style_nqxqv7.png",
    color: "bg-[#C6EDF6]",
  }
]

onMounted(() => {
  fetchUsersData('data fetched')
})
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
                  <div class="ghost w-20 h-20 rounded-xl"
                    :style="{ backgroundImage: vendor?.logo?.secure_url ? vendor.logo?.secure_url : imagePreview ? `url(${imagePreview})` : 'none' }"
                  >

                  </div>
                  <div class="h-full flex items-end justify-end p-2">
                      <Badge @click="triggerFileInput" variant="outline" class="badge absolute bottom-0 right-2 rounded-full">
                          {{ vendor?.logo?.secure_url ? 'Change' : 'Upload' }}
                      </Badge>
                      <input 
                        type="file"
                        accept="image/*"
                        ref="fileInput"
                        @change="handleFileChange"
                        class="hidden"
                      />
                  </div>
              </div>
              <div class="border-t border-b pt-6 pb-4 mt-4">
                <h6 class="font-semibold text-primary">Business Cover Image</h6>
                <div class="mt-2">
                    <div class="ghost w-full h-28 rounded-xl relative"
                      :style="{ backgroundImage: vendor?.cover?.secure_url ? vendor.cover.secure_url : bgImagePreview ? `url(${bgImagePreview})` : 'none' }"
                    >
                        <Badge @click="triggerBgFileInput" variant="outline" class="badge absolute bottom-2 right-2 rounded-full">
                            {{ vendor?.cover?.secure_url ? 'Change' : 'Upload' }}
                        </Badge>
                        <input 
                          type="file"
                          accept="image/*"
                          ref="bgFileInput"
                          @change="handleBgFileChange"
                          class="hidden"
                        />
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
                <p class="text-xs col-span-2 md:text-sm lg:text-sm text-[#020721]">
                  {{ vendor?.createdAt && dateFormat(vendor?.createdAt.toString()) }}
                </p>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-base font-bold lg:text-base text-[#020721]">Profile Status</span>
                <Switch v-if="!isVendor"/>
              </div>
              <div
                v-if="vendor?.status && isVendor"
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
                    <span :class="vendor?.status === 'published' ? 'text-[#020721] z-30' : 'text-white z-30'">Draft</span>
                    <span :class="vendor?.status !== 'published' ? 'text-[#020721] z-30' : 'text-white z-30'">Live</span>
                  </div>
                </label>
              </div>
              <div v-if="!isVendor" class="flex justify-between rounded-md w-full">
                <label
                  class="relative inline-flex cursor-pointer items-center w-full"
                  @click="cycleStatus"
                >
                  <div
                    class="relative flex h-10 w-full items-center gap-6 rounded-md bg-[#F6F6F6] text-black justify-between px-[10%] py-4"
                  >
                    <!-- Sliding indicator -->
                    <div
                      class="absolute top-1 left-1 h-8 w-1/3 rounded-md bg-slate-700 transition-all duration-300"
                      :style="{
                        transform:
                          statusVal === 'Suspended'
                            ? 'translateX(0%)'
                            : statusVal === 'Draft'
                            ? 'translateX(100%)'
                            : 'translateX(200%)',
                      }"
                    ></div>

                    <!-- Labels -->
                    <span
                      :class="statusVal === 'Suspended' ? 'text-white z-30' : 'text-[#020721] z-30'"
                      >Suspended</span
                    >
                    <span
                      :class="statusVal === 'Draft' ? 'text-white z-30' : 'text-[#020721] z-30'"
                      >Draft</span
                    >
                    <span
                      :class="statusVal === 'Live' ? 'text-white z-30' : 'text-[#020721] z-30'"
                      >Live</span
                    >
                  </div>
                </label>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>

      <Card class="px-2 py-4 w-full lg:w-8/12 rounded-xl shadow-md overflow-y-scroll">
        <Tabs default-value="bio" class="space-y-2">
          <TabsList class="w-full bg-transparent flex items-center">
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
            <div class="p-4 w-1/3 flex items-center justify-end">
              <Button class="my-4" @click="()=> isVendor=!isVendor">
                Open Proxy Portal
              </Button>
            </div>
          </TabsList>

          <TabsContent value="bio" class="">
            <div class="p-4 space-y-2">
              <div class="w-full flex items-center justify-between mb-4">
                <h1 class="text-lg font-medium">Business Information</h1>
              </div>
              <div class="grid md:grid-cols-8 gap-2 md:gap-8">
                <div class="md:col-span-3">
                  <Label class="px-2">RC Number</Label>
                  <Input :value="vendor?.rcNumber" class="ghost" readonly disabled/>
                </div>
                <div class="md:col-span-5 ">
                  <Label class="px-2">Company Name</Label>
                  <Input :value="vendor?.companyName" class="ghost" readonly disabled />
                </div>
              </div>
              <div class="grid md:grid-cols-8 gap-2 md:gap-8">
                <div class="md:col-span-3">
                  <Label class="px-2">Company Type</Label>
                  <Input :value="vendor?.companyType" class="ghost" readonly disabled />
                </div>
                <div class="md:col-span-5 ">
                  <Label class="px-2">Company Email</Label>
                  <Input :value="vendor?.companyEmail" class="ghost" readonly disabled />
                </div>
              </div>
              <div class="grid md:grid-cols-8 gap-2 md:gap-8">
                <div class="md:col-span-5">
                  <Label class="px-2">Address</Label>
                  <Input :value="vendor?.companyAddress" class="ghost" readonly disabled />
                </div>
                <div class="md:col-span-3 ">
                  <Label class="px-2">State</Label>
                  <Input :value="vendor?.companyState" class="ghost" readonly disabled />
                </div>
              </div>
              <div class="w-full flex items-center justify-between pt-8">
                <h1 class="text-lg font-medium">Contact Person</h1>
                <div class="flex flex-col md:flex-row items-center gap-2">
                  <Button v-if="!isVendor" class="border-2 border-[#020721] text-[#020721] rounded-full px-4 md:px-8 py-2 flex items-center gap-2" variant="outline">
                    Send Invite                  
                    <Icon icon="mingcute:send-fill" class="text-[#020721] font-bold"
                      width="20"
                      height="20" />
                  </Button>
                  <Button @click="()=> isEdit=!isEdit" class="border-2 border-[#020721] text-[#020721] rounded-full px-4 md:px-8 py-2 flex items-center gap-2" variant="outline">
                    Edit                  
                    <Icon
                      icon="mage:edit"
                      class="text-[#020721] font-bold"
                      width="20"
                      height="20"
                    />
                  </Button>
                </div>
              </div>
              <div class="grid md:grid-cols-8 gap-2 md:gap-8">
                <div class="md:col-span-4">
                  <Label class="px-2">First Name</Label>
                  <Input class="ghost" :disabled="!isEdit"/>
                </div>
                <div class="md:col-span-4 ">
                  <Label class="px-2">Last Name</Label>
                  <Input class="ghost" :disabled="!isEdit"/>
                </div>
              </div>
              <div class="grid md:grid-cols-8 gap-2 md:gap-8">
                <div class="md:col-span-5">
                  <Label class="px-2">Email</Label>
                  <Input class="ghost" :disabled="!isEdit"/>
                </div>
                <div class="md:col-span-3 ">
                  <Label class="px-2">Phone Number</Label>
                  <Input class="ghost" :disabled="!isEdit"/>
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
                  <!-- <Input class="ghost"/> -->
                   <ToggleGroup type="multiple">
                    <div v-if="categories.length !== 0" class="overflow-auto bg-white pb-4 flex items-center gap-4 space-y-2">
                        <ToggleGroupItem v-for="(category, key) in categories" :key="key" :value="category.title" aria-label="Toggle bold">
                          <Card Content class="border flex items-center justify-center rounded-lg hover:shadow-xl w-fit py-2 px-4">
                            <!-- <CardContent
                            > -->
                              <span class="flex gap-2 items-center"><div
                                class="inline-block text-[#F8F9FF] w-6 h-6"
                              >
                                <img :src='category.image' class="w-6 h-6 rounded-sm"/>
                              </div>
                              <div class="flex flex-col items-start justify-between">
                                <p class="text-sm text-muted-foreground text-center text-[#000000]">
                                  {{category.title}}
                                </p>
                              </div>
                            </span>
                            <!-- </CardContent> -->
                          </Card>
                        </ToggleGroupItem>
                    </div>
                  </ToggleGroup>
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