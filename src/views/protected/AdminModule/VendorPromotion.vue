<!-- VendorPromotion.vue -->
<template>
  <div class="flex-col flex bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10">
    <VendorNav class="mx-6" headingText="Promotions"/>

    <div class="container w-full grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4 pt-6 text-nowrap">
      <Card class="h-[150px] rounded-[24px] bg-[#00C37F] cardShadow4 border-transparent transition-transform transform hover:scale-105">
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Active</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon icon="mingcute:arrow-left-down-line" width="24px" height="24px" color="#00C37F" />
            </div>

            <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              3
            </p>
          </CardContent>
        </div>
      </Card>

      <Card class="h-[150px] rounded-[24px] bg-[#6A70FF] border-transparent transition-transform transform hover:scale-105">
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Scheduled</p>
            <Archive width="24px" height="24px" color="#ffffff" />

            <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              <span>1</span>
            </p>
          </CardContent>
        </div>
      </Card>

      <Card class="h-[150px] rounded-[24px] bg-[#3A8EE5] border-transparent transition-transform transform hover:scale-105">
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Draft</p>
            <Archive width="24px" height="24px" color="#ffffff" />

            <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              <span>5</span>
            </p>
          </CardContent>
        </div>
      </Card>

      <Card class="h-[150px] rounded-[24px] bg-[#DF6C50] cardShadow4 border-transparent transition-transform transform hover:scale-105">
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Expired</p>
            <CalendarDays width="24px" height="24px" color="#ffffff" />

            <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              <span>9</span>
            </p>
          </CardContent>
        </div>
      </Card>
    </div>

    <Card class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-14 mb-4">
      <div class="flex flex-col sm:flex-row items-center justify-between py-4">
        <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-2 sm:mb-0">
          History
          <p class="text-xs sm:text-sm font-normal text-[#02072199]">
            Details of all promotions
          </p>
        </div>
        <div class="flex items-center flex-col md:flex-row gap-4">
          <Search class="mt-3 lg:mt-0" />
          <Sheet>
            <SheetTrigger asChild>
              <button class="bg-[#020721] px-4 py-2 rounded-xl w-50 h-12">
                <div class="text-base text-[#F8F9FF] text-center flex items-center">
                  Create New
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
            <SheetContent length="mid_low" class="flex flex-col space-y-0 overflow-y-scroll">
              <SheetHeader class="flex flex-col items-start px-4">
                <SheetDescription class="text-xs text-muted-foreground">
                  {{ currentStep === 1 ? 'Draft' : currentStep === 2 ? 'Draft/Code' : 'Draft/Code' }}
                </SheetDescription>
                <h3 class="text-2xl font-medium text-[#020721]">New Promotion</h3>
                <p class="text-sm text-muted-foreground">7 August 2025</p>
              </SheetHeader>

              <!-- Promotion Creation Tabs -->
              <div class="px-4 py-4">
                <div class="text-sm font-medium text-[#020721] mb-3">Promotion Creation</div>
                <div class="flex gap-2">
                  <button 
                    @click="promotionType = 'schedule'"
                    :class="promotionType === 'schedule' ? 'bg-white text-[#020721]' : 'bg-transparent text-[#02072199]'"
                    class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200"
                  >
                    Schedule
                  </button>
                  <button 
                    @click="promotionType = 'draft'"
                    :class="promotionType === 'draft' ? 'bg-[#020721] text-white' : 'bg-transparent text-[#02072199]'"
                    class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200"
                  >
                    Draft
                  </button>
                  <button 
                    @click="promotionType = 'active'"
                    :class="promotionType === 'active' ? 'bg-white text-[#020721]' : 'bg-transparent text-[#02072199]'"
                    class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200"
                  >
                    Active
                  </button>
                </div>
              </div>

              <!-- Step Indicator -->
              <div class="px-4 flex items-center justify-between mb-4">
                <div :class="currentStep === 1 ? 'text-[#020721] font-semibold' : 'text-[#02072199]'" class="text-sm">
                  {{ currentStep === 1 ? 'Promotion Details' : currentStep === 2 ? 'Discount Configuration' : 'Target Products or Categories' }}
                </div>
                <div class="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                  Step {{ currentStep }} of 3
                </div>
              </div>

              <!-- Step 1: Promotion Details -->
              <div v-if="currentStep === 1" class="px-4 space-y-4">
                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">
                    Name of Promotion <span class="text-red-500">*</span>
                  </label>
                  <input 
                    v-model="formData.name"
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
                  />
                </div>

                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">Description</label>
                  <div class="relative">
                    <textarea 
                      v-model="formData.description"
                      maxlength="90"
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721] resize-none"
                    ></textarea>
                    <span class="absolute bottom-2 right-2 text-xs text-muted-foreground">
                      {{ formData.description.length }}/90
                    </span>
                  </div>
                </div>

                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">
                    Promotion Type <span class="text-red-500">*</span>
                  </label>
                  <select 
                    v-model="formData.type"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721] appearance-none bg-white"
                  >
                    <option value="">Select type</option>
                    <option value="percentage">Percentage Off</option>
                    <option value="fixed">Fixed Amount Off</option>
                    <option value="bogo">Buy One Get One</option>
                  </select>
                </div>

                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">Promo Code</label>
                  <input 
                    v-model="formData.code"
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm font-medium text-[#020721] mb-2 block">Start Date & Time</label>
                    <input 
                      v-model="formData.startDate"
                      type="text" 
                      placeholder="dd / mm / yyyy, --:--"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721] text-sm"
                    />
                  </div>
                  <div>
                    <label class="text-sm font-medium text-[#020721] mb-2 block">End Date & Time</label>
                    <input 
                      v-model="formData.endDate"
                      type="text" 
                      placeholder="dd / mm / yyyy, --:--"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721] text-sm"
                    />
                  </div>
                </div>
              </div>

              <!-- Step 2: Discount Configuration -->
              <div v-if="currentStep === 2" class="px-4 space-y-4">
                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">
                    Discount Value <span class="text-red-500">*</span>
                  </label>
                  <input 
                    v-model="formData.discountValue"
                    type="number" 
                    placeholder="20"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
                  />
                </div>

                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">Minimum Purchase Amount</label>
                  <input 
                    v-model="formData.minPurchase"
                    type="number" 
                    placeholder="5000"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
                  />
                </div>

                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">Maximum Discount Cap</label>
                  <input 
                    v-model="formData.maxDiscount"
                    type="number" 
                    placeholder="2000"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
                  />
                </div>

                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">Limit Total Uses</label>
                  <input 
                    v-model="formData.totalUses"
                    type="number" 
                    placeholder="500"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
                  />
                </div>

                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">Limit Per Customer</label>
                  <input 
                    v-model="formData.perCustomer"
                    type="number" 
                    placeholder="3"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
                  />
                </div>
              </div>

              <!-- Step 3: Target Products or Categories -->
              <div v-if="currentStep === 3" class="px-4 space-y-4">
                <div class="text-sm font-medium text-[#020721] mb-3">Apply To</div>
                <div class="flex gap-2 mb-4">
                  <button 
                    @click="applyTo = 'all'"
                    :class="applyTo === 'all' ? 'bg-[#020721] text-white' : 'bg-white text-[#020721]'"
                    class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200"
                  >
                    All
                  </button>
                  <button 
                    @click="applyTo = 'selected'"
                    :class="applyTo === 'selected' ? 'bg-[#020721] text-white' : 'bg-white text-[#020721]'"
                    class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200"
                  >
                    Selected
                  </button>
                </div>

                <div v-if="applyTo === 'selected'">
                  <label class="text-sm font-medium text-[#020721] mb-2 block">Selected Products</label>
                  <select 
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721] appearance-none bg-white mb-4"
                  >
                    <option value="">Select products</option>
                  </select>

                  <label class="text-sm font-medium text-[#020721] mb-2 block">
                    Select Eligible Products <span class="text-red-500">*</span>
                  </label>
                  
                  <div class="space-y-2 max-h-60 overflow-y-auto">
                    <div v-for="product in eligibleProducts" :key="product.id" 
                         class="flex items-center gap-3 p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input 
                        type="checkbox" 
                        :id="product.id"
                        v-model="selectedProducts"
                        :value="product.id"
                        class="w-4 h-4"
                      />
                      <img :src="product.image" :alt="product.name" class="w-10 h-10 rounded object-cover" />
                      <div class="flex-1">
                        <div class="text-sm font-medium text-[#020721]">{{ product.name }}</div>
                        <div class="text-xs text-muted-foreground">₦{{ product.price.toLocaleString() }}</div>
                      </div>
                      <div class="text-xs text-muted-foreground">{{ product.size }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="px-4 py-4 mt-auto flex items-center justify-between">
                <button 
                  v-if="currentStep > 1"
                  @click="currentStep--"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-[#020721] hover:bg-gray-100 rounded-lg"
                >
                  <Icon icon="radix-icons:chevron-left" />
                  Back
                </button>
                <div v-else></div>
                
                <button 
                  @click="handleNext"
                  class="flex items-center gap-2 px-6 py-2 bg-[#5B68DF] text-white rounded-lg text-sm font-medium hover:bg-[#4a56cc]"
                >
                  {{ currentStep === 3 ? 'Preview' : 'Next' }}
                  <Icon icon="radix-icons:chevron-right" />
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div class="overflow-auto bg-white rounded-lg">
        <Table class="lg:w-full w-[800px]">
          <TableHeader>
            <TableRow class="text-xs sm:text-sm text-[#020721CC] font-normal border-b">
              <TableHead class="cursor-pointer hover:bg-gray-50">
                <div class="flex items-center gap-1">
                  Promotion Name
                  <Icon icon="fluent:chevron-up-down-20-regular" class="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead class="cursor-pointer hover:bg-gray-50">
                <div class="flex items-center gap-1">
                  Type
                  <Icon icon="fluent:chevron-up-down-20-regular" class="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead class="cursor-pointer hover:bg-gray-50">
                <div class="flex items-center gap-1">
                  Discount Value
                  <Icon icon="fluent:chevron-up-down-20-regular" class="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead class="cursor-pointer hover:bg-gray-50">
                <div class="flex items-center gap-1">
                  Applies To
                  <Icon icon="fluent:chevron-up-down-20-regular" class="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead class="cursor-pointer hover:bg-gray-50">
                <div class="flex items-center gap-1">
                  Start Date
                  <Icon icon="fluent:chevron-up-down-20-regular" class="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead class="cursor-pointer hover:bg-gray-50">
                <div class="flex items-center gap-1">
                  End Date
                  <Icon icon="fluent:chevron-up-down-20-regular" class="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead class="cursor-pointer hover:bg-gray-50">
                <div class="flex items-center gap-1">
                  Usage Count
                  <Icon icon="fluent:chevron-up-down-20-regular" class="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead class="cursor-pointer hover:bg-gray-50">
                <div class="flex items-center gap-1">
                  Status
                  <Icon icon="fluent:chevron-up-down-20-regular" class="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="promo in promotions" :key="promo.id" class="hover:bg-gray-50 border-b">
              <TableCell class="text-sm font-medium text-[#020721]">{{ promo.name }}</TableCell>
              <TableCell class="text-sm text-[#020721CC]">{{ promo.type }}</TableCell>
              <TableCell class="text-sm text-[#020721CC]">{{ promo.discountValue }}</TableCell>
              <TableCell class="text-sm text-[#020721CC]">{{ promo.appliesTo }}</TableCell>
              <TableCell class="text-sm text-[#020721CC]">{{ promo.startDate }}</TableCell>
              <TableCell class="text-sm text-[#020721CC]">{{ promo.endDate }}</TableCell>
              <TableCell class="text-sm text-[#020721CC]">{{ promo.usageCount }}</TableCell>
              <TableCell>
                <div
                  :class="statusBg(promo.status)"
                  class="rounded-[10px] w-fit px-3 py-1 text-white text-xs font-medium capitalize"
                >
                  {{ promo.status }}
                </div>
              </TableCell>
              <TableCell class="text-right">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="cursor-pointer"
                >
                  <path
                    d="M7 5L12.5118 9.93939C13.1627 10.5227 13.1627 11.4773 12.5118 12.0606L7 17"
                    stroke="#54586D"
                    stroke-opacity="0.8"
                    stroke-width="2"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div class="flex gap-2 max-w-full flex-wrap justify-end mt-8 mr-4 items-center text-[15px]">
        <Button variant="secondary"> <Icon icon="radix-icons:chevron-left" /> </Button>
        <Button variant="secondary" class="bg-[#020721] text-gray-400"> 1 </Button>
        <Button variant="outline"> 2 </Button>
        <Button variant="outline"> &#8230; </Button>
        <Button variant="outline"> 4 </Button>
        <Button variant="outline"> 5 </Button>
        <Button variant="outline"> <Icon icon="radix-icons:chevron-right" /> </Button>
        <a href="#"><p class="text-[blue]">See all</p></a>
      </div>
    </Card>
    <DashboardFooter />
  </div>
</template>

<script lang="ts" setup>
import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import Search from '@/components/UseSearch.vue'
import VendorNav from '@/components/VendorNav.vue'
import { Archive, CalendarDays } from 'lucide-vue-next'
import DashboardFooter from '@/components/DashboardFooter.vue'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"

const statusBg = (status: string) => {
  switch (status) {
    case 'expired':
      return 'bg-[#DF6C50]'
    case 'scheduled':
      return 'bg-[#6A70FF]'
    case 'active':
      return 'bg-[#00C37F]'
    case 'draft':
      return 'bg-[#3A8EE5]'
    default:
      return ''
  }
}

interface Promotion {
  id: string;
  name: string;
  type: string;
  discountValue: string;
  appliesTo: string;
  startDate: string;
  endDate: string;
  usageCount: string;
  status: 'active' | 'scheduled' | 'draft' | 'expired';
}

const promotions = ref<Promotion[]>([
  {
    id: "promo_001",
    name: "Mega Deal",
    type: "BOGO",
    discountValue: "Buy 1 Get 1",
    appliesTo: "All Products",
    startDate: "5 Jan 2025",
    endDate: "5 Jun 2025",
    usageCount: "57/500",
    status: "active"
  },
  {
    id: "promo_002",
    name: "Midnight Flash Sale",
    type: "% Off",
    discountValue: "20%",
    appliesTo: "All Orders ₦5,000+",
    startDate: "12 Jun 2025",
    endDate: "12 Jun 2025",
    usageCount: "90/Unlimited",
    status: "active"
  },
  {
    id: "promo_003",
    name: "Flash Friday",
    type: "₦ Off",
    discountValue: "₦1,500",
    appliesTo: "Selected Products",
    startDate: "17 Jul 2025",
    endDate: "17 Jul 2025",
    usageCount: "11/50",
    status: "active"
  },
  {
    id: "promo_004",
    name: "Weekend Special",
    type: "% Off",
    discountValue: "15%",
    appliesTo: "Electronics",
    startDate: "20 Dec 2025",
    endDate: "22 Dec 2025",
    usageCount: "0/200",
    status: "scheduled"
  },
  {
    id: "promo_005",
    name: "New Year Sale",
    type: "BOGO",
    discountValue: "Buy 2 Get 1",
    appliesTo: "Fashion Items",
    startDate: "1 Jan 2026",
    endDate: "7 Jan 2026",
    usageCount: "0/1000",
    status: "draft"
  },
  {
    id: "promo_006",
    name: "Summer Clearance",
    type: "% Off",
    discountValue: "30%",
    appliesTo: "All Products",
    startDate: "15 Mar 2025",
    endDate: "31 Mar 2025",
    usageCount: "450/500",
    status: "expired"
  },
  {
    id: "promo_007",
    name: "Black Friday",
    type: "₦ Off",
    discountValue: "₦5,000",
    appliesTo: "Orders ₦20,000+",
    startDate: "24 Nov 2024",
    endDate: "25 Nov 2024",
    usageCount: "1200/1000",
    status: "expired"
  },
  {
    id: "promo_008",
    name: "Valentine's Day",
    type: "% Off",
    discountValue: "25%",
    appliesTo: "Gift Items",
    startDate: "10 Feb 2026",
    endDate: "14 Feb 2026",
    usageCount: "0/500",
    status: "draft"
  }
])

// Sheet state
const currentStep = ref(1)
const promotionType = ref('draft')
const applyTo = ref('all')
const selectedProducts = ref<string[]>([])

// Form data
const formData = ref({
  name: '',
  description: '',
  type: '',
  code: '',
  startDate: '',
  endDate: '',
  discountValue: '',
  minPurchase: '',
  maxDiscount: '',
  totalUses: '',
  perCustomer: ''
})

// Eligible products for step 3
const eligibleProducts = ref([
  {
    id: 'prod_001',
    name: 'Citrus Burst Reed Diffuser',
    price: 2500,
    size: '250ml',
    image: 'https://res.cloudinary.com/drykej1am/image/upload/v1721874426/weesh/categories/AWFAGiROM7oxB4ZJWhnaAYkP.jpg'
  },
  {
    id: 'prod_002',
    name: 'Jojoba Oil - Exotic Fruit Fragrance',
    price: 1600,
    size: '160ml',
    image: 'https://res.cloudinary.com/drykej1am/image/upload/v1721875177/weesh/categories/I9IP1OFoxLzZQpA9Sl12fb_g.jpg'
  },
  {
    id: 'prod_003',
    name: 'Leather & Crystal Reed Diffuser',
    price: 1000,
    size: '100ml',
    image: 'https://res.cloudinary.com/drykej1am/image/upload/v1721874850/weesh/categories/WW18ndBhpeKoy2scWXeVqHBv.jpg'
  },
  {
    id: 'prod_004',
    name: 'Coffee Scented Candle',
    price: 3500,
    size: '200g',
    image: 'https://res.cloudinary.com/drykej1am/image/upload/v1721874426/weesh/categories/AWFAGiROM7oxB4ZJWhnaAYkP.jpg'
  }
])

const handleNext = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  } else {
    // Handle preview/submit
    // console.log('Preview promotion', formData.value)
  }
}
</script>