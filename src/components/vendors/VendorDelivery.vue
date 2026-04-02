<template>
  <div class="p-2 sm:p-4">
    <div class="w-full flex items-center justify-between mb-4">
      <h1 class="text-lg font-medium">Delivery Location & Fee</h1>
    </div>
    <!-- Delivery Information -->
    <div class="grid grid-cols-8 gap-2 md:gap-8 my-2 md:my-4 w-full">
      <div class="col-span-8 md:col-span-5 w-full">
        <div class="flex flex-col md:flex-row md:items-center justify-between py-2 md:py-1">
            <Label class="px-2 text-muted-foreground">Pickup Address</Label>
            <div class="flex items-center gap-2 px-2">
                <p class="text-xs text-green-500 font-medium">Same as business address</p>
                <Switch/>
            </div>
        </div>
        <Input 
          type="text" 
          class=""
          :placeholder="locations[0].address"
        />
      </div>
      <div class="col-span-8 md:col-span-3 w-full">
        <div class="py-1">
            <Label class="px-2 text-muted-foreground">Average Delivery Timeframe</Label>
        </div>
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

    <!-- Working Hours -->
    <div class="w-full flex flex-col mt-12">
      <h1 class="text-lg font-medium">
        Fee Configuration
      </h1>
      <p class="text-sm my-2 text-muted-foreground">Set delivery fee per zone</p>
    </div>



    <!-- Days Schedule -->
    <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 sm:col-span-4 bg-gray-100 p-2 rounded-md space-y-2" v-for="(location, index) in locations" :key="index">
            <div class="flex items-center justify-between py-2 border-b-2">
                {{ location.name }}
                <Badge class="bg-gray-500">Zone {{ index + 1}}</Badge>
            </div>
            <Select
            v-model="vendorData.deliveryType"
            id="gender"
            class="bg-gray-900 w-auto mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
                <SelectTrigger disabled class="">
                    <SelectValue :placeholder='location.address' />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem
                    v-for="(type, index) in locations"
                    :value="type.address"
                    :key="index"
                    class="flex justify-center items-center gap-2 text-left"
                    >
                    {{ type.address }}                     
                    </SelectItem>
                </SelectContent>
            </Select>
            <div class="grid grid-cols-6">
                <div class="px-2 col-span-2 flex items-center gap-2">
                    <Label class="text-muted-foreground">Enter Fee</Label>
                </div>
                <Input type="number" class="col-span-4" placeholder="₦"/>
            </div>
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
import { Badge } from '../ui/badge'

// Interfaces
interface Locations {
    name: string
    address: string,
    fee: number,
    zone?: number,
}
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

const locations = reactive<Locations[]>([
  { name: 'Core Island', address: 'Victoria Island . Ikoyi . Lekki Phase 1', fee: 5 },
  { name: 'Extended Island', address: 'Ikota . Ajah . Sangotedo . Ibeju-Lekki', fee: 10 },
  { name: 'Upper Mainland', address: 'Yaba . Surulere . Maryland . Ikeja GRA', fee: 20 },
  { name: 'Central Mainland', address: 'Berger . Ojodu . Agege . Alimosho', fee: 50 },
  { name: 'Apapa Corridor', address: 'Festac . Amuwo-Odofin . Mile 2 . Apapa', fee: 20 },
  { name: 'Outer Lagos', address: 'Ikorodu . Epe . Badagry', fee: 50 }
])

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