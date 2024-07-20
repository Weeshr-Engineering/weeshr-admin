<script setup lang="ts">
import MainNav from '@/components/MainNav.vue'
import { Icon } from '@iconify/vue'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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
import { computed } from 'vue';
import { Button } from '@/components/ui/button'
import CountryCodes from '@/lib/CountryCodes'
import createUser from '@/composables/createUser';
import usersTable from '@/components/usersTable.vue';
import { ability, defineAbilities, verifyAbilities } from '@/lib/ability'

defineAbilities()
const create = ability.can('create', 'users')
const createStyle = computed(()=>{
  return create ? 'bg-[#020721] px-4 py-2 rounded-xl w-50 h-12' : 'bg-[#020721] cursor-not-allowed opacity-20 px-4 py-2 rounded-xl w-50 h-12'
})

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
          <button @click="verifyAbilities('create', 'users')"  :class='createStyle'>
            <div class="text-base text-[#F8F9FF] text-center flex items-center">
              Create New User
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
        </div>
      </SheetTrigger>
      <Card class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl">
        <usersTable />
      </Card>


      <SheetContent class="bg-[#FFFFFF] overflow-y-scroll w-full">
        <h2 class="text-3xl font-bold ml-4 mt-8">Add User</h2>
        <form class="space-y-4 rounded-xl my-8 mx-auto py-4 px-4 border-solid border border-black border-opacity-50" @submit.prevent="userLoad">
          <h3 class="text-2xl font-medium mb-4 pt-2.5">User Form</h3>
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
            <FormField v-slot="{ componentField }" name="countrycode" class="mt-6">
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
                  <SelectContent class="bg-gray-50 w-auto mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
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

<!-- @/stores/super-admin/super-admin@/stores/super-admin/super-admin -->