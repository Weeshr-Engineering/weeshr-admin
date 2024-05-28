<template>
  <div class="flex-col flex bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10">
    <MainNav class="mx-6" headingText="Activity Log" />

    <Card class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-14 mb-4">
      <div class="flex flex-col sm:flex-row items-center justify-between py-4">
        <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-2 sm:mb-0">
          Activity Log
          <p class="text-xs sm:text-sm font-normal text-[#02072199]">List of Activity logs</p>
        </div>
        <Search class="mt-3 lg:mt-0" />
      </div>

      <div class="overflow-auto bg-white rounded-lg shadow">
        <Table class="lg:w-full w-[800px]">
          <TableHeader>
            <TableRow class="text-[#02072199] font-semibold bg-gray-200">
              <TableHead class="text-sm">
                ID
              </TableHead >
              <TableHead class="text-sm">
                 Timestamp  
              </TableHead>
              <TableHead class="text-sm">
                <div class="flex items-center text-sm">
                 User ID
                  <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                </div>  
              </TableHead>
              <TableHead class="text-sm">  
              Username
                
              </TableHead>
              <TableHead class="text-sm">
                <div class="flex items-center">
                 Action 
                  <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                </div> 
                
              </TableHead>
              <TableHead class="text-sm">
                 IP Address
                
              </TableHead>

              <TableHead class="text-sm">
                <div class="flex items-center">
                User Agent
                  <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                </div>
              </TableHead>

              <TableHead class="text-sm">
                <div class="flex items-center">
                 Status
                  <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                </div>  
              </TableHead>
              <TableHead class="text-sm">
                Description
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="log in logs" :key="log.id">
              <TableCell class="text-xs md:text-sm lg:text-xs">{{ log.id }}</TableCell>
              <TableCell class="text-xs md:text-sm lg:text-xs">{{ new Date(log.timestamp).toLocaleString() }}</TableCell>
              <TableCell class="text-xs md:text-sm lg:text-xs">{{ log.user.id }}</TableCell>
              <TableCell class="text-xs md:text-sm lg:text-xs">{{ log.user.extras.userName }}</TableCell>
              <TableCell class="text-xs md:text-sm lg:text-xs">{{ log.action }}</TableCell>
              <TableCell class="text-xs md:text-sm lg:text-xs">{{ log.resource.ip }}</TableCell>
              <TableCell class="text-xs md:text-sm lg:text-xs">{{ log.resource.user_agent }}</TableCell>
              <TableCell>
                <div
                  :class="statusBg(log.status)"
                  class="rounded-[10px] w-fit px-1.5 py-0.5 text-white text-xs capitalize"
                >{{ log.status }}
              </div>
              </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-xs">{{ log.description }}</TableCell>
              <TableCell>
                <Icon icon="uil:angle-right" class="ml-1" width="25" height="25" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div class="flex gap-2 max-w-full flex-wrap justify-end mt-8 mr-4 items-center text-[15px]">
        <Button variant="secondary">
          <Icon icon="radix-icons:chevron-left" />
        </Button>
        <Button variant="secondary" class="bg-[#020721] text-gray-400">1</Button>
        <Button variant="outline">2</Button>
        <Button variant="outline">&#8230;</Button>
        <Button variant="outline">74</Button>
        <Button variant="outline">75</Button>
        <Button variant="outline">
          <Icon icon="radix-icons:chevron-right" />
        </Button>
        <a href="#">
          <p class="text-[blue]">See all</p>
        </a>
      </div>
    </Card>
    <DashboardFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useActivityLogStore } from '@/stores/activity-log/activity-log';
import MainNav from '@/components/MainNav.vue';
import DashboardFooter from '@/components/DashboardFooter.vue';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/vue';
import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table';
import Search from '@/components/UseSearch.vue';

const route = useRoute();
const store = useActivityLogStore();

const logs = ref(store.logs);
const loading = ref(store.loading);
const error = ref(store.error);
const userId = route.params.Id;

onMounted(() => {
 
    store.fetchActivityLogs('65a41c16e7004dd9b408b60c');
 
});
console.log(userId)
watch(
  () => store.logs,
  (newLogs) => {
    logs.value = newLogs;
  }
);

watch(
  () => store.loading,
  (newLoading) => {
    loading.value = newLoading;
  }
);

watch(
  () => store.error,
  (newError) => {
    error.value = newError;
  }
);

const statusBg = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-[#EE9F39]'
    case 'FAILED':
      return 'bg-[#E45044]'
    case 'SUCCESS':
      return 'bg-[#00c37f]'
    default:
      return ''
  }
}
</script>


