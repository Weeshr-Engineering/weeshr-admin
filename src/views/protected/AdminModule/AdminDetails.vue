<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/toast'
import axios from 'axios'
import { useRoute } from 'vue-router';
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import { useGeneralStore } from '@/stores/general-use'
import router from '@/router'


const route = useRoute();
const id = route.params.Id;
const superAdminStore = useSuperAdminStore()
const token = sessionStorage.getItem('token') || ''
const user = ref<any>({})

// Define a function to fetch users data
const fetchUsersData = async () => {
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
      // Show success toast
      toast({
        title: 'Success',
        description: `data fetched`,
        variant: 'success'
      })
    }

    // Update the users data with the response
    const responseData = response.data.data[0]
    const phoneData = response.data.data[0].phoneNumber.normalizedNumber
    const dobData = formatDate(response.data.data[0].dob)
    const data = {...responseData, phone:phoneData, dob:dobData}
    // fill user data with response data
    user.value = data

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

const editProfile = () => {
  // Your logic for handling the edit click goes here
  console.log('Edit clicked!')
}

// fetch data on mount
onMounted(() => {
  fetchUsersData()
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

                <span class="text-sm font-medium text-[#02072199]">
                  <a href="#" @click="editProfile">Edit</a>
                </span>
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
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{user.dob}}</p>
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
                <span class="text-sm font-medium text-[#02072199]">
                  <a href="#" @click="editProfile">Edit</a>
                </span>
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
