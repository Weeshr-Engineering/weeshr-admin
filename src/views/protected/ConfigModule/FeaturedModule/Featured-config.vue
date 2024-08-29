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
import { ref, onMounted,  computed, watch } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Button } from "@/components/ui/button"
import { z } from 'zod';
import MainNav from '@/components/MainNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import axios from "@/services/ApiService";
import { toast } from '@/components/ui/toast'
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { useFeaturedStore } from '@/stores/config-details/featured'
import { ability, defineAbilities, verifyAbilities } from '@/lib/ability'

defineAbilities()
const create = ability.can('create', 'featured-moments')
const createStyle = computed(()=>{
  return create ? 'bg-[#020721] px-4 py-2 rounded-xl w-50 h-12' : 'cursor-not-allowed opacity-20 bg-[#020721] px-4 py-2 rounded-xl w-50 h-12'
})

const edit = ability.can('update', 'featured-moments')
const editStyle = computed(()=>{
  return edit ? 'border-2 border-gray-100' : 'cursor-not-allowed opacity-20 icons-sidebar border-2 border-gray-100'
})

const deleteWeeshfeature = ability.can('delete', 'featured-moments')
const deleteStyle = computed(()=>{
  return deleteWeeshfeature ? 'text-red-600' : 'cursor-not-allowed opacity-20 icons-sidebar text-red-600'
})

const store = useFeaturedStore()
const loading = ref(false);
const active = computed(()=>{
  return store.active
})

const feature = ref('')
const setfeature = (id: string)=>{
  verifyAbilities('update', 'featured-moments')
  feature.value= id
  // console.log(id)
}

const updateImg = ref<any[]>([])
const updateName = ref('')

const handleFileUpdate = (event: any) => {
  const file = event.target.files[0];
  updateImg.value = file
}

const onUpdate = async() => {  
  toast({
    title: 'Updating',
    description: `Updating Weeshe feature`,
    variant: 'default'
  })
  loading.value = true
  const stringSchema = z.string()      
    .min(2, { message: 'Title must be at least 2 characters long' })
    .max(50, { message: 'Title cannot be longer than 50 characters' })
  
  const name = stringSchema.safeParse(updateName.value)
  if (!name.success && updateImg.value.length == 0) {
        toast({
          title: 'No edit found',
          description: 'You have to make a change first',
          variant: 'destructive'
        })
        return;
  }else{
      const data = {
        // 'name': updateName.value,
        'image': updateImg.value
      }

      try{
        // const response = await axios.put(`/api/v1/admin/featured-moment/${feature.value}`, data);
        // if (response.status === 200 || response.status === 201) {
        //     toast({
        //         description: `${response.data.message}`,
        //         variant: 'success'
        //       })
        //       store.getFeatures(store.page, 'Success')
        //   }
      }catch(error){
        console.log(error)
        store.catchErr(error)
      }
      }
      loading.value = false
}

const formSchema = toTypedSchema(
  z.object({
    title: z
      .string()
      .min(2, { message: 'Title must be at least 2 characters long' })
      .max(50, { message: 'Title cannot be longer than 50 characters' })
      .nonempty('Please enter your Title'),
    link: z
      .string()
      .min(2, { message: 'Link must be at least 2 characters long' })
      .max(50, { message: 'Link cannot be longer than 50 characters' })
      .nonempty('Add the link for the moment'),
    color: z.string(),
    scheduledDate: z.string().nonempty('Please enter your date of birth').optional(),
  })
)

const { handleSubmit: formSubmit } = useForm({
  validationSchema: formSchema
})


const onSubmit = formSubmit(async (values) => {
  loading.value = true
  let data = {}
  const value = {
    'title': values.title,
    'color': values.color,
    'link': values.link,
    'disabled': `${!active.value}`
  }
  if(values.scheduledDate){
    data = {...value, 'scheduledDate': values.scheduledDate}
  }else{
    data = {...value}
  }
  try{
    // console.log(data)
    const response = await axios.post('/api/v1/admin/featured-moment', data);
    if (response.status === 200 || response.status === 201) {
        toast({
            description: `${response.data.message}`,
            variant: 'success'
          })
          store.getFeatures(page.value, 'Success')
      }
  }catch(error){
    console.log(error)
    store.catchErr(error)
  }
  loading.value = false
})



