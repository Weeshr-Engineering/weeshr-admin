<script setup lang="ts">
import { ref, watch, reactive, onMounted } from 'vue'
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
import {
  getUser,
  getUserLog,
  getUserWallet,
  getUserWalletList,
  getUserWeeshes,
  getUserPayout
} from '@/composables/getUser'
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
import axios from "@/services/ApiService";
import { toast } from "@/components/ui/toast";
import { useUserhubStore } from '@/stores/userhub-details/userhub-details'
import { ability, defineAbilities, verifyAbilities } from '@/lib/ability'

defineAbilities()
const update = ability.can('update', 'users')


//get User
const route = useRoute()
const _id = route.params.id
const store = useUserhubStore()

const { appUser, error, load, toggleUserStatus } = getUser()
const { userLog, count, logPagination, logError, log, logActions, logStatus, getFilter } =
  getUserLog()
const { userWeeshesList, weeshesError, totalPages, currentPage, userWeeshes } = getUserWeeshes()
const { userWallet, getWallet } = getUserWallet()
const { walletError, userWalletList, pagination, walletCount, getWalletList } = getUserWalletList()
const { getPayout } = getUserPayout()

onMounted(() => {
  load(_id)
  userWeeshes(_id)
  getFilter()
})
const togglePrivacy =async (val: boolean)=>{
  toast({
      title: 'Loading Data',
      description: 'Fetching data...',
      variant: 'loading',
      duration: 0 // Set duration to 0 to make it indefinite until manually closed
    })
  let data = {isPrivate: val};

  try {
      const response = await axios.post(`/api/v1/admin/accounts/users/${_id}/profile-privacy`, data)

      if (response.data.code === 200 || response.data.code === 201) {
        // appUser.value = response.data.data
        toast({
          description: response.data.message,
          variant: 'success'
        })
        load(_id)
      }
    } catch (err: any) {
        store.catchErr(error)
        console.log(error);
    }
}

