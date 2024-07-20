<template>
    <div v-if="loading" class='w-full h-screen absolute top-0 left-0 z-50 flex justify-center items-center bg-white'>
        <LoadingSpinner />
    </div>
    <div class="flex-col flex bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10">
        <MainNav class="mx-6" headingText="Weeshes" />
        <div class="flex flex-col gap-4">
            <Card class='flex flex-col items-center justify-center'>
                <div class="w-full px-8 my-4 flex items-center justify-between">
                    <h3 class="text-lg font-semibold">Weesh Details</h3>
                    <Badge class="rounded-full"> {{ details.status }} </Badge>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 w-full gap-2 px-4">
                    <Card class="md:col-span-2 rounded-3xl bg-[#34389B1A] bg-opacity-10">
                        <CardContent class="flex flex-col sm:flex-row justify-start items-start md:items-center gap-4 p-4">
                            <img :src="imageData?.url" class='w-17 h-17 rounded-md md:w-20 md:h-22'/>
                                <div>
                                    <h1 class="text-base text-[#02072199]"> {{category?.name || 'No category name'}} </h1>
                                    <p class="text-[#020721] text-2xl font-bold"> {{details.name || 'No name'}} </p>
                                    <h1 class="text-base text-[#02072199]">{{details.description || 'No description'}}</h1>
                                </div>
                        </CardContent>
                    </Card>
                        <div class="col-span-1 rounded-3xl bg-[#34389B1A] bg-opacity-10 min-w-full min-h-32 md:min-h-fit flex flex-col justify-between md:flex-row lg:justify-stretch gap-4 pt-4 pb-8 md:pb-4 lg:pb-8 px-4 lg:px-6">
                            <div class="h-full flex flex-col items-start min-w-8">
                                <img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720070852/money-4_pu9pa9.svg"/>
                            </div>
                            <div class="lg:min-h-full flex flex-col md:justify-end w-full md:mr-4"> 
                                <p class="text-[#020721] text-xl lg:text-xl xl:text-3xl font-bold">₦ {{details.price?.price || 'No price'}} </p>
                            </div>
                        </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-6 w-full gap-2 px-4 py-2">
                        <div class="md:col-span-2 lg:col-span-1 min-h-32 rounded-3xl bg-[#DCDEFF] flex flex-col md:flex-row gap-4 py-6 px-4">
                            <div class="h-full flex flex-col items-start min-w-8">
                                <img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720074062/profile-circle_t6oidm.svg"/>
                            </div>
                            <div class="min-h-full md:flex flex-col justify-end w-full"> 
                                <h1 class="text-sm text-[#02072199]">Weesh by</h1>
                                <p class="text-[#020721] text-base font-bold">Alicia Colins</p>
                            </div>
                        </div>
                        <div class="md:col-span-4 lg:col-span-2 min-h-32 md:flex flex-col w-full max-h-full md:flex-row md:flex-auto gap-4 rounded-3xl bg-[#F4D5F6] p-4">
                            <div class="md:h-full my-2 flex md:flex-col md:items-start w-8">
                                <img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720070989/calendar-2_fjyoy5.svg"/>
                            </div>
                            <div class="min-h-full md:flex flex-row md:justify-end gap-4 mr-2 md:items-center w-full mt-4 md:mt-0">
                                <div class="min-h-full flex flex-col justify-end w-full"> 
                                    <h1 class="text-sm text-[#02072199]">Fulfiled on</h1>
                                    <p class="text-[#020721] text-base font-bold">19 July 2024</p>
                                </div>
                                <div class="min-h-full flex flex-col justify-end w-full"> 
                                    <h1 class="text-sm text-[#02072199]">Birthday</h1>
                                    <div class="text-[#020721] text-nowrap text-base font-bold">23 August 2024</div>
                                </div>
                            </div>
                        </div>
                        <div class="md:col-span-5 lg:col-span-3 min-h-32 md:flex gap-4 rounded-3xl bg-[#E9F4D1] py-6 px-4">
                            <div class="md:h-full col-span-1 flex flex-col items-start min-w-8 flex-1">
                                <img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720070951/map_uxvr5x.svg"/>
                            </div>
                            <div class="md:min-h-full col-span-4 grid grid-row-2 md:grid-cols-2 lg:min-w-fit gap-2 lg:gap-8 md:flex-auto mt-4 md:mt-0">
                                <div class="md:min-h-full row-span-1 md:col-span-1 md:flex flex-col justify-end lg:min-w-fit">
                                    <h1 class="text-xs md:text-sm text-[#02072199]">Street Adress</h1>
                                    <p class="text-[#020721] text-sm md:text-base font-bold">5, Boulevard Estate, Idi Vintage</p>
                                </div>
                                <div class='row-span-1 md:col-span-1 grid grid-cols-2 items-end lg:items-end'>
                                    <div class="col-span-1 w-1/5"> 
                                        <h1 class="text-sm text-[#02072199]">City</h1>
                                        <div class="text-[#020721] text-base font-bold">Calibe</div>
                                    </div>
                                    <div class="col-span-1 justify-end w-1/5"> 
                                        <h1 class="text-sm text-[#02072199]">State</h1>
                                        <div class="text-[#020721] text-base font-bold">Lagos</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
                <div class="flex flex-wrap md:grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 xl:grid-cols-6 w-full gap-2 px-4 pb-4">
                    <div class="min-w-full md:col-span-4 lg:col-span-3 min-h-32 sm:w-full md:flex flex-auto justify-stretch gap-0 lg:gap-4 rounded-3xl bg-[#C6EDF6] py-6 px-4">
                        <div class="md:h-full md:flex flex-col items-start min-w-8">
                            <img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720071004/device-message_wy0vu2.svg"/>
                        </div>
                        <div class="min-h-full md:flex justify-end w-full gap-4 mr-4 mt-4 md:mt-0">
                            <div class="md:min-h-full flex flex-col justify-end w-full mb-2 md:mb-0"> 
                                <h1 class="text-sm text-[#02072199]">Email</h1>
                                <p class="text-[#020721] text-sm md:text-base font-bold">alisha@milly.co.uk</p>
                            </div>
                            <div class="md:min-h-full text-nowrap flex flex-col justify-end w-full"> 
                                <h1 class="text-sm text-[#02072199]">Phone Number</h1>
                                <div class="text-[#020721] text-sm md:text-base font-bold">+234 908 004 3174</div>
                            </div>
                        </div>
                    </div>
                    <!-- <div class='md:col-span-2 grid md:grid-cols-2 gap-2'> -->
                        <div class="min-w-full md:min-w-44 lg:min-w-0 sm:max-w-full md:col-span-2 lg:col-span-1 min-h-32 rounded-3xl bg-[#EBCE7E] md:flex flex-1 justify-stretch gap-4 py-6 px-4">
                            <div class="md:h-full flex flex-col items-start min-w-8">
                                <img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720077681/truck-fast_dqi4bx.svg"/>
                            </div>
                            <div class="md:min-h-full mt-4 md:mt-0 flex flex-col justify-end w-full"> 
                                <h1 class="text-sm text-[#02072199]">Delivery Status</h1>
                                <p class="text-[#020721] text-base font-bold">{{details.fulfilledStatus || 'Not Initiated'}}</p>
                            </div>
                        </div>
                        <div class="min-w-full md:min-w-44 lg:min-w-0 md:col-span-2 lg:col-span-1 min-h-32 rounded-3xl bg-[#3A8EE5] md:flex flex-1 justify-stretch gap-4 py-6 px-4">
                            <div class="md:h-full flex flex-col items-start min-w-8">
                                <img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720071004/device-message_wy0vu2.svg"/>
                            </div>
                            <div class="md:min-h-full mt-4 md:mt-0 flex flex-col justify-end w-full"> 
                                <h1 class="text-sm text-[#02072199]">Procurement Status</h1>
                                <p class="text-[#020721] text-base font-bold">{{details.status || 'Not Initiated'}}</p>
                            </div>
                        </div>
                    <!-- </div> -->
                    <div class='col-span-1'></div>
                </div>
            </Card>
            <Card class="rounded-3xl">
                <CardHeader class="bg-[#020721] text-white rounded-tr-3xl rounded-tl-3xl">
                    Vendor Details
                </CardHeader>
                <CardContent class="min-h-full flex flex-col mt-4 lg:flex-row items-start justify-between lg:items-center gap-4 lg:gap-0">
                    <div>
                        <h1 class="text-sm md:text-base text-[#02072199]">Source</h1>
                        <p class="text-[#020721] text-base md:text-lg">{{details?.vendor}}</p>
                    </div>
                    <div>
                        <h1 class="text-sm md:text-base text-[#02072199]">Location</h1>
                        <p class="text-[#020721] text-base md:text-lg">Lagos State</p>
                    </div>
                    <div class='max-w-full'>
                        <h1 class="text-sm md:text-base text-[#02072199]">Link</h1>
                        <p class="text-[#020721] text-base overflow-clip lg:text-lg text-wrap">{{details?.link}}</p>
                    </div>
                    <Sheet>
                        <SheetTrigger as-child>
                            <Button class="bg-[#020721] opacity-90" :disabled='success'>Start Verification <Icon icon="mdi:chevron-right" class="ml-2" /></Button>
                        </SheetTrigger>
                        <SheetContent class="overflow-y-auto">
                            <h1 class="text-xl my-4">Verification</h1>
                            <Tabs :value="stage" class="w-fit" :modelValue="stage">
                                <TabsList class="gap-2 bg-transparent">
                                    <TabsTrigger value="1" @click="setStage('1')" :class="{'bg-[#02072199] bg-opacity-60 text-white min-w-10 md:min-w-fit min-h-10 no-underline rounded-full': stage === '1', 'bg-[#DCE0F2] text-[#02072199] min-w-10 min-h-10 rounded-full p-2 no-underline': stage !== '1'}">
                                    <p :class="{'text-white': stage === '1', 'text-[#02072199]': stage !== '1'}">1 <span class='hidden md:inline-block'>{{ stage == '1' ? 'Vender Details' : '' }}</span></p>
                                    </TabsTrigger>
                                    <TabsTrigger value="2" @click="setStage('2')" :class="{'bg-[#02072199] bg-opacity-60 text-white no-underline rounded-full min-w-10 md:min-w-fit min-h-10': stage === '2', 'bg-[#DCE0F2] text-[#02072199] min-w-10 min-h-10 rounded-full p-2 no-underline': stage !== '2'}">
                                    <p :class="{'text-white': stage === '2', 'text-[#02072199]': stage !== '2'}">2 <span class='hidden md:inline-block'>{{ stage == '2' ? 'Product Status' : '' }}</span></p>
                                    </TabsTrigger>
                                    <TabsTrigger value='3' @click="setStage('3')" :class="{'bg-[#02072199] bg-opacity-60 text-white no-underline rounded-full min-w-10 md:min-w-fit min-h-10': stage === '3', 'bg-[#DCE0F2] text-[#02072199] min-w-10 min-h-10 rounded-full p-2 no-underline': stage !== '3'}">
                                    <p :class="{'text-white': stage === '3', 'text-[#02072199]': stage !== '3'}">3 <span class='hidden md:inline-block'>{{ stage == '3' ? 'Purchase Initiation' : '' }}</span></p>
                                    </TabsTrigger>
                                    <TabsTrigger value="4" @click="setStage('4')" :class="{'bg-[#02072199] bg-opacity-60 text-white no-underline rounded-full min-w-10 md:min-w-fit min-h-10': stage === '4', 'bg-[#DCE0F2] text-[#02072199] min-w-10 min-h-10 rounded-full p-2 no-underline': stage !== '4'}">
                                    <p :class="{'text-white': stage === '4', 'text-[#02072199]': stage !== '4'}">4 <span class='hidden md:inline-block'>{{ stage == '4' ? 'Payment' : '' }}</span></p>
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="1" class=''>
                                    <TabOne/>
                                </TabsContent>
                                <TabsContent value="2" class='w-[310px]'>
                                    <TabTwo/>
                                </TabsContent>
                                <TabsContent value="3" class='w-[310px]'>
                                    <TabThree/>
                                    </TabsContent>
                                    <TabsContent value="4" class='w-[310px]'>
                                        <section class="rounded-3xl min-w-full min-h-full">
                                            <div class="bg-[#D7DBF5] text-[#020721] h-14 font-medium rounded-tr-3xl rounded-tl-3xl p-4">
                                                Payment Status
                                            </div>
                                            <div class='min-h-96 p-2'>
                                                <div class='p-2'>
                                                    <img 
                                                    src='https://res.cloudinary.com/dotojp6xu/image/upload/v1720669798/Illustration_twyh5k.svg'
                                                    class='w animate-pulse transition-transform delay-300' />
                                                    <!-- <img src='https://res.cloudinary.com/dotojp6xu/image/upload/v1720669816/Illustration_1_zlkk29.svg'/> -->
                                                </div>
                                                <h1 class='text-center font-semibold'>Payment Successful</h1>
                                                <div class='md:flex my-4 justify-center px-4 min-h-28 w-full'>
                                                    <Button class='w-full flex items-center justify-center' @click='done'>
                                                    <SheetClose>  <p>Done</p></SheetClose>
                                                    </Button>
                                                </div>
                                            </div>
                                        </section>
                                    </TabsContent>
                                </Tabs>
                        </SheetContent>
                    </Sheet>
                </CardContent>
            </Card>
            <Card class="rounded-3xl">
                <CardHeader class="bg-[#020721] text-white rounded-tr-3xl rounded-tl-3xl">
                    Weesh Log
                </CardHeader>
                <CardContent class="min-h-24">
                </CardContent>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import MainNav from '@/components/MainNav.vue'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/vue'
import { Badge } from '@/components/ui/badge';
import { useWeeshDetailStore } from '@/stores/weeshes/weesh-details';
import { computed, ref } from 'vue'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TabThree from '@/components/verifications/TabThree.vue';
import TabTwo from '@/components/verifications/TabTwo.vue';
import TabOne from '@/components/verifications/TabOne.vue';
// import { toast } from '@/components/ui/toast'
// import axios from "@/services/ApiService";
import { useRoute } from 'vue-router';
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const success = ref(false)
const store = useWeeshDetailStore()
const done = ()=>{
    success.value= true
}
const details = computed(()=>{
    return store.detail
})
const category = computed(()=>{
    return store.category
})
const imageData = computed(()=>{
    return store.image
})
const stage = computed(()=>{
    return store.stage
})
const loading = computed(()=>{
    return store.loading
})

const setStage = store.setStage

const route = useRoute();
const id = route.params.Id;
// const id = '65a41c16e7004dd9b408b60c'
// '6639626d054298235b7d5bb8'
store.getWeeshDetails(id)
</script>