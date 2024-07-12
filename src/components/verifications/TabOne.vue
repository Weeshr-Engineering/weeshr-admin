<template>
    <form @submit="onSubmit">
        <section class="rounded-3xl w-full">
            <div class="bg-[#D7DBF5] text-[#020721] h-14 font-medium rounded-tr-3xl rounded-tl-3xl p-4">
                Vendor Details
            </div>
            <div class="">
                <div class='flex gap-4 my-4 px-2'>
                    <div>
                        <h1 class="text-xs text-[#02072199]">Source</h1>
                        <p class="text-[#020721] text-sm">Media</p>
                    </div>
                    <div>
                        <h1 class="text-xs text-[#02072199]">Link</h1>
                        <p class="text-[#020721] text-clip text-sm">https://www.instagram.com/phonoflix</p>
                    </div>
                </div>
                <div class="grid grid-cols-5 gap-2 px-2 mb-2 max-w-full">
                    <div class="col-span-2">
                        <FormField v-slot="{ componentField }" name="state">
                            <FormItem>
                                <FormControl>
                                    <Label for="address">Address</Label>
                                    <Select
                                        v-bind="componentField"
                                        class='bg-gray-50 min-w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                        <SelectTrigger class="">
                                            <SelectValue placeholder="State" />
                                            </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Edo">Edo</SelectItem>
                                            <SelectItem value="Lagos">Lagos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage for="state" />
                            </FormItem>
                        </FormField>
                    </div>
                    <div class="grid col-span-3 w-full h-full items-end gap-1.5">
                        <FormField v-slot="{ componentField }" name="street">
                            <FormItem>
                                <FormControl>
                                    
                                    <Input type="text" v-bind="componentField" placeholder="Street"/>
                                </FormControl>
                                <FormMessage for="street" />
                            </FormItem>
                        </FormField>
                    </div>
                </div>
                <div class="px-2 mb-2 max-w-full">
                    <h5 class='text-blue-900 text-sm font-medium mb-3'>Phone Number</h5>
                    <div class='grid grid-cols-5 gap-2 w-full'>
                      <div class="col-span-2">
                        <FormField v-slot="{ componentField }" name="countrycode">
                          <FormItem>
                              <Select
                              v-bind="componentField"
                              id="gender"
                              class='bg-gray-50 w-auto mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white'>
                              <FormControl>
                                <SelectTrigger class="">
                                    <SelectValue placeholder="+234" />
                                  </SelectTrigger>
                              </FormControl>
                                <SelectContent>
                                  <SelectItem v-for="(code, key ) in CountryCodes" :value="code.dial_code" :key="key" class='flex justify-center items-center gap-2'>
                                    {{code.dial_code}} 
                                    <img
                                    class="w-[18px] h-[18px] hidden md:inline-block"
                                    :src="'https://flagcdn.com/16x12/'+code.code.toLowerCase()+'.png'"
                                    alt="gradient"/>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            
                            <FormMessage for="countrycode" />
                          </FormItem>
                        </FormField>
                      </div>
                      <div class='col-span-3'>
                        <FormField v-slot="{ componentField }" name="phone">
                          <FormItem v-auto-animate>
                            <FormControl>
                                <Input
                                  id="phone"
                                  type="tel"
                                  placeholder="Phone Number"
                                  class="focus-visible:ring-blue-600"
                                  v-bind="componentField"
                                />
                            </FormControl>
          
                            <FormMessage for="phone" />
                          </FormItem>
                        </FormField>
                      </div>
                    </div>
                  </div>
                <div class='flex flex-col gap-4 max-w-full rounded-md'>
                        <div class='max-w-full'>
                            <Table>
                                <TableHeader>
                                  <TableRow class=''>
                                    <TableHead class="text-[#020721] font-bold">
                                      Digital Footprint Checklist
                                    </TableHead>
                                    <TableHead class='flex justify-between items-center gap-4'><p>Pass</p> <p>Fail</p></TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow v-for="item in digitalFootprint" :key="item.item" class=''>
                                    <TableCell class="text-xs">
                                      {{item.item}}*
                                    </TableCell>
                                    <FormField v-slot="{ componentField }" type="radio" :name="item.name">
                                        <FormItem class="space-y-3">
                                        <FormControl>
                                            <RadioGroup
                                            class="flex"
                                            v-bind="componentField"
                                            >
                                            <FormItem class="flex items-center space-y-0 gap-x-3">
                                                <FormControl>
                                                    <TableCell class=''>
                                                        <RadioGroupItem value="true" />
                                                    </TableCell>
                                                </FormControl>
                                            </FormItem>
                                            <FormItem class="flex items-center space-y-0 gap-x-3">
                                                <FormControl>
                                                    <TableCell class=''>
                                                        <RadioGroupItem value="false" />
                                                    </TableCell>
                                                
                                                </FormControl>
                                            </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <!-- <FormMessage :for='item.name'/> -->
                                            </FormItem>
                                        </FormField>
                                  </TableRow>
                                  
                                </TableBody>
                                <TableHeader>
                                    <TableRow class=''>
                                      <TableHead class="text-[#020721] font-bold">
                                          Additional Checklist
                                      </TableHead>
                                      <TableHead class='flex justify-between items-center gap-4'><p>Pass</p> <p>Fail</p></TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    <TableRow v-for="item in additionalFootprint" :key="item.name" class=''>
                                      <TableCell class="text-xs font-normal flex-auto">
                                        {{item.item}}*
                                      </TableCell>
                                        <FormField v-slot="{ componentField }" type="radio" :name="item.name">
                                            <FormItem class="flex">
                                                <!-- <FormMessage :for='item.name'/> -->
                                            <FormControl>
                                                <RadioGroup
                                                class="flex"
                                                v-bind="componentField"
                                                >
                                                <FormItem class="flex items-center space-y-0 gap-x-3">
                                                    <FormControl>
                                                        <TableCell class=''>
                                                            <RadioGroupItem value="true" />
                                                        </TableCell>
                                                    </FormControl>
                                                </FormItem>
                                                <FormItem class="flex items-center space-y-0 gap-x-3">
                                                    <FormControl>
                                                        <TableCell class=''>
                                                            <RadioGroupItem value="false" />
                                                        </TableCell>
                                                    </FormControl>
                                                </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                </FormItem>
                                            </FormField>
                                    </TableRow>
                                  </TableBody>
                              </Table>
                        </div>
                        <div class='text-[#020721] flex items-center justify-between p-4 text-xs font-medium bg-[#D7DBF5] w-[70%] md:w-full rounded-md'>
                            <p>Verification Score</p>
                            <p>10</p>
                        </div>
                </div>
                <div class='w-full p-2'>
                    <div class="grid grid-cols-5 max-w-sm my-2 gap-2">
                        <div class='col-span-2 flex flex-col'>
                            <h1 class="text-xs text-[#02072199]">Vendor Status</h1>
                            <p class="text-[#020721] text-sm">Unattended</p>
                        </div>
                        <div class='col-span-3'>
                            <FormField v-slot="{ componentField }" name="status">
                                <FormItem>
                                    <FormControl>
                                        <Select
                                            v-bind="componentField"
                                            class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                            <SelectTrigger class="">
                                                <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="unattended">Unattended</SelectItem>
                                                <SelectItem value="attended">Attended</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage for="state" />
                                </FormItem>
                            </FormField>
                        </div>
                    </div>
                    <Textarea placeholder="Type your message here." class='my-2'/>
                    <Button class='bg-[#D7DBF5] text-[#020721]'>
                        Change Status
                    </Button>
                </div>
            </div>
            <div class='flex flex-col md:flex-row md:justify-between my-4 w-5/6 md:w-11/12 p-2 px-4'>
                <Button type='submit' class='w-full md:min-w-sm '>
                    Next
                </Button>
            </div>
        </section>
    </form>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import { computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FormControl,
  FormField,
  FormItem,
//   FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useWeeshDetailStore } from '@/stores/weeshes/weesh-details';
import CountryCodes from '@/lib/CountryCodes';

const store = useWeeshDetailStore()
const stage = computed(()=>{
    return store.stage
})
const stageTab = store.stageTab

const digitalFootprint = [
    {
        item: 'Change of Social Media Name',
        name:'change'        
    },
    {
        item: 'Date of First Published',
        name:'date'        
    },
    {
        item: 'Social Media Commentary',
        name:'social'     
    },
    {
        item: 'Engagement Quality',
        name:'engagement'  
    },
    {
        item: 'Followership Rating',
        name:'followership'  
    },
]

const additionalFootprint = [
    {
        item: 'Google Review Checker',
        name:'google'    
    },
    {
        item: 'WHOIS Status',
        name:'whois'    
    },
    {
        item: 'CAC',
        name:'cac'        
    },
    {
        item: 'Bank Account Details',
        name:'bank'  
    }
]

const formSchema = toTypedSchema(z.object({
    state: z.string(),
    street: z.string(),
    change: z.string(),
    data: z.string(),
    social: z.string(),
    engagement: z.string(),
    followership: z.string(),
    google: z.string(),
    whois: z.string(),
    cac: z.string(),
    bank: z.string(),
    phone: z.string().min(10, { message: 'Phone number must be 10 characters' }).max(10, { message: 'Phone number must be 10 characters' }),
    countrycode: z.string().optional(),
    status: z.string()
}))

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})
const onSubmit = handleSubmit((values)=>{
    console.log(values)
    stageTab(stage.value)
})
</script>