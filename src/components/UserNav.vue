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

const logout = async () => {
  await superAdminStore.logout()
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="relative h-12 w-12 bg-[#EBCE7E] hover:bg-[#EBCE7E] rounded-2xl ml-2"
      >
        {{ user.firstname[0] }}{{ user.lastname[0] }}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" align="end">
      <DropdownMenuLabel class="flex font-normal">
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium leading-none">
            {{ user.firstname[0] }}{{ user.lastname[0] }}
          </p>
          <p class="text-xs leading-none text-muted-foreground">{{ user.email }}</p>
        </div>
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
