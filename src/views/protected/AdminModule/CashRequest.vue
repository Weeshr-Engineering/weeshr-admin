<template>
    <div class='bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10'>
        <MainNav headingText="Bank / Cash request" class=''/>
        <div>
            <PaymentApproval :items="stage" :openApprovalModal="modal"  @update:openApprovalModal="handleModal"/>
            <PaymentApproval :items="stageGroup" :openApprovalModal="groupModal"  @update:openApprovalModal="handleGroupModal"/>
            <!-- <LienComponent :items="items" :openApprovalModal="modal"  @update:openApprovalModal="handleModal"/> -->
            <Card
            class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-14 mb-4"
          >
            <div class="flex flex-col sm:flex-row sm:gap-4 items-center justify-between py-4">
              <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-2 sm:mb-0">
                Cash Request
                <p class="text-xs sm:text-sm font-normal text-[#02072199]">List of cash payout</p>
              </div>
              <div class='flex flex-col sm:flex-row sm:gap-4 gap-3 items-centerh-full'>
                <Search class="mt-3 sm:mt-0" />
                <Button :class='createStyle' @click='approveGroup' :disabled="stageGroup.length === 0" >Approve Selection</Button>
              </div>
            </div>
            <div class="overflow-auto bg-white rounded-lg shadow">
              <Table class="lg:w-full w-[800px] min-h-52">
                <TableHeader>
                  <TableRow
                    class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
                  >
                    <TableHead>Select</TableHead>
                    <TableHead>Recipient </TableHead>
                    <TableHead>Username </TableHead>
                    <TableHead>
                        <div class="flex items-center">
                            Wallet Balance
                            <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                        </div>
                    </TableHead>
                    <TableHead>
                      <div class="flex items-center">
                        Requested Amount
                        <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div class="flex items-center">
                        Resquest Date
                        <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div class="flex items-center">
                        TAT
                        <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                      </div>
                    </TableHead>
      
                    <TableHead>
                      <div class="flex items-center">
                        Status
                        <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                      </div>
                    </TableHead>
                    <TableHead v-if='createRole'></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody class='min-h-52'>
                  <TableRow v-for="(item, key) in payout" :key="item._id" class='text-nowrap'>
                    <TableCell>
                        <div class='flex items-center justify-center w-full h-full'>
                            <input type='checkbox' class='p-2 accent-[#020721] border-2' @click='updateStageArray(item._id, payout, stageGroup, key)'/>
                        </div>
                    </TableCell>
                    <TableCell class="text-xs md:text-sm lg:text-sm">{{ item?.wallet?.account_name }} </TableCell>
                    <TableCell class="text-xs md:text-sm lg:text-sm">{{ item.user?.userName }}</TableCell>
                    <TableCell class="text-xs md:text-sm lg:text-sm"> {{item.wallet.currency}} {{ item.wallet?.balance.toLocaleString() }} </TableCell>
                    <TableCell class="text-xs md:text-sm lg:text-sm">{{item.wallet.currency}} {{ item.amount.toLocaleString() }} </TableCell>
                    <TableCell class="text-xs md:text-sm lg:text-sm"> 01 Nov 1978</TableCell>
                    <TableCell class="text-xs md:text-sm lg:text-sm"> 02<span class='font-bold'>D</span>03:<span class='font-bold'>H</span>55:<span class='font-bold'>M</span> </TableCell>
                    <!-- <TableCell class="text-xs md:text-sm lg:text-sm"> {{ item.tat[0].toString().padStart(2, '0') }}<span class='font-bold'>D</span>{{ item.tat[1].toString().padStart(2, '0') }}:<span class='font-bold'>H</span>{{ item.tat[2].toString().padStart(2, '0') }}:<span class='font-bold'>M</span> </TableCell> -->
                    <TableCell><Badge class='text-white bg-[#00C37F] rounded-full'>Approve</Badge></TableCell>
                    <TableCell v-if='createRole'>
                        <svg
                          @click='singleRequest(item._id, payout, stage, key)'
                          width="20"
                          height="50"
                          viewBox="0 0 20 50"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7 31L12.5118 26.0606C13.1627 25.4773 13.1627 24.5227 12.5118 23.9394L7 19"
                            stroke="#54586D"
                            stroke-opacity="0.8"
                            stroke-width="2"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div class="flex gap-2 max-w-full flex-wrap justify-end mt-8 mr-4 items-center text-[15px]" v-if="payout.length !== 0">
              <Pagination :total="totalPages" :sibling-count="1" show-edges :default-page="1" @change="store.handlePageChange">
                <PaginationList class="flex items-center gap-1">
                  <PaginationFirst @click="store.handlePageChange(1)" />
                  <PaginationPrev @click="store.handlePageChange(Math.max(currentPage - 1, 1))" />
                  <template v-for="(item, index) in paginationItems" :key="index">
                    <PaginationListItem v-if="item.type === 'page'" :value="item.value" as-child>
                      <Button class="w-10 h-10 p-0" :variant="item.value === currentPage ? 'default' : 'outline'" @click="store.handlePageChange(item.value)">
                        {{ item.value }}
                      </Button>
                    </PaginationListItem>
                    <PaginationEllipsis v-else :index="index" />
                  </template>
                  <PaginationNext @click="store.handlePageChange(Math.min(currentPage + 1, totalPages))" />
                  <PaginationLast @click="store.handlePageChange(totalPages)" />
                </PaginationList>
              </Pagination>
            </div>
          </Card>
        </div>
        <DashboardFooter/>
    </div>
