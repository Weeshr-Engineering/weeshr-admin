<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { useSuperAdminStore } from '@/stores/super-admin/super-admin'

const superAdminStore = useSuperAdminStore()
const user = superAdminStore.getLocalstorageData()
const id = '68fe1807a98f5d209988f4e0'
const logout = async () => {
  await superAdminStore.logout()
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <!-- <Button
        variant="ghost"
        class="relative h-12 w-12 bg-primary text-white hover:bg-[#EBCE7E] rounded-2xl ml-2"
      >
        {{ user.firstname[0] }}{{ user.lastname[0] }}
      </Button> -->
      <span class="relative">
        <img src="https://res.cloudinary.com/drykej1am/image/upload/v1757871530/weershr-vendor/Group_348_izzhlm.png" alt="" class=" max-h-10 max-w-10"/>
      </span>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" align="end">
      <DropdownMenuLabel class="flex font-normal">
        <router-link :to="`/details`">
          <div class="flex flex-col space-y-1">
            <p class="text-sm md:hidden font-medium leading-none">
              {{ user.firstname[0] }}{{ user.lastname[0] }}
            </p>
            <p class="text-sm hidden md:block font-medium leading-none">
              {{ user.firstname }} {{ user.lastname }}
            </p>
            <p class="text-xs leading-none text-muted-foreground">{{ user.email }}</p>
          </div>
        </router-link>
      </DropdownMenuLabel>
      <!-- <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem @click="redirect(`/admindetails/${user.id}`)">Profile </DropdownMenuItem>
        <DropdownMenuItem @click="redirect(`/user`)"> Users </DropdownMenuItem>
        <DropdownMenuItem @click="redirect(`/config`)"> Configuration </DropdownMenuItem>
      </DropdownMenuGroup> -->
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="logout"> Log out </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
@/stores/super-admin/super-admin@/stores/super-admin/super-admin
