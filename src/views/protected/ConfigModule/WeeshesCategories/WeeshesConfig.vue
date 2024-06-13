<script setup lang="ts">
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet'
import { ref, onMounted,  computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Button } from "@/components/ui/button"
// import * as z from 'zod'
import { z } from 'zod';
import MainNav from '@/components/MainNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
// import { useConfigStore } from '@/stores/config-details/config-detail'
import axios from "axios";
import { toast } from '@/components/ui/toast'
import router from '@/router'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Icon } from '@iconify/vue'
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

const MAX_FILE_SIZE = 1024 * 1024 * 5;

const currentCategory = ref('')
const setCurrentCategory = (id: string)=>{
  currentCategory.value= id
  console.log(id)
}

const updateImg = ref<any[]>([])
const updateName = ref('')

const handleFileUpdate = (event: any) => {
  const file = event.target.files[0];
  updateImg.value = file
}

const onUpdate = () => {  
  const stringSchema = z.string()      
    .min(2, { message: 'First name must be at least 2 characters long' })
    .max(50, { message: 'First name cannot be longer than 50 characters' })
  
  const name = stringSchema.safeParse(updateName.value)
  console.log(updateImg.value)
  if (!name.success && updateImg.value.length == 0) {
        toast({
          title: 'No edit found',
          description: 'You have to make a change first',
          variant: 'destructive'
        })
        return;
  }else{
      const data = {
        'image': updateImg.value,
        'name': updateName.value
      }
      // console.log(updateName.value)
      console.log(data)
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://api.staging.weeshr.com/api/v1/admin/weesh/category/${currentCategory.value}`,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        data : data
      };

      axios.request(config)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
      }
}

