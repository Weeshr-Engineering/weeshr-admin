<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardDescription, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import axios from '@/services/ApiService'
import { toast } from '@/components/ui/toast'
import { defineAbilities } from '@/lib/ability'
import { Input } from '@/components/ui/input'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-vue-next'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
import { Label } from '../ui/label'
import type { Bank } from './vendor-types'
import VendorsOperation from './VendorsOperation.vue'
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import { useRouter } from 'vue-router'
import ProxyNav from '../ProxyNav.vue'
import MainNav from '../MainNav.vue'
import VendorBankDetails from './vendorBankDetails.vue'
import { Badge } from '../ui/badge'
import { cn } from '@/lib/utils'

defineAbilities()
// const update = true//ability.can('update', 'users')
const props = defineProps({
  id: String,
})

interface Banks {
  id: string,
  code: string,
  name: string,
  [key: string]: any;
}

interface VerifiedBank {
  accountNumber: string,
  accountName: string,
}
const id = props.id
const router = useRouter()
const isVendor = ref<boolean>(useSuperAdminStore().isVendor);
const sheetOpen = ref(false)
const logo = ref<File | null>(null)
const bankDetails = ref<Bank[]>([])
const banks = ref<Banks[]>([])
const verifyBank = ref<VerifiedBank | null>()
const open = ref(false)

