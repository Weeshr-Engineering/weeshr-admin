<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/components/ui/card'

import MainNav from '@/components/MainNav.vue'

import DashboardFooter from '@/components/DashboardFooter.vue'
</script>

<template>
  <div class="flex-col flex h-svh h-full bg-[#f0f8ff] relative">
    <div class="flex-1 space-y-4 p-8 pt-6 bg-[#f0f8ff] w-full">
      <MainNav class="mx-6" headingText="Users Hub" />
      <div class="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
        <Card
          class="rounded-xl bg-[#C6F4EB] h-80 shadow-md transition-transform transform hover:scale-105 mb-5"
        >
          <RouterLink to="/user/appuser">
            <CardHeader class="flex items-center justify-between space-y-0">
              <img
                class=""
                src="https://res.cloudinary.com/dufimctfc/image/upload/v1712066751/users1_yng7it.svg"
                alt="gradient"
              />

              <p class="text-2xl font-bold text-gray-800">App Users</p>
            </CardHeader>
            <CardContent class="bg-[#373B4D] rounded-xl pb-4">
              <div class="px-1 pt-4 text-xs">
                <p class="font-semibold tracking-tight text-gray-400">Members</p>
                <p class="text-2xl font-semibold text-white">586,004</p>
              </div>
            </CardContent>
          </RouterLink>
        </Card>

        <Card
          class="rounded-xl bg-[#DCDEFF] h-80 shadow-md transition-transform transform hover:scale-105 mb-5"
        >
          <RouterLink to="/user/vendors">
            <CardHeader class="flex items-center justify-between space-y-0">
              <img
                class=""
                src="https://res.cloudinary.com/dufimctfc/image/upload/v1712066752/user2_gygznz.svg"
                alt="gradient"
              />

              <p class="text-2xl font-bold text-gray-800">Vendors</p>
            </CardHeader>
            <CardContent class="bg-[#373B4D] rounded-xl pb-4">
              <div class="px-1 pt-4 text-xs">
                <p class="font-semibold tracking-tight text-gray-400">Members</p>
                <p class="text-2xl font-semibold text-white">3</p>
              </div>
            </CardContent>
          </RouterLink>
        </Card>

        <Card
          class="rounded-xl bg-[#89cff0ee] h-80 shadow-md transition-transform transform hover:scale-105 mb-5"
        >
          <RouterLink to="/user/admin">
            <CardHeader class="flex items-center justify-between space-y-0">
              <img
                class=""
                src="https://res.cloudinary.com/dufimctfc/image/upload/v1712066752/user3_hpnxmx.svg"
                alt="gradient"
              />

              <p class="text-2xl font-bold text-gray-800">Admin Staff</p>
            </CardHeader>
            <CardContent class="bg-[#373B4D] rounded-xl pb-4">
              <div class="px-1 pt-4 text-xs">
                <p class="font-semibold tracking-tight text-gray-400">Members</p>
                <p class="text-2xl font-semibold text-white">18</p>
              </div>
            </CardContent>
          </RouterLink>
        </Card>

        <Card
          class="rounded-xl bg-[#E9F4D1] h-90 shadow-md transition-transform transform hover:scale-105 mb-5"
        >
          <CardHeader class="flex items-center justify-between space-y-0">
            <img
              class=""
              src="https://res.cloudinary.com/dufimctfc/image/upload/v1712066752/user4_a9k8bm.svg"
              alt="gradient"
            />

            <p class="text-2xl font-bold text-gray-800">Partners</p>
          </CardHeader>
          <CardContent class="bg-[#373B4D] rounded-xl pb-4">
            <div class="px-1 pt-4 text-xs">
              <p class="font-semibold tracking-tight text-gray-400">Members</p>
              <p class="text-2xl font-semibold text-white">0</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <DashboardFooter></DashboardFooter>
  </div>
</template>
