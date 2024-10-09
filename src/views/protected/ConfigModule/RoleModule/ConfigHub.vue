<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import MainNav from '@/components/MainNav.vue'
import { computed } from 'vue';
import DashboardFooter from '@/components/DashboardFooter.vue'
import { ability, defineAbilities, verifyAbilities } from '@/lib/ability';
import { useRoleStore } from '@/stores/config-details/roleManager';

const store = useRoleStore()
store.getAnalytics()
defineAbilities()
const readRole = ability.can('read', 'roles');
const roleStyle= computed(()=>{
  return readRole ? 'rounded-xl bg-[#C6F4EB] shadow-md transition-transform transform hover:scale-105 mb-5 h-[450px] flex flex-col justify-between' : 'cursor-not-allowed opacity-20 rounded-xl bg-[#C6F4EB] shadow-md mb-5 h-[450px] flex flex-col justify-between'
})
const readCategories = ability.can('read', 'weesh-categories');
const categoryStyle= computed(()=>{
  return readCategories ? 'rounded-xl bg-[#DCDEFF] h-[450px] shadow-md transition-transform transform hover:scale-105 mb-5' : 'cursor-not-allowed opacity-20 rounded-xl bg-[#DCDEFF] h-[450px] shadow-md mb-5'
})
const readGist = ability.can('read', 'weesh-gists');
const gistStyle= computed(()=>{
  return readGist ? 'rounded-xl bg-[#C6EDF6] h-[450px] shadow-md transition-transform transform hover:scale-105 mb-5' : 'cursor-not-allowed opacity-20 rounded-xl bg-[#C6EDF6] h-[450px] shadow-md mb-5'
})
const readFeatured = ability.can('read', 'featured-moments');
const featuredStyle= computed(()=>{
  return readFeatured ? 'rounded-xl bg-[#C6EDF6] h-[450px] shadow-md transition-transform transform hover:scale-105 mb-5' : 'cursor-not-allowed opacity-20 rounded-xl bg-[#C6EDF6] h-[450px] shadow-md mb-5'
})
const readCurrency = ability.can('read', 'currency');
const currencyStyle= computed(()=>{
  return readCurrency ? 'rounded-xl bg-[#C6F4EB] h-[450px] shadow-md transition-transform transform hover:scale-105 mb-5' : 'cursor-not-allowed opacity-20 rounded-xl bg-[#C6EDF6] h-[450px] shadow-md mb-5'
})
const readCountry = ability.can('read', 'country');
const countryStyle= computed(()=>{
  return readCountry ? 'rounded-xl bg-[#DCDEFF] h-[450px] shadow-md transition-transform transform hover:scale-105 mb-5' : 'cursor-not-allowed opacity-20 rounded-xl bg-[#C6EDF6] h-[450px] shadow-md mb-5'
})

</script>

