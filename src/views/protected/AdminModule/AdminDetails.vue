<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/toast'
import axios from 'axios'
import { useRoute } from 'vue-router';
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import { useAdminListStore } from '@/stores/admin-list/admin-list'
import { Loader2 } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Button } from "@/components/ui/button"
import * as z from 'zod'
import router from '@/router'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const route = useRoute();
const id = route.params.Id;
const superAdminStore = useSuperAdminStore()
const token = sessionStorage.getItem('token') || ''
const user = ref<any>({})
const dobFormat = ref('')
const loading = ref(false)
const adminListStore = useAdminListStore()

// Define a function to fetch users data
const fetchUsersData = async (msg: string) => {
  adminListStore.setDetailLoading(false)
  toast({
    title: 'Loading Data',
    description: 'Fetching data...',
    duration: 0 // Set duration to 0 to make it indefinite until manually closed
  })

  
  try {
    // Set loading to true
    // useGeneralStore().setLoading(true)
    const response = await axios.get(
      `https://api.staging.weeshr.com/api/v1/admin/administrator/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (response.status === 200 || response.status === 201) {
      // useGeneralStore().setLoadingToFalse()
      
      // Update the users data with the response
      const responseData = response.data.data[0]
      const phoneData = response.data.data[0].phoneNumber.normalizedNumber
      dobFormat.value = formatDate(response.data.data[0].dob)
      const data = {...responseData, phone:phoneData}
      // fill user data with response data
      user.value = data
      adminListStore.setAdminStatus(responseData.disabled)
      // Show success toast
      toast({
        title: 'Success',
        description: `${data.firstName} ${msg}`,
        variant: 'success'
      })
    }
    adminListStore.setDetailLoading(false)
    // set Loading to false
    // useGeneralStore().setLoading(false)
  } catch (error: any) {
    if (error.response.status === 401) {
      sessionStorage.removeItem('token')
      // Clear token from superAdminStore
      superAdminStore.setToken('')

      setTimeout(() => {
        router.push({ name: 'super-admin-login' })
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

function formatDate(inputDate: string) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dateObj = new Date(inputDate);
    const month = months[dateObj.getMonth()];
    const day = dateObj.getDate();

    return `${month} ${day}`;
}

const editProfile = async (values: any) => {
const adminProfile = JSON.stringify({
    'firstName': values.firstName || user.value.firstName,
    'lastName': values.lastName || user.value.lastName,
    'gender': values.gender || user.value.gender,
    'email': values.email || user.value.email,
    'dob': values.dob && values.dob.substring(0, 10) || user.value.dob.substring(0, 10),
    'phone': {
      'countryCode': '+234',
      'phoneNumber': values.phone || '0987876543'
    },
    "disabled": adminListStore.adminStatus
  })

let config = {
  method: 'patch',
  maxBodyLength: Infinity,
  url: `https://api.staging.weeshr.com/api/v1/admin/administrator/${id}`,
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${token}`
  },
  data : adminProfile
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
  fetchUsersData('data updated')
})
.catch((error) => {
  console.log(error);
});

}

// fetch data on mount
onMounted(() => {
  fetchUsersData('data fetched')
})

const contactFormSchema = toTypedSchema(z.object({
      firstName: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }).optional(),
    lastName: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }).optional(),
    dob: z.string().nonempty('Please enter your date of birth').optional(),
    gender: z.string().nonempty('Please select your gender').optional(),
    phone: z.string().min(10, { message: 'Phone number must be 10 characters' }).max(10, { message: 'Phone number must be 10 characters' }).optional(),
    email: z.string().email({ message: 'Invalid email address' }).optional(),
}))
const { handleSubmit: contactForm } = useForm({
  validationSchema: contactFormSchema,
})

const onSubmit = contactForm((values) => {
  // console.log(adminProfile)
  editProfile(values)
})

</script>
<template>
  <div class="container lg:px-0 mx-auto mt-10 md:mt-0">
    <div class="flex flex-col grid-cols-1 md:grid-cols-1 justify-center items-center lg:flex-row">
      <Card
        class="w-full md:w-3/4 md:mr-9 lg:h-screen lg:w-1/3 bg-[#F8F9FF] sm:items-center shadow-2xl mb-auto"
      >
        <CardHeader>
          <CardTitle class="text-xl font-bold">{{ user.firstName }} Profile</CardTitle>
          <CardDescription>
            <img
              v-if="user.avatar"
              class=""
              :src="user.avatar"
              alt="User Profile Image"
            />
            <div class="flex justify-between px-2 pr-6 my-2">
              <span class="font-semibold text-base text-[#020721]">Identity</span>
              <div class="flex">
                <img
                  class="max-w-[18.05px] max-h-[24px]"
                  src="https://res.cloudinary.com/dufimctfc/image/upload/v1714310908/edit-4-svgrepo-com_1_iy2nwu.svg"
                  alt="gradient"
                />

                <Popover>
                  <PopoverTrigger>
                    <span class="text-sm font-medium text-[#02072199]">
                      <p>Edit</p>
                    </span>
                  </PopoverTrigger>
                  <PopoverContent>
                      <form class="space-y-8" @submit="onSubmit">
                        <FormField v-slot="{ componentField }" name="firstName">
                          <FormItem v-auto-animate>
                            <FormLabel class="text-blue-900">First Name</FormLabel>
                            <FormControl>
                              <Input
                                id="text"
                                type="text"
                                placeholder="First Name"
                                class="focus-visible:ring-blue-600"
                                v-bind="componentField"
                              />
                            </FormControl>
                            <FormMessage for="firstName" />
                          </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField }" name="lastName">
                          <FormItem v-auto-animate>
                            <FormLabel class="text-blue-900">Last Name</FormLabel>
                            <FormControl>
                              <Input
                                id="text"
                                type="text"
                                placeholder="Last Name"
                                class="focus-visible:ring-blue-600"
                                v-bind="componentField"
                              />
                            </FormControl>
                            <FormMessage for="lastName" />
                          </FormItem>
                        </FormField>
                        <div class="flex flex-row justify-between gap-2">
                          <FormField v-slot="{ componentField }" name="gender" class="w-[40%]">
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              
                                <Select
                                v-bind="componentField"
                                id="gender"
                                class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                <FormControl>
                                  <SelectTrigger class="">
                                      <SelectValue placeholder="Gender" />
                                    </SelectTrigger>
                                </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Male">Male</SelectItem>
                                  </SelectContent>
                                </Select>
                              
                              <FormMessage for="gender" />
                            </FormItem>
                          </FormField>
          
                          <div class="w-[70%]">
                            <FormField v-slot="{ componentField }" name="dob">
                              <FormItem v-auto-animate>
                                <FormLabel class="text-blue-900">Date of Birth</FormLabel>
                                <FormControl>
                                  <Input
                                    id="dob"
                                    type="date"
                                    placeholder="Date of Birth"
                                    class="focus-visible:ring-blue-600"
                                    v-bind="componentField"
                                  />
                                </FormControl>
          
                                <FormMessage for="dob" />
                              </FormItem>
                            </FormField>
                          </div>
                        </div>
                        <Button type="submit">
                          <Loader2
                            color="#ffffff"
                            v-if="loading"
                            class="w-4 h-4 mr-2 text-black animate-spin"
                          />
                          Submit
                          <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
                        </Button>
                        </form>
                  </PopoverContent>
                </Popover>
                
              </div>
            </div>

            <Card class="rounded-md">
              <div class="flex min-w-62 justify-between px-6 md:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">First Name</p>
                <p class="text-xs text-left md:text-sm lg:text-sm text-[#020721]">{{user.firstName}}</p>
              </div>
              <div class="flex justify-between px-6 md:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Last Name</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{user.lastName}}</p>
              </div>
              <div class="flex justify-between px-6 md:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Handle</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{user.handle}}</p>
              </div>
              <div class="flex justify-between px-6 md:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Role</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{user.role}}</p>
              </div>
              <div class="flex justify-between px-6 md:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Birthday</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{dobFormat}}</p>
              </div>
              <div class="flex justify-between px-6 md:px-6 py-2 border-b" v-if="user.middleName">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Handle</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{user.middleName}}</p>
              </div>
              <div class="flex justify-between px-6 md:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Gender</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{user.gender}}</p>
              </div>
              <div class="flex justify-between px-6 md:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Joined</p>
                <p class="text-xs md:text-sm text-left lg:text-sm text-[#020721]">3 Aug 2023</p>
              </div>
            </Card>

            <div class="flex justify-between px-2 pr-6 my-2">
              <span class="font-semibold text-base text-[#020721]">Contact</span>
              <div class="flex">
                <img
                  class="max-w-[18.05px] max-h-[24px]"
                  src="https://res.cloudinary.com/dufimctfc/image/upload/v1714310908/edit-4-svgrepo-com_1_iy2nwu.svg"
                  alt="gradient"
                />
                <Popover>
                  <PopoverTrigger>
                    <span class="text-sm font-medium text-[#02072199]">
                      <p>Edit</p>
                    </span>
                  </PopoverTrigger>
                  <PopoverContent>
                      <form class="space-y-4" @submit.prevent="onSubmit">
                        <FormField v-slot="{ componentField }" name="phone">
                          <FormItem v-auto-animate>
                            <FormLabel class="text-blue-900">Phone Number</FormLabel>
                            <FormControl>
                              <div>
                                <Input
                                  id="phone"
                                  type="tel"
                                  placeholder="Phone Number"
                                  class="focus-visible:ring-blue-600"
                                  v-bind="componentField"
                                />
                              </div>
                            </FormControl>
                            <FormMessage for="phone" />
                          </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField }" name="email">
                          <FormItem v-auto-animate>
                            <FormLabel class="text-blue-900">Email</FormLabel>
                            <FormControl>
                              <Input
                                id="email"
                                type="email"
                                placeholder="weeshr@admin.com"
                                class="focus-visible:ring-blue-600"
                                v-bind="componentField"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        </FormField>
          
                        <Button type="submit">
                          <Loader2
                            color="#ffffff"
                            v-if="loading"
                            class="w-4 h-4 mr-2 text-black animate-spin"
                          />
                          Submit
          
                          <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
                        </Button>
                      </form>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Card class="rounded-md">
              <div class="flex justify-between px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Email</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{user.email}}</p>
              </div>
              <div class="flex justify-between px-6 lg:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Phone no.</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{user.phone}}</p>
              </div>
              <div class="flex justify-between px-6 lg:px-6 py-2 border-b">
                <p class="flex grow text-[#02072199] text-xs md:text-sm lg:text-sm">Address:</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">
                  {{user.address}}
                </p>
              </div>
            </Card>

            <div class="w-full px-2 pr-6 my-2">
              <span class="font-semibold text-base text-[#020721]">Status</span>
            </div>

            <Card class="bg-[#F8F9FF] flex justify-between">
              <CardHeader><span v-if="!adminListStore.detailLoading">{{ adminListStore.adminStatus ? 'Disabled' : 'Active' }}</span>
                <Loader2 v-else class="w-4 h-4 mr-2 text-black animate-spin" />
              </CardHeader>
              
              <CardContent
                class="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 py-4"
              >
                <Switch
                v-if="!adminListStore.detailLoading"
                v-bind:checked="!adminListStore.adminStatus"
                :onclick="()=>adminListStore.toggleStatus(user._id, adminListStore.adminStatus, user.firstName)"
                />
                <Loader2 v-else class="w-4 h-4 mr-2 text-black animate-spin" />
              </CardContent>
            </Card>
          </CardDescription>
        </CardHeader>
      </Card>

      <div class="my-9 lg:px-6 lg:w-4/5">
        <Tabs default-value="permission" class="space-y-1">
          <TabsList
            class="border-b-8 border-[#DEDFE8] lg:justify-between px-0 lg:px-6 md:px-6 py-2 bg-transparent"
          >
            <TabsTrigger value="permission" class="text-[#000000]"> Permission </TabsTrigger>
            <TabsTrigger value="analytics" disabled> Activity log </TabsTrigger>
          </TabsList>
          <TabsContent value="permission" class="space-y-4">
            <div class="lg:w-full">
              <Card Content class="bg-[#F8F9FF] mt-4">
                <CardContent
                  class="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 py-4"
                >
                  <div
                    class="inline-block bg-[#373B4D] text-[#F8F9FF] rounded-full px-2 py-1 text-sm"
                  >
                    Dashboard
                  </div>
                  <p class="text-sm text-muted-foreground text-center text-[#000000]">
                    Get an overall stats of Weeshr and a users list at login
                  </p>
                  <Switch />
                </CardContent>
              </Card>

              <Card Content class="bg-[#F8F9FF] mt-4">
                <CardContent
                  class="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 py-4"
                >
                  <div
                    class="inline-block bg-[#373B4D] text-[#F8F9FF] rounded-full px-2 py-1 text-sm"
                  >
                    Users
                  </div>
                  <p class="text-sm text-muted-foreground text-center text-[#000000]">
                    View and manage all Weeshr app users,admin ,vendors and partners
                  </p>
                  <Switch />
                </CardContent>
              </Card>

              <Card Content class="bg-[#F8F9FF] mt-4">
                <CardContent
                  class="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 py-4"
                >
                  <div
                    class="inline-block bg-[#373B4D] text-[#F8F9FF] rounded-full px-2 py-1 text-sm"
                  >
                    Weeshes
                  </div>
                  <p class="text-sm text-muted-foreground text-center text-[#000000]">
                    View and manage all weeshes at different level fulfillement
                  </p>
                  <Switch />
                </CardContent>
              </Card>

              <Card Content class="bg-[#F8F9FF] mt-4">
                <CardContent
                  class="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 py-4"
                >
                  <div
                    class="inline-block bg-[#373B4D] text-[#F8F9FF] rounded-full px-2 py-1 text-sm"
                  >
                    Depot
                  </div>
                  <p class="text-sm text-muted-foreground text-center text-[#000000]">
                    Manage fulfilled weeshes and delievery status
                  </p>
                  <Switch />
                </CardContent>
              </Card>

              <Card Content class="bg-[#F8F9FF] mt-4">
                <CardContent
                  class="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 py-4"
                >
                  <div
                    class="inline-block bg-[#373B4D] text-[#F8F9FF] rounded-full px-2 py-1 text-sm"
                  >
                    Bank
                  </div>
                  <p class="text-sm text-muted-foreground text-center text-[#000000]">
                    View and manage funds in user's wallet
                  </p>
                  <Switch />
                </CardContent>
              </Card>

              <Card Content class="bg-[#F8F9FF] mt-4">
                <CardContent
                  class="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 py-4"
                >
                  <div
                    class="inline-block bg-[#373B4D] text-[#F8F9FF] rounded-full px-2 py-1 text-sm"
                  >
                    Support
                  </div>
                  <p class="text-sm text-muted-foreground text-center text-[#000000]">
                    View and manage tickets and complaints from users
                  </p>
                  <Switch />
                </CardContent>
              </Card>

              <Card Content class="bg-[#F8F9FF] mt-4">
                <CardContent
                  class="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 py-4"
                >
                  <div
                    class="inline-block bg-[#373B4D] text-[#F8F9FF] rounded-full px-2 py-1 text-sm"
                  >
                    Configuration
                  </div>
                  <p class="text-sm text-muted-foreground text-center text-[#000000]">
                    Manage the core engine of Weeshr
                  </p>
                  <Switch />
                </CardContent>
              </Card>

              <Card Content class="bg-[#F8F9FF] mt-4">
                <CardContent
                  class="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 py-4"
                >
                  <div
                    class="inline-block bg-[#373B4D] text-[#F8F9FF] rounded-full px-2 py-1 text-sm"
                  >
                    Analytics
                  </div>
                  <p class="text-sm text-muted-foreground text-center text-[#000000]">
                    Get general data in regards to Weeshr performance
                  </p>
                  <Switch />
                </CardContent>
              </Card>

              <Card Content class="bg-[#F8F9FF] mt-4">
                <CardContent
                  class="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 py-4"
                >
                  <div
                    class="inline-block bg-[#373B4D] text-[#F8F9FF] rounded-full px-2 py-1 text-sm"
                  >
                    Activity logs
                  </div>
                  <p class="text-sm text-muted-foreground text-center text-[#000000]">
                    View all activites of weeshr in record
                  </p>
                  <Switch />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
</template>