interface VendorData {
    "_id": "691ed372e1081bcda7fd759d",
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


//get User
const vendor = computed(()=>{
  return useSuperAdminStore().vendor;
})
const vendorData = ref<VendorData>()
const inviteId = ref('')
const bgImagePreview = ref<string | null>(null)
const newPassword = ref('')
const showPassword = ref(false)

// const triggerFileInput = () => {
//   fileInput.value?.click()
// }


// const triggerBgFileInput = () => {
//   bgFileInput.value?.click()
// }

// const handleFileChange = (e: Event) => {
//   const target = e.target as HTMLInputElement
//   const file = target.files?.[0]
//   if (!file) return

//   imageFile.value = file
//   imagePreview.value = URL.createObjectURL(file) // preview
// }
// const handleBgFileChange = (e: Event) => {
//   const target = e.target as HTMLInputElement
//   const file = target.files?.[0]
//   if (!file) return

//   bgImageFile.value = file
//   bgImagePreview.value = URL.createObjectURL(file) // preview
// }

const isEdit = ref(false)
const isEditCompany = ref(false)
const companyFormData = ref({
  rcNumber: vendor.value?.rcNumber,
  companyName: vendor.value?.companyName,
  companyEmail: vendor.value?.companyEmail,
  companyAddress: vendor.value?.companyAddress,
  companyState: vendor.value?.companyState,
  companyType: vendor.value?.companyType
});
const vendorFormData = ref({
  firstName: vendorData.value?.firstName,
  lastName: vendorData.value?.lastName,
  phone: vendorData.value?.phoneNumber.phoneNumber,
  email: vendorData.value?.email
});

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
      bankDetails.value = response.data.data;
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
    // console.log(error)
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

const fetchVendorsData = async (msg: string) => {
  toast({
    title: 'Loading Data',
    description: 'Fetching data...',
    variant: 'loading',
    duration: 0 // Set duration to 0 to make it indefinite until manually closed
  })

  try {
    // Set loading to true
    // useGeneralStore().setLoading(true)
    const response = await axios.get(`/api/v1/admin/market/invites/vendor/${id}`)

    if (response.status === 200 || response.status === 201) {
      // Update the users data with the response
      // console.log(response)
      vendorData.value = response.data.data[0];
      vendorFormData.value={
        firstName: vendorData.value?.firstName,
        lastName: vendorData.value?.lastName,
        email: vendorData.value?.email,
        phone: `${vendorData.value?.phoneNumber.countryCode} - ${vendorData.value?.phoneNumber.phoneNumber}`
      }
      inviteId.value = response.data.data[0]._id;
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
    // console.log(error)
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

const fetchBanks = async (msg: string) => {
  toast({
    title: 'Loading Data',
    description: 'Fetching data...',
    variant: 'loading',
    duration: 0 // Set duration to 0 to make it indefinite until manually closed
  })

  try {
    // Set loading to true
    // useGeneralStore().setLoading(true)
    const response = await axios.get(`/api/v1/admin/market/banks/list/all`)

    if (response.status === 200 || response.status === 201) {
      // Update the users data with the response
      // console.log(response)
      banks.value = response.data.data
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
    // console.log(error)
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

const handleImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    logo.value = file
    bgImagePreview.value = URL.createObjectURL(file) 
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

// function removeUndefinedKeys<T extends Record<string, any>>(obj: T): Partial<T> {
//   // Create a new object to store the filtered keys
//   const filteredObject: Partial<T> = {}

//   // Iterate through the keys of the input object
//   for (const key in obj) {
//     if (Object.prototype.hasOwnProperty.call(obj, key)) {
//       // Copy the key-value pair if the value is not undefined
//       if (obj[key] !== undefined) {
//         filteredObject[key] = obj[key]
//       }
//     }
//   }

//   return filteredObject
// }

const getVendorAdminID = async()=>{
  const response = await axios.get(`/api/v1/admin/market/vendor/users/vendor/${vendorData.value?.vendorId}`)
  // console.log(response.data.data[0].adminId._id)
  return response.data.data[0].adminId._id
}

const handleProxy = async ()=>{
  toast({
      description: 'Setting up proxy...',
      variant: 'loading',
      duration: 0 // Set duration to 0 to make it indefinite until manually closed
    })
  if(vendorData.value && vendor.value){
    try {
      useSuperAdminStore().setVendor(true, vendorData.value?.vendorId)
      localStorage.setItem('vendor', JSON.stringify(vendor.value.companyName))
      sessionStorage.setItem('isProxy', JSON.stringify(true))
      sessionStorage.setItem('proxyAdminId', await getVendorAdminID())
      router.push('/')
    } catch (error) {
      toast({
        description: 'Error setting up proxy, please try again',
        variant: 'destructive',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })
      catchErr(error)
    }
  }else{
    toast({
      description: 'The page is not ready for proxy actions, please refresh your browser and try again',
      variant: 'destructive',
      duration: 0 // Set duration to 0 to make it indefinite until manually closed
    })
  }
}

const editProfile = async (values: string) => {
  toast({
      title: 'Loading Data',
      description: 'Updating Profile status...',
      variant: 'loading',
      duration: 0 // Set duration to 0 to make it indefinite until manually closed
    })
    if(!values){
      toast({
        description: 'Incomplete data',
        variant: 'destructive'
      })
      return;
    }
    // VendorListStore.loadingControl(true)
    try {
      // console.log(values)
      const response = await axios.patch(
        `/api/v1/admin/market/vendor/${id}`,
        {
          status: values
        }
      )

      // Check if response status is 200 or 201
      if (response.status === 200 || response.status === 201) {
        // Show success toast
        toast({
          title: 'Success',
          description: `Status updated successfully.`,
          variant: 'success'
        })
      }
      useSuperAdminStore().fetchUsersData('Success', id)
      // Handle success
    } catch (err: any) {
      //   VendorListStore.loadingControl(false)
      // console.log(err)
      catchErr(err)
      // Handle other errors
    }
}

// const toggleDayActive = (key: string) => {
//   appUser.value.workingHours.days[key].active = 
//   !appUser.value.workingHours.days[key].active
// }

// const editProfile = (param: keyof typeof appUser.value, val: stvendor?.status>{
//   appUser.value = {...appUser.value, [param]: val}
// }

// const { handleSubmit: contactForm } = useForm({
//   validationSchema: contactFormSchema
// })

// const onSubmit = contactForm((values) => {
//   function valueChecker<T extends Record<string, any>>(obj: T): boolean {
//     return Object.values(obj).some((value) => value !== undefined)
//   }
//   if (valueChecker(values)) {
//     editProfile(values)
//   } else {
//     toast({
//       title: 'Form Input Is Empty',
//       description: `Make a change: There is nothing to update`,
//       variant: 'destructive'
//     })
//   }
// })

const frequency = ref(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'])
interface CompanyType {
  name: string, value: string
}
const companyTypes: CompanyType[] = [
  { name: "Sole Proprietorship", value: "Sole Proprietorship" },
  { name: "Business", value: "BUSINESS" },
  { name: "Company", value: "COMPANY" },
  { name: "Partnership", value: "Partnership" },
  { name: "Limited Liability Company (LLC)", value: "Limited Liability Company (LLC)" },
  { name: "Corporation", value: "Corporation" },
  { name: "S Corporation", value: "S Corporation" },
  { name: "Nonprofit Organization", value: "Nonprofit Organization" },
  { name: "Cooperative", value: "Cooperative" }
]


// 🔹 Form state
const bankCode = ref('')
const bankName = computed(() =>
  banks.value.find(bank => bank.code === bankCode.value)
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
          "payoutFrequency": payoutFrequency.value.toLowerCase(),
          accountName: verifyBank.value?.accountName
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
        verifyBank.value = null;
        accountNumber.value = ''
        fetchBankData('Success')
      }
      // Handle success
    } catch (err: any) {
      //   VendorListStore.loadingControl(false)
      // console.log(err)
      catchErr(err)
      // Handle other errors
    }
  }

   const saveLogo = async () => {
    toast({
      title: 'Loading Data',
      description: 'Saving logo details...',
      variant: 'loading',
      duration: 0 // Set duration to 0 to make it indefinite until manually closed
    })
    if(!logo.value){
      toast({
        description: 'Incomplete data',
        variant: 'destructive'
      })
      return;
    }
    // VendorListStore.loadingControl(true)
    try {
      let data = new FormData()
      if (logo.value) {
        data.append('logo', logo.value)
      }

      // let config = {}
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      const response = await axios.patch(
        `/api/v1/admin/market/vendor/${id}`,
        data, config
      )

      // Check if response status is 200 or 201
      if (response.status === 200 || response.status === 201) {
        // Show success toast
        toast({
          title: 'Success',
          description: `${bankName.value?.name} added successfully.`,
          variant: 'success'
        })
        await useSuperAdminStore().fetchUsersData('Success')
      }
      // Handle success
    } catch (err: any) {
      //   VendorListStore.loadingControl(false)
      catchErr(err)
      // Handle other errors
    }
  }

const saveUserData = async () => {
    toast({
      title: 'Loading Data',
      description: 'Saving details...',
      variant: 'loading',
      duration: 0 // Set duration to 0 to make it indefinite until manually closed
    })

    try {
      const response = await axios.put(
        `/api/v1/admin/market/invites/${inviteId.value}`,
        {
          "firstName": vendorFormData.value.firstName,
          'email': vendorFormData.value.email,
          'lastName': vendorFormData.value.lastName,
          "phoneNumber": {
            "countryCode": vendorFormData.value.phone?.split('-')[0],
            "phoneNumber": vendorFormData.value.phone?.split('-')[1]
          }
        }
      )

      // Check if response status is 200 or 201
      if (response.status === 200 || response.status === 201) {
        // Show success toast
        fetchVendorsData('Success')
        toast({
          title: 'Success',
          description: `Edit successfully.`,
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

  const saveNewPassword = async () => {
    toast({
      title: 'Loading Data',
      description: 'Saving new password...',
      variant: 'loading',
      duration: 0 // Set duration to 0 to make it indefinite until manually closed
    })

    try {
      const user = JSON.parse(localStorage.getItem('user') || '');
      // const user = JSON.parse(localStorage.getItem('user') || '')
      // const proxyAdminId = await getVendorAdminID()
      if(!user) {
        toast({
          title: 'Success',
          description: `Error getting user data.`,
          variant: 'destructive'
        })
        return
      }
      // console.log(isVendor.value, proxyAdminId, user.id)
      const response = await axios.patch(
        `/api/v1/admin/market/vendor/user/${isVendor.value ? user.id : await getVendorAdminID() }/change-password`,
        {
          newPassword: newPassword.value
        }
      )

      // Check if response status is 200 or 201
      if (response.status === 200 || response.status === 201) {
        // Show success toast
        fetchVendorsData('Success')
        toast({
          title: 'Success',
          description: `Edit successfully.`,
          variant: 'success'
        })
      }
      showPassword.value= false
      newPassword.value = ''
      // Handle success
    } catch (err: any) {
      //   VendorListStore.loadingControl(false)
      catchErr(err)
      // Handle other errors
    }
  }

  const saveCompanyData = async () => {
    toast({
      title: 'Loading Data',
      description: 'Processing...',
      variant: 'loading',
      duration: 0 // Set duration to 0 to make it indefinite until manually closed
    })
    // VendorListStore.loadingControl(true)
    try {
      const response = await axios.patch(
        `/api/v1/admin/market/vendor/${id}`,
        companyFormData.value,
      )

      // Check if response status is 200 or 201
      if (response.status === 200 || response.status === 201) {
        // Show success toast
        toast({
          title: 'Success',
          description: `Update successful.`,
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
      // verifyBank.value= {
      //     accountName: 'IZEKOR RUBY',
      //     accountNumber: '8099433649'
      //   }
      const response = await axios.post(
        '/api/v1/admin/market/banks/verify',
        {
          "bankCode": code,
          "accountNumber": accNum,
          // 'bankName': bankName,
          // 'vendorId': props.id
        }
      )

      // Check if response status is 200 or 201
      if (response.status === 200 || response.status === 201) {
        // Show success toast
        // console.log(response)\
        verifyBank.value = response.data.data;
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

  // const fetchBioData = async()=>{
  //  await fetchVendorsData('Success')
  // //  fetchData('Success')
  // }
  const View = computed(() =>
    useSuperAdminStore().isVendor ? VendorNav : MainNav
  )

onMounted(async () => {
  fetchBankData('data fetched')
  fetchBanks('Success')
  // fetchData('success')
  await useSuperAdminStore().fetchUsersData('Success', id)
  fetchVendorsData('Success')
  companyFormData.value={
    companyAddress: vendor.value?.companyAddress,
    companyEmail: vendor.value?.companyEmail,
    companyName: vendor.value?.companyName,
    companyState: vendor.value?.companyState,
    companyType: vendor.value?.companyType,
    rcNumber: vendor.value?.rcNumber
  }
  // console.log(id)
})
</script>

<template>
  <div class="max-h-screen h-screen">
    <component :is="View" class="mx-6" :heading-text="isVendor ? 'Profile' : 'Dashboard'"/>
    <ProxyNav/>
  <!-- <div v-if="!appUser">
    <LoadingSpinner />
  </div> -->
    <div class="flex-col lg:flex lg:flex-row gap-1 px-8 mt-9 min-h-[80dvh]">
      <Card class="lg:w-4/12 bg-[#F8F9FF] sm:items-center shadow-xl">
        <CardHeader>
          <h1 class="font-semibold text-lg">{{ useSuperAdminStore().companyName }}</h1>
          <CardDescription>
            <div>
              <h6 class="font-semibold text-primary">Business Logo</h6>
              <div class="border-t border-b pt-6 pb-4 mt-4">
                <div class="grid grid-cols-3 gap-4">
                  <div :class="{ 'border-dashed' : vendor?.logo?.secure_url }" class="border-2 border-gray-300 rounded-lg w-20 h-20 p-2 bg-[#F0F0FF] flex items-center justify-center col-span-1">
                    <div v-if="vendor?.logo?.secure_url || bgImagePreview" class="w-full h-full bg-no-repeat bg-contain"
                      :style="{ backgroundImage: vendor?.logo?.secure_url ? `url(${vendor.logo?.secure_url})` : `url(${bgImagePreview})` }"></div>
                    <div v-else class="w-12 h-12 mb-3 text-[#5B68DF]">
                      
                    <Icon icon="mdi:clock-outline" width="48" height="48" />
                    </div>
                  </div>
                  
                  <div class="flex flex-col justify-center col-span-2">
                    <p class="text-sm font-medium text-[#020721] mb-1">Upload Business Logo</p>
                    <p class="text-xs text-[#8B8D97] mb-3">Recommended Format: JPG or PNG</p>
                    <input
                      type="file"
                      accept="image/*"
                      @change="handleImageUpload"
                      class="hidden"
                      id="product-image"
                    />
                    <label 
                      for="product-image"
                      class="text-xs text-[#5B68DF] cursor-pointer hover:underline"
                    >
                      {{ logo ? '✓ Image uploaded' : 'Choose file' }}
                    </label>
                    <Button v-if="logo" @click="saveLogo">Save</Button>
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
                  {{ vendorData?.firstName }} {{ vendorData?.lastName }}
                </p>
              </div>
              <div
                class="grid grid-cols-3 py-2 my-2 border-t border-b relative"
              >
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Password</p>
                <input
                  v-if="showPassword"
                    type="password"
                    v-model="newPassword"
                    class="border-b-2 border-primary"
                  />
                <p v-else class="text-xs md:text-sm lg:text-sm text-[#020721]">********</p>
                <div class="flex items-center gap-1 absolute bottom-2 right-0">
                  <Badge v-if="newPassword !== '' && showPassword" @click="saveNewPassword" variant="outline" class="badge rounded-full">
                    Save
                </Badge>
                <Badge variant="outline" @click="()=> showPassword = !showPassword" class="badge rounded-full">
                    {{ showPassword ? 'Cancel' : 'Change' }}
                </Badge>
                </div>
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
                <!-- <Switch v-if="!isVendor"/> -->
              </div>
              <div
                v-if="vendor?.status && isVendor"
                class="flex justify-between rounded-md w-full"
              >
                <label
                  class="relative inline-flex cursor-pointer items-center w-full"
                >
                  <input
                    type="checkbox"
                    value=""
                    :checked="vendor?.status === 'published'"
                    disabled
                    class="peer sr-only"
                  />
                  <div
                    class="peer flex h-10 w-full items-center gap-6 rounded-md bg-[#F6F6F6] text-black after:absolute after:left-1 after:h-8 after:w-[49%] after:rounded-md after:bg-slate-700 after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-focus:outline-none dark:border-[#F6F6F6] dark:bg[#F6F6F6] text-sm peer-checked:text-white justify-between px-[20%] py-4 -mr-2"
                  >
                    <span @click="() => editProfile('drafted')" :class="vendor?.status === 'published' ? 'text-[#020721] z-30' : 'text-white z-30'">Draft</span>
                    <span @click="() => editProfile('published')" :class="vendor?.status !== 'published' ? 'text-[#020721] z-30' : 'text-white z-30'">Live</span>
                  </div>
                </label>
              </div>
              <div v-if="!isVendor" class="flex justify-between rounded-md w-full">
                <div
                  class="relative flex h-10 w-full items-center gap-6 rounded-md bg-[#F6F6F6] text-black justify-between px-[10%] py-4"
                >
                  <!-- Sliding indicator -->
                  <div
                    class="absolute top-1 left-1 h-8 w-1/3 rounded-md bg-slate-700 transition-all duration-300"
                    :style="{
                      transform:
                        vendor?.status === 'suspended'
                          ? 'translateX(0%)'
                          : vendor?.status === 'drafted'
                          ? 'translateX(100%)'
                          : 'translateX(200%)',
                    }"
                  ></div>

                  <!-- Labels -->
                  <span
                    @click="editProfile('suspended')"
                    :class="vendor?.status === 'suspended' ? 'text-white z-30' : 'text-[#020721] z-30'"
                    class="cursor-pointer"
                    >Suspended</span
                  >

                  <span
                    @click="editProfile('drafted')"
                    :class="vendor?.status === 'drafted' ? 'text-white z-30' : 'text-[#020721] z-30'"
                    class="cursor-pointer text-center"
                    >Draft</span
                  >

                  <span
                    @click="editProfile('published')"
                    :class="vendor?.status === 'published' ? 'text-white z-30' : 'text-[#020721] z-30'"
                    class="cursor-pointer"
                    >Live</span
                  >
                </div>
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
            <div v-if="!useSuperAdminStore().isVendor" class="p-4 w-full md:w-1/3 flex items-center justify-end">
              <Button class="my-4" @click="handleProxy">
                Open Proxy Portal
              </Button>
            </div>
          </TabsList>

          <TabsContent value="bio" class="">
            <div class="p-4 space-y-2">
              <div class="w-full flex items-center justify-between mb-4">
                <h1 class="text-lg font-medium">Business Information</h1>
                <div class="flex flex-col md:flex-row items-center gap-2">
                  <Button v-if="isEditCompany" @click="saveCompanyData" class="border-2 border-[#020721] text-[#020721] rounded-full px-4 md:px-8 py-2 flex items-center gap-2" variant="outline">
                    Save
                    <Icon icon="mingcute:save-fill" class="text-[#020721] font-bold"
                      width="20"
                      height="20" />
                  </Button>
                  <Button @click="()=> isEditCompany=!isEditCompany" class="border-2 border-[#020721] text-[#020721] rounded-full px-4 md:px-8 py-2 flex items-center gap-2" variant="outline">
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
                <div class="md:col-span-3">
                  <Label class="px-2">RC Number</Label>
                  <Input v-model="companyFormData.rcNumber" :placeholder="vendor?.rcNumber" class="ghost" :disabled="!isEditCompany"/>
                </div>
                <div class="md:col-span-5 ">
                  <Label class="px-2">Company Name</Label>
                  <Input v-model="companyFormData.companyName" :placeholder="vendor?.companyName" class="ghost" :disabled="!isEditCompany" />
                </div>
              </div>
              <div class="grid md:grid-cols-8 gap-2 md:gap-8">
                <div class="md:col-span-3">
                  <Label class="px-2">Company Type</Label>
                  <Select
                    v-model="companyFormData.companyType"
                    id="gender"
                    class="bg-gray-900 w-auto mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  >
                      <SelectTrigger class="" :disabled="!isEditCompany">
                        <SelectValue :placeholder="vendor?.companyType || 'Select company type'" />
                      </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="(company) in companyTypes"
                        :value="company.value"
                        :key="company.name"
                        class="flex justify-center items-center gap-2"
                      >                   
                       {{ company.name }}   
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <!-- <Input v-model="companyFormData.companyType" :placeholder="vendor?.companyType" class="ghost" :disabled="!isEditCompany" /> -->
                </div>
                <div class="md:col-span-5 ">
                  <Label class="px-2">Company Email</Label>
                  <Input v-model="companyFormData.companyEmail" :placeholder="vendor?.companyEmail" class="ghost" :disabled="!isEditCompany" />
                </div>
              </div>
              <div class="grid md:grid-cols-8 gap-2 md:gap-8">
                <div class="md:col-span-5">
                  <Label class="px-2">Address</Label>
                  <Input v-model="companyFormData.companyAddress" :placeholder="vendor?.companyAddress" class="ghost" :disabled="!isEditCompany"/>
                </div>
                <div class="md:col-span-3 ">
                  <Label class="px-2">State</Label>
                  <Input v-model="companyFormData.companyState" :placeholder="vendor?.companyState" class="ghost" :disabled="!isEditCompany" />
                </div>
              </div>
              <div class="w-full flex items-center justify-between pt-8">
                <h1 class="text-lg font-medium">Contact Person</h1>
                <div class="flex flex-col md:flex-row items-center gap-2">
                  <Button v-if="isEdit" @click="saveUserData" class="border-2 border-[#020721] text-[#020721] rounded-full px-4 md:px-8 py-2 flex items-center gap-2" variant="outline">
                    Save
                    <Icon icon="mingcute:save-fill" class="text-[#020721] font-bold"
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
                  <Input v-model="vendorFormData.firstName" :placeholder="vendorFormData?.firstName" class="ghost" :disabled="!isEdit"/>
                </div>
                <div class="md:col-span-4 ">
                  <Label class="px-2">Last Name</Label>
                  <Input v-model="vendorFormData.lastName" :placeholder="vendorFormData?.lastName" class="ghost" :disabled="!isEdit"/>
                </div>
              </div>
              <div class="grid md:grid-cols-8 gap-2 md:gap-8">
                <div class="md:col-span-5">
                  <Label class="px-2">Email</Label>
                  <Input v-model="vendorFormData.email" :placeholder="vendorFormData?.email" class="ghost" :disabled="!isEdit"/>
                </div>
                <div class="md:col-span-3 ">
                  <Label class="px-2">Phone Number</Label>
                  <Input v-model="vendorFormData.phone" :placeholder="`${vendorData?.phoneNumber.countryCode || ''} ${vendorData?.phoneNumber.phoneNumber || ''}`" class="ghost" :disabled="!isEdit"/>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="product" class="space-y-4">
            <VendorsOperation :id="id"/>
          </TabsContent>

          <!-- <TabsContent value="support" class="space-y-4"> </TabsContent> -->

          <TabsContent value="financial" class="space-y-4 h-full">
            <div class="px-4 py-2 h-full">
              <div class="flex items-center justify-between w-full mb-2">
                <h1 class="text-lg font-medium">Bank Details</h1>
                <div class="flex items-center gap-4">
                  <!-- <button class="text-[#020721] border-2 border-[#020721] px-4 py-2 rounded-xl w-50 h-12">
                    <div class="text-base text-center flex items-center gap-4 border-[#020721]">
                      Verify Account
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#020721" d="M19 19V5H5v14zm0-16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-2 8v2H7v-2z"/></svg>
                    </div>
                  </button> -->
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
                            <Label class="px-2 w-full">Bank Name</Label>
                            <Popover v-model:open="open">
                              <PopoverTrigger as-child>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  :aria-expanded="open"
                                  class="w-full justify-between"
                                >
                                  {{
                                    bankCode
                                      ? banks.find(bank => bank.code === bankCode)?.name
                                      : 'Select bank...'
                                  }}
                                  <ChevronsUpDownIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent class="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search bank..." />
                                  <CommandList>
                                    <CommandEmpty>No bank found.</CommandEmpty>
                                    <CommandGroup>
                                      <CommandItem
                                        v-for="bank in banks"
                                        :key="bank.code"
                                        :value="bank.name"
                                        @select="() => {
                                          bankCode = bankCode === bank.code ? '' : bank.code
                                          open = false
                                        }"
                                      >
                                        <CheckIcon
                                          :class="cn(
                                            'mr-2 h-4 w-4',
                                            bankCode === bank.code ? 'opacity-100' : 'opacity-0',
                                          )"
                                        />
                                        {{ bank.name }}
                                      </CommandItem>
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <!-- <Select
                              v-model="bankCode"
                              id="gender"
                              class="bg-gray-900 w-auto mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            >
                                <SelectTrigger class="">
                                  <SelectValue placeholder="Select Bank" />
                                </SelectTrigger>
                              <SelectContent>
                                <SelectItem
                                  v-for="(bank) in banks"
                                  :value="bank.code"
                                  :key="bank.code"
                                  class="flex justify-center items-center gap-2"
                                >
                                  {{ bank.name }}                        
                                </SelectItem>
                              </SelectContent>
                            </Select> -->
                          </div>
                          <div class="">
                            <Label class="px-2">Account Number</Label>
                            <Input v-model="accountNumber" class="" placeholder="XXXXXXXXXX"/>
                          </div>
                        </div>
                        <div v-if="verifyBank" class="rounded-lg overflow-hidden flex flex-col mt-6">
                          <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2">
                            <div class="flex items-center gap-4">
                              <h2 class="text-xs font-semibold text-muted-foreground">Account Name</h2>
                            </div>
                            <h1 class="text-md text-primary font-semibold">{{ verifyBank.accountName }}</h1>
                          </div>
                          <!-- <div class="bg-[#F6F6F6] flex items-center justify-between w-full px-4 py-2 my-1">
                            <div class="flex items-center gap-4">
                              <h2 class="text-xs font-semibold text-muted-foreground">Delivery Charge</h2>
                            </div>
                            <h1 class="text-md text-primary font-semibold">₦{{ transaction.delivery_charge.toLocaleString() }}</h1>
                          </div> -->
                        </div>
                        <div v-if="verifyBank" class="grid grid-cols-2 gap-4">
                          <Button @click="()=> saveBankDetails()" class="border-2 border-green-600 w-full px-4 md:px-8 py-2 flex items-center gap-2">
                            Save
                          </Button>
                          <Button @click="()=> verifyBank = null" class="border-2 border-[#020721] w-full px-4 md:px-8 py-2 flex items-center gap-2" variant="outline">
                            Cancel
                          </Button>
                        </div>
                        <Button v-else @click="()=> verifyDetails(accountNumber, bankCode)" class="border-2 border-[#020721] w-full px-4 md:px-8 py-2 flex items-center gap-2">
                          Verify
                        </Button>
                      </div>
                      
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              <VendorBankDetails :bankDetails="bankDetails" :cbnBankCodes="banks" :frequency="frequency" :refresh="fetchBankData" :id="id || ''"/>

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