<script setup lang="ts">
import Search from '@/components/UseSearch.vue'
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
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

import { Dialog, DialogContent, DialogFooter, DialogClose } from '@/components/ui/dialog'

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
  SheetDescription,
  // SheetHeader,
  SheetTitle,
  // SheetTrigger,
  sheetVariants
} from '@/components/ui/sheet'

import EmailTemplate from '@/views/protected/AdminModule/EmailTemplate.vue'

import { onMounted, reactive, ref, watch } from 'vue'
import getUsers, { type User, type UserFilter } from '@/composables/getUsers'
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'
import PagePagination from './PagePagination.vue'
import axios from '@/services/ApiService'
import { toast } from '@/components/ui/toast'
import { catchErr } from '@/composables/catchError'
import { ability, defineAbilities } from '@/lib/ability'
import { useUserTablePageStore } from '@/stores/userTableStore'
import * as XLSX from 'xlsx'
import DialogTitle from './ui/dialog/DialogTitle.vue'
import DialogDescription from './ui/dialog/DialogDescription.vue'

//logic
defineAbilities()
const update = ability.can('update', 'users')
const { users, error, totalPages, currentPage, load } = getUsers()

const appUsers = ref(users)
const errors = error

const sheetClass = sheetVariants({ length: 'template' })
// const isSheetOpen = ref(true) // Set to true to open by default

const filter = reactive<UserFilter>({
  page: 1,
  per_page: 20,
  gender: '',
  startDateMonth: '',
  endDateMonth: '',
  search: '',
  birthdayFilterConstants: ''
})

onMounted(() => {
  load(filter)
})

watch(filter, () => {
  load(filter)
})

//birthday
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

const dates = Array.from({ length: 31 }, (_, i) => i + 1)

const dateOfBirth = (dob: string) => {
  const date = new Date(dob)

  const day = String(date.getUTCDate()).padStart(2, '0')
  const monthNames = months
  const month = monthNames[date.getUTCMonth()]
  const year = date.getUTCFullYear()

  const formattedDate = `${day} - ${month} - ${year}`

  return formattedDate
}

const startMonth = ref<string>('')
const startDay = ref<string>('')
const endMonth = ref<string>('')
const endDay = ref<string>('')
const openDateDialog = ref(false)

const handleBirthdayFilter = () => {
  if (startDay.value && startMonth.value && endMonth.value && endDay.value) {
    const startMonthIndex = months.indexOf(startMonth.value)
    const endMonthIndex = months.indexOf(endMonth.value)

    if (startMonthIndex === -1 || endMonthIndex === -1) {
      toast({
        description: 'Please select a valid month',
        variant: 'warning'
      })
      return
    }

    const formattedStartMonthIndex = (startMonthIndex + 1).toString().padStart(2, '0')
    const formattedEndMonthIndex = (endMonthIndex + 1).toString().padStart(2, '0')

    filter.startDateMonth = `${startDay.value} - ${formattedStartMonthIndex}`
    filter.endDateMonth = `${endDay.value} - ${formattedEndMonthIndex}`
    filter.birthdayFilterConstants = ''

    startDay.value = ''
    startMonth.value = ''
    endMonth.value = ''
    endDay.value = ''
  }
}

//search
const search = ref('')

watch(search, () => {
  filter.search = search.value
})

const store = useUserTablePageStore()

const lastPage = computed(() => {
  return store.currentPage
})

//filter
type SortItem = 'verified' | 'unverified' | 'all'

const order = ref<SortItem>('all')

const handleClick = (term: SortItem) => {
  order.value = term
}
const handleReset = () => {
  ;(filter.page = lastPage.value),
    (filter.per_page = 20),
    (filter.gender = ''),
    (filter.startDateMonth = ''),
    (filter.endDateMonth = ''),
    (filter.search = ''),
    (filter.birthdayFilterConstants = ''),
    load(filter)
}

const sortUsers = computed(() => {
  let users = [...appUsers.value]
  if (order.value === 'verified') {
    users = users.filter((user) => user.emailVerified)
  } else if (order.value === 'unverified') {
    users = users.filter((user) => !user.emailVerified)
  }
  return users
})

//pagination
const pageTotal = ref(totalPages)
const pageCurrent = ref(currentPage)

const handlePageChange = (page: number) => {
  filter.page = page
  load(filter)
}

const alert = ref(false)
const confirmSheet = ref(false)
const stage = ref('')

const selectedUsers = ref<string[]>([])
const selectedUsersData = ref<User[]>([])
const selectAll = ref(false)

