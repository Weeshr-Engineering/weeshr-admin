<template>
    <div class="w-full">
        <MainNav class="mx-6" headingText="Country Config" />
        <div class="px-10 py-5 md:py-10 ml-auto w-full flex justify-end">
            <Sheet v-model:open='store.state'>
              <SheetTrigger as-child>
                <button @click="verifyAbilities('create', 'country')" :class="createStyle">
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
                    <h3 class="text-2xl font-medium">Add New country</h3>
                    
                    </SheetHeader>
                    <SheetDescription class="pt-2 flex items-center gap-4">
                        Active <Switch v-model:checked='active' @click='()=> active=!active'/>
                    </SheetDescription>
                </div>
                <div>
                  <Form :validation-schema="schema" @submit="onSubmit">
                    <!-- <form class="space-y-4" @submit.prevent="onSubmit"> -->
                        <FormField v-slot="{ componentField }" name="name">
                            <FormItem v-auto-animate>
                              <FormLabel class="text-blue-900">Country name</FormLabel>
                              <FormControl>
                                <Input
                                  id="text"
                                  type="text"
                                  class="focus-visible:ring-blue-600"
                                  v-bind="componentField"
                                />
                              </FormControl>
            
                              <FormMessage for="country" />
                            </FormItem>
                          </FormField>

                          <FormField v-slot="{ componentField }" name="flag">
                            <FormItem v-auto-animate>
                              <FormLabel class="text-blue-900">Flag url</FormLabel>
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
            
                              <FormMessage for="symbol" />
                            </FormItem>
                          </FormField>

                          <FormField v-slot="{ componentField }" name="dial_code">
                            <FormItem v-auto-animate>
                              <FormLabel class="text-blue-900">Dial code</FormLabel>
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
                    <Button @click='store.resetSeed' :class='refreshStyle'>Refresh</Button>
                </div>
                <Card Content class="mt-4" v-for="(item, key) in countries" :key="key">
                  <CardContent
                    class="grid grid-cols-7 px-2 sm:px-6 py-4"
                  >
                  <div class="col-span-3 flex items-center gap-4">
                      <div class="flex flex-col gap-2">
                        <p class='text-muted-foreground text-xs text-[#000000]'>Country</p>
                        {{ item.name}}
                      </div>
                  </div>

                  <div class="hidden col-span-1 md:flex flex-col gap-2">
                    <p class='text-muted-foreground text-xs text-[#000000]'>Code</p>
                    {{ item.code }}
                  </div>

                  <div class="hidden col-span-1 md:flex flex-col gap-2">
                    <p class='text-muted-foreground text-xs text-[#000000]'>Dial Code</p>
                    {{ item.dial_code }}
                  </div>

                  <div class='col-span-2 md:col-span-1 flex items-center justify-center'>
                    <Switch :checked='item.isEnabled' @click='store.updateState(!item.isEnabled, item.code)'/>
                  </div>
                    <div class="col-span-2 md:col-span-1 flex items-center justify-end gap-4 md:w-full">
                      <Sheet>
                        <SheetTrigger>
                          <Icon @click='handleItem(item.code)' icon="mdi:edit" width="17" height="17" :class="editStyle" />
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
                                  <FormField v-slot="{ componentField }" name="editName">
                                    <FormItem v-auto-animate>
                                      <FormLabel class="text-blue-900">Edit Country Name</FormLabel>
                                      <FormControl>
                                        <Input
                                          id="text"
                                          type="text"
                                          placeholder="Edit country name"
                                          class="focus-visible:ring-blue-600"
                                          v-bind="componentField"
                                        />
                                      </FormControl>
                    
                                      <FormMessage for="country" />
                                    </FormItem>
                                  </FormField>

                                  <FormField v-slot="{ componentField }" name="editFlag">
                                    <FormItem v-auto-animate>
                                      <FormLabel class="text-blue-900">Flag url</FormLabel>
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

                                  <FormField v-slot="{ componentField }" name="editCode">
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
                    
                                      <FormMessage for="symbol" />
                                    </FormItem>
                                  </FormField>

                                  <FormField v-slot="{ componentField }" name="editDial_code">
                                    <FormItem v-auto-animate>
                                      <FormLabel class="text-blue-900">Dial code</FormLabel>
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
                                <Button type="submit" class="bg-[#4145A7] mt-2"> Update country</Button>
                              </Form>
                        </SheetContent>
                      </Sheet>

                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Icon icon="mdi:delete" width="17" height="17" :class="deleteStyle" @click="verifyAbilities('delete', 'country')"/>
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
                            <AlertDialogAction :onclick="()=>deleteRole(item.code)">Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                        </div>
                      </AlertDialog>
                    </div>

                  </CardContent>
                </Card>
                <div v-if="countries.length !== 0">
                    <PagePagination :page-current="store.page" :page-total="store.totalPages" @pagination="store.handlePageChange"/>
                    <!-- <Pagination :total="totalPages" :sibling-count="1" show-edges :default-page="1" @change="store.handlePageChange">
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
                    </Pagination> -->
                  </div>
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
import PagePagination from '@/components/PagePagination.vue';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import MainNav from '@/components/MainNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import { ref, computed } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { Form, ErrorMessage } from 'vee-validate';
import * as z from 'zod'
import { toast } from '@/components/ui/toast'
import { ability, defineAbilities, verifyAbilities } from '@/lib/ability'
import { useCountryStore } from '@/stores/config-details/countryStore'

