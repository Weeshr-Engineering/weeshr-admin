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
import { useConfigStore } from '@/stores/config-details/config-detail'
import { toTypedSchema } from '@vee-validate/zod'
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as z from 'zod'
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead
} from '@/components/ui/table'
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

import axios from "axios";
import { toast } from '@/components/ui/toast'
import router from '@/router'

const token = sessionStorage.getItem('token') || ''


const schema = toTypedSchema(
  z.object({
    roleName: z.string().nonempty('Please add a Name'),
    description: z.string().nonempty('Add description'),
    permissionList: z.array(z.string()),
  })
)

const deleteRole = async (id:string)=>{
  await useConfigStore().deleteRole(id)
  getRoles()
}
const onSubmit=async (values:any)=> {
  console.log(JSON.stringify(values, null, 2));
  const data = JSON.stringify({
    'name': values.roleName,
    'description': values.description,
    'permissions': values.permissionList
  })
  await useConfigStore().createRole(data)
  getRoles()
}



const editSchema = toTypedSchema(
  z.object({
    name: z.string().nonempty('Please add a Name').optional(),
    permissionArr: z.array(z.string()).nonempty('Select at least one permission').optional(),
  })
)

const roles = ref<any[]>([])
const permissions = ref<any[]>([])
const allPermissions = ref<any[]>([])
const rolePermissions = ref<any[]>([])
const roleName = ref('')
const modified = ref(false)

const handleRolePermissions=(arr: any[], name: string)=>{
  modified.value = false
  rolePermissions.value = arr
  roleName.value = name
}

const getRoles = async()=>{
            toast({
                title: 'Loading Data',
                description: 'Fetching data...',
                duration: 0 // Set duration to 0 to make it indefinite until manually closed
              })  
              try {
                const response = await axios.get(
                  `https://api.staging.weeshr.com/api/v1/admin/roles`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  }
                )
            
                if (response.status === 200 || response.status === 201) {
                  toast({
                    title: 'Success',
                    description: `Gotten data`,
                    variant: 'success'
                  })
                }
                perPage.value= response.data.data.perPage
                currentPage.value = response.data.data.currentPage
                totalPages.value = response.data.data.totalPages
                roles.value= response.data.data.data.reverse()
                console.log(roles.value)
                // set Loading to false
    
              } catch (error: any) {
                if (error.response.status === 401) {
                  // sessionStorage.removeItem('token')

                  setTimeout(() => {
                    router.push({ name: 'home' })
                  }, 3000)
            
                  toast({
                    title: 'Unauthorized',
                    description: 'You are not authorized to perform this action. Redirecting to home page...',
                    variant: 'destructive'
                  })
                  // Redirect after 3 seconds
                } else {
                  toast({
                    title: error.response.data.message || 'An error occurred',
                    variant: 'destructive'
                  })
                }
              }
        }
const onEdit= async (values:any)=> {
  let arr: any[]
  let name: string

  if(values.permissionArr){
    const combinedArray = [...rolePermissions.value, ...values.permissionArr];
    modified.value = true
  
  // Use a Set to ensure all elements are unique
  arr = [...new Set(combinedArray)];
  }else{
    arr = rolePermissions.value
  }
  // console.log(arr)
  if(values.name){
    name = values.name
  }else{
    name = roleName.value
  }
  if(name == roleName.value && modified.value == false){
    console.log(arr)
    toast({
      title: 'No edit found',
      description: 'You have to make a change first',
      variant: 'destructive'
    })
  }else{
    const data = JSON.stringify({
    'name': name,
    'permissions': arr
  })
  console.log(data)
  useConfigStore().updateRole(data)
  getRoles()
  }
}

const handleChecked = (val: string)=>{
  // console.log(val)
  const index = rolePermissions.value.indexOf(val);
  
  if (index === -1) {
    // If the string is not found, add it to the array
    rolePermissions.value.push(val);
  } else {
    // If the string is found, remove it from the array
    rolePermissions.value.splice(index, 1);
  }
  modified.value = true
}

