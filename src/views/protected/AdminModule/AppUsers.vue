<script setup lang="ts">
import Search from '@/components/UseSearch.vue'
import MainNav from '@/components/MainNav.vue'
import { Icon } from '@iconify/vue'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

import { Button } from '@/components/ui/button'
import getUsers from '@/composables/getUsers';
import { computed } from 'vue';
import { ref } from 'vue';
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination';
import CountryCodes from '@/lib/CountryCodes'
import createUser from '@/composables/createUser';




//logic

const { users, error, load} = getUsers()

load()

const appUsers = ref(users);
const errors = error;

const dateOfBirth = (dob: string) => {
  const date = new Date(dob)

  const day = String(date.getUTCDate()).padStart(2, '0');
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  const formattedDate = `${day} - ${month} - ${year}`;

  return formattedDate
}

type SortItem = 'male' |'female' | 'dob' | 'verified' | 'unverified'

const order = ref<SortItem>('dob')

const handleClick = (term: SortItem) => {
  order.value = term
}

const sortUsers = computed(() => {
  let users = [...appUsers.value];

  if (order.value === 'female') {
    users = users.filter(user => user.gender === 'female');
  } else if (order.value === 'male') {
    users = users.filter(user => user.gender === 'male');
  }
  if (order.value === 'verified') {
    users = users.filter(user => user.emailVerified);
  } else if (order.value === 'unverified') {
    users = users.filter(user => !user.emailVerified);
  }

  if (order.value === 'dob') {
    users.sort((a, b) => {
      const dateA = new Date(a.dob).getTime();
      const dateB = new Date(b.dob).getTime();
      return dateA - dateB;
    });
  }
  return users;
});

const perPage = 10;
const currentPage = ref(1);
const totalUsers = computed(() => sortUsers.value.length);
const totalPages = computed(() => Math.ceil(totalUsers.value / perPage));

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  const end = start + perPage;
  return sortUsers.value.slice(start, end);
});

const paginationItems = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push({ type: 'page', value: i });
  }
  return pages;
});

const handlePageChange = (newPage: number) => {
  if (newPage > 0 && newPage <= totalPages.value) {
    currentPage.value = newPage;
  }
};

//Create User
const {loading, newUser, userLoad} = createUser()

</script>

