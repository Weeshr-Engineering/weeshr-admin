<template>
    <form @submit="onSubmit">
        <section class="rounded-3xl w-full">
            <div class="bg-[#D7DBF5] text-[#020721] h-14 font-medium rounded-tr-3xl rounded-tl-3xl p-4">
                Vendor Bank Details
            </div>
            <div class="min-w-56 px-2">
                <div class='px-2 my-4'>
                    <div class='w-full'>
                        <div class="text-sm text-gray-500 px-2 my-2">
                            Account Name
                        </div>
                        <div class='bg-[#0000000D] bg-opacity-5 w-full h-9 py-2 px-4 flex items-center rounded-md'>
                            John Doe
                        </div>
                    </div>
                    <div class='flex flex-col md:grid grid-cols-3 my-4 gap-2'>
                        <div class='col-span-2 gap-2'>
                            <FormField v-slot="{ componentField }" name="number">
                                <FormItem>
                                  <FormLabel class="text-gray-500 px-2">Account Number</FormLabel>
                                  <FormControl>
                                    <Input
                                        id='checkpass'
                                        type="text"
                                        class='w-full h-10'
                                        placeholder='000 0000 000'
                                      v-bind="componentField"
                                    />
                                  </FormControl>
                
                                  <FormMessage for="number" />
                                </FormItem>
                              </FormField>
                        </div>
                        <div class='col-span-1 md:grid items-end'>
                            <FormField v-slot="{ componentField }" name="bank">
                                <FormItem v-auto-animate>
                                  <FormControl>
                                    <Select
                                        v-bind="componentField"
                                        id="gender"
                                        class='w-full bg-[#0000000D] bg-opacity-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block min-w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                        <SelectTrigger class="">
                                            <SelectValue placeholder="Select Bank" />
                                            </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="First bank">First Bank</SelectItem>
                                            <SelectItem value="UBA">UBA</SelectItem>
                                        </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage for="bank" />
                                </FormItem>
                            </FormField>
                        </div>
                    </div>
                </div>
                    <div class='w-full px-2'>
                        <div class="text-sm text-gray-500 px-2">
                            Concluded Price
                        </div>
                        <div class='bg-[#0000000D] bg-opacity-5 w-full h-9 my-2 py-2 px-4 rounded-md'>
                            ₦ 1,558,100.50.00
                        </div>
                    </div>
                    <!-- <p>{{tabThreeErr}}</p> -->
                <div class='flex flex-col justify-center px-2 my-8 w-full'>
                    <Button type='submit' class='w-full flex items-center justify-center'>
                        <p>Request Payment</p>
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
import { Input } from '@/components/ui/input';
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
import { useWeeshDetailStore } from '@/stores/weeshes/weesh-details';


const store = useWeeshDetailStore()
const stage = computed(()=>{
    return store.stage
})
const stageTab = store.stageTab

const formSchema = toTypedSchema(z.object({
    number: z.string().nonempty('Required'),
    bank: z.string().nonempty('Required')
}))

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})
const onSubmit = handleSubmit((values)=>{
    console.log(values)
    stageTab(stage.value)
})
</script>