const wallet = (_id: string | string[]) => {
  getWallet(_id)
  getWalletList(_id, walletPage)
  getPayout(_id)
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

//USER LOG

//Log pagination
const filter = reactive<Filter>({
  page_item_from: 1,
  per_page: 25,
  log_action: '',
  log_status: '',
  sort_direction: 'asc'
})

watch(filter, () => {
  log(_id, filter)
})

// USER WEESHES
//search
const search = ref('')

watch(search, () => {
  userWeeshes(_id, search.value)
})

// Sortby price
const sortPrice = ref('desc')

watch(sortPrice, () => {
  userWeeshes(_id, sortPrice.value)
})

//Weeshes status
const statusBg = (status: string) => {
  switch (status) {
    case 'ADDED':
      return 'bg-[#000000]'
    case 'INITIATED':
      return 'bg-[#ee9f39]'
    case 'FULFILLED':
      return 'bg-[#6a70ff]'
    case 'DELIVERED':
      return 'bg-[#00c37f]'
    case 'OUTBOUND':
      return 'bg-[#fc045c]'
    case 'PENDING':
      return 'bg-[#4287f5]'
  }
}

//contributor list
interface VisibleContributors {
  [key: string]: boolean
}

const visibleContributors: VisibleContributors = reactive({})

function toggleContributors(id: string) {
  visibleContributors[id] = !visibleContributors[id]
}

//progress bar
const getContributionPercentage = (weeshes: Weeshes) => {
  return weeshes.donationProgress || 0
}

//Weeshes Pagination
const weeshesPageTotal = ref(totalPages)
const weeshesCurrentPage = ref(currentPage)

const handleWeeshesPageChange = (page: number) => {
  userWeeshes(_id, page)
}

//USER WALLET

//sort wallet by type
const handleTypeSort = (type: string) => {
  getWalletList(_id, walletPage, type)
}

//wallet pagination
const walletPage = reactive({
  page_item_from: 1,
  per_page: 25
})

watch(walletPage, () => {
  getWalletList(_id, walletPage)
})

const openApprovalModal = ref<boolean>(false)

const items = [
  { name: 'Felixant', amount: 1500000, id: 1 },
  { name: 'Gbengax', amount: 40000, id: 2 },
  { name: 'KayodeOdulay', amount: 2400500, id: 3 },
  { name: 'DancingQueen', amount: 750000, id: 4 },
  { name: 'FastFuriousGuy', amount: 500000, id: 5 }
]
</script>

<template>
  <div v-if="!appUser">
    <LoadingSpinner />
  </div>
  <div v-else class="flex-col lg:flex lg:flex-row gap-1">
    <Card class="lg:w-5/12 bg-[#F8F9FF] sm:items-center shadow-xl">
      <CardHeader>
        <div class="flex items-center text-xl mb-8">
          <RouterLink :to="{ name: 'appuser' }" class="text-gray-500">App Users</RouterLink>
          <Icon icon="tabler:chevron-right" width="22px" height="22px" class="ml-1 pt-1" />
          <RouterLink :to="{ name: 'appuserDetails' }">Users Details</RouterLink>
        </div>
        <CardDescription>
          <div v-if="appUser">
            <div v-if="appUser.images.length">
              <Carousel class="w-6/12 h-2/5 lg:h-1/5 lg:w-4/12 mx-auto">
                <CarouselContent>
                  <CarouselItem v-for="image in appUser.images" :key="image.resource.asset_id">
                    <img
                      :src="image.resource.secure_url"
                      alt="display"
                      class="w-full rounded-full border-double border-4 border-[#baef23]"
                    />
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious class="bg-[#baef23]" />
                <CarouselNext class="bg-[#baef23]" />
              </Carousel>
            </div>
            <div v-else class="w-7/12 mx-auto">
              <img
                :src="
                  appUser.gender === 'female'
                    ? 'https://res.cloudinary.com/daisikwbm/image/upload/v1720005675/undraw_Female_avatar_efig_pkhjpd.png'
                    : 'https://res.cloudinary.com/daisikwbm/image/upload/v1720005675/undraw_Male_avatar_g98d_hy94tp.png'
                "
                alt="display"
                class="w-full rounded-full border-double border-4 border-[#baef23]"
              />
            </div>
          </div>
          <div v-if="error" class="text-[#02072199] p-10">
            <p>{{ error }}</p>
          </div>
          <div v-else-if="appUser">
            <div class="px-6 py-4 mt-4">
              <span class="text-base font-bold lg:text-base text-[#020721]">Identity</span>
            </div>
            <div
              class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-lg border"
            >
              <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Full Name</p>
              <p class="text-xs md:text-sm lg:text-sm text-[#020721]">
                {{ appUser.firstName }} {{ appUser.middleName }} {{ appUser.lastName }}
              </p>
            </div>
            <div
              class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-lg border"
            >
              <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Preferred</p>
              <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{ appUser.userName }}</p>
            </div>
            <div
              class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-lg border"
            >
              <p class="flex grow text-[#02072199] text-xs md:text-sm lg:text-sm">Birthday</p>
              <p class="text-xs md:text-sm lg:text-sm text-[#020721]">
                {{ dateFormat(appUser.dob) }}
              </p>
            </div>
            <div
              class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-lg border"
            >
              <p class="flex grow text-[#02072199] text-xs md:text-sm lg:text-sm">Gender</p>
              <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{ appUser.gender }}</p>
            </div>
            <div class="px-6 py-4">
              <span class="text-base font-bold lg:text-base text-[#020721]">Contact</span>
            </div>
            <div
              class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-lg border"
            >
              <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Email</p>
              <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{ appUser.email }}</p>
            </div>
            <div
              class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-lg border"
            >
              <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Phone</p>
              <p class="text-xs md:text-sm text-[#020721]">
                {{ appUser.phoneNumber.normalizedNumber }}
              </p>
            </div>

            <div
              class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-1 my-2 rounded-lg border"
            >
              <p class="text-[#02072199] text-xs md:text-sm lg:text-sm pt-2">Profile Privacy</p>

              <label class="relative inline-flex cursor-pointer items-center" @click='(()=> togglePrivacy(appUser?.settings.isProfilePublic!))'>

                <input type="checkbox" value="" :checked='!appUser.settings.isProfilePublic' disabled class="peer sr-only" />
                <div
                  class="peer flex h-8 items-center gap-6 rounded-full bg-[#baef23] px-4 text-black after:absolute after:left-1 after: after:h-6 after:w-16 after:rounded-full after:bg-[#F4ffc8]/50 after:transition-all after:content-[''] peer-checked:bg-green-900 peer-checked:after:translate-x-full peer-focus:outline-none dark:border-slate-600 dark:bg-slate-700 text-sm peer-checked:text-white"
                >
                  <span>Public</span>
                  <span>Private</span>
                </div>
              </label>
            </div>

            <div class='rounded-lg flex flex-col lg:mx-4 border shadow-md'>
                  <div
                  class="w-full flex justify-between rounded-lg px-4 md:px-6 py-1 my-2"
                >
                  <p class="flex grow text-[#02072199] text-xs md:text-sm lg:text-sm pt-2">
                    User Status
                  </p>
                  <div
                    class="rounded-[15px] gap-2 w-fit px-3 py-1 text-sm capitalize flex items-center"
                  >
                  <!-- verified badge -->
                  <svg v-if='appUser.statusBadge.verified' width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.8433 0.820117C13.5362 0.328844 14.4638 0.328845 15.1567 0.820118L16.5477 1.8063C16.9379 2.08292 17.4143 2.21057 17.8905 2.16609L19.5882 2.00751C20.4339 1.92852 21.2373 2.39234 21.5917 3.16426L22.3032 4.71381C22.5028 5.14845 22.8516 5.49718 23.2862 5.69676L24.8357 6.40829C25.6077 6.76274 26.0715 7.56611 25.9925 8.41183L25.8339 10.1095C25.7894 10.5857 25.9171 11.0621 26.1937 11.4523L27.1799 12.8433C27.6712 13.5362 27.6712 14.4638 27.1799 15.1567L26.1937 16.5477C25.9171 16.9379 25.7894 17.4143 25.8339 17.8905L25.9925 19.5882C26.0715 20.4339 25.6077 21.2373 24.8357 21.5917L23.2862 22.3032C22.8516 22.5028 22.5028 22.8516 22.3032 23.2862L21.5917 24.8357C21.2373 25.6077 20.4339 26.0715 19.5882 25.9925L17.8905 25.8339C17.4143 25.7894 16.9379 25.9171 16.5477 26.1937L15.1567 27.1799C14.4638 27.6712 13.5362 27.6712 12.8433 27.1799L11.4523 26.1937C11.0621 25.9171 10.5857 25.7894 10.1095 25.8339L8.41183 25.9925C7.5661 26.0715 6.76274 25.6077 6.40829 24.8357L5.69676 23.2862C5.49718 22.8516 5.14845 22.5028 4.71381 22.3032L3.16426 21.5917C2.39234 21.2373 1.92852 20.4339 2.00751 19.5882L2.16609 17.8905C2.21057 17.4143 2.08292 16.9379 1.8063 16.5477L0.820117 15.1567C0.328844 14.4638 0.328845 13.5362 0.820118 12.8433L1.8063 11.4523C2.08292 11.0621 2.21057 10.5857 2.16609 10.1095L2.00751 8.41183C1.92852 7.5661 2.39234 6.76274 3.16426 6.40829L4.71381 5.69676C5.14845 5.49718 5.49718 5.14845 5.69676 4.71381L6.40829 3.16426C6.76274 2.39234 7.56611 1.92852 8.41183 2.00751L10.1095 2.16609C10.5857 2.21057 11.0621 2.08292 11.4523 1.8063L12.8433 0.820117Z" fill="url(#paint0_linear_4731_4899)"/>
                    <path d="M10 13.83L12.83 16.66L18.5 11" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <defs>
                    <linearGradient id="paint0_linear_4731_4899" x1="4.5" y1="5.5" x2="22.5" y2="25" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#A4D80F"/>
                    <stop offset="0.365" stop-color="#00D793"/>
                    <stop offset="0.66" stop-color="#00B1CA"/>
                    <stop offset="0.955" stop-color="#6066F5"/>
                    </linearGradient>
                    </defs>
                  </svg>
                  <!-- featured tag -->
                  <svg v-if='appUser.statusBadge.featured' width="57" height="28" viewBox="0 0 77 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="77" height="28" rx="14" fill="#373B4D"/>
                    <path d="M11.148 19V9.284H12.464V19H11.148ZM12.044 14.73V13.526H17.112V14.73H12.044ZM12.044 10.488V9.284H17.35V10.488H12.044ZM21.6603 19.14C20.9976 19.14 20.4003 18.9907 19.8683 18.692C19.3363 18.384 18.9163 17.9687 18.6083 17.446C18.3003 16.9233 18.1463 16.3307 18.1463 15.668C18.1463 15.0147 18.2956 14.4267 18.5943 13.904C18.9023 13.3813 19.3129 12.9707 19.8263 12.672C20.3489 12.364 20.9323 12.21 21.5763 12.21C22.1923 12.21 22.7336 12.35 23.2003 12.63C23.6763 12.91 24.0449 13.2973 24.3063 13.792C24.5769 14.2867 24.7123 14.8467 24.7123 15.472C24.7123 15.5653 24.7076 15.668 24.6983 15.78C24.6889 15.8827 24.6703 16.004 24.6423 16.144H19.0283V15.094H23.9703L23.5083 15.5C23.5083 15.052 23.4289 14.674 23.2703 14.366C23.1116 14.0487 22.8876 13.806 22.5983 13.638C22.3089 13.4607 21.9589 13.372 21.5483 13.372C21.1189 13.372 20.7409 13.4653 20.4143 13.652C20.0876 13.8387 19.8356 14.1 19.6583 14.436C19.4809 14.772 19.3923 15.1687 19.3923 15.626C19.3923 16.0927 19.4856 16.5033 19.6723 16.858C19.8589 17.2033 20.1249 17.474 20.4703 17.67C20.8156 17.8567 21.2123 17.95 21.6603 17.95C22.0336 17.95 22.3743 17.8847 22.6823 17.754C22.9996 17.6233 23.2703 17.4273 23.4943 17.166L24.3063 17.992C23.9889 18.3653 23.5969 18.65 23.1303 18.846C22.6729 19.042 22.1829 19.14 21.6603 19.14ZM28.9141 19.14C28.3074 19.14 27.7568 18.9907 27.2621 18.692C26.7674 18.384 26.3754 17.9687 26.0861 17.446C25.8061 16.9233 25.6661 16.3353 25.6661 15.682C25.6661 15.0287 25.8061 14.4407 26.0861 13.918C26.3754 13.3953 26.7628 12.98 27.2481 12.672C27.7428 12.364 28.2981 12.21 28.9141 12.21C29.4181 12.21 29.8661 12.3173 30.2581 12.532C30.6594 12.7373 30.9814 13.0267 31.2241 13.4C31.4668 13.764 31.6021 14.1887 31.6301 14.674V16.676C31.6021 17.152 31.4668 17.5767 31.2241 17.95C30.9908 18.3233 30.6734 18.6173 30.2721 18.832C29.8801 19.0373 29.4274 19.14 28.9141 19.14ZM29.1241 17.95C29.7494 17.95 30.2534 17.74 30.6361 17.32C31.0188 16.8907 31.2101 16.3447 31.2101 15.682C31.2101 15.2247 31.1214 14.828 30.9441 14.492C30.7761 14.1467 30.5334 13.8807 30.2161 13.694C29.8988 13.498 29.5301 13.4 29.1101 13.4C28.6901 13.4 28.3168 13.498 27.9901 13.694C27.6728 13.89 27.4208 14.1607 27.2341 14.506C27.0568 14.842 26.9681 15.2293 26.9681 15.668C26.9681 16.116 27.0568 16.5127 27.2341 16.858C27.4208 17.194 27.6774 17.46 28.0041 17.656C28.3308 17.852 28.7041 17.95 29.1241 17.95ZM31.1261 19V17.208L31.3641 15.584L31.1261 13.974V12.35H32.4001V19H31.1261ZM35.2292 19V9.564H36.4892V19H35.2292ZM33.5912 13.498V12.35H38.1272V13.498H33.5912ZM42.0355 19.14C41.4942 19.14 41.0042 19.0187 40.5655 18.776C40.1362 18.524 39.8002 18.1787 39.5575 17.74C39.3148 17.3013 39.1935 16.7927 39.1935 16.214V12.35H40.4535V16.158C40.4535 16.522 40.5142 16.8393 40.6355 17.11C40.7662 17.3713 40.9528 17.572 41.1955 17.712C41.4382 17.852 41.7228 17.922 42.0495 17.922C42.5442 17.922 42.9315 17.768 43.2115 17.46C43.4915 17.1427 43.6315 16.7087 43.6315 16.158V12.35H44.8915V16.214C44.8915 16.7927 44.7702 17.3013 44.5275 17.74C44.2848 18.1787 43.9488 18.524 43.5195 18.776C43.0995 19.0187 42.6048 19.14 42.0355 19.14ZM46.5802 19V12.35H47.8403V19H46.5802ZM47.8403 15.206L47.3643 14.996C47.3643 14.1467 47.5603 13.47 47.9523 12.966C48.3443 12.462 48.9089 12.21 49.6463 12.21C49.9823 12.21 50.2856 12.2707 50.5563 12.392C50.8269 12.504 51.0789 12.6953 51.3123 12.966L50.4863 13.82C50.3463 13.6707 50.1923 13.5633 50.0243 13.498C49.8563 13.4327 49.6603 13.4 49.4363 13.4C48.9696 13.4 48.5869 13.5493 48.2883 13.848C47.9896 14.1467 47.8403 14.5993 47.8403 15.206ZM55.0606 19.14C54.398 19.14 53.8006 18.9907 53.2686 18.692C52.7366 18.384 52.3166 17.9687 52.0086 17.446C51.7006 16.9233 51.5466 16.3307 51.5466 15.668C51.5466 15.0147 51.696 14.4267 51.9946 13.904C52.3026 13.3813 52.7133 12.9707 53.2266 12.672C53.7493 12.364 54.3326 12.21 54.9766 12.21C55.5926 12.21 56.134 12.35 56.6006 12.63C57.0766 12.91 57.4453 13.2973 57.7066 13.792C57.9773 14.2867 58.1126 14.8467 58.1126 15.472C58.1126 15.5653 58.108 15.668 58.0986 15.78C58.0893 15.8827 58.0706 16.004 58.0426 16.144H52.4286V15.094H57.3706L56.9086 15.5C56.9086 15.052 56.8293 14.674 56.6706 14.366C56.512 14.0487 56.288 13.806 55.9986 13.638C55.7093 13.4607 55.3593 13.372 54.9486 13.372C54.5193 13.372 54.1413 13.4653 53.8146 13.652C53.488 13.8387 53.236 14.1 53.0586 14.436C52.8813 14.772 52.7926 15.1687 52.7926 15.626C52.7926 16.0927 52.886 16.5033 53.0726 16.858C53.2593 17.2033 53.5253 17.474 53.8706 17.67C54.216 17.8567 54.6126 17.95 55.0606 17.95C55.434 17.95 55.7746 17.8847 56.0826 17.754C56.4 17.6233 56.6706 17.4273 56.8946 17.166L57.7066 17.992C57.3893 18.3653 56.9973 18.65 56.5306 18.846C56.0733 19.042 55.5833 19.14 55.0606 19.14ZM62.3005 19.14C61.6845 19.14 61.1338 18.9907 60.6485 18.692C60.1632 18.384 59.7758 17.9687 59.4865 17.446C59.2065 16.9233 59.0665 16.3353 59.0665 15.682C59.0665 15.0287 59.2065 14.4407 59.4865 13.918C59.7758 13.3953 60.1632 12.98 60.6485 12.672C61.1338 12.364 61.6845 12.21 62.3005 12.21C62.7952 12.21 63.2432 12.3173 63.6445 12.532C64.0458 12.7373 64.3678 13.0267 64.6105 13.4C64.8625 13.764 65.0025 14.1887 65.0305 14.674V16.676C65.0025 17.152 64.8672 17.5767 64.6245 17.95C64.3818 18.3233 64.0598 18.6173 63.6585 18.832C63.2572 19.0373 62.8045 19.14 62.3005 19.14ZM62.5105 17.95C62.9305 17.95 63.2945 17.852 63.6025 17.656C63.9198 17.46 64.1672 17.194 64.3445 16.858C64.5218 16.5127 64.6105 16.1207 64.6105 15.682C64.6105 15.2247 64.5172 14.828 64.3305 14.492C64.1532 14.156 63.9058 13.89 63.5885 13.694C63.2805 13.498 62.9165 13.4 62.4965 13.4C62.0765 13.4 61.7078 13.498 61.3905 13.694C61.0732 13.89 60.8212 14.1607 60.6345 14.506C60.4572 14.842 60.3685 15.2293 60.3685 15.668C60.3685 16.116 60.4572 16.5127 60.6345 16.858C60.8212 17.194 61.0732 17.46 61.3905 17.656C61.7172 17.852 62.0905 17.95 62.5105 17.95ZM65.8005 19H64.5265V17.208L64.7645 15.584L64.5265 13.974V9.004H65.8005V19Z" fill="#F8F9FF"/>
                  </svg>
                  <!-- Influencer tag -->
                  <svg v-if='appUser.statusBadge.influencer' width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="28" height="28" rx="14" fill="#C6EDF6"/>
                    <path d="M13.064 19V9.2H14.674V19H13.064Z" fill="#020721"/>
                  </svg>
                  <!-- Public figure -->
                  <svg v-if='appUser.statusBadge.public_figure' width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="28" height="28" rx="14" fill="#DCDEFF"/>
                    <path d="M7.67 15.304V13.904H10.12C10.456 13.904 10.75 13.8387 11.002 13.708C11.2633 13.568 11.4687 13.3767 11.618 13.134C11.7673 12.882 11.842 12.588 11.842 12.252C11.842 11.916 11.7673 11.6267 11.618 11.384C11.4687 11.132 11.2633 10.9407 11.002 10.81C10.75 10.67 10.456 10.6 10.12 10.6H7.67V9.2H10.204C10.82 9.2 11.3707 9.326 11.856 9.578C12.3507 9.83 12.738 10.1847 13.018 10.642C13.3073 11.0993 13.452 11.636 13.452 12.252C13.452 12.868 13.3073 13.4047 13.018 13.862C12.738 14.3193 12.3507 14.674 11.856 14.926C11.3707 15.178 10.82 15.304 10.204 15.304H7.67ZM6.564 19V9.2H8.174V19H6.564ZM14.9038 19V9.2H16.5138V19H14.9038ZM16.0098 14.8V13.33H20.9938V14.8H16.0098ZM16.0098 10.67V9.2H21.2318V10.67H16.0098Z" fill="#020721"/>
                  </svg>                  
                    <!-- <Icon
                      icon="mdi:check-decagram"
                      class="verified-icon text-green-600"
                      width="20"
                      height="20"
                    /> -->
                  </div>
                </div>
                <div class='w-full grid grid-cols-2 px-4 gap-2 mb-2'>
                    <div class='col-span-2 md:col-span-1 flex items-center justify-between px-2'>Public Figure <Switch :disabled='!update' :checked='appUser.statusBadge.public_figure' @click='()=> toggleUserStatus("public_figure", _id)'/></div>
                    <div class='col-span-2 md:col-span-1 flex items-center justify-between px-2'>Influencer <Switch :disabled='!update' :checked='appUser.statusBadge.influencer' @click='()=> toggleUserStatus("influencer", _id)'/></div>
                    <div class='col-span-2 md:col-span-1 flex items-center justify-between px-2'>Featured <Switch :disabled='!update' :checked='appUser.statusBadge.featured' @click='()=> toggleUserStatus("featured", _id)'/></div>
                    <div class='col-span-2 md:col-span-1 flex items-center justify-between px-2'>Verified <Switch :disabled='!update' :checked='appUser.statusBadge.verified' @click='()=> toggleUserStatus("verified", _id)'/></div>
                </div>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
    </Card>

    <Card class="px-2 py-4 w-full lg:w-7/12 rounded-xl shadow-md overflow-y-scroll">
      <Tabs default-value="weeshes" class="space-y-2">
        <TabsList class="w-full bg-transparent">
          <TabsTrigger
            value="weeshes"
            class="text-[#000000] data-[state=active]:border-[#baef23]"
            @click="
              () => {
                userWeeshes(_id, 1)
              }
            "
          >
            Weeshes
          </TabsTrigger>
          <TabsTrigger
            value="bank"
            class="text-[#000000] data-[state=active]:border-[#baef23]"
            @click="
              () => {
                wallet(_id)
              }
            "
          >
            Wallet
          </TabsTrigger>
          <!-- <TabsTrigger value="support" class="text-[#000000] data-[state=active]:border-[#baef23]"
            >Support
          </TabsTrigger> -->
          <TabsTrigger
            value="activity"
            class="text-[#000000] data-[state=active]:border-[#baef23]"
            @click="
              () => {
                log(_id)
              }
            "
          >
            Activity log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weeshes" class="space-y-4">
          <div class="flex flex-wrap gap-3 flex-row px-2 sm:px-6 py-4 w-full mt-6">
            <Button
              variant="outline"
              class="rounded-2xl bg-[#EEEFF5]"
              @click="
                () => {
                  userWeeshes(_id)
                }
              "
            >
              <div class="flex items-center text-[15px]">
                <Icon icon="tdesign:clear" width="15" height="15" class="me-2" />
                Clear Filter
              </div>
            </Button>
            <Button
              variant="outline"
              class="rounded-2xl bg-[#EEEFF5]"
              @click="
                () => {
                  sortPrice = sortPrice === 'desc' ? 'asc' : 'desc'
                }
              "
            >
              <div class="flex items-center text-[15px]">Sort by Price</div>
            </Button>
            <Search class="flex-grow" v-model="search" />
          </div>
          <div v-if="weeshesError" class="text-[#02072199] p-10">
            {{ weeshesError }}
          </div>
          <div v-else-if="userWeeshesList.length">
            <div v-for="weeshes in userWeeshesList" :key="weeshes._id">
              <Card class="px-4 py-10 my-4 w-11/12 mx-auto shadow-md">
                <div class="flex items-center justify-end mb-6 mr-4">
                  <div class="rounded-full p-2 bg-[#EEEFF5]">
                    <Icon
                      :icon="weeshes.isLocked ? 'jam:padlock' : 'jam:padlock-open'"
                      width="24"
                      height="24"
                    />
                  </div>
                  <div
                    :class="statusBg(weeshes.status)"
                    class="rounded-full h-fit w-fit py-2 px-6 text-white text-sm capitalize ml-6"
                  >
                    {{ weeshes.status.toLocaleLowerCase() }}
                  </div>
                </div>
                <div class="xl:flex xl:justify-between xl:items-center mb-4">
                  <Carousel class="w-7/12 lg:w-4/12 mx-auto">
                    <CarouselContent>
                      <CarouselItem v-for="image in weeshes.images" :key="image._id">
                        <img :src="image.url" alt="display" class="w-full" />
                      </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious class="bg-[#baef23]" />
                    <CarouselNext class="bg-[#baef23]" />
                  </Carousel>
                  <div class="w-11/12 mx-auto xl:w-6/12 flex flex-col justify-end xl:mx-0 xl:mt-8">
                    <p
                      class="flex flex-row justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-lg border"
                    >
                      <span class="text-[#02072199] text-xs md:text-sm">Name :</span>
                      <span class="text-blue-400 font-bold text-xs md:text-sm">{{
                        weeshes.name
                      }}</span>
                    </p>
                    <div>
                      <p
                        class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-lg border"
                      >
                        <span class="text-[#02072199] text-xs md:text-sm lg:text-sm">Price :</span>
                        <span class="text-xs md:text-sm lg:text-sm text-[#020721]"
                          >{{ weeshes.currency.code }}
                          {{ weeshes.price.price.toLocaleString('en-US') }}</span
                        >
                      </p>
                      <p
                        class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-lg border"
                      >
                        <span class="text-[#02072199] text-xs md:text-sm lg:text-sm"
                          >Genie Charges :</span
                        >
                        <span class="text-xs md:text-sm lg:text-sm text-[#020721]"
                          >{{ weeshes.currency.code }}
                          {{ weeshes.price.genieGratuity.toLocaleString('en-US') }}</span
                        >
                      </p>
                    </div>
                    <div class="flex justify-between flex-col">
                      <p
                        class="flex justify-between flex-row xl:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-lg border"
                      >
                        <span class="text-[#02072199] text-xs md:text-sm">Category :</span>
                        <span class="text-xs md:text-sm text-[#020721] md:ml-4">
                          {{ weeshes.category.name }}</span
                        >
                      </p>
                      <p
                        class="flex flex-row justify-between xl:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-lg border"
                      >
                        <span class="text-[#02072199] text-xs md:text-sm">Wish Year :</span>
                        <span class="text-xs md:text-sm text-[#020721] ml-4">
                          {{ weeshes.wishYear }}</span
                        >
                      </p>
                    </div>
                  </div>
                </div>
                <div class="my-6 w-11/12 mx-auto">
                  <Button
                    variant="outline"
                    class="rounded-xl bg-[#EEEFF5] col-span-3 md:col-span-1 my-4"
                    @click="
                      () => {
                        toggleContributors(weeshes._id)
                      }
                    "
                  >
                    <div class="flex items-center text-[10px] md:text-xs">
                      Progress
                      <Icon
                        :icon="
                          visibleContributors[weeshes._id]
                            ? 'mdi-light:chevron-up'
                            : 'mdi-light:chevron-down'
                        "
                        width="20"
                      />
                    </div>
                  </Button>
                  <div class="flex items-center justify-between mx-4">
                    <p class="italic text-xs">{{ getContributionPercentage(weeshes) }} %</p>
                    <Progress
                      :model-value="getContributionPercentage(weeshes)"
                      class="mr-2 w-10/12"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Icon icon="noto:wrapped-gift" width="40" height="40" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{{ getContributionPercentage(weeshes) }}%</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div
                  v-for="contributors in weeshes.contributions"
                  :key="contributors._id"
                  class="my-4"
                >
                  <transition name="fade">
                    <div v-if="visibleContributors[weeshes._id]">
                      <div class="relative py-0.5 px-4">
                        <div
                          class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-full border"
                        >
                          <p
                            v-if="contributors.isContributorAnonymous"
                            class="text-[#02072199] text-xs md:text-sm lg:text-sm"
                          >
                            Annonymous
                          </p>
                          <p v-else class="text-[#02072199] text-xs md:text-sm lg:text-sm">
                            {{ contributors.contributor.firstName }}
                            {{ contributors.contributor.lastName }}
                          </p>
                          <p class="italic text-xs md:text-sm lg:text-sm text-[#020721]">
                            {{ weeshes.currency.code }}
                            {{ contributors.amount.toLocaleString('en-US') }}
                          </p>
                        </div>
                        <div class="absolute -top-5 left-7">
                          <div
                            v-if="
                              contributors.contributor.avatar !== null &&
                              !contributors.isContributorAnonymous
                            "
                          >
                            <img
                              :src="contributors.contributor.avatar"
                              class="w-4/12 rounded-full border-2 border-[#baef23]"
                              alt="avatar"
                            />
                          </div>
                          <div v-else>
                            <Icon
                              icon="iconamoon:profile-circle-duotone"
                              width="35"
                              height="35"
                              class="mt-2 text-blue-400"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </Card>
            </div>
            <PagePagination
              :page-total="weeshesPageTotal"
              :page-current="weeshesCurrentPage"
              @pagination="handleWeeshesPageChange"
            />
          </div>
          <div v-else class="text-[#02072199] p-10">
            <p>User doesn't have any Weeshes at the moment</p>
          </div>
        </TabsContent>

        <TabsContent value="bank" class="space-y-4">
          <div class="xl:flex gap-2 mt-8 mx-4" v-if="userWallet">
            <Card
              class="h-[230px] rounded-lg w-11/12 mx-auto xl:w-6/12 border-transparent mt-8 xl:mt-0 flex-grow bg-blue-50"
            >
              <CardContent class="w-full">
                <div class="flex justify-between px-2 mt-4">
                  <p class="font-medium">Bank Balance</p>
                  <Icon icon="tdesign:money" width="24px" height="24px" />
                </div>
                <div class="text-sm mt-2">
                  <div class="md:flex items-center justify-between">
                    <div class="flex justify-between items-center gap-2 mt-6">
                      <p class="font-medium text-lg">
                        {{ userWallet.currency }}
                        {{ userWallet.balance.toLocaleString('en-US') }}
                      </p>
                    </div>
                  </div>
                  <div class="w-full mt-4">
                    <div class="flex rounded-md bg-gray-200 justify-between mb-3 p-2">
                      <p>Total Inflow</p>
                      <p class="font-medium text-lg">
                        {{ userWallet.currency }}
                        {{ userWallet.total_inflow.toLocaleString('en-US') }}
                      </p>
                    </div>
                    <div class="flex rounded-md bg-gray-200 justify-between p-2">
                      <p>Total Outflow</p>
                      <p class="font-medium text-lg">
                        {{ userWallet.currency }}
                        {{ userWallet.total_outflow.toLocaleString('en-US') }}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card
              class="h-[230px] rounded-lg bg-blue-50 w-11/12 mx-auto xl:w-3/12 border-transparent mt-8 xl:mt-0"
            >
              <CardContent class="flex flex-col justify-between h-full">
                <div class="w-full flex justify-between mt-4">
                  <p class="font-medium">Cash Request</p>
                  <Icon
                    icon="heroicons-outline:external-link"
                    width="24px"
                    height="24px"
                    @click="openApprovalModal = true"
                  />
                  <PaymentApproval
                    :openApprovalModal="openApprovalModal"
                    :items="items"
                    @update:openApprovalModal="(value) => (openApprovalModal = value)"
                  />
                </div>
                <div class="md:flex items-center justify-between -mt-6">
                  <p class="font-medium text-lg">
                    {{ userWallet.currency }}
                    {{ userWallet.balance.toLocaleString('en-US') }}
                  </p>
                </div>
                <div class="flex justify-end">
                  <Button @click="openApprovalModal = true" class="rounded-full bg-[#00c37f]"
                    >Approve</Button
                  >
                </div>
              </CardContent>
            </Card>
            <Card
              class="h-[230px] rounded-lg bg-blue-50 w-11/12 mx-auto xl:w-3/12 border-transparent mt-8 xl:mt-0"
            >
              <CardContent class="flex flex-col justify-between h-full">
                <div class="w-full flex justify-between mt-4">
                  <p class="font-medium">Lien</p>
                  <Icon icon="fluent:arrow-enter-16-filled" width="24px" height="24px" />
                  <!-- <div
                    class="fixed inset-0 flex items-center justify-center w-full h-full bg-black/30 backdrop-blur-md z-50"
                  >
                    <Card>
                      <CardHeader><Icon icon="ri:secure-payment-line" /></CardHeader>
                      <CardDescription>
                        <p>Be sure to review carefully</p>
                        <p>You're about to approve the following transactions</p>
                      </CardDescription>
                      <CardContent>
                        <div v-if="items">
                          <div v-for="item in items" :key="item.id">
                            <div class="flex">
                              <p>{{ item.name }}</p>
                              <p>{{ item.amount }}</p>
                            </div>
                          </div>
                          <div class="flex justify-between">
                            <div>
                              <p>Total amount approved</p>
                              <p>{{ item.total }}</p>
                            </div>
                            <div>
                              <Button>Approve</Button>
                            </div>
                          </div>
                        </div>
                        <div v-else>No transaction is currently awaiting approval</div>
                      </CardContent>
                    </Card>
                  </div> -->
                </div>
                <div class="md:flex items-center justify-between -mt-6">
                  <p class="font-medium text-lg">
                    {{ userWallet.currency }}
                    {{ userWallet.balance.toLocaleString('en-US') }}
                  </p>
                </div>
                <div class="flex justify-end">
                  <Button class="rounded-full bg-gray-200 text-gray-500">View</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div class="overflow-auto bg-white rounded-md md:mx-6">
            <div v-if="walletError" class="text-[#02072199] p-10">
              {{ walletError }}
            </div>
            <div v-else-if="userWalletList">
              <Card>
                <div
                  class="flex gap-2 w-11/12 flex-wrap justify-end my-4 mr-4 items-center text-[15px]"
                >
                  <Button
                    variant="outline"
                    class="rounded-2xl bg-[#EEEFF5] col-span-3 md:col-span-1"
                    @click="() => getWalletList(_id)"
                  >
                    <div class="flex items-center text-[10px] md:text-xs">
                      <Icon icon="tdesign:clear" width="15" height="15" class="me-2" />
                      Clear Filter
                    </div>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5]">
                      <Button variant="outline">
                        <div class="flex items-center text-[10px] md:text-xs">
                          Sort by Type
                          <Icon icon="ion:chevron-down-outline" class="ml-1" />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="item-center justify-between">
                      <DropdownMenuCheckboxItem @click="() => handleTypeSort('INFLOW')">
                        INFLOW
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem @click="() => handleTypeSort('OUTFLOW')">
                        OUTFLOW
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Table class="min-w-full">
                  <TableHeader>
                    <TableRow
                      class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-100 shadow"
                    >
                      <TableHead>
                        <div class="flex items-center">Type</div>
                      </TableHead>
                      <TableHead>
                        <div class="flex items-center">Date</div>
                      </TableHead>
                      <TableHead>
                        <div class="flex items-center">Amount</div>
                      </TableHead>
                      <TableHead>
                        <div class="flex items-center">Status</div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow
                      v-for="(transaction, index) in userWalletList"
                      :key="transaction.id"
                      :class="index % 2 === 0 ? 'bg-gray-50' : ''"
                    >
                      <TableCell>{{ transaction.type }}</TableCell>
                      <TableCell>{{ dateFormat(transaction.time) }}</TableCell>
                      <TableCell
                        >{{ transaction.currency }}
                        {{ transaction.amount.toLocaleString() }}</TableCell
                      >
                      <TableCell class="font-medium">
                        {{ transaction.status }}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div
                  class="flex gap-2 w-11/12 flex-wrap justify-end my-8 mr-4 items-center text-[15px]"
                >
                  <PaginationIndex
                    :count="walletCount"
                    :per-page="pagination?.per_page"
                    :from="pagination?.from"
                    :to="pagination?.to"
                    :next-from="pagination?.next_from"
                    :valid-next-page="pagination?.valid_next_page"
                    :prev-from="pagination?.prev_from"
                    :valid-prev-page="pagination?.valid_prev_page"
                    @per_page="(val: number) => (walletPage.per_page = val)"
                    @prev="(val: number) => (walletPage.page_item_from = val)"
                    @next="(val: number) => (walletPage.page_item_from = val)"
                  />
                </div>
              </Card>
            </div>
            <div v-else class="text-[#02072199] p-10">
              <p>No user data available</p>
            </div>
          </div>
        </TabsContent>

        <!-- <TabsContent value="support" class="space-y-4"> </TabsContent> -->

        <TabsContent value="activity" class="space-y-4">
          <div class="flex gap-2 w-11/12 flex-wrap justify-end mt-8 mr-4 items-center text-[15px]">
            <Button
              variant="outline"
              class="rounded-2xl bg-[#EEEFF5]"
              @click="
                () => {
                  log(_id)
                }
              "
            >
              <div class="flex items-center text-[12px]">
                <Icon icon="tdesign:clear" width="15" height="15" class="me-2" />
                Clear Filter
              </div>
            </Button>

            <Button
              variant="outline"
              class="rounded-2xl bg-[#EEEFF5]"
              @click="
                () => {
                  filter.sort_direction = filter.sort_direction === 'asc' ? 'desc' : 'asc'
                }
              "
            >
              <div class="flex items-center text-[10px] md:text-xs">Sort By Date</div>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5]">
                <Button variant="outline">
                  <div class="flex items-center text-[10px] md:text-xs">
                    {{ filter.log_action || 'All Actions' }}
                    <Icon icon="ion:chevron-down-outline" class="ml-1" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="item-center justify-between max-h-80 overflow-y-auto">
                <DropdownMenuLabel class="item-center justify-center text-center">
                  Select Action
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup v-model="filter.log_action">
                  <DropdownMenuRadioItem value="" class="item-center text-center">
                    All Actions
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    v-for="action in logActions"
                    :key="action"
                    :value="action"
                    class="item-center text-center"
                  >
                    {{ action }}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5]">
                <Button variant="outline">
                  <div class="flex items-center text-[10px] md:text-xs">
                    {{ filter.log_status || 'All Status' }}
                    <Icon icon="ion:chevron-down-outline" class="ml-1" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="item-center justify-between max-h-80 overflow-y-auto">
                <DropdownMenuLabel class="item-center justify-center text-center">
                  Select Status
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup v-model="filter.log_status">
                  <DropdownMenuRadioItem value="" class="item-center text-center">
                    All Status
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    v-for="status in logStatus"
                    :key="status"
                    :value="status"
                    class="item-center text-center"
                  >
                    {{ status }}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div v-if="logError" class="text-[#02072199] p-10">
            <p>{{ logError }}</p>
          </div>
          <div v-else-if="userLog && userLog.length" class="relative">
            <div class="timeline">
              <div v-for="logItem in userLog" :key="logItem.id">
                <Card class="px-4 my-2 relative ms-8 md:ms-12 xl:ms-16 w-10/12 me-4 shadow-md">
                  <CardHeader>
                    <p
                      class="rounded-[15px] w-fit px-3 py-1 bg-[#baef23] absolute z-10 -left-4 lg:-left-10 top-3.5 italic text-sm"
                    >
                      {{ dateFormat(logItem.timestamp, 'time') }}
                    </p>
                    <CardDescription>
                      <div class="mt-10">
                        <div class="lg:flex lg:justify-between">
                          <p class="text-blue-400 font-bold text-lg">{{ logItem.action }}</p>
                          <h3
                            :class="
                              logItem.status == 'SUCCESS' ? 'text-green-900' : 'text-gray-500'
                            "
                            class="font-bold text-xl italic"
                          >
                            {{ logItem.status }}
                          </h3>
                        </div>
                        <p class="mt-4 text-xs">{{ logItem.description }}</p>
                        <div class="lg:flex lg:justify-between my-2">
                          <p>
                            <span class="text-blue-400 me-2">Email :</span>
                            {{ logItem.user.extras.email }}
                          </p>
                          <p>
                            <span class="text-blue-400 me-2">Username :</span>
                            {{ logItem.user.extras.userName }}
                          </p>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
            <div
              class="flex gap-2 w-11/12 flex-wrap justify-end mt-8 mr-4 items-center text-[15px]"
            >
              <PaginationIndex
                :count="count"
                :per-page="logPagination?.per_page"
                :from="logPagination?.from"
                :to="logPagination?.to"
                :next-from="logPagination?.next_from"
                :valid-next-page="logPagination?.valid_next_page"
                :prev-from="logPagination?.prev_from"
                :valid-prev-page="logPagination?.valid_prev_page"
                @per_page="(val: number) => (filter.per_page = val)"
                @prev="(val: number) => (filter.page_item_from = val)"
                @next="(val: number) => (filter.page_item_from = val)"
              />
            </div>
          </div>
          <div v-else class="text-[#02072199] p-10">
            <p>No user log available</p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  </div>
</template>

<style scoped>
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
</style>
