<template>
    <div class="w-full">
        <MainNav class="mx-6" headingText="Currency Config" />
        <div class="px-10 py-5 md:py-10 ml-auto w-full flex justify-end">
            <Sheet v-model:open='store.state'>
              <SheetTrigger as-child>
                <button @click="verifyAbilities('create', 'currency')" :class="createStyle">
                  <div class="text-base text-[#F8F9FF] text-center flex items-center">
                    Add New
                    <svg
                      width="20"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="ml-6"
                    >
                      <path
                        d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16 12.75H12.75V16C12.75 16.41 12.41 16.75 12 16.75C11.59 16.75 11.25 16.41 11.25 16V12.75H8C7.59 12.75 7.25 12.41 7.25 12C7.25 11.59 7.59 11.25 8 11.25H11.25V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V11.25H16C16.41 11.25 16.75 11.59 16.75 12C16.75 12.41 16.41 12.75 16 12.75Z"
                        fill="#F8F9FF"
                      />
                    </svg>
                  </div>
                </button>
              </SheetTrigger>
              <SheetContent class="overflow-y-auto py-8" v-if="create">
               <div class="flex py-4 justify-between items-center">
                    <SheetHeader>
                    <h3 class="text-2xl font-medium">Add New Currency</h3>
                    
                    </SheetHeader>
                    <SheetDescription class="pt-2 flex items-center gap-4">
                        Active <Switch v-model:checked='active' @click='()=> active=!active'/>
                    </SheetDescription>
                </div>
                <div>
                  <Form :validation-schema="schema" @submit="onSubmit">
                    <!-- <form class="space-y-4" @submit.prevent="onSubmit"> -->
                        <FormField v-slot="{ componentField }" name="currency">
                            <FormItem v-auto-animate>
                              <FormLabel class="text-blue-900">Currency name</FormLabel>
                              <FormControl>
                                <Input
                                  id="text"
                                  type="text"
                                  class="focus-visible:ring-blue-600"
                                  v-bind="componentField"
                                />
                              </FormControl>
            
                              <FormMessage for="currency" />
                            </FormItem>
                          </FormField>

                          <FormField v-slot="{ componentField }" name="code">
                            <FormItem v-auto-animate>
                              <FormLabel class="text-blue-900">Code</FormLabel>
                              <FormControl>
                                <Input
                                  id="text"
                                  type="text"
                                  class="focus-visible:ring-blue-600"
                                  v-bind="componentField"
                                />
                              </FormControl>
            
                              <FormMessage for="code" />
                            </FormItem>
                          </FormField>

                          <FormField v-slot="{ componentField }" name="symbol">
                            <FormItem v-auto-animate>
                              <FormLabel class="text-blue-900">Symbol</FormLabel>
                              <FormControl>
                                <Input
                                  id="text"
                                  type="text"
                                  class="focus-visible:ring-blue-600"
                                  v-bind="componentField"
                                />
                              </FormControl>
            
                              <FormMessage for="symbol" />
                            </FormItem>
                          </FormField>
                          
                          <div class="flex justify-end items-center gap-4 mt-5"> 
                              <Button type="submit" class="bg-[#4145A7]">
                                Save
                              </Button>
                          </div>
                    </Form>
                </div>
              </SheetContent>
            </Sheet>
        </div>
        <div class="w-full flex justify-center">
            <div class="min-h-72 w-5/6">
                <div class="flex justify-end w-full text-sm text-[#6A70FF]">
                    <!-- <p>Only show active</p> -->
                </div>
                <Card Content class="mt-4" v-for="(item, key) in currencies" :key="key">
                  <CardContent
                    class="flex items-center justify-between px-2 sm:px-6 py-4"
                  >
                  <div class="flex items-center gap-4">
                      <div class="text-center flex flex-col gap-2 items-center">
                        <p class='text-muted-foreground text-xs text-[#000000]'>Currency</p>
                        {{ item.name}}
                      </div>
                  </div>
                  <div class="hidden md:flex flex-col gap-2 items-center">
                    <p class='text-muted-foreground text-xs text-[#000000]'>Symbol</p>
                    {{ item.symbol.toUpperCase() }}
                  </div>

                  <div class="hidden md:flex flex-col gap-2 items-center">
                    <p class='text-muted-foreground text-xs text-[#000000]'>Code</p>
                    {{ item.code }}
                  </div>

                  <div>
                    <Switch :checked='item.isEnabled' @click='store.updateState(!item.isEnabled, item._id)'/>
                  </div>
                    <div class="flex items-center gap-4">
                      <Sheet>
                        <SheetTrigger>
                          <Icon @click='handleItem(item._id)' icon="mdi:edit" width="17" height="17" :class="editStyle" />
                        </SheetTrigger>
                        <SheetContent class="overflow-y-auto py-8" side="right" v-if="edit">
                            <div class="flex py-4 justify-between items-center">
                              <SheetHeader>
                              <h3 class="text-2xl font-medium">{{item.name.toUpperCase()}}</h3>
                              </SheetHeader>
                              
                          </div>
                              <Form :validation-schema="editSchema" @submit="onEdit">
                                <div class="">
                                  <ErrorMessage name="permissionList" class="text-red-600 text-sm font-medium"/>
                                  <FormField v-slot="{ componentField }" name="currency">
                                    <FormItem v-auto-animate>
                                      <FormLabel class="text-blue-900">Edit Currency Name</FormLabel>
                                      <FormControl>
                                        <Input
                                          id="text"
                                          type="text"
                                          placeholder="Edit currency name"
                                          class="focus-visible:ring-blue-600"
                                          v-bind="componentField"
                                        />
                                      </FormControl>
                    
                                      <FormMessage for="currency" />
                                    </FormItem>
                                  </FormField>

                                  <FormField v-slot="{ componentField }" name="code">
                                    <FormItem v-auto-animate>
                                      <FormLabel class="text-blue-900">Code</FormLabel>
                                      <FormControl>
                                        <Input
                                          id="text"
                                          type="text"
                                          class="focus-visible:ring-blue-600"
                                          v-bind="componentField"
                                        />
                                      </FormControl>
                    
                                      <FormMessage for="code" />
                                    </FormItem>
                                  </FormField>

                                  <FormField v-slot="{ componentField }" name="symbol">
                                    <FormItem v-auto-animate>
                                      <FormLabel class="text-blue-900">Symbol</FormLabel>
                                      <FormControl>
                                        <Input
                                          id="text"
                                          type="text"
                                          class="focus-visible:ring-blue-600"
                                          v-bind="componentField"
                                        />
                                      </FormControl>
                    
                                      <FormMessage for="symbol" />
                                    </FormItem>
                                  </FormField>
                                </div>
                                <Button type="submit" class="bg-[#4145A7] mt-2"> Update Role</Button>
                              </Form>
                        </SheetContent>
                      </Sheet>

                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Icon icon="mdi:delete" width="17" height="17" :class="deleteStyle" @click="verifyAbilities('delete', 'roles')"/>
                        </AlertDialogTrigger>
                        <div>
                        <AlertDialogContent v-if="deleteRoles">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure you want to delete {{item.name}}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this role
                              and remove it from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction :onclick="()=>deleteRole(item._id)">Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                        </div>
                      </AlertDialog>
                    </div>

                  </CardContent>
                </Card>
              </div>
        </div>
        <DashboardFooter/>
    </div>