const clearIds = () => {
  selectedUsers.value = []
}
const extractIds = () => {
  selectedUsers.value = []
  selectedUsers.value = sortUsers.value.map((obj) => obj._id)
}

const extractUser = () => {
  selectedUsersData.value = []
  selectedUsersData.value = sortUsers.value
}

const clearUser = () => {
  selectedUsersData.value = []
}

const emailTemplateProps = ref<{ name: string; ids: string[] }>({
  name: 'John Doe',
  ids: selectedUsers.value // Example IDs
})

const toggleSelectAll = () => {
  if (selectAll.value === false) {
    extractUser()
    extractIds()
  } else {
    clearUser()
    clearIds()
  }
  selectAll.value = !selectAll.value
}

const toggleValue = (value: string) => {
  const index = selectedUsers.value.indexOf(value)
  if (index !== -1) {
    // If the value exists, remove it
    selectedUsers.value.splice(index, 1)
  } else {
    // If the value does not exist, add it
    selectedUsers.value.push(value)
  }
}

function checkValue(value: string) {
  const index = selectedUsers.value.indexOf(value)
  if (index !== -1) {
    // If the value exists, remove it
    return true
  } else {
    // If the value does not exist, add it
    return false
  }
}

const handleConfirmation = (val: string) => {
  alert.value = true
  stage.value = val
}

const sendReset = async () => {
  toast({
    description: 'Loading...',
    variant: 'loading',
    duration: 0 // Set duration to 0 to make it indefinite until manually closed
  })
  try {
    const response = await axios.post(`/api/v1/admin/accounts/users/reset/pin`, {
      ids: selectedUsers.value
    })

    if (response.status === 200 || response.status === 201) {
      toast({
        description: response.data.message,
        variant: 'success'
      })
    }
  } catch (error: any) {
    catchErr(error)
  }
}

const sendVerification = async () => {
  toast({
    description: 'Loading...',
    variant: 'loading',
    duration: 0 // Set duration to 0 to make it indefinite until manually closed
  })
  try {
    const response = await axios.post(`/api/v1/admin/accounts/users/send/email-verification`, {
      ids: selectedUsers.value
    })

    if (response.status === 200 || response.status === 201) {
      toast({
        description: response.data.message,
        variant: 'success'
      })
    }
  } catch (error: any) {
    catchErr(error)
  }
}

//per page input
const dropDown = [10, 20, 50, 100, 200, 500, 1000, 2000, 4000, 5000, 7000, 10000, 20000]

const setPerPage = (item: number) => {
  filter.per_page = item
}

//download excel file

const exportToExcel = () => {
  if (selectedUsers.value.length === 0) {
    toast({
      description: 'Please select a user to export',
      variant: 'warning'
    })
    return
  }
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(selectedUsersData.value)

  XLSX.utils.book_append_sheet(wb, ws, 'Users')

  XLSX.writeFile(wb, 'users.xlsx')
}
</script>

