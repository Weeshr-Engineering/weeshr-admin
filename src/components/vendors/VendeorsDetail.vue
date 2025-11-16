<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
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
// import CountryCodes from '@/lib/CountryCodes'
import { cbnBankCodes } from './bankcodes'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet'
import { catchErr } from '@/composables/catchError'
import VendorNav from '@/components/VendorNav.vue'
import { Badge } from '@/components/ui/badge'
import { Label } from '../ui/label'
import type { Bank } from './vendor-types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import VendorsOperation from './VendorsOperation.vue'

defineAbilities()
const update = true//ability.can('update', 'users')
const route = useRoute()
const id = route.params.id
const isVendor = ref(true);
const sheetOpen = ref(false)
const bankDetails = ref<Bank[]>([])
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

const statusVal = ref('Suspended') // default state
const isEdit = ref(false)

const cycleStatus = () => {
  if (statusVal.value === 'Suspended') statusVal.value = 'Draft'
  else if (statusVal.value === 'Draft') statusVal.value = 'Live'
  else statusVal.value = 'Suspended'

  // Optional: call backend update
  // editDetails('status', status.value)
}

const deleteBankData = async (msg: string, _id: string) => {
  toast({
    title: 'Loading Data',
    description: 'Fetching data...',
    variant: 'loading',
    duration: 0 // Set duration to 0 to make it indefinite until manually closed
  })

  try {
    // Set loading to true
    // useGeneralStore().setLoading(true)
    const response = await axios.delete(`/api/v1/admin/market/banks/${_id}`)

    if (response.status === 200 || response.status === 201) {
      toast({
        title: 'Success',
        description: `Success- ${msg}`,
        variant: 'success'
      })
      fetchBankData('Success')
    }
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

const fetchBankData = async (msg: string) => {
  toast({
    title: 'Loading Data',
    description: 'Fetching data...',
    variant: 'loading',
    duration: 0 // Set duration to 0 to make it indefinite until manually closed
  })

  try {
    // Set loading to true
    // useGeneralStore().setLoading(true)
    const response = await axios.get(`/api/v1/admin/market/banks/vendor/${id}`)

    if (response.status === 200 || response.status === 201) {
      // Update the users data with the response
      // console.log(response)
      bankDetails.value = response.data.data;
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
}

const fetchData = async (msg: string) => {
  toast({
    title: 'Loading Data',
    description: 'Fetching data...',
    variant: 'loading',
    duration: 0 // Set duration to 0 to make it indefinite until manually closed
  })

  try {
    // Set loading to true
    // useGeneralStore().setLoading(true)
    const response = await axios.get(`/api/v1/admin/market/vendor/rcdetails/9000`)

    if (response.status === 200 || response.status === 201) {
      // Update the users data with the response
      console.log(response)
      // vendor.value = response.data.data;
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
}

const fetchUsersData = async (msg: string) => {
  toast({
    title: 'Loading Data',
    description: 'Fetching data...',
    variant: 'loading',
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
  
}

// const toggleDayActive = (key: string) => {
//   appUser.value.workingHours.days[key].active = 
//   !appUser.value.workingHours.days[key].active
// }

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

const frequency = ref(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'])

// 🔹 Form state
const bankCode = ref('')
const bankName = computed(() =>
  cbnBankCodes.find(bank => bank.code === bankCode.value)
);
// const bankCode = ref(cbnBankCodes[])
const accountNumber = ref("");
const payoutFrequency = ref("WEEKLY");
const initialData = ref({
  bankCode: "",
  accountNumber: "",
  payoutFrequency: ""
});

// whether to show button
const showButton = ref(false);

// watch all three fields for change
watch([bankCode, accountNumber, payoutFrequency], ([newBank, newAcc, newFreq]) => {
  const changed =
    newBank !== initialData.value.bankCode ||
    newAcc !== initialData.value.accountNumber ||
    newFreq !== initialData.value.payoutFrequency;
  showButton.value = changed;
});

 const saveBankDetails = async () => {
    toast({
      title: 'Loading Data',
      description: 'Saving bank details...',
      variant: 'loading',
      duration: 0 // Set duration to 0 to make it indefinite until manually closed
    })
    if(!bankCode.value || accountNumber.value === ''){
      toast({
        description: 'Incomplete data',
        variant: 'destructive'
      })
      return;
    }
    // VendorListStore.loadingControl(true)
    try {
      const response = await axios.post(
        '/api/v1/admin/market/banks',
        {
          "vendorId": id,
          "bankName": bankName.value?.name,
          "bankCode": bankCode.value,
          "accountNumber": accountNumber.value,
          "payoutFrequency": payoutFrequency.value.toLowerCase()
        }
      )

      // Check if response status is 200 or 201
      if (response.status === 200 || response.status === 201) {
        // Show success toast
        toast({
          title: 'Success',
          description: `${bankName.value?.name} added successfully.`,
          variant: 'success'
        })
      }
      // Handle success
    } catch (err: any) {
      //   VendorListStore.loadingControl(false)
      catchErr(err)
      // Handle other errors
    }
  }

  const verifyDetails = async (accNum: string, code: string) => {
    toast({
      title: 'Loading Data',
      description: 'Verifying bank details...',
      variant: 'loading',
      duration: 0 // Set duration to 0 to make it indefinite until manually closed
    })
    if(!code || accNum === ''){
      toast({
        description: 'Incomplete data',
        variant: 'destructive'
      })
      return;
    }
    // VendorListStore.loadingControl(true)
    try {
      const response = await axios.post(
        '/api/v1/admin/market/banks',
        {
          "bankCode": code,
          "accountNumber": accNum,
        }
      )

      // Check if response status is 200 or 201
      if (response.status === 200 || response.status === 201) {
        // Show success toast
        toast({
          title: 'Success',
          description: `Verification successfully.`,
          variant: 'success'
        })
      }
      // Handle success
    } catch (err: any) {
      //   VendorListStore.loadingControl(false)
      catchErr(err)
      // console.log(err)
      // Handle other errors
    }
  }
onMounted(() => {
  fetchUsersData('data fetched')
  fetchBankData('data fetched')
  fetchData('success')
})
</script>

<template>
  <div class="max-h-screen h-full">
    <VendorNav class="mx-6" heading-text="Profile"/>
  <!-- <div v-if="!appUser">
    <LoadingSpinner />
  </div> -->
    <div class="flex-col lg:flex lg:flex-row gap-1 px-8 mt-9 h-full">
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
            <VendorsOperation/>
          </TabsContent>

          <!-- <TabsContent value="support" class="space-y-4"> </TabsContent> -->

          <TabsContent value="financial" class="space-y-4 h-full">
            <div class="px-4 py-2 h-full">
              <div class="flex items-center justify-between w-full mb-2">
                <h1 class="text-lg font-medium">Bank Details</h1>
                <Sheet v-model:open="sheetOpen">
                  <SheetTrigger as-child>
                    <button @click="sheetOpen = true" class="bg-[#020721] px-4 py-2 rounded-xl w-50 h-12">
                      <div class="text-base text-[#F8F9FF] text-center flex items-center">
                        Add Account
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
                      <h3 class="text-2xl font-medium">Add Account Information</h3>
                      <SheetDescription>
                        Add bank info. Click submit when you're done.
                      </SheetDescription>
                    </SheetHeader>
                    <div class="space-y-4 py-2">
                      <div class=" gap-2 md:gap-8">
                        <div class="">
                          <Label class="px-2">Bank Name</Label>
                          <Select
                            v-model="bankCode"
                            id="gender"
                            class="bg-gray-900 w-auto mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                          >
                              <SelectTrigger class="">
                                <SelectValue placeholder="Select Bank" />
                              </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                v-for="(bank) in cbnBankCodes"
                                :value="bank.code"
                                :key="bank.code"
                                class="flex justify-center items-center gap-2"
                              >
                                {{ bank.name }}                        
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div class="">
                          <Label class="px-2">Account Number</Label>
                          <Input v-model="accountNumber" class="" placeholder="XXXXXXXXXX"/>
                        </div>
                      </div>
                      <Button @click="()=> saveBankDetails()" class="border-2 border-[#020721] w-full px-4 md:px-8 py-2 flex items-center gap-2">
                        Save
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              <div v-for="bank in bankDetails" :key="bank.accountNumber" class="shadow-md p-2 rounded-md">
                <div class="grid md:grid-cols-8 gap-2 md:gap-8">
                  <div class="md:col-span-5">
                    <Label class="px-2">Bank Name</Label>
                    <Select
                      v-model="bankCode"
                      id="gender"
                      class="bg-gray-900 w-auto mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    >
                        <SelectTrigger class="">
                          <SelectValue :placeholder="bank.bankName || 'Select Bank'" />
                        </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          v-for="(bank) in cbnBankCodes"
                          :value="bank.code"
                          :key="bank.code"
                          class="flex justify-center items-center gap-2"
                        >
                          {{ bank.name }}                        
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div class="md:col-span-3 ">
                    <Label class="px-2">Account Number</Label>
                    <Input v-model="accountNumber" class="ghost" :value="bank.accountNumber" :placeholder="bank.accountNumber"/>
                  </div>
                </div>
                <div class="grid md:grid-cols-8 gap-2 md:gap-8 my-2 md:my-4">
                  <div class="md:col-span-3">
                    <Label class="px-2">Payout Frequency</Label>
                    <Select
                      v-model="payoutFrequency"
                      id="gender"
                      class="bg-gray-900 w-auto mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    >
                        <SelectTrigger class="">
                          <SelectValue :placeholder="bank.payoutFrequency" />
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
                  <div class="md:col-span-5 flex items-end">
                    <div class="w-full flex flex-col md:flex-row md:items-center justify-end">
                      <div class="flex items-center gap-4">
                        <Button  class="border-2 mt-2 md:mt-0 text-[#020721] rounded-full px-4 md:px-8 py-2 flex items-center gap-2" variant="outline">
                          <Icon
                            icon="uil:edit"
                            class="verified-icon text-[#020721]"
                            width="20"
                            height="20"
                          />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger as-child>
                            <Button class="border-2 mt-2 md:mt-0 text-white rounded-full px-4 md:px-8 py-2 flex items-center gap-2" variant="destructive">
                              <Icon
                                icon="mi:delete"
                                class="verified-icon text-white"
                                width="20"
                                height="20"
                              />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction @click="deleteBankData('Deleted successfully', bank._id)">Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <Button @click="()=> saveBankDetails()" v-if="showButton" class="border-2 mt-2 md:mt-0 border-[#020721] text-[#020721] rounded-full px-4 md:px-8 py-2 flex items-center gap-2" variant="outline">
                          Save
                          <Icon
                            icon="mingcute:save-line"
                            class="verified-icon text-[#020721]"
                            width="20"
                            height="20"
                          />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger as-child>
                            <Button class="border-2 mt-2 md:mt-0 border-[#020721] text-[#020721] rounded-full px-4 md:px-8 py-2 flex items-center gap-2" variant="outline">
                              Verify Account
                              <Icon
                                icon="mdi:minus-box-outline"
                                class="verified-icon text-[#020721]"
                                width="20"
                                height="20"
                              />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Do you want to begin verification?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This may take a second.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction @click="verifyDetails(bank.accountNumber, bank.bankCode)">Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="bankDetails.length === 0" class="h-[60dvh]">
                <Card class="h-full">
                  <CardContent class="flex border-none flex-col gap-4 items-center justify-center h-full px-2 sm:px-4 py-4">
                    <img src="https://res.cloudinary.com/drykej1am/image/upload/v1762618116/weeshr-marketplace/empty_wallet_register_transaction_payment_purchase_shopping_incomplete_vrdj7e.png" class="w-48 h-48" alt="">
                    <h1>No account setup</h1>
                    <div class="w-full flex items-center justify-center">
                      <Button class="animate-bounce flex items-center gap-2 text-primary border-primary" @click="()=> sheetOpen = true" variant="outline">
                        Add Account 
                        <Icon
                          icon="mdi:plus-box-outline"
                          class="verified-icon text-[#020721]"
                          width="20"
                          height="20"
                        />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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