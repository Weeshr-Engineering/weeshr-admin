<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import UserNav from '@/components/UserNav.vue'

import { useDateFormat, useNow } from '@vueuse/core'
const formattedDate = useDateFormat(useNow(), 'ddd, D MMM YYYY')
</script>

<template>
  <div class="flex-col flex h-svh h-full bg-[#f0f8ff]">
    <div class="flex items-center h-16 px-4">
      <div class="mx-6 tracking-tight text-gray-500 text-1xl">
        {{ formattedDate }}

        <p class="text-3xl font-bold tracking-tight text-gray-800">Configuration</p>
      </div>

      <div class="flex items-center ml-auto space-x-4">
        <p class="font-semibold tracking-tight text-gray-800">Abiola Waltz</p>
        <UserNav />
        <p class="ml-4 text-xs font-normal tracking-tight">Adminstrator</p>
      </div>
    </div>
    <div class="flex-1 space-y-4 p-8 pt-6 bg-[#f0f8ff]">
      <div class="flex flex-col items-center justify-between space-y-2 sm:flex-row"></div>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-20 space-y-0">
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold text-gray-800">Role Manager</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-20 space-y-0">
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold text-gray-800">Weesh Category</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-20 space-y-0">
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold text-gray-800">Weesh Gist</div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
