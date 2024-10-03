<script setup lang="ts">
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet'
import { ref, onMounted,  computed} from 'vue'
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import DateRanged from './Date-range.vue'
import { useFeaturedStore } from '@/stores/config-details/featured'
import { ability, defineAbilities, verifyAbilities } from '@/lib/ability'

defineAbilities()
const create = ability.can('create', 'featured-moments')
const createStyle = computed(()=>{
  return create ? 'bg-[#020721] px-4 py-2 rounded-full w-50 h-12' : 'cursor-not-allowed opacity-20 bg-[#020721] px-4 py-2 rounded-full w-50 h-12'
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
const sheetState = ref(false)
const updateSheetState = ref(false)
const loading = ref(false);
const MAX_FILE_SIZE = 1024 * 1024 * 2;
const active = computed(()=>{
  return store.active
})

const updateImg = ref<any[]>([])
const imageError = ref('')

const handleFileUpdate = (event: any) => {
  imageError.value = ''
  const file = event.target.files[0];
  const imageSchema = z.any().refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 2MB.`);
  const img = imageSchema.safeParse(file)
  if (!img.success) {
      toast({
        description: 'Max image size is 2MB',
        variant: 'destructive'
      })
      imageError.value = 'Max image size is 2MB'
        return;
  }


  updateImg.value = file
}

interface Updates {
  updateColor: string,
  updateLink: string, 
  updateTitle: string
  updateHeader: string,
  updateLinkTitle: string,
  updateDisabled: boolean
}
const updates = ref<Updates>({
  updateColor: '',
  updateLink: '', 
  updateTitle: '',
  updateHeader: '',
  updateLinkTitle: '',
  updateDisabled: false
})

interface Feature {
color: string,
disabled: boolean,
header: string,
image: string,
link: string,
linkTitle: string,
scheduledDateFrom: string,
scheduledDateTo: string,
title: string,
_id: string
}
const feature = ref<Feature>({
  color: "string",
  disabled: false,
  header: "Connect with friends!",
  image: "https://res.cloudinary.com/drykej1am/image/upload/v1726165334/featured_content/zwbJH-o9AMftdj-_MeH8yS9V.jpg",
  link: "https://www.weeshr.com",
  linkTitle: "Connect",
  scheduledDateFrom: '',
  scheduledDateTo: '',
  title: "Weeshr explore connects you with new friends",
  _id: ''
})

const setfeature = async (id: Feature)=>{
  console.log(id)
  feature.value= id
}

const toggle = async(feature: Feature)=>{
  
  const data = {
    title: feature.title,
    header: feature.header,
    color: feature.color,
    link: feature.link,
    linkTitle: feature.linkTitle,
    disabled: !feature.disabled
  }
  submit(data, feature._id)
}

const updateSchedule = ref({
  start: '',
  end: ''
})
const updateLog = (val: Schedule)=>{
  if(val.start && val.end){
    const start = `${val.start.day.toString().padStart(2, '0')}/${val.start.month.toString().padStart(2, '0')}/${val.start.year.toString()}`
    updateSchedule.value.start = start

    const end = `${val.end.day.toString().padStart(2, '0')}/${val.end.month.toString().padStart(2, '0')}/${val.end.year.toString()}`
    updateSchedule.value.end = end
  }
}
function modDate(dateString: string): string {
  const [day, month, year] = dateString.split('/');
  
  // Ensure month and day are two digits
  const formattedMonth = month.padStart(2, '0');
  const formattedDay = day.padStart(2, '0');
  
  return `${year}-${formattedMonth}-${formattedDay}`;
}

const onUpdate = async(state: boolean) => {
  toast({
    description: `Updating featured moment`,
    variant: 'loading'
  })
  interface UpdateData {
    color: string,
    disabled: boolean,
    header: string,
    image?: any[],
    link: string,
    linkTitle: string,
    scheduledDateFrom?: string,
    scheduledDateTo?: string,
    title: string,
  }
  let data: UpdateData = {
    title: '',
    header: '',
    color: '',
    link: '',
    linkTitle: '',
    disabled: feature.value.disabled
  }
if(updates.value.updateTitle || updates.value.updateHeader || updates.value.updateColor || updates.value.updateLink || updates.value.updateLinkTitle || updateImg.value.length !== 0 || updateSchedule.value.start !== '' || updateSchedule.value.end !== ''){
    if (updates.value.updateTitle !== ''){
            data.title= updates.value.updateTitle
    }else{
        data.title= feature.value.title
    }
    if (updates.value.updateHeader !== ''){
            data.header= updates.value.updateHeader
    }else{
        data.header= feature.value.header
    }
    if (updates.value.updateColor !== ''){
            data.color= updates.value.updateColor
    }else{
        data.color= feature.value.color
    }
    if (updates.value.updateLink !== ''){
            data.link= updates.value.updateLink
    }else{
        data.link= feature.value.link
    }
    if (updates.value.updateLinkTitle !== ''){
            data.linkTitle= updates.value.updateLinkTitle
    }else{
        data.linkTitle= feature.value.linkTitle
    }
    if(updateImg.value.length !== 0 || updateSchedule.value.start !== '' || updateSchedule.value.end !== ''){
      if(updateImg.value.length !== 0){
          if(imageError.value !== ''){
            toast({
            description: imageError.value,
            variant: 'destructive'
          })
          return;
        }
        data = {
          ...data,
          image: updateImg.value
        }
      }
      if(updateSchedule.value.start !== '' && updateSchedule.value.end !== ''){
        data = {
          ...data,
          scheduledDateFrom: modDate(updateSchedule.value.start),
          scheduledDateTo: modDate(updateSchedule.value.end)
        }
      }
    }
    console.log(data)
    submit(data, feature.value._id)
  }else{
      toast({
          description: 'All input fields are empty',
          variant: 'destructive'
      }) 
  }
}

// handles submit for updating features
const submit = async (data: any, id: string)=>{
  try{
        const response = await axios.put(`/api/v1/admin/featured-moment/${id}`, data);
        if (response.status === 200 || response.status === 201) {
            toast({
                description: `${response.data.message}`,
                variant: 'success'
              })
              store.getFeatures(store.page, 'Success')
          }
        loading.value = false
        updateSheetState.value = false;

          return;
      }catch(error){
        console.log(error)
        store.catchErr(error)
      }
}


const formSchema = toTypedSchema(
  z.object({
    intro: z
      .string()
      .min(2, { message: 'Title must be at least 2 characters long' })
      .max(100, { message: 'Title cannot be longer than 100 characters' })
      .nonempty('Please enter your Title'),
    header: z
      .string()
      .min(2, { message: 'Title must be at least 2 characters long' })
      .max(50, { message: 'Title cannot be longer than 50 characters' })
      .nonempty('Please enter your Header'),
    title: z
      .string()
      .min(2, { message: 'Title must be at least 2 characters long' })
      .max(100, { message: 'Title cannot be longer than 50 characters' })
      .nonempty('Please select a call to action'),
    link: z
      .string()
      .min(2, { message: 'Link must be at least 2 characters long' })
      .max(50, { message: 'Link cannot be longer than 50 characters' })
      .nonempty('Add the link for the moment'),
    color: z.string().nonempty('Please select a color theme'),
    image: z
      .any()
      .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 2MB.`),
    // scheduledDate: z.string().nonempty('Please enter your date of birth').optional(),
  })
)
const img = ref<File | any>(null)
const schedule = ref({
  start: '',
  end: ''
})
const handleFileChange = (event: any) => {
  const file = event.target.files[0];
  img.value = file
}

