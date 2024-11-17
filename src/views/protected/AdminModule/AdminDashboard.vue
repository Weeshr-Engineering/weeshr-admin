<script setup lang="ts">
import { onMounted } from 'vue';
import MainNav from '@/components/MainNav.vue';
import DashboardFooter from '@/components/DashboardFooter.vue';
import { Card, CardContent } from '@/components/ui/card';
import { useUserhubStore } from '@/stores/userhub-details/userhub-details';
import usersTable from '@/components/usersTable.vue';
import { ability } from '@/lib/ability';
import { defineAbilities } from '@/lib/ability';
import { useWeeshStore } from '@/stores/weeshes/weeshes-count';
import { useDashboardAnalyticsStore } from '@/stores/dashboard-analytics/dashboard-analytics';
import { storeToRefs } from 'pinia';
import { Loader2 } from 'lucide-vue-next';

defineAbilities();
const userHubStore = useUserhubStore();
const weeshStore = useWeeshStore();
const dashboardAnalyticsStore = useDashboardAnalyticsStore();

const { addedCount } = storeToRefs(weeshStore);
const { weeshes, wallet, users, tickets, loading } = storeToRefs(dashboardAnalyticsStore);

weeshStore.getWeeshesCount();
dashboardAnalyticsStore.fetchDashboardAnalytics();

onMounted(() => {
  userHubStore.getUsersNumber();
});
function formatNumberWithCommas(number: number): string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
</script>

<template>
  <div class="flex-col flex bg-[#f0f8ff] h-full p-8 pt-6 pb-10 w-full">
    <MainNav class="mx-6" headingText="Dashboard" />
    <div class="w-full grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        <Card class="h-[210px] rounded-[24px] shadow-md transition-transform transform hover:scale-105">
            <div class="h-[130px] pt-4 bg-[#00e19d] bg-opacity-20 relative rounded-tr-[24px] rounded-tl-[24px]">
                <CardContent class="flex items-center justify-between space-y-0">
                    <p class="text-l font-medium text-[#020721]">Weeshes</p>
                    <img
                      class="h-6 w-6"
                      src="https://res.cloudinary.com/dotojp6xu/image/upload/v1715162947/menu_mvjoy6.svg"
                      alt="gradient"
                    />
                    <div class="text-2xl lg:text-2xl font-medium text-[#020721] absolute bottom-2 left-5">
                    <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
                    <p v-else >{{formatNumberWithCommas (weeshes.all) }}</p>
                     </div>
            </CardContent>
            </div>
            <div class="bg-[#020721] pt-2 h-[80px] rounded-bl-[24px] rounded-br-[24px]">
                <CardContent class="flex flex-col space-y-0">
                    <p class="text-l font-normal text-[#F8F9FFB2]">Delivered</p>
                    <div class="text-2xl font-normal text-white">
                    <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-white animate-spin" />
                    <p v-else >{{formatNumberWithCommas (weeshes.fulfilled) }}</p>
                    </div>
                </CardContent>
            </div>
        </Card>

        <Card class="h-[210px] rounded-[24px] shadow-md transition-transform transform hover:scale-105">
            <div class="h-[130px] pt-4 bg-[#6A70FF] bg-opacity-20 relative rounded-tr-[24px] rounded-tl-[24px]">
                <CardContent class="flex items-center justify-between space-y-0">
                    <p class="text-l font-medium text-[#020721]">Total wallet balance</p>
                    <img
                      class="h-6 w-6"
                      src="https://res.cloudinary.com/dotojp6xu/image/upload/v1715162926/wallet-3_fbkk9u.svg"
                      alt="gradient"
                    />
                    <div class="text-2xl lg:text-2xl font-medium text-[#020721] absolute bottom-2 left-5">
                    <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
                    <p class='whitespace-nowrap text-adaptive' v-else >₦ {{formatNumberWithCommas (wallet.total_current_balance.balance) }}</p>
                    </div>
                </CardContent>
            </div>
            <div class="bg-[#020721] pt-2 h-[80px] rounded-bl-[24px] rounded-br-[24px]">
                <CardContent class="flex flex-col space-y-0">
                     <p class="text-l font-normal text-[#F8F9FFB2]">Invested</p>
                    <div class="text-2xl font-normal text-white">
                    <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-white animate-spin" />
                    <p v-else >₦ {{formatNumberWithCommas (wallet.invested.balance) }}</p>
                    </div>
                </CardContent>
            </div>
        </Card>

        <Card class="h-[210px] rounded-[24px] shadow-md transition-transform transform hover:scale-105">
            <div class="h-[130px] pt-4 bg-[#00BBD4] bg-opacity-20 relative rounded-tr-[24px] rounded-tl-[24px]">
                <CardContent class="flex items-center justify-between space-y-0">
                    <p class="text-l font-medium text-[#020721]">Users</p>
                    <img
                      class="h-6 w-6"
                      src="https://res.cloudinary.com/dotojp6xu/image/upload/v1715162907/profile-2user_stezwz.svg"
                      alt="gradient"
                    />
                    <div class="text-2xl lg:text-2xl font-medium text-[#020721] absolute bottom-2 left-5">
                    <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
                    <p v-else >{{ formatNumberWithCommas (users.all) }}</p>
                    </div>
                </CardContent>
            </div>
            <div class="bg-[#020721] pt-2 h-[80px] rounded-bl-[24px] rounded-br-[24px]">
                <CardContent class="flex flex-col space-y-0">
                    <p class="text-l font-normal text-[#F8F9FFB2]">Active</p>

                    <div class="text-2xl font-normal text-white">
                    <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-white animate-spin" />
                    <p v-else>{{ formatNumberWithCommas (users.active) }}</p>
                    </div>
                </CardContent>
            </div>
        </Card>

        <Card class="h-[210px] rounded-[24px] shadow-md transition-transform transform hover:scale-105">
            <div class="h-[130px] pt-4 bg-[#AEE219] bg-opacity-20 relative rounded-tr-[24px] rounded-tl-[24px]">
                <CardContent class="flex items-center justify-between space-y-0">
                    <p class="text-l font-medium text-[#020721]">Tickets</p>
                    <img
                      class="h-6 w-6"
                      src="https://res.cloudinary.com/dotojp6xu/image/upload/v1715162881/ticket_etur0t.svg"
                      alt="gradient"
                    />
                    <div class="text-2xl lg:text-2xl font-medium text-[#020721] absolute bottom-2 left-5">
                    <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
                    <p v-else>{{formatNumberWithCommas (tickets.all) }}</p>
                    </div>
                </CardContent>
            </div>
            <div class="bg-[#020721] h-[80px] pt-2 rounded-bl-[24px] rounded-br-[24px]">
                <CardContent class="flex flex-col space-y-0">
                    <p class="text-l font-normal text-[#F8F9FFB2]">Pending</p>
                    <div class="text-2xl font-normal text-white">
                    <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-white animate-spin" />
                    <p v-else >{{formatNumberWithCommas (tickets.pending) }}</p>
                    </div>
                </CardContent>
            </div>
        </Card>
    </div>
    <Card class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-16 mb-4">
      <usersTable />
    </Card>
    <DashboardFooter/>
  </div>
</template>