</template>

<script lang="ts" setup>
import MainNav from '@/components/MainNav.vue';
import DashboardFooter from '@/components/DashboardFooter.vue'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue';
import Search from '@/components/UseSearch.vue'
import { Badge } from '@/components/ui/badge';
import { ability, defineAbilities, verifyAbilities } from '@/lib/ability';
import PaymentApproval from '@/components/PaymentApproval.vue';
import { usePayoutStore } from '@/stores/bank/payout-store';

defineAbilities()
const createRole = ability.can('create', 'wallet-payouts');
const createStyle = computed(()=>{
  return(
    createRole ? `text-white bg-[#00C37F] rounded-full my-2 sm:my-0 ${stageGroup.value.length !== 0 ? '' : 'cursor-not-allowed'}` : 'cursor-not-allowed opacity-20 text-white bg-[#00C37F] rounded-full my-2 sm:my-0'
  )
})
import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table';
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination';


const store = usePayoutStore()
store.getPayout()
const modal = ref(false)
const payout = computed(()=>{
  return store.payout
})
const groupModal = ref(false)
const handleModal = ()=>{
    modal.value = (!modal.value)
}
const handleGroupModal = ()=>{
  verifyAbilities('create', 'wallet-payouts')
  if(createRole){
    groupModal.value = (!groupModal.value)
  }
}

  const stage = ref<Stage[]>([])
  const stageGroup = ref<Stage[]>([])
  // const page = computed(()=>{
  //   return store.page
  // })
  const currentPage = computed(()=>{
    return store.currentPage
  });
  const totalPages = computed(()=>{
    return store.totalPages
  })
  const paginationItems = computed(() => {
    const pages = [];
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push({ type: 'page', value: i });
    }
    return pages;
  });

interface Item {
    _id: string;
    [key: string]: any; // Other properties of the item
  }
interface Stage {
    id: number;
    name: string;
    amount: number;
    _id: string
}

  function updateStageArray(
    id: string,
    sourceArray: Item[], 
    stageArray: Stage[],
    key: number
  ): void {
    // Find the item in the source array using the provided id
    const item = sourceArray.find((obj) => obj._id === id);
  
    if (!item) {
      console.error(`Item with id ${id} not found in sourceArray.`);
      return;
    }
    
        // If the checkbox is checked, add the item to the stage array if it doesn't exist
    if (!stageArray.some((obj) => obj._id === id)) {
        const tempObj = {
            id: key,
            _id: id,
            name: item.wallet?.account_name,
            amount: parseInt(item.amount)
        }
        stageArray.push(tempObj);
        // stage.value = stageArray
    } else {
        // If the checkbox is unchecked, remove the item from the stage array
        const index = stageArray.findIndex((obj) => obj._id === id);
        if (index !== -1) {
            stageArray.splice(index, 1);
        }
    }
  }

  const approveGroup = ()=>{
    handleGroupModal()
  }


  const singleRequest = (
    id: string,
    sourceArray: Item[], 
    stageArray: Stage[],
    key: number
  )=>{
    const item = sourceArray.find((obj) => obj._id === id);
    
    if (!item) {
      console.error(`Item with id ${id} not found in sourceArray.`);
      return;
    }
    const tempObj: Stage = {
        _id: id,
        name: item.wallet?.account_name,
        amount: parseInt(item.amount),
        id: key
    }
    stageArray.splice(0, stageArray.length, tempObj)
    handleModal()
  }
  
</script>