const features = computed(()=>{
  return store.featured
})
const page = computed(()=>{
  return store.page
})
const currentPage = computed(()=>{
  return store.currentPage
});
const totalPages = computed(()=>{
  return store.totalPages
})
const theme  = ref('')
// = computed(()=>{
//   return store.tempColor
// })


const paginationItems = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push({ type: 'page', value: i });
  }
  return pages;
});


onMounted(async()=>{
  store.getColors()
  store.getFeatures(page.value, 'Data fetched')
})

watch(theme, (newTheme)=>{
  console.log('chancged to '+newTheme)
})
</script>

<template>
    <div class="w-full">
        <MainNav class="mx-6" headingText="Featured Moment" />
        <div class="px-10 py-10 ml-auto w-full flex justify-end">
            <Sheet>
              <SheetTrigger as-child @click="verifyAbilities('create', 'featured-moments')">
                <button :class="createStyle">
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
                <form class="space-y-4" @submit.prevent="onSubmit">
                <div class="flex py-4 justify-between items-center">
                <SheetHeader>
                    <h3 class="text-2xl font-medium">New Featured Moment</h3>
                    </SheetHeader>
                    <SheetDescription class="flex items-center gap-4">
                      {{ store.active === true ? 'Enabled' : 'Disabled' }} <Switch @click="store.handleActive()" :checked="store.active"/>
                    </SheetDescription>
                </div>
                
                  <div class="grid w-full max-w-sm items-center gap-1.5">
                    <FormField v-slot="{ componentField }" name="title">
                      <FormItem v-auto-animate>
                        <FormLabel class="text-blue-900">Feature Title</FormLabel>
                        <FormControl>
                            <Input id="name" v-bind="componentField" type="text" placeholder="Title" />
                        </FormControl>
                        <FormMessage for="name" />
                      </FormItem>
                    </FormField>
                  </div>
                  <div class="grid w-full max-w-sm items-center gap-1.5">
                    <FormField v-slot="{ componentField }" name="link">
                      <FormItem v-auto-animate>
                        <FormLabel class="text-blue-900">Link</FormLabel>
                        <FormControl>
                            <Input id="name" v-bind="componentField" type="text" placeholder="Https://...." />
                        </FormControl>
                        <FormMessage for="name" />
                      </FormItem>
                    </FormField>
                  </div>
                  <FormField v-slot="{ componentField }" name="color">
                    <FormItem>
                      <FormLabel class="text-blue-900">Select Theme color</FormLabel>
                      
                        <Select
                        v-model="theme"
                        v-bind="componentField"
                        id="isCash"
                        class='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                        <FormControl>
                          <SelectTrigger :style="{'background-color': theme}">
                              <SelectValue placeholder="Theme colors" :onChange="()=>console.log('changed')"/>
                            </SelectTrigger>
                        </FormControl>
                          <SelectContent>
                            <SelectItem v-for="(theme, key) in store.colors" :key="key" :value="theme.hexacode" :onclick="()=>console.log('clicked')"
                            :style="{'background-color': theme.hexacode}"
                            > {{theme.name}} - {{theme.hexacode}} </SelectItem>
                          </SelectContent>
                        </Select>
                      
                      <FormMessage for="isCash" />
                    </FormItem>
                  </FormField>

                  <div>
                    <FormField v-slot="{ componentField }" name="scheduledDate">
                      <FormItem v-auto-animate>
                        <FormLabel class="text-blue-900">Schedule Feature Date (optional)</FormLabel>
                        <FormControl>
                          <Input
                            id="dob"
                            type="date"
                            placeholder="Date of Birth"
                            class="focus-visible:ring-blue-600"
                            v-bind="componentField"
                          />
                        </FormControl>
  
                        <FormMessage for="dob" />
                      </FormItem>
                    </FormField>
                  </div>

                  <Button type="submit" class="bg-[#4145A7] mt-2">
                    <Loader2
                      color="#ffffff"
                      v-if="loading"
                      class="w-4 h-4 mr-2 text-white animate-spin"
                    />
                    Submit
    
                    <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-white animate-spin" />
                  </Button>
                </form>
              </SheetContent>
            </Sheet>
        </div>
        <div class="w-full flex justify-center">
            <div class="w-3/4">
                <div class="flex justify-end w-full text-sm text-[#6A70FF]" disabled>
                    <!-- <p>Only show active</p> -->
                </div>
                <div class="w-full min-h-72">
                <span v-for="(feature, key) in features" :key="key">
                  <Card Content class="mt-4" :style="{'background-color': feature.color}">
                      <CardContent
                        class="flex flex-col gap-4 md:grid grid-cols-8 px-2 sm:px-4 py-4"
                      >
                        <span class="flex flex-col gap-2 col-span-7 md:grid grid-cols-4 md:gap-4 w-full">
                            <div
                            class="col-span-2 text-[#000000] md:h-14 flex flex-col"
                            >
                              <p class='text-muted-foreground'>Title</p>
                              <p>{{feature.title}}</p>
                          </div>
                        <div class='flex items-center justify-between gap-2 w-full col-span-2 md:grid grid-cols-2'>
                          <div class="col-span-1 text-sm text-[#000000]">
                            <p class='text-muted-foreground'>Theme</p>
                            <p>{{feature.color}}</p>
                          </div>
                          <div class="col-span-1 flex flex-col text-muted-foreground items-center justify-center w-full">
                            {{ feature.disabled === false ? 'Active' : 'Disabled' }} 
                            <Switch :checked="!feature.disabled"/>
                          </div>
                        </div>
                      </span>
                      <div class="col-span-1 flex items-center justify-between gap-4 w-full">
                        <!-- <Switch :checked="!feature.disabled" @click="store.handleSwitch(feature._id, feature.title, feature.disabled)" :disabled="!edit"/> -->
                        <Sheet>
                            <SheetTrigger>
                                <Icon @click="setfeature(feature._id)" icon="mdi:edit" width="17" height="17" :class="editStyle" />
                            </SheetTrigger>
                            <SheetContent class="overflow-y-auto py-8" side="right" v-if="ability.can('update', 'featured-moments')">
                                <div class="flex py-4 justify-between items-center">
                                  <SheetHeader>
                                  <h3 class="text-2xl font-medium">EDIT {{feature.title.toUpperCase()}}</h3>
                                  </SheetHeader>
                                </div>
                                <form class="space-y-4" @submit.prevent="onUpdate">
                                  <div class="grid w-full max-w-sm items-center gap-1.5">
                                    <FormField name="updateName">
                                      <FormItem v-auto-animate>
                                        <FormLabel class="text-blue-900">Edit Title</FormLabel>
                                        <FormControl>
                                            <Input id="updateName" v-model="updateName" type="text" :placeholder="feature.title" />
                                        </FormControl>
                                        <FormMessage for="updateName" />
                                      </FormItem>
                                    </FormField>
                                  </div>
                                  <Button type="submit" class="bg-[#4145A7] mt-2">
                      
                                    <Loader2
                                      color="#ffffff"
                                      v-if="loading"
                                      class="w-4 h-4 mr-2 text-white animate-spin"
                                    />
                                    Submit
                    
                                    <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-white animate-spin" />
                                  </Button>
                                </form>
                            </SheetContent>
                          </Sheet>

                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Icon icon="mdi:delete" width="17" height="17" :class="deleteStyle" @click="verifyAbilities('delete', 'featured-moments')"/>
                          </AlertDialogTrigger>
                          <div>
                          <AlertDialogContent v-if="deleteWeeshfeature">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure you want to delete {{feature.title}}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this role
                                and remove it from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction :onclick="()=>store.deleteFeature(feature._id)">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                          </div>
                        </AlertDialog>
                      </div>
                      </CardContent>
                    </Card>
                </span>
                  <div class="flex gap-2 max-w-full flex-wrap justify-end mt-8 mr-4 items-center text-[15px]" v-if="features.length !== 0">
                    <Pagination :total="totalPages" :sibling-count="1" show-edges :default-page="1" @change="store.handlePageChange">
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
                    </Pagination>
                  </div>

                </div>
              </div>
        </div>
        <DashboardFooter/>
    </div>
</template>