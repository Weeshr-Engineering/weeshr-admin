<template>
    <div class="flex-col flex bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10">
        <MainNav class="mx-6" headingText="Weeshes" />
        <div class="flex flex-col gap-4">
            <Card>
                <div class="w-full px-8 my-4 flex items-center justify-between">
                    <h3 class="text-lg font-semibold">Weesh Details</h3>
                    <Badge class="rounded-full">Added</Badge>
                </div>
                <div class="flex flex-col gap-2 lg:flex-row p-4">
                    <Card class="flex-auto rounded-3xl bg-[#34389B1A] bg-opacity-10">
                        <CardContent class="flex justify-start items-center gap-4 p-4">
                            <img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720071091/Rectangle_3624_om6xeb.png"/>
                                <div>
                                <h1 class="text-base text-[#02072199]">Gadget</h1>
                                <p class="text-[#020721] text-2xl font-bold">iPhone 15 Pro Max</p>
                                <h1 class="text-base text-[#02072199]">A Pink 256GB phone, new one oh</h1>
                                </div>
                        </CardContent>
                    </Card>
                    <!-- <Card class=""> -->
                        <div class="flex-1 rounded-3xl bg-[#34389B1A] bg-opacity-10 min-h-32 max-w-64 lg:max-w-72 flex justify-stretch gap-4 pt-4 pb-8 px-2 lg:px-6">
                            <div class="h-full flex flex-col items-start min-w-8"><img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720070852/money-4_pu9pa9.svg"/></div>
                            <div class="min-h-full flex flex-col justify-end items-end min-w-fit mr-4"> <p class="text-[#020721] text-2xl font-bold">₦ 1,565,987.00</p></div>
                        </div>
                    <!-- </Card> -->
                </div>
                <div class="flex flex-row flex-wrap w-full gap-2 p-4">
                        <div class="min-h-32 rounded-3xl bg-[#DCDEFF] flex flex-auto justify-stretch gap-4 py-6 px-4">
                            <div class="h-full flex flex-col items-start w-1/5">
                                <img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720074062/profile-circle_t6oidm.svg"/>
                            </div>
                            <div class="min-h-full flex flex-col justify-end w-full"> 
                                <h1 class="text-sm text-[#02072199]">Weesh by</h1>
                                <p class="text-[#020721] text-base font-bold">Alicia Colins</p>
                            </div>
                        </div>
                        <div class="min-h-32 flex flex-auto justify-stretch gap-4 rounded-3xl bg-[#F4D5F6] py-6 px-4">
                            <div class="h-full flex flex-col items-start w-8">
                                <img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720070989/calendar-2_fjyoy5.svg"/>
                            </div>
                            <div class="min-h-full flex justify-end items-center w-full">
                                <div class="min-h-full flex flex-col justify-end w-full"> 
                                    <h1 class="text-sm text-[#02072199]">Fulfiled on</h1>
                                    <p class="text-[#020721] text-base font-bold">19 July 2024</p>
                                </div>
                                <div class="min-h-full flex flex-col justify-end w-full"> 
                                    <h1 class="text-sm text-[#02072199]">Birthday</h1>
                                    <div class="text-[#020721] text-base font-bold">23 August 2024</div>
                                </div>
                            </div>
                        </div>
                        <div class="min-h-32 max-w-fit lg:max-w-lg flex flex-auto justify-stretch gap-4 rounded-3xl bg-[#E9F4D1] py-6 px-4">
                            <div class="h-full flex flex-col items-start min-w-8 flex-1">
                                <img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720070951/map_uxvr5x.svg"/>
                            </div>
                            <div class="min-h-full flex justify-end items-center lg:min-w-fit gap-2 lg:gap-8 flex-3">
                                <div class="min-h-full flex flex-col justify-end lg:min-w-fit">
                                    <h1 class="text-sm text-[#02072199]">Street Adress</h1>
                                    <p class="text-[#020721] text-base font-bold">5, Boulevard Estate, Idi Vintage</p>
                                </div>
                                <div class="min-h-full flex flex-col justify-end w-1/5 flex-2"> 
                                    <h1 class="text-sm text-[#02072199]">City</h1>
                                    <div class="text-[#020721] text-base font-bold">Calibe</div>
                                </div>
                                <div class="min-h-full flex flex-col justify-end w-1/5 flex-2"> 
                                    <h1 class="text-sm text-[#02072199]">State</h1>
                                    <div class="text-[#020721] text-base font-bold">Lagos</div>
                                </div>
                            </div>
                        </div>
                </div>
                <div class="flex flex-row flex-wrap w-full gap-2 p-4">
                    <div class="min-h-32 flex flex-auto justify-stretch gap-0 lg:gap-4 rounded-3xl bg-[#C6EDF6] py-6 px-4">
                        <div class="h-full flex flex-col items-start w-8">
                            <img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720071004/device-message_wy0vu2.svg"/>
                        </div>
                        <div class="min-h-full flex justify-end w-full">
                            <div class="min-h-full flex flex-col justify-end w-full"> 
                                <h1 class="text-sm text-[#02072199]">Email</h1>
                                <p class="text-[#020721] text-base font-bold">alisha@milly.co.uk</p>
                            </div>
                            <div class="min-h-full flex flex-col justify-end w-full"> 
                                <h1 class="text-sm text-[#02072199]">Phone Number</h1>
                                <div class="text-[#020721] text-base font-bold">+234 908 004 3174</div>
                            </div>
                        </div>
                    </div>
                    <div class="min-h-32 rounded-3xl bg-[#EBCE7E] flex flex-1 justify-stretch gap-4 py-6 px-4 min-w-44">
                        <div class="h-full flex flex-col items-start w-1/5">
                            <img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720077681/truck-fast_dqi4bx.svg"/>
                        </div>
                        <div class="min-h-full flex flex-col justify-end w-full"> 
                            <h1 class="text-sm text-[#02072199]">Deliery Status</h1>
                            <p class="text-[#020721] text-base font-bold">Not Initiated</p>
                        </div>
                    </div>
                    <div class="min-h-32 rounded-3xl bg-[#3A8EE5] flex flex-1 justify-stretch gap-4 py-6 px-4 min-w-44 max-w-64">
                        <div class="h-full flex flex-col items-start w-1/5">
                            <img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720071004/device-message_wy0vu2.svg"/>
                        </div>
                        <div class="min-h-full flex flex-col justify-end w-full"> 
                            <h1 class="text-sm text-[#02072199]">Procurement Status</h1>
                            <p class="text-[#020721] text-base font-bold">Not Initiated</p>
                        </div>
                    </div>
                </div>
            </Card>
            <Card class="rounded-3xl">
                <CardHeader class="bg-[#020721] text-white rounded-tr-3xl rounded-tl-3xl">
                    Vendor Details
                </CardHeader>
                <CardContent class="min-h-24 mt-4 lg:mt-0 flex flex-col lg:flex-row items-start justify-between lg:items-center gap-4 lg:gap-0">
                    <div>
                        <h1 class="text-base text-[#02072199]">Source</h1>
                        <p class="text-[#020721] text-lg">Media</p>
                    </div>
                    <div>
                        <h1 class="text-base text-[#02072199]">Location</h1>
                        <p class="text-[#020721] text-lg">Lagos State</p>
                    </div>
                    <div>
                        <h1 class="text-base text-[#02072199]">Link</h1>
                        <p class="text-[#020721] text-lg">https://www.instagram.com/phonoflix</p>
                    </div>
                    <Button class="bg-[#4145A7] opacity-10">Start Verification <Icon icon="mdi:chevron-right" class="ml-2" /></Button>
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

const store = useWeeshDetailStore()
// import axios from "@/services/ApiService";
import { useRoute } from 'vue-router';


const route = useRoute();
// const id = route.params.Id;
const id = '65a41c16e7004dd9b408b60c'
// '6639626d054298235b7d5bb8'
store.getWeeshDetails(id)
</script>