</template>

<script setup lang="ts">
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@iconify/vue'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet'
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import MainNav from '@/components/MainNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import { ref, onMounted, computed } from 'vue'
import { useRoleStore } from '@/stores/config-details/roleManager'
import { toTypedSchema } from '@vee-validate/zod'
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as z from 'zod'
import { toast } from '@/components/ui/toast'
import { ability, defineAbilities, verifyAbilities } from '@/lib/ability'
import { useCurrencyStore } from '@/stores/config-details/currencyStore'

defineAbilities()
const create = ability.can('create', 'currency')
const createStyle = computed(()=>{
  return create ? 'bg-[#020721] px-4 py-2 rounded-xl w-50 h-12' : 'cursor-not-allowed opacity-20 bg-[#020721] px-4 py-2 rounded-xl w-50 h-12'
})

const state = computed(()=>{
    return store.state
})
const edit = ability.can('update', 'currency')
const editStyle = computed(()=>{
  return edit ? 'icons-sidebar border-2 border-gray-100' : 'cursor-not-allowed opacity-20 icons-sidebar border-2 border-gray-100'
})

const deleteRoles = ability.can('delete', 'currency')
const deleteStyle = computed(()=>{
  return deleteRoles ? 'icons-sidebar text-red-600' : 'cursor-not-allowed opacity-20 icons-sidebar text-red-600'
})

const store = useCurrencyStore()
store.getCurrencies('Success: currencies retrieved')
const currency = ref('')
const active = ref(true)
const handleItem =(val:string)=>{
    currency.value = val
}
// store.getPermissions()

const schema = toTypedSchema(
  z.object({
    currency: z.string().nonempty('Please add a Name').min(3, { message: 'Cannot be more that 3 character'}),
    code: z.string().nonempty('Add description').max(3, { message: 'Cannot be more that 3 character'}),
    symbol: z.string().nonempty('Cannot be empty'),
  })
)

const deleteRole = async (id:string)=>{
  await store.deleteCurrency(id)
}
const onSubmit=async (values:any)=> {
//   console.log(JSON.stringify(values, null, 2));
  const data = JSON.stringify({
    'name': values.currency,
    'code': values.code,
    'symbol': values.symbol,
    isEnabled: active.value
  })
  console.log(data)
  await store.createCurrency(data)
}

const editSchema = toTypedSchema(
  z.object({
    currency: z.string().min(3, { message: 'Cannot be more that 3 character'}).optional(),
    code: z.string().max(3, { message: 'Cannot be more that 3 character'}).optional(),
    symbol: z.string().optional(),
  })
)

interface Currency {
    name: string,
    code: string,
    symbol: string,
    isEnabled: boolean,
    _id: string
}

const currencies = computed(()=>{
    return store.currencies
})
// // : Currency[] = [
//     {
//         name: 'Naira',
//         code: 'NG',
//         symbol: '#',
//         isEnabled: true,
//         _id: 'ergdfdf',
//     }
// ]

const onEdit= async (values:any)=> {
    let data = {

    }
    if(values.currency || values.code || values.symbol){
        // console.log(values)
        if (values.currency){
            data = {
                ...data,
                currency: values.currency
            }     
        }
        if (values.code){
            data = {
                ...data,
                code: values.code
            }     
        }
        if (values.symbol){
            data = {
                ...data,
                symbol: values.symbol
            }     
        }
        console.log(data)
        store.updateCurrency(data, currency.value)
    }else{
        toast({
            description: 'All input fields are empty',
            variant: 'destructive'
        }) 
    }
}

const sheetCLose = ref(true)

// onMounted(async()=>{
//     await store.getRoles('Roles found')
//     allPermissions.value = await useRoleStore().allPermissions()
// })
</script>