const { handleSubmit: formSubmit } = useForm({
  validationSchema: formSchema
})

// submit funtion to create a new featured moment
const onSubmit = formSubmit(async (values) => {
  toast({
      description: `Loading...`,
      variant: 'loading'
    })
  let data = {}
  const value = {
    'image': img?.value,
    'header': values.header,
    'title': values.intro,
    'color': values.color,
    'linkTitle': values.title,
    'link': values.link,
    'disabled': `${!active.value}`
  }
  if (schedule.value.start !== '' && schedule.value.end !== ''){
    data = {
      ...value,
      'scheduledDateFrom': modDate(schedule.value.start),
      'scheduledDateTo': modDate(schedule.value.end)
    }
    console.log(data)
  }else {
    data = {
      ...value
    }
    console.log(data)
  }
  try{
    const response = await axios.post('/api/v1/admin/featured-moment', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status === 200 || response.status === 201) {
        sheetState.value = false;
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
})


// computed variables for values in the store
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

interface Period {
  day: number,
  month: number,
  year: number
}

interface Schedule {
  start: Period,
  end: Period
}
const log = (val: Schedule)=>{
  if(val.start && val.end){
    const start = `${val.start.day.toString().padStart(2, '0')}/${val.start.month.toString().padStart(2, '0')}/${val.start.year.toString()}`
    schedule.value.start = start

    const end = `${val.end.day.toString().padStart(2, '0')}/${val.end.month.toString().padStart(2, '0')}/${val.end.year.toString()}`
    schedule.value.end = end
  }
}


const paginationItems = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push({ type: 'page', value: i });
  }
  return pages;
});

