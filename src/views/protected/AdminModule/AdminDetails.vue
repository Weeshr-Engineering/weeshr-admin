<script setup lang="ts">
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const editProfile = () => {
  // Your logic for handling the edit click goes here
  console.log('Edit clicked!')
}
</script>
<template>
  <div class="container lg:px-0 mx-auto">
    <div class="flex-col  lg:flex lg:flex-row justify-evenly">
      <Card
        class="sm:col-span-3 md:col-span-3 bg-[#F8F9FF] sm:items-center shadow-2xl mb-auto mr-auto"
      >
        <CardHeader>
          <CardTitle class="text-2xl font-medium text-[#000000]">Admin Profile</CardTitle>
          <CardDescription>
            <img
              class=""
              src="https://res.cloudinary.com/dufimctfc/image/upload/v1710684025/images1_wbbxb5.svg"
              alt="gradient"
            />
            <div class="flex justify-between px-6 my-2">
              <span class="text-base font-medium lg:text-base text-[#020721]">Identity</span>
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
              <div class="flex justify-between px-6 md:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Full Name</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">Demliade</p>
              </div>
              <div class="flex justify-between px-6 md:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Last Name</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">Simon</p>
              </div>
              <div class="flex justify-between px-6 md:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Handle</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">@Demily</p>
              </div>
              <div class="flex justify-between px-6 md:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Role</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">Cxperience</p>
              </div>
              <div class="flex justify-between px-6 md:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Birthday</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">July 28</p>
              </div>
              <div class="flex justify-between px-6 md:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Handle</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">@Demily</p>
              </div>
              <div class="flex justify-between px-6 md:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Gender</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">>Female</p>
              </div>
              <div class="flex justify-between px-6 md:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Joined</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">3 Aug 2023</p>
              </div>
            </Card>

            <div class="flex justify-between px-6 my-2">
              <span class="text-base font-medium lg:text-base text-[#020721]">Contact</span>
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
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">felixont@email.uk</p>
              </div>
              <div class="flex justify-between px-3 lg:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">phone.no</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">+234 818 100 8221</p>
              </div>
              <div class="flex justify-between px-5 lg:px-6 py-2 border-b">
                <p class="flex grow text-[#02072199] text-xs md:text-sm lg:text-sm">Address:</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">
                  No. 51, Briswood Ipaja Rd, Ikeja
                </p>
              </div>
            </Card>
          </CardDescription>
        </CardHeader>
      </Card>

      <div class="my-9 lg:mx-auto">
        <Tabs default-value="permission" class="space-y-1">
          <TabsList
            class=" lg:justify-between px-0 lg:px-6 md:px-6 py-2 bg-transparent"
          >
            <TabsTrigger value="permission" class="text-[#000000]"> Permission </TabsTrigger>
            <TabsTrigger value="activity" > Activity log </TabsTrigger>
          </TabsList>
          <TabsContent value="permission" class="space-y-4 lg-w-[802px]">
            <div class="lg:w-[802px]">
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
          <TabsContent value="activity" class="space-y-4 w-[802px]">
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
</template>
