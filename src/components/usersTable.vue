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
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

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

import { onMounted, ref } from 'vue'
import getUsers from '@/composables/getUsers'
import { computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'
import PagePagination from './PagePagination.vue'
import axios from "@/services/ApiService";
import { toast } from '@/components/ui/toast'
import { catchErr } from '@/composables/catchError'
import { ability, defineAbilities } from '@/lib/ability'

//logic
defineAbilities()
const update = ability.can('update', 'users')
const { users, error, totalPages, currentPage, load } = getUsers()

const appUsers = ref(users)
const errors = error

const sheetClass = sheetVariants({ length: 'template' })
// const isSheetOpen = ref(true) // Set to true to open by default

const emailTemplateProps = ref<{ name: string; ids: string[] }>({
  name: 'John Doe',
  ids: ['34343', '422424'] // Example IDs
})

onMounted(() => {
  load('', 1)
})

const dateOfBirth = (dob: string) => {
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

  const formattedDate = `${day} - ${month} - ${year}`

  return formattedDate
}

//search
const search = ref('')

watch(search, () => {
  load(search.value, 1)
})

//filter
type SortItem = 'male' | 'female' | 'dob' | 'verified' | 'unverified' | 'all'

const order = ref<SortItem>('all')

const handleClick = (term: SortItem) => {
  order.value = term
}
const handleReset = () => {
  order.value = 'all'
  load('', 1)
}

const sortUsers = computed(() => {
  let users = [...appUsers.value]

  if (order.value === 'female') {
    users = users.filter((user) => user.gender === 'female')
  } else if (order.value === 'male') {
    users = users.filter((user) => user.gender === 'male')
  }
  if (order.value === 'verified') {
    users = users.filter((user) => user.emailVerified)
  } else if (order.value === 'unverified') {
    users = users.filter((user) => !user.emailVerified)
  }

  if (order.value === 'dob') {
    users.sort((a, b) => {
      const dateA = new Date(a.dob).getTime()
      const dateB = new Date(b.dob).getTime()
      return dateA - dateB
    })
  }
  return users
})

//pagination
const pageTotal = ref(totalPages)
const pageCurrent = ref(currentPage)
const alert = ref(false)
const confirmSheet = ref(false)
const stage = ref('')

const selectedUsers = ref<string[]>([])
const selectAll = ref(false)

const clearIds = ()=>{
  selectedUsers.value = []
}
const extractIds = () => {
  selectedUsers.value = []
  selectedUsers.value = sortUsers.value.map(obj => obj._id);
}

const toggleSelectAll = ()=>{
  if(selectAll.value === false){
    extractIds()
  }else{
    clearIds()
  }
  selectAll.value = !selectAll.value
}

const toggleValue = (value: string) => {
  const index = selectedUsers.value.indexOf(value);
  if (index !== -1) {
    // If the value exists, remove it
    selectedUsers.value.splice(index, 1);
  } else {
    // If the value does not exist, add it
    selectedUsers.value.push(value);
  }
}

function checkValue(value: string) {
  const index = selectedUsers.value.indexOf(value);
  if (index !== -1) {
    // If the value exists, remove it
    return true
  } else {
    // If the value does not exist, add it
    return false
  }
}

const handleConfirmation = (val: string)=>{
  alert.value = true;
  stage.value = val
}


const handlePageChange = (page: number) => {
  load('', page)
}

const sendReset = async ()=>{
  toast({
      description: 'Loading...',
      variant: 'loading',
      duration: 0 // Set duration to 0 to make it indefinite until manually closed
    })
    try {
      const response = await axios.post(
        `/api/v1/admin/accounts/users/reset/pin`,
        {
          ids: selectedUsers.value
        }
      )

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

const sendVerification = async ()=>{
  toast({
      description: 'Loading...',
      variant: 'loading',
      duration: 0 // Set duration to 0 to make it indefinite until manually closed
    })
    try {
      const response = await axios.post(
        `/api/v1/admin/accounts/users/send/email-verification`,
        {
          ids: selectedUsers.value
        }
      )

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
</script>

<template>
  <AlertDialog v-model:open='alert'>
    <div>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure you want to send a mail to <span v-if='stage ==="reset"'>RESET PINS</span> <span v-if='stage ==="verify"'>VERIFY EMAIILS</span> to all selected users ?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction v-if='stage === "reset"' @click='sendReset'>Send reset mail</AlertDialogAction>
        <AlertDialogAction v-if='stage === "verify"' @click="sendVerification">Send verification mail</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
    </div>
  </AlertDialog>
  <Sheet v-model:open='confirmSheet'>
    <SheetContent :class="sheetClass" length='full'>
      <SheetTitle class="py-10 text-3xl"> Email template</SheetTitle>
      <SheetDescription> <EmailTemplate v-bind="emailTemplateProps" /></SheetDescription>
    </SheetContent>
  </Sheet>
  <div
    class="flex flex-col gap-4 md:flex-row items-center justify-between px-2 sm:px-6 py-4 w-full bg-[#FFFFFF] h-full"
  >
    <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-4 sm:mb-0">
      App Users
      <p class="text-xs sm:text-sm text-[#02072199]">List of Weeshr App Users</p>
    </div>

    <div class="items-center grid grid-cols-3 md:grid-cols-4 gap-2 flex-row">
      <DropdownMenu v-if='update'>
        <DropdownMenuTrigger as-child class="">
          <Button class='text-white' :disabled='selectedUsers.length == 0'>
            <div class="flex items-center text-[10px] md:text-xs">
              Mail format
              <Icon icon="ion:chevron-down-outline" class="ml-1" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="item-center justify-between">
          <DropdownMenuCheckboxItem @click='() => handleConfirmation("verify")'>
            Verify emails
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem @click='() => handleConfirmation("reset")'>
            Reset pin
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem @click='()=> confirmSheet = true'>
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
          <Button variant="outline">
            <div class="flex items-center text-[10px] md:text-xs">
              Gender
              <Icon icon="ion:chevron-down-outline" class="ml-1" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="justify-between item-center">
          <DropdownMenuCheckboxItem @click="() => handleClick('male')">
            Male
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem @click="() => handleClick('female')">
            Female
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="outline" class="rounded-2xl bg-[#EEEFF5]" @click="() => handleClick('dob')">
        <div class="flex items-center text-[10px] md:text-xs">Birthday</div>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5]">
          <Button variant="outline">
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
        class="rounded-2xl bg-[#EEEFF5] col-span-3 md:col-span-1"
        @click="() => handleReset()"
      >
        <div class="flex items-center text-[10px] md:text-xs">
          <Icon icon="tdesign:clear" width="15" height="15" class="me-2" />
          Clear Filter
        </div>
      </Button>
    </div>
    <Search v-model="search" />
  </div>

  <div class="overflow-auto bg-white rounded-lg shadow">
    <div v-if="errors" class="text-[#02072199] p-10">
      <p>{{ errors }}</p>
    </div>
    <div v-else-if="sortUsers.length">
      <Table class="lg:w-full w-[800px]">
        <TableHeader>
          <TableRow
            class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
          >
            <TableHead v-if='update'>
              <div class='flex items-center justify-center w-full h-full gap-2'>
                  <input @click='toggleSelectAll' type='checkbox' class='p-2 accent-[#020721] border-2'/>
                  <p>Select all</p>
              </div>
            </TableHead>
            <TableHead> Weeshr name </TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Birthday</TableHead>
            <TableHead> Gender</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="user in sortUsers" :key="user._id">
            <TableCell v-if='update'>
              <div class='flex items-center justify-center w-full h-full'>
                  <input :checked="checkValue(user._id)" @click='toggleValue(user._id)' type='checkbox' class='p-2 accent-[#7b7d87] border-2'/>
              </div>
            </TableCell>
            <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.userName }} </TableCell>
            <TableCell class="text-xs md:text-sm lg:text-sm"
              >{{ user.firstName }} {{ user.middleName }} {{ user.lastName }}</TableCell
            >
            <TableCell class="text-xs md:text-sm lg:text-sm">{{ dateOfBirth(user.dob) }}</TableCell>
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
  <PagePagination
    :page-total="pageTotal"
    :page-current="pageCurrent"
    @pagination="handlePageChange"
  />
</template>