const linkTitles = [
  'Connect', 'Preview', 'Explore'
]

onMounted(async()=>{
  store.getColors()
  store.getFeatures(page.value, 'Data fetched')
})

</script>

<template>
    <div class="w-full">
        <MainNav class="mx-6" headingText="Featured Content" />
        <div class="px-10 py-10 ml-auto w-full flex justify-end">
            <Sheet v-model:open='sheetState'>
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
                    <h3 class="text-2xl font-medium">Add Featured</h3>
                    </SheetHeader>
                    <SheetDescription class="flex items-center gap-4">
                      {{ store.active === true ? 'Active' : 'Disabled' }} <Switch @click="store.handleActive()" :checked="store.active"/>
                    </SheetDescription>
                </div>

                  <div class="grid w-full max-w-sm items-center gap-1.5">
                    <FormField v-slot="{ componentField }" name="image">
                      <FormItem v-auto-animate>
                        <FormLabel class="text-blue-900">Upload feature image</FormLabel>
                        <FormControl>
                          <input id="picture" type="file"  @change="handleFileChange" v-bind="componentField"  class="w-full h-24 appearance-none border-[1px] border-gray-200 rounded-sm flex justify-center items-center" accept="image/*"/>
                        </FormControl>
                        <FormMessage for="image" />
                      </FormItem>
                    </FormField>
                  </div>
                  
                  <div class="grid w-full max-w-sm items-center gap-1.5">
                    <FormField v-slot="{ componentField }" name="intro">
                      <FormItem v-auto-animate>
                        <FormLabel class="text-blue-900">Intro title</FormLabel>
                        <FormControl>
                            <Input id="name" v-bind="componentField" type="text" placeholder="Title" />
                        </FormControl>
                        <FormMessage for="intro" />
                      </FormItem>
                    </FormField>
                  </div>
                  <div class="grid w-full max-w-sm items-center gap-1.5">
                    <FormField v-slot="{ componentField }" name="header">
                      <FormItem v-auto-animate>
                        <FormLabel class="text-blue-900">Header</FormLabel>
                        <FormControl>
                            <Input id="name" v-bind="componentField" type="text" placeholder="" />
                        </FormControl>
                        <FormMessage for="header" />
                      </FormItem>
                    </FormField>
                  </div>
                  <FormField v-slot="{ componentField }" name="title">
                    <FormItem>
                      <FormLabel class="text-blue-900">Link title</FormLabel>
                      
                        <Select
                        v-model="theme"
                        v-bind="componentField"
                        id="color"
                        class='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                        <FormControl>
                          <SelectTrigger>
                              <SelectValue placeholder="Select Link Title"/>
                            </SelectTrigger>
                        </FormControl>
                          <SelectContent>
                            <SelectItem v-for="(item, key) in linkTitles" :key="key" :value="item"
                            > {{ item }} </SelectItem>
                          </SelectContent>
                        </Select>
                      
                      <FormMessage for="title" />
                    </FormItem>
                  </FormField>

                  <div class="grid w-full max-w-sm items-center gap-1.5">
                    <FormField v-slot="{ componentField }" name="link">
                      <FormItem v-auto-animate>
                        <FormLabel class="text-blue-900">Link</FormLabel>
                        <FormControl>
                            <Input id="name" v-bind="componentField" type="text" placeholder="Https://...." />
                        </FormControl>
                        <FormMessage for="link" />
                      </FormItem>
                    </FormField>
                  </div>

                  <FormField v-slot="{ componentField }" name="color">
                    <FormItem>
                      <FormLabel class="text-blue-900">Select Theme color</FormLabel>
                      
                      <ToggleGroup type="single" v-bind="componentField">
                        <ToggleGroupItem aria-label="Toggle bold" v-for="(theme, key) in store.colors" :key="key" :value="theme.hexacode">
                          <div class='w-6 h-6 rounded-md' :style="{'background-color': theme.hexacode}"></div>
                        </ToggleGroupItem>
                      </ToggleGroup>
                      
                      <FormMessage for="color" />
                    </FormItem>
                  </FormField>

                  <div>
                    <FormField name="scheduledDate">
                      <FormItem v-auto-animate>
                        <FormLabel class="text-blue-900">Schedule (optional)</FormLabel>
                        <FormControl>
                          <DateRanged @updateValue="log"/>
                        </FormControl>
  
                        <FormMessage for="dob" />
                      </FormItem>
                    </FormField>
                  </div>

                  <div class='flex gap-4 items-center justify-end'>
                    <SheetClose>
                        <Button type='button' class="bg-gray-300 mt-2">
                          Close
                        </Button>
                    </SheetClose>
                    <Button type="submit" class="bg-[#4145A7] mt-2">
                      Submit
                    </Button>  
                  </div>
                </form>
              </SheetContent>
            </Sheet>
        </div>
        <div class="w-full flex justify-center">
            <div class="w-3/4">
                <div class="flex justify-end w-full text-xs text-[#6A70FF]" disabled>
                    <!-- <p>Only show active</p> -->
                </div>
                <div class="w-full min-h-72">
                <span v-for="(feature, key) in features" :key="key">
                  <div class="grid grid-cols-12 px-2 sm:px-4 py-4 md:pb-4 items-center mt-4 min-h-fit justify-center relative" :style="{'background-color': feature.color}" @click="setfeature(feature)">
                      <!-- <CardContent
                        class="grid grid-cols-12 px-2 sm:px-4 py-4 md:pb-4 items-center"
                      > -->
                        <span class="gap-2 col-span-11 md:col-span-10 grid grid-cols-6 md:gap-4 w-full min-h-fit">
                          <div
                            class="col-span-5 lg:col-span-4 text-[#000000] md:h-14 flex flex-col pb-4"
                            >
                              <p class='text-muted-foreground'>Title</p>
                              <p>{{feature.title}}</p>
                          </div>
                          <div class='flex items-center justify-between gap-2 w-full col-span-1 lg:col-span-2 md:grid grid-cols-2'>
                            <div class="col-span-1 hidden lg:inline-block text-sm text-[#000000]">
                              <p class='text-muted-foreground'>Theme</p>
                              <p>{{feature.color}}</p>
                            </div>
                            <div class="hidden col-span-1 md:flex flex-col text-muted-foreground items-center justify-end md:justify-center w-full">
                              {{ feature.disabled === false ? 'Active' : 'Disabled' }} 
                              <Switch :checked="!feature.disabled" @click='()=> toggle(feature)'/>
                            </div>
                          </div>
                      </span>
                      <div class="col-span-2 lg:col-span-2 hidden md:grid grid-cols-2 items-center justify-end gap-2 w-full pr-2">
                        <!-- <Switch :checked="!feature.disabled" @click="store.handleSwitch(feature._id, feature.title, feature.disabled)" :disabled="!edit"/> -->
                        <Sheet v-model:open='updateSheetState'>
                            <SheetTrigger as-child>
                                <Icon icon="mdi:edit" width="17" height="17" :class="editStyle" class='hidden md:inline-block col-span-1'/>
                            </SheetTrigger>
                            <SheetContent class="overflow-y-auto py-8" side="right" v-if="ability.can('update', 'featured-moments')">
                                <div class="flex py-4 justify-between items-center">
                                  <SheetHeader>
                                  <h3 class="text-2xl font-medium">EDIT {{feature.title.toUpperCase()}}</h3>
                                  </SheetHeader>
                                </div>
                                <form class="space-y-4" @submit.prevent="()=>onUpdate(false)">
                                  <div class="grid w-full max-w-sm items-center gap-1.5">
                                    <FormField v-slot="{ componentField }" name="updateImage">
                                      <FormItem v-auto-animate>
                                        <FormLabel class="text-blue-900">Change/Add Image (optional)</FormLabel>
                                        <FormControl>
                                          <input id="updatePicture" type="file"  @change="handleFileUpdate" v-bind="componentField" accept="image/*" class='border-[1px] border-gray-200 rounded-sm'/>
                                        </FormControl>
                                        <FormMessage for="updateImage" />
                                      </FormItem>
                                    </FormField>
                                    <p class='text-red-600 mb-2'>{{imageError}}</p>
                                  </div>
                                  <div class="grid w-full max-w-sm items-center gap-1.5">
                                    <FormField name="updateTitle">
                                      <FormItem v-auto-animate>
                                        <FormLabel class="text-blue-900">Edit Title</FormLabel>
                                        <FormControl>
                                            <Input id="updateTitle" v-model="updates.updateTitle" type="text" :placeholder="feature.title" />
                                        </FormControl>
                                        <FormMessage for="updateTitle" />
                                      </FormItem>
                                    </FormField>
                                  </div>
                                  <div class="grid w-full max-w-sm items-center gap-1.5">
                                    <FormField name="updateLink">
                                      <FormItem v-auto-animate>
                                        <FormLabel class="text-blue-900">Edit Link</FormLabel>
                                        <FormControl>
                                            <Input id="updateLink" v-model="updates.updateLink" type="text" :placeholder="feature.link" />
                                        </FormControl>
                                        <FormMessage for="updateNLine" />
                                      </FormItem>
                                    </FormField>
                                  </div>
                                  <div class="grid w-full max-w-sm items-center gap-1.5">
                                    <FormField name="updateLink">
                                      <FormItem v-auto-animate>
                                        <FormLabel class="text-blue-900">Edit Header</FormLabel>
                                        <FormControl>
                                            <Input id="updateLink" v-model="updates.updateHeader" type="text" :placeholder="feature.link" />
                                        </FormControl>
                                        <FormMessage for="updateNLine" />
                                      </FormItem>
                                    </FormField>
                                  </div>
                                  <div class="grid w-full max-w-sm items-center gap-1.5">
                                    <FormField name="updateLink">
                                      <FormItem v-auto-animate>
                                        <FormLabel class="text-blue-900">Edit Link Title</FormLabel>
                                        <FormControl>
                                            <Input id="updateLink" v-model="updates.updateLinkTitle" type="text" :placeholder="feature.link" />
                                        </FormControl>
                                        <FormMessage for="updateNLine" />
                                      </FormItem>
                                    </FormField>
                                  </div>
                                  <p class="text-blue-900 mt-2">Select Theme color</p>    
                                      <ToggleGroup type="single">
                                        <ToggleGroupItem aria-label="Toggle bold" v-for="(theme, key) in store.colors" :key="key" :value="theme.hexacode">
                                          <div class='w-6 h-6 rounded-md' :style="{'background-color': theme.hexacode}" @click='()=> updates.updateColor = theme.hexacode'></div>
                                        </ToggleGroupItem>
                                      </ToggleGroup>

                                    <div>
                                      <FormField name="scheduledDate">
                                        <FormItem v-auto-animate>
                                          <FormLabel class="text-blue-900">Schedule (optional)</FormLabel>
                                          <FormControl>
                                            <DateRanged @updateValue="updateLog"/>
                                          </FormControl>
                    
                                          <FormMessage for="dob" />
                                        </FormItem>
                                      </FormField>
                                    </div>

                                  <Button type="submit" class="bg-[#4145A7] mt-2">
                                    Submit
                                  </Button>
                                </form>
                            </SheetContent>
                          </Sheet>

                        <AlertDialog>
                          <AlertDialogTrigger>
                            <div class='w-full h-full col-span-1 flex items-center pt-1'>
                              <Icon icon="mdi:delete" width="17" height="17" :class="deleteStyle" class='hidden md:inline-block' @click="verifyAbilities('delete', 'featured-moments')"/>
                            </div>
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
                      <div class='absolute right-3 place-self-center'>
                      <!-- <div class='h-full w-full grid grid-cols-1 items-center justify-center md:flex md:justify-end col-sapn-1'> -->
                        <Dialog>
                          <DialogTrigger as-child>
                            <Icon icon="uil:angle-right" class="ml-1 col-span-1 md:" width="20" height="20" />
                          </DialogTrigger>
                          <DialogContent class="flex justify-center md:block">
                            <DialogHeader>
                              <DialogTitle></DialogTitle>
                              <DialogDescription>
                              </DialogDescription>
                            </DialogHeader>
                            <div class="flex items-center space-x-2 w-full pl-8">
                              <div class='w-full grid grid-cols-2'>
                                <div class='w-20 h-20 col-span-1 md:col-span-1'>
                                  <img v-if='feature.image !== ""' :src='feature.image' class="w-full h-full rounded-sm"/>
                                  <div v-else class='w-full h-full flex items-center justify-center border border-gray-500 rounded-sm'>
                                    <Icon icon="mdi:broken-image" class="text-gray-500 h-full w-full" width="48" height="48"/>
                                  </div>
                                </div>
                                <div class="col-span-1 flex flex-col text-muted-foreground items-center justify-end md:justify-center w-full">
                                  {{ feature.disabled === false ? 'Active' : 'Disabled' }} 
                                  <Switch :checked="!feature.disabled" @click='()=> toggle(feature)'/>
                                </div>
                                <div class="col-span-2 text-[#000000] md:h-14 flex flex-col">
                                    <p class='text-muted-foreground'>Header</p>
                                    <p>{{feature.header}}</p>
                                </div>
                                  <div class="col-span-2 text-[#000000] md:h-14 flex flex-col">
                                      <p class='text-muted-foreground'>Scheduled date</p>
                                      <p>{{feature.scheduledDateFrom}} - {{feature.scheduledDateTo}}</p>
                                  </div>
                                <div class="col-span-2 text-[#000000] md:h-14 flex flex-col">
                                    <p class='text-muted-foreground'>Link</p>
                                    <p>{{feature.link}}</p>
                                </div>
                                <div class="col-span-1 md:hidden text-[#000000] md:h-14 flex flex-col">
                                    <p class='text-muted-foreground'>Theme</p>
                                    <p>{{feature.color}}</p>
                                </div>
                                <div class="col-span-2 hidden text-[#000000] md:h-14 lg:flex flex-col mb-4">
                                    <p class='text-muted-foreground'>Admin details</p>
                                    <p><span class='text-muted-foreground'>Name:</span> {{feature.adminDetails.firstName}} <span class='text-muted-foreground'>Email:</span> {{feature.adminDetails.email}}</p>
                                </div>
                                <DialogClose class='col-span-1' as-child>
                                  <Button type="button" variant="secondary">
                                    Close
                                  </Button>
                                </DialogClose>
                              </div>
                            </div>
                            <!-- <DialogFooter class="sm:justify-start">
                              <DialogClose as-child>
                                <Button type="button" variant="secondary">
                                  Close
                                </Button>
                              </DialogClose>
                            </DialogFooter> -->
                          </DialogContent>
                        </Dialog>
                      </div>
                      <!-- </CardContent> -->
                    </div>
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