defineAbilities()
const create = ability.can('create', 'country')
const createStyle = computed(()=>{
  return create ? 'bg-[#020721] px-4 py-2 rounded-xl w-50 h-12' : 'cursor-not-allowed opacity-20 bg-[#020721] px-4 py-2 rounded-xl w-50 h-12'
})

const edit = ability.can('update', 'country')
const editStyle = computed(()=>{
  return edit ? 'icons-sidebar border-2 border-gray-100' : 'cursor-not-allowed opacity-20 icons-sidebar border-2 border-gray-100'
})

const deleteRoles = ability.can('delete', 'country')
const deleteStyle = computed(()=>{
  return deleteRoles ? 'icons-sidebar text-red-600' : 'cursor-not-allowed opacity-20 icons-sidebar text-red-600'
})

const refresh = ability.can('update', 'country')
const refreshStyle = computed(()=>{
  return refresh ? '' : 'cursor-not-allowed opacity-20'
})

const store = useCountryStore()
const currentPage = computed(()=>{
  return store.currentPage
});
const totalPages = computed(()=>{
  return store.totalPages
})
store.getcountries(store.page, 'Success: countries retrieved')
const country = ref('')
const active = ref(true)
const handleItem =(val:string)=>{
    country.value = val
}
// store.getPermissions()

const schema = toTypedSchema(
  z.object({
    name: z.string().nonempty('Add Name').min(3, { message: 'Cannot be less that 3 character'}),
    flag: z.string().nonempty('Add flag').max(3, { message: 'Cannot be more that 2 character'}),
    code: z.string().nonempty('Add code').max(3, { message: 'Cannot be more that 3 character'}),
    dial_code: z.string().nonempty('Add dial code'),
  })
)

const deleteRole = async (id:string)=>{
  await store.deleteCountry(id)
}
const onSubmit=async (values:any)=> {
//   console.log(JSON.stringify(values, null, 2));
  const data = JSON.stringify({
    'name': values.name,
    'flag': values.flag,
    'code': values.code,
    'dial_code': values.dial_code,
    isEnabled: active.value
  })
  console.log(data)
  await store.createCountry(data)
}

const editSchema = toTypedSchema(
  z.object({
    editName: z.string().min(3, { message: 'Cannot be less that 3 character'}).optional(),
    editFlag: z.string().max(3, { message: 'Cannot be more that 3 character'}).optional(),
    editCode: z.string().max(3, { message: 'Cannot be more that 3 character'}).optional(),
    editDial_code: z.string().optional(),
  })
)

const countries = computed(()=>{
    return store.countries
})
const onEdit= async (values:any)=> {
    let data = {

    }
    if(values.editName || values.editFlag || values.editCode || values.editDial_code){
        // console.log(values)
        if (values.editName){
            data = {
                ...data,
                country: values.editName
            }     
        }
        if (values.editFlag){
            data = {
                ...data,
                flag: values.editFlag
            }     
        }
        if (values.editCode){
            data = {
                ...data,
                code: values.editCode
            }     
        }
        if (values.editDial_code){
            data = {
                ...data,
                dial_code: values.editDial_code
            }     
        }
        console.log(data)
        store.updateCountry(data, country.value)
    }else{
        toast({
            description: 'All input fields are empty',
            variant: 'destructive'
        }) 
    }
}


const paginationItems = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push({ type: 'page', value: i });
  }
  return pages;
});

</script>