const formSchema = toTypedSchema(
  z.object({
    name: z
      .string()
      .min(2, { message: 'First name must be at least 2 characters long' })
      .max(50, { message: 'First name cannot be longer than 50 characters' })
      .nonempty('Please enter your first name'),
    image: z
      .any()
      .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`), 
    isCash: z.string()
  })
)

const { handleSubmit: formSubmit } = useForm({
  validationSchema: formSchema
})

const img = ref<any[]>([])

const handleFileChange = (event: any) => {
  const file = event.target.files[0];
  img.value = file
}

const onSubmit = formSubmit(async (values) => {
  const data = {
    'image': img.value,
    'name': values.name,
    'isCash': values.isCash,
    'disabled': 'false'
  }
let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://api.staging.weeshr.com/api/v1/admin/weesh/category',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(response.data);
})
.catch((error) => {
  console.log(error);
});
})

const sheetCLose = ref(true)
const token = sessionStorage.getItem('token') || ''
const handleSheet = ()=>{
    sheetCLose.value = !sheetCLose.value
}

const categories = ref<any[]>([])

const handleSwitch = (value: string, category: string, status: boolean)=>{
  toast({
      title: `${!status ? `Disabling ${category}...` : `Activating ${category}...`}`,
      description: `${status ? `Disabling ${category} in progress...` : `Activating ${category} in progress...`}`,
      duration: 0 // Set duration to 0 to make it indefinite until manually closed
    })
  const data = JSON.stringify({
    "disabled": !status
  });
  const token = sessionStorage.getItem('token') || ''
  const config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `https://api.staging.weeshr.com/api/v1/admin/weesh/category/${value}/status`,
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`
    },
    data : data
  };

  axios.request(config)
  .then((response) => {
    // Check if response status is 200 or 201
    if (response.status === 200 || response.status === 201) {
      // Show success toast
      // this.adminStatus = !this.adminStatus
      getWeesheCategories() 
      console.log(response)
      toast({
          title: 'Success',
          description: `${!status ? `${category} Disabled` : `${category} Activated`}`,
          variant: 'success'
        })
    }
  })
  .catch((error) => {
    console.log(error);
  });
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

const getWeesheCategories = ()=>{
          toast({
            title: 'Loading Data',
            description: 'Fetching data...',
            duration: 0 // Set duration to 0 to make it indefinite until manually closed
          })
          const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://api.staging.weeshr.com/api/v1/admin/weesh/categories?per_page=5&page=1&search=cash',
            headers: { 
              'Authorization': `Bearer ${token}`
            }
          };
          
          axios.request(config)
          .then((response) => {
            console.log(response.data.data);
            perPage.value= response.data.data.perPage
            currentPage.value = response.data.data.currentPage
            totalPages.value = response.data.data.totalPages
            categories.value= response.data.data.data
            toast({
              title: 'Success',
              description: `Successful: data retrieved`,
              variant: 'success'
            })
            return response.data.data
          })
          .catch((error) => {
            console.log(error)
            if (error.response.status === 401) {
              sessionStorage.removeItem('token')

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
          });          
}

const deleteWeeshCategory = (id: string)=>{
toast({
    title: 'Deleting Data',
    description: 'Deleting data...',
    duration: 0 // Set duration to 0 to make it indefinite until manually closed
  })

  
  const config = {
    method: 'delete',
    url: `https://api.staging.weeshr.com/api/v1/admin/role/${id}`,
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`
    }
  };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
    toast({
      title: 'Success',
      description: `Successful: data deleted`,
      variant: 'success'
    })
  })
  .catch((error) => {
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
  });
}

onMounted(async()=>{
    getWeesheCategories()
})
</script>

<template>
    <div class="w-full">
        <MainNav class="mx-6" headingText="Weesh Categories" />
        <div class="px-10 py-10 ml-auto w-full flex justify-end">
            <Sheet>
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
                <form class="space-y-4" @submit.prevent="onSubmit">
                <div class="flex py-4 justify-between items-center">
                <SheetHeader>
                    <h3 class="text-2xl font-medium">Add New Weeshes Categories</h3>
                    
                    </SheetHeader>
                    <SheetDescription class="flex items-center gap-4">
                      <!-- <FormField v-slot="{ componentField }" name="isCash">
                        <FormItem v-auto-animate>
                          <FormControl> -->
                            Active <Switch/>
                          <!-- </FormControl>
                          <FormMessage for="isCash" />
                        </FormItem>
                      </FormField> -->
                    </SheetDescription>
                </div>
                
                  <div class="grid w-full max-w-sm items-center gap-1.5">
                    <FormField v-slot="{ componentField }" name="name">
                      <FormItem v-auto-animate>
                        <FormLabel class="text-blue-900">Category Name</FormLabel>
                        <FormControl>
                            <Input id="name" v-bind="componentField" type="text" placeholder="Category Name" />
                        </FormControl>
                        <FormMessage for="name" />
                      </FormItem>
                    </FormField>
                  </div>
                   
                  <div class="grid w-full max-w-sm items-center gap-1.5">
                    <FormField v-slot="{ componentField }" name="image">
                      <FormItem v-auto-animate>
                        <FormLabel class="text-blue-900">Category Image</FormLabel>
                        <FormControl>
                          <!-- <Label for="picture">Upload Category Image</Label> -->
                           <input id="picture" type="file"  @change="handleFileChange" v-bind="componentField"  class="w-full h-48 border-[1px] border-gray-200 rounded-sm flex justify-center items-center" accept="image/*"/>
                          <!-- <Input id="picture" type="file"  @change="handleFileChange" v-bind="componentField"  class="w-full h-48" accept="image/*"/> -->
                        </FormControl>
                        <FormMessage for="image" />
                      </FormItem>
                    </FormField>
                  </div>
                  <FormField v-slot="{ componentField }" name="isCash">
                        <FormItem v-auto-animate>
                        <FormControl>
                          <Label for="type">Category Type</Label>
                          <ToggleGroup type="single" id="type" v-bind="componentField" class="w-full justify-evenly items-center" variant="outline">
                            <ToggleGroupItem value="true">
                              Cash
                            </ToggleGroupItem>
                            <ToggleGroupItem value="false">
                              Other
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </FormControl>
                        <FormMessage for="isCash" />
                    </FormItem>
                      </FormField>
                  <Button type="submit" class="bg-[#4145A7] mt-2">
                    
                    <!-- <Loader2
                      color="#ffffff"
                      v-if="loading"
                      class="w-4 h-4 mr-2 text-black animate-spin"
                    /> -->
                    Submit
    
                    <!-- <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" /> -->
                  </Button>
                </form>
              </SheetContent>
            </Sheet>
        </div>
        <div class="w-full flex justify-center">
            <div class="w-3/4">
                <div class="flex justify-end w-full text-sm text-[#6A70FF]">
                    <p>Only show active</p>
                </div>
                <div class="w-full min-h-72">
                  <Card Content class="mt-4" v-for="(category, key) in categories" :key="key">
                    <CardContent
                      class="flex items-center justify-between px-2 sm:px-4 py-4"
                    >
                      <span class="flex gap-2 items-center"><div
                        class="inline-block text-[#F8F9FF] w-14 h-14"
                      >
                        <img :src='category.image.secure_url' class="wfull h-full rounded-sm"/>
                      </div>
                      <p class="text-sm text-muted-foreground text-center text-[#000000]">
                        {{category.name}}
                      </p>
                    </span>
                    <div class="flex items-center gap-4">
                      <Switch :checked="!category.disabled" @click="handleSwitch(category._id, category.name, category.disabled)"/>
                      
                      <Sheet>
                          <SheetTrigger>
                              <Icon @click="setCurrentCategory(category._id)" icon="mdi:edit" width="17" height="17" class="icons-sidebar border-2 border-gray-100" />
                          </SheetTrigger>
                          <SheetContent class="overflow-y-auto py-8" side="right">
                              <div class="flex py-4 justify-between items-center">
                                <SheetHeader>
                                <h3 class="text-2xl font-medium">EDIT {{category.name.toUpperCase()}} CATEGORY</h3>
                                </SheetHeader>
                              </div>
                              <form class="space-y-4" @submit.prevent="onUpdate">
                                <div class="grid w-full max-w-sm items-center gap-1.5">
                                  <FormField name="updateName">
                                    <FormItem v-auto-animate>
                                      <FormLabel class="text-blue-900">Edit Category Name</FormLabel>
                                      <FormControl>
                                          <Input id="updateName" v-model="updateName" type="text" :placeholder="category.name" />
                                      </FormControl>
                                      <FormMessage for="updateName" />
                                    </FormItem>
                                  </FormField>
                                </div>
                                <div class="flex justify-center items-center w-full h-48">
                                  <img :src='category.image.secure_url' class="h-36 w-36 rounded-sm"/>
                                </div>
                                <div class="grid w-full max-w-sm items-center gap-1.5">
                                  <FormField v-slot="{ componentField }" name="updateImage">
                                    <FormItem v-auto-animate>
                                      <FormLabel class="text-blue-900">Change Image</FormLabel>
                                      <FormControl>
                                        <input id="updatePicture" type="file"  @change="handleFileUpdate" v-bind="componentField" accept="image/*" class='border-[1px] border-gray-200 rounded-sm'/>
                                        <!-- <Input id="updatePicture" type="file"  @change="handleFileUpdate" v-bind="componentField" accept="image/*"/> -->
                                      </FormControl>
                                      <FormMessage for="updateImage" />
                                    </FormItem>
                                  </FormField>
                                </div>
                                <Button type="submit" class="bg-[#4145A7] mt-2">
                    
                                  <!-- <Loader2
                                    color="#ffffff"
                                    v-if="loading"
                                    class="w-4 h-4 mr-2 text-black animate-spin"
                                  /> -->
                                  Submit
                  
                                  <!-- <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" /> -->
                                </Button>
                              </form>
                          </SheetContent>
                        </Sheet>

                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Icon icon="mdi:delete" width="17" height="17" class="icons-sidebar text-red-600" />
                        </AlertDialogTrigger>
                        <div>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure you want to delete {{category.name}}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this role
                              and remove it from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction :onclick="()=>deleteWeeshCategory(category._id)">Continue</AlertDialogAction>
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
        </div>
        <DashboardFooter/>
    </div>
</template>