<template>
    <div class="flex-col flex h-full bg-[#f0f8ff] pb-10">
        <MainNav class="mx-6" headingText="Configuration" />
    
        <div class="w-full grid gap-7 md:grid-cols-2 lg:grid-cols-4 pt-6 p-8 min-h-fit">
          <Card
            :class='roleStyle'
            @click="verifyAbilities('read', 'roles')"
          >
            <span class="flex flex-col justify-between h-full">
              <RouterLink :to="readRole ? '/config/role' : ''" class="flex flex-col h-full">
                <CardHeader class="flex flex-col items-center justify-center flex-grow">
                  <img
                    class="mb-2"
                    src="https://res.cloudinary.com/dufimctfc/image/upload/v1712066751/users1_yng7it.svg"
                    alt="gradient"
                  />
                  <p class="text-2xl font-bold text-gray-800">Role Manager</p>
                </CardHeader>
    
                <CardContent
                  class="bg-[#020721] pt-2 h-[80px] rounded-bl-[12px] rounded-br-[12px] px-1 text-xs pb-4"
                >
                  <div class="pt-2 px-4 text-xs">
                    <p class="font-semibold tracking-tight text-gray-400">Roles</p>
                    <p class="text-2xl font-semibold text-white">{{store.config.roles}}</p>
                  </div>
                </CardContent>
              </RouterLink>
            </span>
            <!-- <UserhubSkeleton /> -->
          </Card>
    
          <Card
            :class="categoryStyle"
            @click="verifyAbilities('read', 'weesh-categories')"
          >
            <span class="flex flex-col justify-between h-full">
              <RouterLink :to="ability.can('read', 'weesh-categories') ? '/config/weesh' : ''" class="flex flex-col h-full">
                <CardHeader class="flex flex-col items-center justify-center flex-grow">
                  <img
                    class="mb-2"
                    src="https://res.cloudinary.com/dufimctfc/image/upload/v1712066752/user2_gygznz.svg"
                    alt="gradient"
                  />
    
                  <p class="text-2xl font-bold text-gray-800">Weeshes Categories</p>
                </CardHeader>
    
                <CardContent class="bg-[#020721] pt-2 h-[80px] rounded-bl-[12px] rounded-br-[12px] px-1 text-xs pb-4">
                  <div class="pt-2 px-4 text-xs">
                    <p class="font-semibold tracking-tight text-gray-400">Categories</p>
                    <p class="text-2xl font-semibold text-white"> {{store.config.weesh_categories}} </p>
                  </div>
                </CardContent>
              </RouterLink>
            </span>
            <!-- <UserhubSkeleton /> -->
          </Card>
    
          <Card
            :class="gistStyle"
            @click="verifyAbilities('read', 'weesh-gist')"
          >
            <span class="flex flex-col justify-between h-full">
              <RouterLink :to="ability.can('read', 'weesh-gist') ? '/config/wish' : ''" class="flex flex-col h-full">
                <CardHeader class="flex flex-col items-center justify-center flex-grow">
                  <img
                    class="mb-2"
                    src="https://res.cloudinary.com/dufimctfc/image/upload/v1712066752/user3_hpnxmx.svg"
                    alt="gradient"
                  />
    
                  <p class="text-2xl font-bold text-gray-800">Weeshes Gist</p>
                </CardHeader>
    
                <CardContent class="bg-[#020721] pt-2 h-[80px] rounded-bl-[12px] rounded-br-[12px] px-1 text-xs pb-4">
                  <div class="pt-2 px-4 text-xs">
                    <p class="font-semibold tracking-tight text-gray-400">Gists</p>
                    <p class="text-2xl font-semibold text-white"> {{ store.config.weesh_gist }} </p>
                  </div>
                </CardContent>
              </RouterLink>
            </span>
            <!-- <UserhubSkeleton /> -->
          </Card>

          <Card
            :class="featuredStyle"
            @click="verifyAbilities('read', 'featured-moments')"
          >
            <span class="flex flex-col justify-between h-full">
              <RouterLink :to="ability.can('read', 'featured-moments') ? '/config/featured' : ''" class="flex flex-col h-full">
                <CardHeader class="flex flex-col items-center justify-center flex-grow">
                  <img
                    class="mb-2 h-44 w-44"
                    src="https://res.cloudinary.com/drykej1am/image/upload/v1724789573/269257040_11240815_mdzeid.svg"
                    alt="gradient"
                  />
    
                  <p class="text-2xl font-bold text-gray-800">Featured</p>
                </CardHeader>
    
                <CardContent class="bg-[#020721] pt-2 h-[80px] rounded-bl-[12px] rounded-br-[12px] px-1 text-xs pb-4">
                  <div class="pt-2 px-4 text-xs">
                    <p class="font-semibold tracking-tight text-gray-400">Featured moments</p>
                    <p class="text-2xl font-semibold text-white"> {{ store.config.featured }} </p>
                  </div>
                </CardContent>
              </RouterLink>
            </span>
            <!-- <UserhubSkeleton /> -->
          </Card>

          <Card
            :class="currencyStyle"
            @click="verifyAbilities('read', 'currency')"
          >
            <span class="flex flex-col justify-between h-full">
              <RouterLink :to="ability.can('read', 'currency') ? '/config/currency' : ''" class="flex flex-col h-full">
                <CardHeader class="flex flex-col items-center justify-center flex-grow">
                  <img
                    class="mb-2 h-44 w-44"
                    src="https://res.cloudinary.com/drykej1am/image/upload/v1727730386/money-exchange_m9sbfd.png"
                    alt="gradient"
                  />
    
                  <p class="text-2xl font-bold text-gray-800">Currencies</p>
                </CardHeader>
    
                <CardContent class="bg-[#020721] pt-2 h-[80px] rounded-bl-[12px] rounded-br-[12px] px-1 text-xs pb-4">
                  <div class="pt-2 px-4 text-xs">
                    <p class="font-semibold tracking-tight text-gray-400">Currencies</p>
                    <p class="text-2xl font-semibold text-white"> {{store.config.currencies}} </p>
                  </div>
                </CardContent>
              </RouterLink>
            </span>
            <!-- <UserhubSkeleton /> -->
          </Card>

          <Card
            :class="countryStyle"
            @click="verifyAbilities('read', 'country')"
          >
            <span class="flex flex-col justify-between h-full">
              <RouterLink :to="ability.can('read', 'country') ? '/config/country' : ''" class="flex flex-col h-full">
                <CardHeader class="flex flex-col items-center justify-center flex-grow">
                  <img
                    class="mb-2 h-44 w-44"
                    src="https://res.cloudinary.com/drykej1am/image/upload/v1728318022/weeshr_admin/flags_lexpn1.png"
                    alt="gradient"
                  />
    
                  <p class="text-2xl font-bold text-gray-800">Country</p>
                </CardHeader>
    
                <CardContent class="bg-[#020721] pt-2 h-[80px] rounded-bl-[12px] rounded-br-[12px] px-1 text-xs pb-4">
                  <div class="pt-2 px-4 text-xs">
                    <p class="font-semibold tracking-tight text-gray-400">Country</p>
                    <p class="text-2xl font-semibold text-white"> {{store.config.countries}} </p>
                  </div>
                </CardContent>
              </RouterLink>
            </span>
            <!-- <UserhubSkeleton /> -->
          </Card>
        </div>
    
        <DashboardFooter />  
      </div>
</template>