<template>
  <AlertDialog v-model:open="alert">
    <div>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle
            >Are you absolutely sure you want to send a mail to
            <span v-if="stage === 'reset'">RESET PINS</span>
            <span v-if="stage === 'verify'">VERIFY EMAIILS</span> to all selected users
            ?</AlertDialogTitle
          >
          <AlertDialogDescription> This action cannot be undone. </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction v-if="stage === 'reset'" @click="sendReset"
            >Send reset mail</AlertDialogAction
          >
          <AlertDialogAction v-if="stage === 'verify'" @click="sendVerification"
            >Send verification mail</AlertDialogAction
          >
        </AlertDialogFooter>
      </AlertDialogContent>
    </div>
  </AlertDialog>
  <Sheet v-model:open="confirmSheet">
    <SheetContent :class="sheetClass" length="full">
      <SheetTitle class="py-10 text-3xl"> Email template</SheetTitle>
      <SheetDescription> <EmailTemplate v-bind="emailTemplateProps" /></SheetDescription>
    </SheetContent>
  </Sheet>
  <div class="space-y-2">
    <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-4 sm:mb-0">
      App Users
      <p class="text-xs sm:text-sm text-[#02072199]">List of Weeshr App Users</p>
    </div>

    <div class="items-center gap-1 flex flex-wrap">
      <DropdownMenu v-if="update">
        <DropdownMenuTrigger as-child class="">
          <Button class="text-white" :disabled="selectedUsers.length == 0">
            <div class="flex items-center text-[10px] md:text-xs">
              Mail format
              <Icon icon="ion:chevron-down-outline" class="ml-1" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="item-center justify-between">
          <DropdownMenuCheckboxItem @click="() => handleConfirmation('verify')">
            Verify emails
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem @click="() => handleConfirmation('reset')">
            Reset pin
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem @click="() => (confirmSheet = true)">
            Custom mail
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- <div class="grid flex-row items-center grid-cols-3 gap-2 md:grid-cols-4">
      <Sheet v-model="isSheetOpen" length="template">
        <SheetTrigger>
          <Button variant="" radius="lg">
            <div class="flex items-center text-[10px] md:text-xs">Email Template</div>
          </Button>
        </SheetTrigger> -->
      <!-- <SheetContent v-model="isSheetOpen"> -->
      <!-- <EmailTemplate v-bind="emailTemplateProps"/> -->
      <!-- </SheetContent> -->

      <!-- <SheetContent :class="sheetClass">
          <SheetTitle class="py-10 text-3xl"> Email template</SheetTitle>
          <SheetDescription> <EmailTemplate v-bind="emailTemplateProps" /></SheetDescription>
        </SheetContent>
      </Sheet> -->

      <DropdownMenu>
        <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5]">
          <Button variant="outline" size="sm">
            <div class="flex items-center text-[10px] md:text-xs">
              {{
                filter.birthdayFilterConstants
                  ? filter.birthdayFilterConstants.toUpperCase()
                  : 'Filter by Birthdays'
              }}
              <span v-if="filter.birthdayFilterConstants">🥳</span>
              <Icon icon="ion:chevron-down-outline" class="ml-1" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="justify-between item-center">
          <DropdownMenuGroup>
            <DropdownMenuCheckboxItem @click="() => (filter.birthdayFilterConstants = 'tommorrow')">
              Birthdays tommorrow
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              @click="() => (filter.birthdayFilterConstants = 'in-three-days')"
            >
              Birthdays in 3 days
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem @click="() => (filter.birthdayFilterConstants = 'in-a-week')">
              Birthdays in a week
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              @click="() => (filter.birthdayFilterConstants = 'in-a-month')"
            >
              Birthdays in a month
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            class="bg-gray-200"
            @click="() => (openDateDialog = !openDateDialog)"
            >Pick a date range</DropdownMenuCheckboxItem
          >
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog v-model:open="openDateDialog">
        <DialogContent class="sm:max-w-[425px]">
          <DialogTitle>Select Date Range</DialogTitle>
          <DialogDescription>
            Select the start and end dates to filter users by their birthdays within this range.
          </DialogDescription>
          <div>
            <p>Start Date:</p>
            <div class="flex justify-center items-center">
              <Select v-model="startMonth">
                <SelectTrigger class="w-fit"> <SelectValue placeholder="Month" /></SelectTrigger>
                <SelectContent class="overflow-y-auto pb-10">
                  <SelectItem v-for="month in months" :key="month" :value="month" class="text-sm">{{
                    month
                  }}</SelectItem>
                </SelectContent>
              </Select>
              <p class="font-semibold text-xl mx-2">-</p>
              <Select v-model="startDay">
                <SelectTrigger class="w-fit">
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent class="overflow-y-auto pb-10">
                  <SelectItem v-for="date in dates" :key="date" :value="date.toLocaleString()">{{
                    date
                  }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <p>End Date:</p>
            <div class="flex justify-center items-center">
              <Select v-model="endMonth">
                <SelectTrigger class="w-fit"> <SelectValue placeholder="Month" /></SelectTrigger>
                <SelectContent class="overflow-y-auto pb-10">
                  <SelectItem v-for="month in months" :key="month" :value="month" class="text-sm">{{
                    month
                  }}</SelectItem>
                </SelectContent>
              </Select>
              <p class="font-semibold text-xl mx-2">-</p>
              <Select v-model="endDay">
                <SelectTrigger class="w-fit">
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent class="overflow-y-auto pb-10">
                  <SelectItem v-for="date in dates" :key="date" :value="date.toLocaleString()">{{
                    date
                  }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" @click="() => handleBirthdayFilter()">
                Go
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5]">
          <Button variant="outline" size="sm">
            <div class="flex items-center text-[10px] md:text-xs">
              Gender
              <Icon icon="ion:chevron-down-outline" class="ml-1" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="justify-between item-center">
          <DropdownMenuCheckboxItem @click="() => (filter.gender = 'male')">
            Male
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem @click="() => (filter.gender = 'female')">
            Female
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5]">
          <Button variant="outline" size="sm">
            <div class="flex items-center text-[10px] md:text-xs">
              Status
              <Icon icon="ion:chevron-down-outline" class="ml-1" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="justify-between item-center">
          <DropdownMenuCheckboxItem @click="() => handleClick('verified')">
            Verified
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem @click="() => handleClick('unverified')">
            Unverified
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="outline"
        class="rounded-2xl bg-[#EEEFF5]"
        @click="() => handleReset()"
        size="sm"
      >
        <div class="flex items-center text-[10px] md:text-xs">
          <Icon icon="tdesign:clear" width="15" height="15" class="me-2" />
          Clear Filter
        </div>
      </Button>
      <Button
        class="bg-[#EEEFF5] rounded-2xl"
        :disabled="selectedUsersData.length === 0"
        variant="outline"
        @click="() => exportToExcel()"
      >
        <div class="flex items-center text-[10px] md:text-xs">
          Export as Excel
          <Icon icon="vscode-icons:file-type-excel" class="ml-2 text-xl text-green-700" />
        </div>
      </Button>
      <Search v-model="search" class="flex-1 max-w-[600px]" />
    </div>
  </div>

  <div class="overflow-auto bg-white rounded-lg shadow mt-2">
    <div v-if="errors" class="text-[#02072199] p-10">
      <p>{{ errors }}</p>
    </div>
    <div v-else-if="sortUsers.length">
      <Table class="lg:w-full w-[800px]">
        <TableHeader>
          <TableRow
            class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
          >
            <TableHead v-if="update">
              <div class="flex items-center justify-center w-full h-full gap-2">
                <input
                  @click="toggleSelectAll"
                  type="checkbox"
                  class="p-2 accent-[#020721] border-2"
                />
                <p class="text-nowrap text-xs">Select all</p>
              </div>
            </TableHead>
            <TableHead class="text-nowrap"> Weeshr name </TableHead>
            <TableHead class="text-center">Full Name</TableHead>
            <TableHead class="text-center">Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Birthday</TableHead>
            <TableHead> Gender</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="user in sortUsers" :key="user._id">
            <TableCell v-if="update">
              <div class="flex items-center justify-center w-full h-full">
                <input
                  :checked="checkValue(user._id)"
                  @click="toggleValue(user._id)"
                  v-model="selectedUsersData"
                  :value="user"
                  type="checkbox"
                  class="p-2 accent-[#7b7d87] border-2"
                />
              </div>
            </TableCell>
            <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.userName }} </TableCell>
            <TableCell class="text-xs md:text-sm lg:text-sm text-center text-nowrap"
              >{{ user.firstName }} {{ user.middleName }} {{ user.lastName }}</TableCell
            >
            <TableCell class="text-xs md:text-sm lg:text-sm text-center">{{
              user.email
            }}</TableCell>
            <TableCell class="text-xs md:text-sm lg:text-sm">{{
              user.phoneNumber.normalizedNumber
            }}</TableCell>
            <TableCell class="text-xs md:text-sm lg:text-sm w-full text-nowrap">{{
              dateOfBirth(user.dob)
            }}</TableCell>
            <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.gender }} </TableCell>
            <TableCell>
              <div
                class="rounded-[15px] w-fit px-3 py-1 text-white text-sm capitalize flex items-center"
                :class="user.emailVerified ? 'bg-green-900' : 'bg-gray-500'"
              >
                <Icon
                  :icon="
                    user.emailVerified ? 'ic:outline-mark-email-read' : 'mdi:email-remove-outline'
                  "
                  width="24"
                  height="24"
                  class="me-2"
                />
                <p class="text-xs md:text-sm lg:text-sm">
                  {{ user.emailVerified ? 'Verified' : 'Unverified' }}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <router-link :to="`/user/appuser/${user._id}`">
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
    <div v-else class="text-[#02072199] p-10">
      <p>No user data available</p>
    </div>
  </div>
  <div class="flex justify-between items-end">
    <div class="flex gap-4 space-x-2 w-15 h-10 border-2 rounded-md p-2 items-center">
      Per Page
      <DropdownMenu>
        <DropdownMenuTrigger class="flex items-center gap-2"
          >{{ filter.per_page }}<Icon icon="oui:arrow-down" width="16" height="16"
        /></DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            v-for="(item, index) in dropDown"
            v-bind:key="index"
            @click="() => setPerPage(item)"
            >{{ item.toLocaleString() }}</DropdownMenuItem
          >
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <PagePagination
      :page-total="pageTotal"
      :page-current="pageCurrent"
      @pagination="handlePageChange"
    />
  </div>
</template>