const sheetCLose = ref(true)

const handleSheet = ()=>{
    sheetCLose.value = !sheetCLose.value
}

const perPage = ref(0);
const currentPage = ref(0);
const totalPages = ref(0)

const paginationItems = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push({ type: 'page', value: i });
  }
  return pages;
});

const handlePageChange = (newPage: number) => {
  if (newPage > 0 && newPage <= totalPages.value) {
    currentPage.value = newPage;
  }
};


onMounted(async()=>{
    getRoles()
    const data = await useConfigStore().getPermissions()
    allPermissions.value = await useConfigStore().allPermissions()
    permissions.value = data
})
</script>

<template>
    <div class="w-full">
        <MainNav class="mx-6" headingText="Role Manager" />
        <div class="px-10 py-5 md:py-10 ml-auto w-full flex justify-end">
            <Sheet :close='sheetCLose'>
              <SheetTrigger as-child>
                <button @click="handleSheet" class="bg-[#020721] px-4 py-2 rounded-xl w-50 h-12">
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
              <SheetContent class="overflow-y-auto py-8">
               <div class="flex py-4 justify-between items-center">
                    <SheetHeader>
                    <h3 class="text-2xl font-medium">Add New Role</h3>
                    
                    </SheetHeader>
                    <SheetDescription class="pt-2 flex items-center gap-4">
                        Active <Switch :checked="true"/>
                    </SheetDescription>
                </div>
                <div>
                  <Form :validation-schema="schema" @submit="onSubmit">
                    <!-- <form class="space-y-4" @submit.prevent="onSubmit"> -->
                        <FormField v-slot="{ componentField }" name="roleName">
                            <FormItem v-auto-animate>
                              <FormLabel class="text-blue-900">Name of Role</FormLabel>
                              <FormControl>
                                <Input
                                  id="text"
                                  type="text"
                                  class="focus-visible:ring-blue-600"
                                  v-bind="componentField"
                                />
                              </FormControl>
            
                              <FormMessage for="roleName" />
                            </FormItem>
                          </FormField>

                          <FormField v-slot="{ componentField }" name="description">
                            <FormItem v-auto-animate>
                              <FormLabel class="text-blue-900">Description</FormLabel>
                              <FormControl>
                                <Input
                                  id="text"
                                  type="text"
                                  class="focus-visible:ring-blue-600"
                                  v-bind="componentField"
                                />
                              </FormControl>
            
                              <FormMessage for="description" />
                            </FormItem>
                          </FormField>
                  
                          <FormField  name="permissions">
                            <FormItem v-auto-animate>
                              <FormLabel class="text-blue-900">Select Module Access</FormLabel>
                              <FormControl>
                                <Table>
                                  <TableHead> Name </TableHead>
                                  <TableHead>Create</TableHead>
                                  <TableHead>Read</TableHead>
                                  <TableHead>Edit</TableHead>
                                  <TableHead>Delete</TableHead>
                                    <TableBody>
                                      <TableRow v-for="(name, key) in permissions" :key="key">
                                        <TableCell>{{ key }}</TableCell>
                                        <TableCell ><span v-for="(item, keys) in permissions[key].permissions" :key="keys"><span v-if="item.tag == 'create'">
                                          <Field name="permissionList" type="checkbox" :value="item.identifier" />
                                        </span></span></TableCell>
                                        <TableCell ><span v-for="(item, keys) in permissions[key].permissions" :key="keys"><span v-if="item.tag == 'read'">
                                          <Field name="permissionList" type="checkbox" :value="item.identifier" />
                                        </span></span></TableCell>
                                        <TableCell ><span v-for="(item, keys) in permissions[key].permissions" :key="keys"><span v-if="item.tag == 'update'">
                                          <Field name="permissionList" type="checkbox" :value="item.identifier" />
                                        </span></span></TableCell>
                                        <TableCell ><span v-for="(item, keys) in permissions[key].permissions" :key="keys"><span v-if="item.tag == 'delete'">
                                          <Field name="permissionList" type="checkbox" :value="item.identifier" />
                                        </span></span></TableCell>
                                      </TableRow>
                                    </TableBody>
                                </Table>
                              </FormControl>
                            </FormItem>
                          </FormField>
                          <ErrorMessage name="permissionList" class="text-red-600 text-sm font-medium"/>
                          
                          <div class="flex justify-end items-center gap-4 mt-5"> 
                              <Button type="submit" class="bg-[#4145A7]">
                                <!-- <Loader2
                                  color="#ffffff"
                                  v-if="loading"
                                  class="w-4 h-4 mr-2 text-black animate-spin"
                                /> -->
                                Save
                
                                <!-- <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" /> -->
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
                    <p>Only show active</p>
                </div>
                <Card Content class="mt-4" v-for="(item, key) in roles" :key="key">
                  <CardContent
                    class="flex items-center justify-between px-2 sm:px-6 py-4"
                  >
                  <div class="flex items-center gap-4">
                      <div
                        class="inline-block bg-[#373B4D] text-[#F8F9FF] rounded-full px-3 py-2 text-sm"
                      >
                      {{item.name[0]}}{{ (item.name)[item.name.length-1].toUpperCase() }}
                      </div>
                      <p class="text-sm text-muted-foreground text-center text-[#000000]">
                        {{ item.name}}
                      </p>
                  </div>
                  <div class="hidden md:inline-block">
                    {{ item.description }}
                  </div>
                    <div class="flex items-center gap-4">
                      <Sheet>
                        <SheetTrigger>
                          <Icon @click="()=>handleRolePermissions(item.permissions, item.name)" icon="mdi:edit" width="17" height="17" class="icons-sidebar border-2 border-gray-100" />
                        </SheetTrigger>
                        <SheetContent class="overflow-y-auto py-8" side="right">
                            <div class="flex py-4 justify-between items-center">
                              <SheetHeader>
                              <h3 class="text-2xl font-medium">{{item.name.toUpperCase()}}</h3>
                              </SheetHeader>
                              
                          </div>
                              <Form :validation-schema="editSchema" @submit="onEdit">
                                <div class="">
                                  <ErrorMessage name="permissionList" class="text-red-600 text-sm font-medium"/>
                                  <FormField v-slot="{ componentField }" name="name">
                                    <FormItem v-auto-animate>
                                      <FormLabel class="text-blue-900">Edit Role Name</FormLabel>
                                      <FormControl>
                                        <Input
                                          id="text"
                                          type="text"
                                          placeholder="Edit role name"
                                          class="focus-visible:ring-blue-600"
                                          v-bind="componentField"
                                        />
                                      </FormControl>
                    
                                      <FormMessage for="roleName" />
                                    </FormItem>
                                  </FormField>
    
                                  <FormField  name="permission">
                                    <FormItem v-auto-animate>
                                      <FormLabel class="text-blue-900 text-left">Edit Module Access</FormLabel>
                                      <FormControl>
                                        <Table>
                                          <TableHead> Name </TableHead>
                                          <TableHead>Create</TableHead>
                                          <TableHead>Read</TableHead>
                                          <TableHead>Edit</TableHead>
                                          <TableHead>Delete</TableHead>
                                            <TableBody>
                                              <TableRow v-for="(name, key) in permissions" :key="key">
                                                <TableCell>{{ key }}</TableCell>
                                                <TableCell ><span v-for="(permit, keys) in permissions[key].permissions" :key="keys"><span v-if="permit.tag == 'create'">
                                                  <Field v-slot="{ field }" name="permissionArr" type="checkbox" :value="permit.identifier" :unchecked-value="!item.permissions.includes(permit.identifier)">
                                                    <input type="checkbox" @click="()=> handleChecked(permit.identifier)" :value="permit.identifier" v-if="item.permissions.includes(permit.identifier)" checked>
                                                    <input type="checkbox" v-bind="field" :value="permit.identifier" v-else>
                                                </Field>
                                                </span></span></TableCell>
                                                <TableCell ><span v-for="(permit, keys) in permissions[key].permissions" :key="keys"><span v-if="permit.tag == 'read'">
                                                  <Field v-slot="{ field }" name="permissionArr" type="checkbox" :value="permit.identifier" :unchecked-value="!item.permissions.includes(permit.identifier)">
                                                    <input type="checkbox" @click="()=> handleChecked(permit.identifier)" :value="permit.identifier" v-if="item.permissions.includes(permit.identifier)" checked>
                                                    <input type="checkbox" v-bind="field" :value="permit.identifier" v-else>
                                                  </Field>
                                                </span></span></TableCell>
                                                <TableCell ><span v-for="(permit, keys) in permissions[key].permissions" :key="keys"><span v-if="permit.tag == 'update'">
                                                  <Field v-slot="{ field }" name="permissionArr" type="checkbox" :value="permit.identifier" :unchecked-value="!item.permissions.includes(permit.identifier)">
                                                    <input type="checkbox" @click="()=> handleChecked(permit.identifier)" :value="permit.identifier" v-if="item.permissions.includes(permit.identifier)" checked>
                                                    <input type="checkbox" v-bind="field" :value="permit.identifier" v-else>
                                                  </Field>
                                                </span></span></TableCell>
                                                <TableCell ><span v-for="(permit, keys) in permissions[key].permissions" :key="keys"><span v-if="permit.tag == 'delete'">
                                                  <Field v-slot="{ field }" name="permissionArr" type="checkbox" :value="permit.identifier" :unchecked-value="!item.permissions.includes(permit.identifier)">
                                                    <input type="checkbox" @click="()=> handleChecked(permit.identifier)" :value="permit.identifier" v-if="item.permissions.includes(permit.identifier)" checked>
                                                    <input type="checkbox" v-bind="field" :value="permit.identifier" v-else>
                                                  </Field>
                                                </span></span></TableCell>
                                              </TableRow>
                                            </TableBody>
                                        </Table>
                                      </FormControl>
                                    </FormItem>
                                  </FormField>
                                  <ErrorMessage name="permissionList" class="text-red-600 text-sm font-medium"/>
                                </div>
                                <Button type="submit" class="bg-[#4145A7] mt-2"> Update Role</Button>
                              </Form>
                        </SheetContent>
                      </Sheet>

                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Icon icon="mdi:delete" width="17" height="17" class="icons-sidebar text-red-600" />
                        </AlertDialogTrigger>
                        <div>
                        <AlertDialogContent>
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
                <div class="flex gap-2 max-w-full flex-wrap justify-end mt-8 mr-4 items-center text-[15px]">
                  <Pagination :total="totalPages" :sibling-count="1" show-edges :default-page="1" @change="handlePageChange">
                    <PaginationList class="flex items-center gap-1">
                      <PaginationFirst @click="handlePageChange(1)" />
                      <PaginationPrev @click="handlePageChange(Math.max(currentPage - 1, 1))" />
                      <template v-for="(item, index) in paginationItems" :key="index">
                        <PaginationListItem v-if="item.type === 'page'" :value="item.value" as-child>
                          <Button class="w-10 h-10 p-0" :variant="item.value === currentPage ? 'default' : 'outline'" @click="handlePageChange(item.value)">
                            {{ item.value }}
                          </Button>
                        </PaginationListItem>
                        <PaginationEllipsis v-else :index="index" />
                      </template>
                      <PaginationNext @click="handlePageChange(Math.min(currentPage + 1, totalPages))" />
                      <PaginationLast @click="handlePageChange(totalPages)" />
                    </PaginationList>
                  </Pagination>
                </div>
              </div>
        </div>
        <DashboardFooter/>
    </div>
</template>