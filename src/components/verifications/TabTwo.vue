<template>
    <form @submit='onSubmit'>
        <section class="rounded-3xl w-full min-h-full">
            <div class="bg-[#D7DBF5] text-[#020721] h-14 font-medium rounded-tr-3xl rounded-tl-3xl p-4">
                Product Status
            </div>
            <div class='px-2 w-full'>
                <div class="gap-4 p-2">
                    <img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720071091/Rectangle_3624_om6xeb.png"/>
                    <Collapsible>
                        <CollapsibleTrigger>Info  &#9432;</CollapsibleTrigger>
                        <CollapsibleContent>
                            <div class='w-full bg-[#0000000D] bg-opacity-5 p-2 rounded-md'>
                                <h1 class="text-sm text-[#02072199]">Gadget</h1>
                                <p class="text-[#020721] text-xl font-bold">iPhone 15 Pro Max</p>
                                <h1 class="text-sm text-[#02072199]">A Pink 256GB phone, new one oh</h1>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </div>

                <div class='md:min-w-full'>
                    <h1 class="text-sm text-[#02072199] px-2">Product Description</h1>
                    <div class='w-full pr-4 grid grid-cols-5 bg-[#0000000D] bg-opacity-5 p-2 rounded-md'>
                        <div class='col-span-2 flex items-center justify-start'>
                            <h2 class="text-base font-medium text-[#02072199]">Check</h2>
                        </div>
                        <div class='col-span-3 p-1'>
                            <FormField v-slot="{ componentField }" type="radio" name="check">
                                <FormItem class="">
                                  <FormControl>
                                    <RadioGroup
                                      class="flex item-center justify-center"
                                      v-bind="componentField"
                                    >
                                      <FormItem class="flex justify-center items-end gap-2">
                                        <FormLabel class='text-sm text-green-600'>
                                            Pass
                                          </FormLabel>
                                        <FormControl>
                                          <RadioGroupItem value="pass" />
                                        </FormControl>
                                        
                                      </FormItem>
                                      <FormItem class="flex justify-center items-end gap-2">
                                        <FormLabel class="text-sm text-red-600">
                                            Fail
                                          </FormLabel>
                                        <FormControl>
                                          <RadioGroupItem value="fail" />
                                        </FormControl>                                               
                                      </FormItem>
                                       
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              </FormField>
                        </div>
                    </div>
                </div>

                <div class='my-4'>
                    <h1 class="text-sm text-[#02072199] px-2">Availability Status</h1>
                    <div class='w-full pr-4'>
                        <FormField v-slot="{ componentField }" name="purchase">
                            <FormItem>
                              <FormControl>
                                <Select
                                    v-bind="componentField"
                                    id="gender"
                                    class='w-full bg-[#0000000D] bg-opacity-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block min-w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                    <SelectTrigger class="">
                                        <SelectValue placeholder="Purchase Eligibile" />
                                        </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Yes</SelectItem>
                                        <SelectItem value="false">No</SelectItem>
                                    </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage for="check" />
                            </FormItem>
                        </FormField>
                    </div>
                </div>

                <div class='my-2'>
                    <div class='md:flex w-full items-center justify-between h-12 p-2 rounded-md'>
                        <h1 class="text-sm text-[#02072199]">Price Status</h1>
                        <p class="text-[#020721] text-xl font-bold">₦ 1,558,100.50</p>
                    </div>
                    <div class='w-full pr-4 my-4 md:my-0'>
                        <Select
                            id="gender"
                            class='bg-[#0000000D] bg-opacity-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block min-w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                            <SelectTrigger class="" disabled>
                                <SelectValue placeholder="Exact Price" />
                                </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Edo">1,500,000. 50</SelectItem>
                                <SelectItem value="Lagos">234211</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div class='flex w-full pr-4 my-4 p-2 px-0'>
                    <Button type='submit' class='w-full md:min-w-sm '>
                        Next
                    </Button>
                </div>
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
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useWeeshDetailStore } from '@/stores/weeshes/weesh-details';


const store = useWeeshDetailStore()
const stage = computed(()=>{
    return store.stage
})
const stageTab = store.stageTab

const formSchema = toTypedSchema(z.object({
    purchase: z.string().nonempty('Required'),
    check: z.string().nonempty('Required')
}))

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})
const onSubmit = handleSubmit((values)=>{
    console.log(values)
    stageTab(stage.value)
})
</script>