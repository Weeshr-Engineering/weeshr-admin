<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { onMounted } from 'vue'
import { useUserhubStore } from '@/stores/userhub-details/userhub-details'
import MainNav from '@/components/MainNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import UserhubSkeleton from '@/components/UserhubSkeleton.vue'
import { ability, defineAbilities } from '@/lib/ability'
import { toast } from '@/components/ui/toast'

defineAbilities()
const userHubStore = useUserhubStore()
const verifyPermission = (action: string, subject: string)=>{
  if(!ability.can(action, subject)){
    toast({
        title: 'You do not have READ access',
        // description: ``,
        variant: 'destructive'
      })
  }
}
onMounted(() => {
  const userHubStore = useUserhubStore()
  userHubStore.getUsersNumber()
})
</script>

<template>
  <div class="flex-col flex h-full bg-[#f0f8ff] pb-10">
    <MainNav class="mx-6" headingText="Users Hub" />

    <div class="w-full grid gap-7 md:grid-cols-2 lg:grid-cols-4 pt-6 p-8">
      <Card
        class="rounded-xl bg-[#C6F4EB] shadow-md transition-transform transform hover:scale-105 mb-5 h-[450px] flex flex-col justify-between"
      >
        <span v-if="userHubStore.loading" class="flex flex-col justify-between h-full">
          <RouterLink to="/user/appuser" class="flex flex-col h-full">
            <CardHeader class="flex flex-col items-center justify-center flex-grow">
              <img
                class="mb-2"
                src="https://res.cloudinary.com/dufimctfc/image/upload/v1712066751/users1_yng7it.svg"
                alt="gradient"
              />
              <p class="text-2xl font-bold text-gray-800">App Users</p>
            </CardHeader>

            <CardContent
              class="bg-[#020721] pt-2 h-[80px] rounded-bl-[12px] rounded-br-[12px] px-1 text-xs pb-4"
            >
              <div class="pt-2 px-4 text-xs">
                <p class="font-semibold tracking-tight text-gray-400">Members</p>
                <p class="text-2xl font-semibold text-white">{{ userHubStore.usersCount }}</p>
              </div>
            </CardContent>
          </RouterLink>
        </span>
        <UserhubSkeleton />
      </Card>

      <Card
        class="rounded-xl bg-[#DCDEFF] h-[450px] shadow-md transition-transform transform hover:scale-105 mb-5"
      >
        <span v-if="userHubStore.loading" class="flex flex-col justify-between h-full">
          <RouterLink to="/user/vendors" class="flex flex-col h-full">
            <CardHeader class="flex flex-col items-center justify-center flex-grow">
              <img
                class="mb-2"
                src="https://res.cloudinary.com/dufimctfc/image/upload/v1712066752/user2_gygznz.svg"
                alt="gradient"
              />

              <p class="text-2xl font-bold text-gray-800">Vendors</p>
            </CardHeader>

            <CardContent class="bg-[#020721] pt-2 h-[80px] rounded-bl-[12px] rounded-br-[12px] px-1 text-xs pb-4">
              <div class="pt-2 px-4 text-xs">
                <p class="font-semibold tracking-tight text-gray-400">Members</p>
                <p class="text-2xl font-semibold text-white">{{ userHubStore.vendorsCount }}</p>
              </div>
            </CardContent>
          </RouterLink>
        </span>
        <UserhubSkeleton />
      </Card>

      <Card
        class="rounded-xl bg-[#89cff0ee] h-[450px] shadow-md transition-transform transform hover:scale-105 mb-5"
        @click="verifyPermission('read', 'admins')"
      >
        <span v-if="userHubStore.loading" class="flex flex-col justify-between h-full">
          <RouterLink :to="ability.can('read', 'admins') ? '/user/admin' : ''" class="flex flex-col h-full">
            <CardHeader class="flex flex-col items-center justify-center flex-grow">
              <img
                class="mb-2"
                src="https://res.cloudinary.com/dufimctfc/image/upload/v1712066752/user3_hpnxmx.svg"
                alt="gradient"
              />

              <p class="text-2xl font-bold text-gray-800">Admin Staff</p>
            </CardHeader>

            <CardContent class="bg-[#020721] pt-2 h-[80px] rounded-bl-[12px] rounded-br-[12px] px-1 text-xs pb-4">
              <div class="pt-2 px-4 text-xs">
                <p class="font-semibold tracking-tight text-gray-400">Members</p>
                <p class="text-2xl font-semibold text-white">{{ userHubStore.adminsCount }}</p>
              </div>
            </CardContent>
          </RouterLink>
        </span>
        <UserhubSkeleton />
      </Card>

      <Card
        class="rounded-xl bg-[#E9F4D1] h-[450px] shadow-md transition-transform transform hover:scale-105 mb-5"
      >
        <span v-if="userHubStore.loading" class="flex flex-col justify-between h-full">
          <CardHeader class="flex flex-col items-center justify-center flex-grow">
            <img
              class="mb-2"
              src="https://res.cloudinary.com/dufimctfc/image/upload/v1712066752/user4_a9k8bm.svg"
              alt="gradient"
            />

            <p class="text-2xl font-bold text-gray-800">Partners</p>
          </CardHeader>
          <CardContent class="bg-[#020721] pt-2 h-[80px] rounded-bl-[12px] rounded-br-[12px] px-1 text-xs pb-4">
            <div class="pt-2 px-4 text-xs">
              <p class="font-semibold tracking-tight text-gray-400">Members</p>
              <p class="text-2xl font-semibold text-white">{{ userHubStore.partnersCount }}</p>
            </div>
          </CardContent>
        </span>
        <UserhubSkeleton />
      </Card>
    </div>

    <DashboardFooter />

          
  </div>
</template>
..userhub