<script setup lang="ts">
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
</script>
<template>
  <div class="flex-col flex min-h-[400px] px-4 sm:px-10 pb-10">
    <div>
      <Card>
        <div class="grid gap-4 lg:grid-cols-7">
          <Card class="sm:col-span-3 bg-[#F8F9FF] shadow-2xl">
            <CardHeader>
              <CardTitle class="text-xl font-bold">Admin Profile</CardTitle>
              <CardDescription>
                <img
                  class=""
                  src="https://res.cloudinary.com/dufimctfc/image/upload/v1710684025/images1_wbbxb5.svg"
                  alt="gradient"
                />
                <div class="flex space-x-2 justify-between px-6 py-4">
                  <span class="text-sm text-gray-500">Identity</span>
                  <div class="flex">
                    <img
                      class=""
                      src="https://res.cloudinary.com/dufimctfc/image/upload/v1714310908/edit-4-svgrepo-com_1_iy2nwu.svg"
                      alt="gradient"
                    />
                    <span class="ml-2 text-sm font-medium text-gray-700"> Edit </span>
                  </div>
                </div>

                <Card
                  class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 border border-gray-200 rounded-md px-4 py-4"
                >
                  <dt class="text-sm font-medium text-gray-500">First Name</dt>
                  <dd class="text-sm text-gray-800">Demliade</dd>
                  <dt class="text-sm font-medium text-gray-500">Last Name</dt>

                  <dd class="text-sm text-gray-800">Simcon</dd>
                  <dt class="text-sm font-medium text-gray-500">Icon</dt>
                  <dd class="text-sm text-gray-800">Demily</dd>

                  <dt class="text-sm font-medium text-gray-500">Role</dt>
                  <dd class="text-sm text-gray-800">Cxperience</dd>

                  <dt class="text-sm font-medium text-gray-500">Birthday</dt>
                  <dd class="text-sm text-gray-800">July 28</dd>

                  <dt class="text-sm font-medium text-gray-500">Gender</dt>
                  <dd class="text-sm text-gray-800">Female</dd>

                  <dt class="text-sm font-medium text-gray-500">Joined</dt>
                  <dd class="text-sm text-gray-800">3 Aug 2023</dd>
                </Card>
                <div class="flex space-x-2 justify-between px-6 py-4">
                  <span class="text-sm text-gray-500">Contact</span>
                  <div class="flex">
                    <img
                      class=""
                      src="https://res.cloudinary.com/dufimctfc/image/upload/v1714310908/edit-4-svgrepo-com_1_iy2nwu.svg"
                      alt="gradient"
                    />
                    <span class="ml-2 text-sm font-medium text-gray-700"> Edit </span>
                  </div>
                </div>
                <Card
                  class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 border border-gray-200 rounded-md px-4 py-4"
                >
                  <dt class="text-sm font-medium text-gray-500">Email</dt>
                  <dd class="text-sm text-gray-800">felixont@email.uk</dd>
                  <dt class="text-sm font-medium text-gray-500">phone.no</dt>
                  <dd class="text-sm text-gray-800">felixont@email.uk</dd>
                  <dt class="text-sm font-medium text-gray-500">Address</dt>
                  <dd class="text-sm text-gray-800">No. 51, Briswood Ipaja Rd, Ikeja</dd>
                  <p>User ID: {{ $route.params.userId }}</p>
                </Card>
              </CardDescription>
            </CardHeader>
          </Card>

          <div class="col-span-4 my-9">
            <Tabs default-value="permission" class="space-y-4">
              <TabsList class="text-blue-900">
                <TabsTrigger value="permission" class="text-[#000000]"> Permission </TabsTrigger>
                <TabsTrigger value="analytics" disabled> Activity log </TabsTrigger>
              </TabsList>
              <TabsContent value="permission" class="space-y-4">
                <div>
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
                        View and manage all weeshes at different level fulfillementr
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
      </Card>
    </div>
  </div>
</template>