<template>
  <div class="flex-col flex bg-[#f0f8ff] h-full px-4 sm:px-10">
    <MainNav class="md:mx-6" headingText="" /> 
    <div class="flex items-center text-xl mx-4 md:mx-10 md:text-3xl mb-4 -mt-8">
      <RouterLink :to="{name: 'user'}" class="text-gray-500">User</RouterLink>
      <Icon icon="tabler:chevron-right" width="22px" height="22px" class="ml-1 pt-1"/>
      <RouterLink :to="{name: 'appuser'}">App Users</RouterLink>
    </div>
    <Sheet>
      <SheetTrigger asChild>
        <div class="flex justify-end ml-3 my-4">
          <Button class="rounded-full px-4 py-6 bg-[#020721] md:px-6 md:text-xl">Create New User
            <Icon icon="mdi:plus-circle" width="26px" height="26px" class="ml-4 pt-1"/>
          </Button>
        </div>
      </SheetTrigger>
      <Card class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl">
        <div class="flex flex-col gap-4 md:flex-row items-center justify-between px-2 sm:px-6 py-4 w-full bg-[#FFFFFF] h-full">
          <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-4 sm:mb-0">
            App Users
            <p class="text-xs sm:text-sm text-[#02072199]">List of Weeshr App Users</p>
          </div>
          <div class="items-center grid grid-cols-3 md:grid-cols-3 gap-4 flex-row ">
            <DropdownMenu>
              <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5]">
                <Button variant="outline">
                  <div class="flex items-center text-[10px] md:text-xs">
                    Gender
                    <Icon icon="ion:chevron-down-outline" class="ml-1" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="item-center justify-between">
                <DropdownMenuCheckboxItem @click="() => handleClick('male')">
                  Male
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem @click="() => handleClick('female')">
                  Female
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" class="rounded-2xl bg-[#EEEFF5]" @click="() => handleClick('dob')">
              <div class="flex items-center text-[10px] md:text-xs">
                Birthday
              </div>
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
              <DropdownMenuContent class="item-center justify-between">
                <DropdownMenuCheckboxItem @click="() => handleClick('verified')">
                  Verified
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem @click="() => handleClick('unverified')">
                  Unverified
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Search />
        </div>

        <div class="overflow-auto bg-white rounded-lg shadow">
          <div v-if="errors" class="text-[#02072199] p-10">
            <p>{{ errors }}</p>
          </div>
          <div v-else-if="paginatedUsers.length">
            <Table class="lg:w-full w-[800px]">
              <TableHeader>
                <TableRow
                  class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
                >
                  <TableHead> Weeshr name </TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Birthday</TableHead>
                  <TableHead> Gender</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="user in paginatedUsers" :key="user._id">
                  <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.userName }} </TableCell>
                  <TableCell class="text-xs md:text-sm lg:text-sm"
                    >{{ user.firstName }} {{ user.middleName }} {{ user.lastName }}</TableCell
                  >
                  <TableCell class="text-xs md:text-sm lg:text-sm">{{ dateOfBirth(user.dob) }}</TableCell>
                  <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.gender }} </TableCell>
                  <TableCell class="flex items-center mt-4">
                    <Icon :icon="user.emailVerified?'ic:outline-mark-email-read':'mdi:email-remove-outline'" width="20" height="20" class="me-4" />
                    <Icon :icon="user.verificationBadge === 'Default'?'heroicons-outline:check':'line-md:check-all'" width="20" height="20"/>
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
        <div class="flex gap-2 max-w-full flex-wrap justify-end mt-8 mr-4 items-center text-[15px]">
        <Pagination :total="totalPages" :sibling-count="1" show-edges :default-page="1" @change="handlePageChange">
          <PaginationList class="flex items-center gap-1">
            <PaginationFirst @click="handlePageChange(1)" />
            <PaginationPrev @click="handlePageChange(Math.max(currentPage - 1, 1))" />
            
            <template v-for="(item, index) in paginationItems" :key="index">
              <PaginationListItem v-if="item.type === 'page'" :value="item.value" as-child>
                <Button class="w-10 h-10 p-0" :variant="item.value === currentPage ? 'default' : 'outline'" @click="handlePageChange(item.value)">
                  {{ item.value }}
                </Button>
              </PaginationListItem>
              <PaginationEllipsis v-else :index="index" />
            </template>
            
            <PaginationNext @click="handlePageChange(Math.min(currentPage + 1, totalPages))" />
            <PaginationLast @click="handlePageChange(totalPages)" />
          </PaginationList>
        </Pagination>
      </div>
      </Card>


      <SheetContent class="bg-[#FFFFFF] overflow-y-scroll w-full">
        <h2 class="text-3xl font-bold ml-4 mt-8">Add User</h2>
        <form class="space-y-4 rounded-xl my-8 mx-auto py-4 px-4 border-solid border border-black border-opacity-50" @submit.prevent="userLoad">
          <div class="flex justify-between items-center">
              <h3 class="text-2xl font-medium mb-4 pt-2.5">User Form</h3>
              <div class="flex items-center">
                  <p class="me-2 text-xs font-semibold">Active</p>
                  <Switch class="dark:bg-gray-700"/>
              </div>
          </div>
          <FormField v-slot="{ componentField }" name="firstName">
              <FormItem v-auto-animate>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                  <input
                      id="text"
                      type="text"
                      placeholder=""
                      class="focus-visible:ring-blue-600 w-full bg-[#000000] bg-opacity-5 p-2 dark:bg-gray-700 dark:text-white rounded-lg"
                      v-bind="componentField"
                      v-model="newUser.firstName"
                  />
                  </FormControl>

                  <FormMessage for="fistName" />
              </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="middleName">
              <FormItem v-auto-animate>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                  <input
                      id="text"
                      type="text"
                      placeholder=""
                      class="focus-visible:ring-blue-600 w-full bg-[#000000] bg-opacity-5 p-2 dark:bg-gray-700 dark:text-white rounded-lg"
                      v-bind="componentField"
                      v-model="newUser.middleName"
                      optional
                  />
                  </FormControl>

                  <FormMessage for="middleName" />
              </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="lastName">
              <FormItem v-auto-animate>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                  <input
                      id="text"
                      type="text"
                      placeholder=""
                      class="focus-visible:ring-blue-600 w-full bg-[#000000] bg-opacity-5 p-2 dark:bg-gray-700 dark:text-white rounded-lg"
                      v-bind="componentField"
                      v-model="newUser.lastName"
                  />
                  </FormControl>

                  <FormMessage for="lastName" />
              </FormItem>
          </FormField>
          
          <FormField v-slot="{ componentField }" name="userName">
              <FormItem v-auto-animate>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                  <input
                      id="text"
                      type="text"
                      class="focus-visible:ring-blue-600 w-full bg-[#000000] bg-opacity-5 p-2 dark:bg-gray-700 dark:text-white rounded-lg"
                      v-bind="componentField"
                      v-model="newUser.userName"
                  />
                  </FormControl>

                  <FormMessage for="userName" />
              </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="userEmail">
              <FormItem v-auto-animate>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                  <input
                  id="email"
                  type="email"
                  placeholder="weeshr@admin.com"
                  class="focus-visible:ring-blue-600 w-full bg-[#000000] bg-opacity-5 p-2 dark:bg-gray-700 dark:text-white rounded-lg"
                  v-bind="componentField"
                  v-model="newUser.email"
                  />
                  </FormControl>

                  <FormMessage for="email"/>
              </FormItem>
          </FormField>

          <div class="flex flex-col lg:flex-row gap-2">
            <FormField v-slot="{ componentField }" name="gender">
            <FormItem>
            <FormLabel>Gender</FormLabel>
            <Select v-bind="componentField" v-model="newUser.gender">
            <SelectTrigger class="bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
            </Select>
            <FormMessage for="gender" />
            </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="birthday">
            <FormItem v-auto-animate>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                <input
                  id="dob"
                  type="date"
                  class="focus-visible:ring-blue-600 w-full bg-[#000000] bg-opacity-5 p-1.5 dark:bg-gray-700 dark:text-white rounded-lg"
                  v-bind="componentField"
                  v-model="newUser.dob"
                />
                </FormControl>

                <FormMessage for="dob" />
            </FormItem>
            </FormField>
          </div>

          <div class='flex flex-col lg:flex-row gap-2'>
            <FormField v-slot="{ componentField }" name="countrycode" class="bg-[teal] mt-6">
              <FormItem>
                <FormLabel>Code</FormLabel>
                <Select
                v-bind="componentField"
                id="phoneCode"
                class='bg-gray-50 w-auto mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white'
                v-model="newUser.phone.countryCode">
                <FormControl>
                  <SelectTrigger class="focus-visible:ring-blue-600 w-full bg-[#000000] bg-opacity-5 p-2 dark:bg-gray-700 dark:text-white rounded-lg">
                      <SelectValue placeholder="+234" />
                    </SelectTrigger>
                </FormControl>
                  <SelectContent class="focus-visible:ring-blue-600 w-full bg-[#000000] bg-opacity-5 p-2 dark:bg-gray-700 dark:text-white rounded-lg">
                    <SelectItem v-for="(code, key ) in CountryCodes" :value="code.dial_code" :key="key" class='flex justify-center items-center gap-2'>
                      {{code.dial_code}} 
                      <img
                      class="w-[18px] h-[18px] hidden md:inline-block"
                      :src="'https://flagcdn.com/16x12/'+code.code.toLowerCase()+'.png'"
                      alt="gradient"/>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage for="phone.countryCode" />
              </FormItem>
            </FormField>
            <div class='lg:w-[70%]'>
              <FormField v-slot="{ componentField }" name="phone" class='lg:w-[70%]'>
                <FormItem v-auto-animate>
                <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <div>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="Phone Number"
                        class="focus-visible:ring-blue-600 w-full bg-[#000000] bg-opacity-5 p-2 dark:bg-gray-700 dark:text-white rounded-lg"
                        v-bind="componentField"
                        v-model="newUser.phone.phoneNumber"
                      />
                    </div>
                  </FormControl>

                  <FormMessage for="phone.phoneNumber" />
                </FormItem>
              </FormField>
            </div>
          </div>
          <FormField v-slot="{ componentField }" name="pin">
              <FormItem v-auto-animate>
                  <FormLabel>Pin</FormLabel>
                  <FormControl>
                  <input
                      id="text"
                      type="text"
                      placeholder=""
                      class="focus-visible:ring-blue-600 w-full bg-[#000000] bg-opacity-5 p-2 dark:bg-gray-700 dark:text-white rounded-lg"
                      v-bind="componentField"
                      v-model="newUser.pin"
                      required
                  />
                  </FormControl>

                  <FormMessage for="pin" />
              </FormItem>
          </FormField>

          <div class="flex justify-center lg:justify-end">
            <SheetClose asChild>
              <Button class="rounded-lg px-2 py-1 text-black bg-transparent border">
                  Cancel
              </Button>
            </SheetClose>
            <Button :disabled="loading" type="submit" class="rounded-lg px-4 py-1 bg-[#4145a7] ms-2">
            <Loader2
                color="#ffffff"
                v-if="loading"
                class="w-4 h-4 mr-2 text-black animate-spin"
            />
            Save
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  </div>
</template>

<style>
</style>

@/stores/super-admin/super-admin@/stores/super-admin/super-admin