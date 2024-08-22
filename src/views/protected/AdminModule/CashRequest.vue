<template>
    <div>
        <MainNav headingText="Bank / Cash request" class=''/>
        <div>
            <PaymentApproval :items="stage" :openApprovalModal="modal"  @update:openApprovalModal="handleModal"/>
            <!-- <LienComponent :items="items" :openApprovalModal="modal"  @update:openApprovalModal="handleModal"/> -->
            <Card
            class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-14 mb-4"
          >
            <div class="flex flex-col sm:flex-row items-center justify-between py-4">
              <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-2 sm:mb-0">
                Cash Request
                <p class="text-xs sm:text-sm font-normal text-[#02072199]">List of cash payout</p>
              </div>
              <div class='flex flex-col sm:flex-row items-start sm:gap-6 gap-3'>
                <Search class="mt-3 md:mt-0" />
                <Button class='text-white bg-[#00C37F] rounded-full my-2 sm:my-0' @click='approveGroup'>Approve Selection</Button>
              </div>
            </div>
            <div class="overflow-auto bg-white rounded-lg shadow">
              <Table class="lg:w-full w-[800px]">
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
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="item in items" :key="item.id" class='text-nowrap'>
                    <TableCell>
                        <div class='flex items-center justify-center w-full h-full'>
                            <input type='checkbox' class='p-2 accent-[#020721] border-2' @click='updateStageArray(item.id, items, stageGroup)'/>
                        </div>
                    </TableCell>
                    <TableCell class="text-xs md:text-sm lg:text-sm">{{ item.recipient }} </TableCell>
                    <TableCell class="text-xs md:text-sm lg:text-sm">{{ item.name }}</TableCell>
                    <TableCell class="text-xs md:text-sm lg:text-sm">₦{{ item.balance }} </TableCell>
                    <TableCell class="text-xs md:text-sm lg:text-sm">₦ {{ item.amount }} </TableCell>
                    <TableCell class="text-xs md:text-sm lg:text-sm">{{ item.date }} </TableCell>
                    <TableCell class="text-xs md:text-sm lg:text-sm"> {{ item.tat[0].toString().padStart(2, '0') }}<span class='font-bold'>D</span>{{ item.tat[1].toString().padStart(2, '0') }}:<span class='font-bold'>H</span>{{ item.tat[2].toString().padStart(2, '0') }}:<span class='font-bold'>M</span> </TableCell>
                    <TableCell><Badge class='text-white bg-[#00C37F] rounded-full'>Approve</Badge></TableCell>
                    <TableCell>
                        <svg

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
            <div class="flex gap-2 max-w-full flex-wrap justify-end mt-8 mr-4 items-center text-[15px]">
              <Button variant="secondary"> <Icon icon="radix-icons:chevron-left" /> </Button>
              <Button variant="secondary" class="bg-[#020721] text-gray-400"> 1 </Button>
              <Button variant="outline"> 2 </Button>
              <Button variant="outline"> &#8230; </Button>
              <Button variant="outline"> 74</Button>
              <Button variant="outline"> 75 </Button>
              <Button variant="outline"> <Icon icon="radix-icons:chevron-right" /> </Button>
              <a href="#"><p class="text-[blue]">See all</p></a>
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

defineAbilities()
const createRole = ability.can('create', 'wallet-payouts');

import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'


const modal = ref(false)
const handleModal = ()=>{
    modal.value = (!modal.value)
}

const items = ref<any[]>([
  {
    id: 1,
    recipient: 'Weeshr Bank',
    name: '@harrison',
    weeshes: 'iphone 15 Pro Max',
    balance: '500,000',
    tat: [2,3,55],
    type: 'Inflow',
    date: '01 Nov 1978',
    amount: '1,565,987.00',
    status: 'successful'
  },
  {
    id: 2,
    recipient: 'Weeshr Bank',
    name: '@dario',
    weeshes: 'Mary K Facial Cleanser',
    balance: '500,000',
    tat: [2,3,55],
    type: 'Inflow',
    date: '03 Sep 1995',
    amount: '51,000,087.66',
    status: 'successful'
  },
  {
    id: 3,
    recipient: 'Weeshr Bank',
    name: '@sidney101',
    weeshes: '2014 Honda Accord',
    balance: '500,000',
    tat: [2,3,55],
    type: 'Inflow',
    date: '25 Aug 1994',
    amount: '1,927.0',
    status: 'successful'
  },
  {
    id: 4,
    recipient: 'Ajax Logistics',
    name: '@kemiller',
    weeshes: 'Lacoste White Sneakers',
    balance: '500,000',
    tat: [2,3,55],
    type: 'Outflow',
    date: '06 Apr 1991',
    amount: '1,565,987.00',
    status: 'pending'
  },
  {
    id: 5,
    recipient: 'WeeshrBank',
    name: '@saderizder',
    weeshes: 'Money',
    balance: '500,000',
    tat: [2,3,55],
    type: 'Inflow',
    date: '28 Dec 1988',
    amount: '200,000.00',
    status: 'failed'
  },
])

const stage = ref<Stage[]>([])

interface Item {
    id: string;
    [key: string]: any; // Other properties of the item
  }
interface Stage {
    id: number;
    name: string;
    amount: number;
}
  
const stageGroup = ref<Stage[]>([])

  function updateStageArray(
    id: string, 
    sourceArray: Item[], 
    stageArray: Stage[],
  ): void {
    // Find the item in the source array using the provided id
    const item = sourceArray.find((obj) => obj.id === id);
  
    if (!item) {
      console.error(`Item with id ${id} not found in sourceArray.`);
      return;
    }
    
        // If the checkbox is checked, add the item to the stage array if it doesn't exist
    if (!stageArray.some((obj) => obj.id === parseInt(id))) {
        const tempObj = {
            id: parseInt(item.id),
            name: item.name,
            amount: parseInt(item.amount)
        }
        stageArray.push(tempObj);
        stage.value = stageArray
    } else {
        // If the checkbox is unchecked, remove the item from the stage array
        const index = stageArray.findIndex((obj) => obj.id === parseInt(id));
        if (index !== -1) {
            stageArray.splice(index, 1);
        }
    }
  }

  const approveGroup = ()=>{
    console.log(stageGroup)
    stage.value = stageGroup.value
    handleModal()
  }

  //@click='singleRequest(item.id, items, stage)'
  const singleRequest = (
    id: string, 
    sourceArray: Item[], 
    stageArray: Stage[],
  )=>{
    const item = sourceArray.find((obj) => obj.id === id);
    
    if (!item) {
      console.error(`Item with id ${id} not found in sourceArray.`);
      return;
    }
    const tempObj: Stage = {
                id: parseInt(item.id),
                name: item.name,
                amount: parseInt(item.amount)
            }
        // stageSingle.value = tempObj
        stageArray.splice(0, stageArray.length, tempObj)
        handleModal()
  }
  
</script>