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
import LienComponent from '@/components/LienComponent.vue'

//get User
const route = useRoute()
const _id = route.params.id

const { appUser, error, load } = getUser()
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
const openLienModal = ref<boolean>(false)

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
              class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-full border"
            >
              <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Full Name</p>
              <p class="text-xs md:text-sm lg:text-sm text-[#020721]">
                {{ appUser.firstName }} {{ appUser.middleName }} {{ appUser.lastName }}
              </p>
            </div>
            <div
              class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-full border"
            >
              <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Preferred</p>
              <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{ appUser.userName }}</p>
            </div>
            <div
              class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-full border"
            >
              <p class="flex grow text-[#02072199] text-xs md:text-sm lg:text-sm">Birthday</p>
              <p class="text-xs md:text-sm lg:text-sm text-[#020721]">
                {{ dateFormat(appUser.dob) }}
              </p>
            </div>
            <div
              class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-full border"
            >
              <p class="flex grow text-[#02072199] text-xs md:text-sm lg:text-sm">Gender</p>
              <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{ appUser.gender }}</p>
            </div>
            <div class="px-6 py-4">
              <span class="text-base font-bold lg:text-base text-[#020721]">Contact</span>
            </div>
            <div
              class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-full border"
            >
              <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Email</p>
              <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{ appUser.email }}</p>
            </div>
            <div
              class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-full border"
            >
              <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Phone</p>
              <p class="text-xs md:text-sm text-[#020721]">
                {{ appUser.phoneNumber.normalizedNumber }}
              </p>
            </div>

            <div
              class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-1 my-2 rounded-full border"
            >
              <p class="text-[#02072199] text-xs md:text-sm lg:text-sm pt-2">Profile Privacy</p>
              <label class="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" value="" checked class="peer sr-only" />
                <div
                  class="peer flex h-8 items-center gap-6 rounded-full bg-[#baef23] px-4 text-black after:absolute after:left-1 after: after:h-6 after:w-16 after:rounded-full after:bg-[#F4ffc8]/50 after:transition-all after:content-[''] peer-checked:bg-green-900 peer-checked:after:translate-x-full peer-focus:outline-none dark:border-slate-600 dark:bg-slate-700 text-sm peer-checked:text-white"
                >
                  <span>Public</span>
                  <span>Private</span>
                </div>
              </label>
            </div>

            <div
              class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-1 my-2 rounded-full border"
            >
              <p class="flex grow text-[#02072199] text-xs md:text-sm lg:text-sm pt-2">
                User Status
              </p>
              <div
                class="rounded-[15px] w-fit px-3 py-1 text-white text-sm capitalize flex items-center"
                :class="appUser.emailVerified ? 'bg-green-900' : 'bg-gray-500'"
              >
                <Icon
                  :icon="
                    appUser.emailVerified
                      ? 'ic:outline-mark-email-read'
                      : 'mdi:email-remove-outline'
                  "
                  width="24"
                  height="24"
                  class="me-2"
                />
                <p class="text-xs md:text-sm lg:text-sm">
                  {{ appUser.emailVerified ? 'Verified' : 'Unverified' }}
                </p>
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
                      class="flex flex-row justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-full border"
                    >
                      <span class="text-[#02072199] text-xs md:text-sm">Name :</span>
                      <span class="text-blue-400 font-bold text-xs md:text-sm">{{
                        weeshes.name
                      }}</span>
                    </p>
                    <div>
                      <p
                        class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-full border"
                      >
                        <span class="text-[#02072199] text-xs md:text-sm lg:text-sm">Price :</span>
                        <span class="text-xs md:text-sm lg:text-sm text-[#020721]"
                          >{{ weeshes.currency.code }}
                          {{ weeshes.price.price.toLocaleString('en-US') }}</span
                        >
                      </p>
                      <p
                        class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-full border"
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
                        class="flex justify-between flex-row xl:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-full border"
                      >
                        <span class="text-[#02072199] text-xs md:text-sm">Category :</span>
                        <span class="text-xs md:text-sm text-[#020721] md:ml-4">
                          {{ weeshes.category.name }}</span
                        >
                      </p>
                      <p
                        class="flex flex-row justify-between xl:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-full border"
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
              class="md:h-[230px] h-fit rounded-lg w-11/12 mx-auto xl:w-6/12 border-transparent mt-8 xl:mt-0 flex-grow bg-blue-50"
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
                    <div class="md:flex rounded-md bg-gray-200 justify-between mb-3 p-2">
                      <p class="mb-2 md:mb-0">Total Inflow</p>
                      <p class="font-medium text-lg">
                        {{ userWallet.currency }}
                        {{ userWallet.total_inflow.toLocaleString('en-US') }}
                      </p>
                    </div>
                    <div class="md:flex rounded-md bg-gray-200 justify-between p-2">
                      <p class="mb-2 md:mb-0">Total Outflow</p>
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
                  <Icon
                    icon="fluent:arrow-enter-16-filled"
                    width="24px"
                    height="24px"
                    @click="openLienModal = true"
                  />
                  <LienComponent
                    :openLienModal="openLienModal"
                    :items="items"
                    @update:openLienModal="(value) => (openLienModal = value)"
                  />
                </div>
                <div class="md:flex items-center justify-between -mt-6">
                  <p class="font-medium text-lg">
                    {{ userWallet.currency }}
                    {{ userWallet.balance.toLocaleString('en-US') }}
                  </p>
                </div>
                <div class="flex justify-end">
                  <Button
                    class="rounded-full bg-gray-200 text-gray-500"
                    @click="openLienModal = true"
                    >View</Button
                  >
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
</style>
