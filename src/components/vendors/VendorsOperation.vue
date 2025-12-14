<template>
  <div class="p-4">
    <div class="w-full flex items-center justify-between mb-4">
      <h1 class="text-lg font-medium">Product & Operation</h1>
    </div>
    
    <!-- Product Categories -->
    <div class="grid md:grid-cols-8 gap-2 md:gap-8">
      <div class="md:col-span-8">
        <Label class="px-2">Product Category</Label>
        <!-- <ToggleGroup type="multiple" v-model="selectedCategories"> -->
          <div v-if="vendorData.categories.length !== 0" class="overflow-auto bg-white pb-4 flex items-center gap-4 space-y-2">
            <div
              v-for="(category) in vendorData.categories" 
              :key="category._id"
              :value="category._id" 
              aria-label="Toggle category"
            >
              <Card class="border flex items-center justify-center rounded-lg hover:shadow-xl w-fit py-2 px-4">
                <span class="flex gap-2 items-center">
                  <div class="inline-block text-[#F8F9FF] w-6 h-6">
                    <img :src="category.image || '/placeholder-image.png'" class="w-6 h-6 rounded-sm"/>
                  </div>
                  <div class="flex flex-col items-start justify-between">
                    <p class="text-sm text-muted-foreground text-center text-[#000000]">
                      {{ category.name }}
                    </p>
                  </div>
                </span>
              </Card>
            </div>
          </div>
        <!-- </ToggleGroup> -->
      </div>
    </div>

    <!-- Delivery Information -->
    <div class="grid grid-cols-8 gap-2 md:gap-8 my-2 md:my-4 w-full">
      <div class="col-span-8 md:col-span-3 w-full">
        <Label class="px-2">Delivery Coverage</Label>
        <Select
          v-model="vendorData.deliveryCoverage"
          id="gender"
          class="bg-gray-900 w-auto mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        >
            <SelectTrigger class="">
              <SelectValue :placeholder="vendorData.deliveryCoverage || 'Local'" />
            </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="(option, index) in deliveryOptions"
              :value="option"
              :key="index"
              class="flex justify-center items-center gap-2"
            >
              {{ option }}                       
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <!-- <div class="col-span-8 md:col-span-4 w-full">
        <Label class="px-2">Delivery Coverage</Label>
        <Select v-model="vendorData.deliveryCoverage">
          <SelectTrigger class="w-full mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
            <SelectValue placeholder="Select coverage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="(option, index) in deliveryOptions"
              :value="option"
              :key="index"
              class="flex justify-center items-center gap-2"
            >
              {{ option }}                        
            </SelectItem>
          </SelectContent>
        </Select>
      </div> -->
      <!-- <div class="col-span-8 md:col-span-4 w-full">
        <Label class="px-2">Delivery Logistics Type</Label>
        <Select v-model="vendorData.deliveryType">
          <SelectTrigger class="w-auto mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="(type, index) in logisticsTypes"
              :value="type"
              :key="index"
              class="flex justify-center items-center gap-2"
            >
              {{ type }}                        
            </SelectItem>
          </SelectContent>
        </Select>
      </div> -->
      <div class="col-span-8 md:col-span-5 w-full">
        <Label class="px-2">Delivery Logistics Type</Label>
        <Select
          v-model="vendorData.deliveryType"
          id="gender"
          class="bg-gray-900 w-auto mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        >
            <SelectTrigger class="">
              <SelectValue placeholder="Weekly" />
            </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="(type, index) in logisticsTypes"
              :value="type"
              :key="index"
              class="flex justify-center items-center gap-2"
            >
              {{ type }}                     
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Delivery Details -->
    <div class="grid grid-cols-12 gap-2 md:gap-8 my-2 md:my-4">
      <div class="col-span-12 md:col-span-6">
        <Label class="px-2">Average Delivery Timeframe (Days)</Label>
        <Input 
          v-model.number="opsFormData.averageDeliveryMins" 
          type="number" 
          class=""
          placeholder="Enter days"
        />
      </div>
      <div class="col-span-12 md:col-span-4">
        <Label class="px-2">Max. Delivery Cost (₦)</Label>
        <Input class="ghost" v-model="opsFormData.maxDeliveryCost"/>
      </div>
      <div class="col-span-12 md:col-span-6">
        <Label class="px-2">Link to Return Policy</Label>
        <Input 
          v-model="opsFormData.policyPageUrl" 
          class="w-full"
          placeholder="https://example.com/return-policy"
        />
      </div>
    </div>

    <!-- Working Hours -->
    <div class="w-full flex flex-col md:flex-row md:items-center justify-between pt-8 pb-4">
      <h1 class="text-lg font-medium">
        Working Hours
      </h1>
      <div class="w-48 mt-2 md:mt-0">
        <label class="relative inline-flex items-center w-full cursor-pointer select-none">
          <input
            type="checkbox"
            v-model="vendorData.scheduled"
            class="sr-only"
          />
          <div
            class="relative flex border h-8 items-center justify-between rounded-full px-4 w-full text-sm
                  dark:border-slate-600 text-black bg-white transition-colors duration-300"
          >
            <span
              :class="vendorData.scheduled
                ? 'text-white z-30'
                : 'text-[#020721] z-30'"
            >
              Scheduled
            </span>
            <span
              :class="!vendorData.scheduled
                ? 'text-white z-30'
                : 'text-[#020721] z-30'"
            >
              24hrs
            </span>
            <!-- Slider knob that moves based on vendorData.scheduled -->
            <span
              class="absolute place-self-center left-1 h-6 w-[48%] rounded-full bg-[#020721] transition-transform duration-300 before:absolute after:left-1 after:h-6 after:w-[30%] after:rounded-full after:content-[''] peer-checked:after:translate-x-full"
              :style="{ transform: vendorData.scheduled ? 'translateX(0)' : 'translateX(100%)' }"
            ></span>
          </div>
        </label>
      </div>
    </div>



    <!-- Days Schedule -->
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-6 md:col-span-3" v-for="(day, index) in days" :key="index">
        <Label class="px-2 my-1 w-full flex items-center justify-between">
          <p>{{ day }}</p>
          <Switch
            :checked="workingHours[index].active"
            @click="workingHours[index].active = !workingHours[index].active"
            v-model="workingHours[index].active"
            :disabled="!vendorData.scheduled"
          />
        </Label>
        <Input 
          v-model="workingHours[index].time"
          class="ghost"
          placeholder="9:00am - 6:00pm"
          :readonly="!vendorData.scheduled"
          :disabled="!workingHours[index].active || !vendorData.scheduled"
        />
      </div>
    </div>

    <!-- Save Button -->
    <div class="w-full flex justify-end mt-6">
      <Button @click="saveChanges" :disabled="isLoading">
        {{ isLoading ? 'Saving...' : 'Save Changes' }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/toast'
import axios from 'axios'
import { catchErr } from '@/composables/catchError'

// Interfaces
interface TimeSlot {
  open: string
  close: string
}

interface WeeklySchedule {
  day: string
  slots: TimeSlot[]
}

interface Category {
  _id: string
  name: string
  description: string
  image: string | null
}

interface VendorData {
  _id: string
  vendorId: string
  scheduled: boolean
  weeklySchedule: WeeklySchedule[]
  categories: Category[]
  deliveryCoverage: string
  deliveryType: string
  averageDeliveryMins: number;
  maxDeliveryCost: number,
  policyPageUrl: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

interface WorkingHourDay {
  active: boolean
  time: string
}

// Props (if receiving data from parent)
// const props = defineProps<{
//   initialData?: VendorData
// }>()

// Reactive state
const vendorData = reactive<VendorData>({
  _id: '',
  vendorId: '',
  scheduled: true,
  weeklySchedule: [],
  categories: [],
  deliveryCoverage: '',
  deliveryType: '',
  averageDeliveryMins: 0,
  maxDeliveryCost: 0,
  policyPageUrl: '',
  isActive: true,
  createdAt: '',
  updatedAt: '',
  __v: 0
})

const selectedCategories = ref<string[]>([])
const isLoading = ref(false)
const props = defineProps({
  id: String,
})
const id = props.id
const opsFormData = ref({
  averageDeliveryMins: vendorData.averageDeliveryMins,
  policyPageUrl: vendorData.policyPageUrl,
  maxDeliveryCost: vendorData.maxDeliveryCost
});

// Static data
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const deliveryOptions = ['Local', 'Regional', 'National', 'International']
const logisticsTypes = ['self-managed', 'third-party', 'mixed']

// Working hours state
const workingHours = reactive<WorkingHourDay[]>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  days.map(day => ({
    active: false,
    time: ''
  }))
)

// Convert API weekly schedule to working hours format
const mapWeeklyScheduleToWorkingHours = (weeklySchedule: WeeklySchedule[]) => {
  days.forEach((dayName, index) => {
    const dayLower = dayName.toLowerCase()
    const schedule = weeklySchedule.find(s => s.day === dayLower)
    
    if (schedule && schedule.slots.length > 0) {
      const slot = schedule.slots[0]
      workingHours[index].active = true
      workingHours[index].time = `${formatTime(slot.open)} - ${formatTime(slot.close)}`
    } else {
      workingHours[index].active = false
      workingHours[index].time = ''
    }
  })
}

// Convert working hours back to API format
const mapWorkingHoursToWeeklySchedule = (): WeeklySchedule[] => {
  const weeklySchedule: WeeklySchedule[] = []
  
  workingHours.forEach((day, index) => {
    if (day.active) {
      const time = day.time || '9:00am - 6:00pm'
      const [openTime, closeTime] = time.split(' - ')
      weeklySchedule.push({
        day: days[index].toLowerCase(),
        slots: [
          {
            open: parseTimeTo24Hour(openTime),
            close: parseTimeTo24Hour(closeTime)
          }
        ]
      })
    }
  })
  
  return weeklySchedule
}

// Helper functions for time formatting
const formatTime = (time24: string): string => {
  const [hours, minutes] = time24.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'pm' : 'am'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes}${ampm}`
}

const parseTimeTo24Hour = (time12: string): string => {
  const [time, period] = time12.split(/(?=[ap]m)/)
  let [hours, minutes] = time.split(':')
  
  let hour = parseInt(hours)
  if (period.toLowerCase() === 'pm' && hour !== 12) {
    hour += 12
  } else if (period.toLowerCase() === 'am' && hour === 12) {
    hour = 0
  }
  
  return `${hour.toString().padStart(2, '0')}:${minutes ? minutes : '00'}`
}

const createConfig = async ():  Promise<VendorData | undefined>=>{
  const updateData = {
      vendorId: id,
      scheduled: true,
      weeklySchedule: mapWorkingHoursToWeeklySchedule(),
      categories: vendorData.categories.filter(cat => 
        selectedCategories.value.includes(cat._id)
      ),
      deliveryCoverage: vendorData.deliveryCoverage || "Regional",
      deliveryType: vendorData.deliveryType || "self-managed",
      averageDeliveryMins: vendorData.averageDeliveryMins,
      maxDeliveryCost: vendorData.maxDeliveryCost || 0,
      policyPageUrl: vendorData.policyPageUrl || 'https://example.com'

    }
      try {
         return (await axios.post(`/api/v1/admin/market/vendor/operations`, updateData)).data.data;
      } catch (error) {
        catchErr(error)
        // console.log(error)
      }
}

// API functions
const fetchVendorData = async (): Promise<VendorData |  undefined> => {
  try {
    toast({
      title: 'Loading Data',
      description: 'Fetching data...',
      variant: 'loading',
      duration: 0 // Set duration to 0 to make it indefinite until manually closed
    })
    const response = await axios.get(`/api/v1/market/vendor/operations/${id}`)
  toast({
    title: 'Loading Data',
    description: 'Success!',
    variant: 'success',
    duration: 0 // Set duration to 0 to make it indefinite until manually closed
  })
  // Simulate API call - replace with actual API endpoint
  const data = response.data.data;
  // console.log(data)
  opsFormData.value = {
    averageDeliveryMins: data.averageDeliveryMins,
    policyPageUrl: data.policyPageUrl,
    maxDeliveryCost: data.maxDeliveryCost || 0
  }
  return data
  } catch (error: any) {
    // console.log(error)
    if(error.status === 400){
       try {
        const data = await createConfig()
        if(data) return data
       } catch (error) {
        catchErr(error)
       }
    }
  }
}

const patchVendorData = async (data: Partial<VendorData>): Promise<void> => {
  isLoading.value = true
  try {
    // Replace with actual PATCH API call
    const response = await axios.patch(`/api/v1/admin/market/vendor/operations/${id}`, data)
    
    if (!response) {
      throw new Error('Failed to update vendor data')
    }
    if(response.data.data){
      Object.assign(vendorData, data)
      
      // Set selected categories
      if(response.data.data.categories.length > 0) selectedCategories.value = response.data.data.categories.map((cat: any) => cat._id)
      
      // Map weekly schedule to working hours
      mapWeeklyScheduleToWorkingHours(response.data.data.weeklySchedule)
    }
    toast({
      title: 'Success',
      description: 'Vendor data updated successfully',
      variant: 'success'
    })
  } catch (error) {
    console.error('Error updating vendor data:', error)
    toast({
      title: 'Error',
      description: 'Failed to update vendor data',
      variant: 'destructive'
    })
  } finally {
    isLoading.value = false
  }
}

// Save changes
const saveChanges = async () => {
  // console.log(opsFormData.value)
  const updateData: Partial<VendorData> = {
    scheduled: vendorData.scheduled,
    weeklySchedule: mapWorkingHoursToWeeklySchedule(),
    // categories: vendorData.categories.filter(cat => 
    //   selectedCategories.value.includes(cat._id)
    // ),
    deliveryCoverage: vendorData.deliveryCoverage,
    deliveryType: vendorData.deliveryType,
    averageDeliveryMins: opsFormData.value.averageDeliveryMins || vendorData.averageDeliveryMins,
    policyPageUrl: opsFormData.value.policyPageUrl || vendorData.policyPageUrl,
    maxDeliveryCost: opsFormData.value.maxDeliveryCost || vendorData.maxDeliveryCost
  }
  
  await patchVendorData(updateData)
}

// Initialize data
onMounted(async () => {
  const data = await fetchVendorData()
  if(data){
    Object.assign(vendorData, data)
    
    // Set selected categories
    if(data.categories.length > 0) selectedCategories.value = data.categories.map(cat => cat._id)
    
    // Map weekly schedule to working hours
    mapWeeklyScheduleToWorkingHours(data.weeklySchedule)
  }
})

// Watch for scheduled changes to enable/disable days
watch(() => vendorData.scheduled, (newVal) => {
  if (!newVal) {
    // If switching to 24hrs, disable all day inputs
    workingHours.forEach(day => {
      day.active = false
    })
  }
})
</script>