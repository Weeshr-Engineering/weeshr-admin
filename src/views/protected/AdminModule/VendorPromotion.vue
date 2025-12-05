<!-- VendorPromotion.vue -->
<template>
  <div class="flex-col flex bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10">
    <VendorNav class="mx-6" headingText="Promotions"/>

    <!-- Stats Cards -->
    <div class="container w-full grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4 pt-6 text-nowrap">
      <Card class="h-[150px] rounded-[24px] bg-[#00C37F] cardShadow1 border-transparent transition-transform transform hover:scale-105">
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Active</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Check width="24px" height="24px" color="#00C37F" />
            </div>
            <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              {{ promotionsStore.activeCount }}
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
              {{ promotionsStore.scheduledCount }}
            </p>
          </CardContent>
        </div>
      </Card>

      <Card class="h-[150px] rounded-[24px] bg-[#3A8EE5] border-transparent transition-transform transform hover:scale-105">
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Draft</p>
            <ScrollText width="24px" height="24px" color="#ffffff" />
            <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              {{ promotionsStore.draftCount }}
            </p>
          </CardContent>
        </div>
      </Card>

      <Card class="h-[150px] rounded-[24px] bg-[#DF6C50] border-transparent transition-transform transform hover:scale-105">
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Expired</p>
            <CalendarDays width="24px" height="24px" color="#ffffff" />
            <p class="text-2xl md:text-xl xl:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              {{ promotionsStore.expiredCount }}
            </p>
          </CardContent>
        </div>
      </Card>
    </div>

    <!-- Main Content Card -->
    <Card class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-14 mb-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
        <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721]">
          History
          <p class="text-xs sm:text-sm font-normal text-[#02072199]">
            Details of all promotions
          </p>
        </div>
        <div class="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Search class="mt-3 lg:mt-0" @search="handleSearch" :value="searchQuery" />
          
          <button 
            @click="openCreateSheet"
            class="bg-[#020721] px-4 py-2 rounded-xl w-50 h-12"
          >
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

          <!-- Create/Edit Promotion Sheet -->
          <Sheet v-model:open="sheetOpen" @update:open="(open) => !open && resetForm()">
            <SheetContent length="mid_low" class="flex flex-col space-y-0 overflow-y-scroll">
              <SheetHeader class="flex flex-col items-start px-4 pb-4 border-b">
                <SheetDescription class="text-xs text-muted-foreground">
                  {{ isEditMode ? 'Editing' : currentStep === 1 ? 'Draft' : currentStep === 2 ? 'Draft/Code' : 'Draft/Code' }}
                </SheetDescription>
                <h3 class="text-2xl font-medium text-[#020721]">
                  {{ isEditMode ? 'Edit Promotion' : 'New Promotion' }}
                </h3>
                <p class="text-sm text-muted-foreground">
                  {{ isEditMode ? 'Last Updated' : 'Created' }}
                </p>
                <p class="text-sm font-medium text-[#020721]">
                  {{ new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) }}
                </p>
              </SheetHeader>

              <!-- Promotion Creation Tabs -->
              <div class="px-4 py-4">
                <div class="text-sm font-medium text-[#020721] mb-3">Promotion Creation</div>
                <div class="flex gap-2">
                  <button 
                    @click="promotionStatus = 'scheduled'"
                    :class="promotionStatus === 'scheduled' ? 'bg-[#020721] text-white' : 'bg-white text-[#02072199]'"
                    class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200"
                  >
                    Schedule
                  </button>
                  <button 
                    @click="promotionStatus = 'draft'"
                    :class="promotionStatus === 'draft' ? 'bg-[#020721] text-white' : 'bg-white text-[#02072199]'"
                    class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200"
                  >
                    Draft
                  </button>
                  <button 
                    @click="promotionStatus = 'active'"
                    :class="promotionStatus === 'active' ? 'bg-[#020721] text-white' : 'bg-white text-[#02072199]'"
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
                    placeholder="Enter promotion name"
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
                      placeholder="Enter promotion description"
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
                    v-model="formData.promotionType"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721] appearance-none bg-white"
                  >
                    <option value="">Select type</option>
                    <option value="percentage_off">Percentage Off</option>
                    <option value="fixed_amount_off">Fixed Amount Off</option>
                    <option value="bogo">Buy One Get One</option>
                  </select>
                </div>

                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">Promo Code</label>
                  <input 
                    v-model="formData.promoCode"
                    type="text" 
                    placeholder="e.g., SUMMER20"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm font-medium text-[#020721] mb-2 block">Start Date</label>
                    <input 
                      v-model="formData.startDate"
                      type="date" 
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721] text-sm"
                    />
                  </div>
                  <div>
                    <label class="text-sm font-medium text-[#020721] mb-2 block">End Date</label>
                    <input 
                      v-model="formData.endDate"
                      type="date" 
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
                  <p class="text-xs text-[#8B8D97] mt-1">
                    {{ formData.promotionType === 'percentage_off' ? 'Enter percentage (e.g., 20 for 20%)' : 'Enter amount in Naira' }}
                  </p>
                </div>

                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">Minimum Purchase Amount</label>
                  <input 
                    v-model="formData.minPurchaseAmount"
                    type="number" 
                    placeholder="5000"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
                  />
                </div>

                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">Maximum Discount Cap</label>
                  <input 
                    v-model="formData.maxDiscountCap"
                    type="number" 
                    placeholder="2000"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
                  />
                </div>

                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">Limit Total Uses</label>
                  <input 
                    v-model="formData.totalUsageLimit"
                    type="number" 
                    placeholder="500"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
                  />
                </div>

                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">Limit Per Customer</label>
                  <input 
                    v-model="formData.limitPerCustomer"
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
                    @click="formData.appliesTo = 'all_products'"
                    :class="formData.appliesTo === 'all_products' ? 'bg-[#020721] text-white' : 'bg-white text-[#020721]'"
                    class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200"
                  >
                    All Products
                  </button>
                  <button 
                    @click="formData.appliesTo = 'selected_products'"
                    :class="formData.appliesTo === 'selected_products' ? 'bg-[#020721] text-white' : 'bg-white text-[#020721]'"
                    class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200"
                  >
                    Selected Products
                  </button>
                </div>

                <div v-if="formData.appliesTo === 'selected_products'">
                  <label class="text-sm font-medium text-[#020721] mb-2 block">
                    Select Eligible Products <span class="text-red-500">*</span>
                  </label>
                  
                  <!-- Product Search -->
                  <div class="mb-4">
                    <input 
                      v-model="productSearch"
                      @input="debouncedSearchProducts"
                      type="text" 
                      placeholder="Search products..."
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
                    />
                  </div>

                  <!-- Loading State -->
                  <div v-if="promotionsStore.productsLoading" class="flex justify-center py-4">
                    <Icon icon="eos-icons:loading" class="w-6 h-6 text-[#020721]" />
                  </div>

                  <!-- Products List -->
                  <div v-else class="space-y-2 max-h-60 overflow-y-auto">
                    <div v-for="product in promotionsStore.formattedProducts" :key="product.id" 
                         class="flex items-center gap-3 p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input 
                        type="checkbox" 
                        :id="product.id"
                        v-model="formData.productIds"
                        :value="product.id"
                        class="w-4 h-4"
                      />
                      <img :src="product.image" :alt="product.name" class="w-10 h-10 rounded object-cover" />
                      <div class="flex-1">
                        <div class="text-sm font-medium text-[#020721]">{{ product.name }}</div>
                        <div class="text-xs text-muted-foreground">₦{{ product.price.toLocaleString() }}</div>
                        <div class="text-xs text-muted-foreground">{{ product.sku }}</div>
                      </div>
                      <div class="text-xs text-muted-foreground">{{ product.size }}</div>
                    </div>
                    
                    <!-- No Products Message -->
                    <div v-if="promotionsStore.formattedProducts.length === 0" class="text-center py-4 text-sm text-gray-500">
                      No products found
                    </div>
                  </div>
                  
                  <p v-if="formData.appliesTo === 'selected_products' && formData.productIds.length === 0" class="text-xs text-red-500 mt-2">
                    Please select at least one product
                  </p>
                  
                  <p v-else-if="formData.productIds.length > 0" class="text-xs text-green-500 mt-2">
                    {{ formData.productIds.length }} product(s) selected
                  </p>
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
                  :disabled="promotionsStore.loading"
                  class="flex items-center gap-2 px-6 py-2 bg-[#5B68DF] text-white rounded-lg text-sm font-medium hover:bg-[#4a56cc] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="promotionsStore.loading && currentStep === 3">{{ isEditMode ? 'Updating...' : 'Creating...' }}</span>
                  <span v-else>{{ currentStep === 3 ? (isEditMode ? 'Update Promotion' : 'Create Promotion') : 'Next' }}</span>
                  <Icon v-if="!promotionsStore.loading" icon="radix-icons:chevron-right" />
                </button>
              </div>
            </SheetContent>
          </Sheet>

          <!-- View Promotion Sheet -->
          <Sheet v-model:open="viewSheetOpen">
            <SheetContent length="mid_low" class="flex flex-col space-y-0 overflow-y-scroll">
              <SheetHeader class="flex flex-col items-start px-4">
                <SheetDescription class="text-xs text-muted-foreground">
                  {{ selectedPromotion?.status || 'Draft' }}
                </SheetDescription>
                <h3 class="text-2xl font-medium text-[#020721]">
                  {{ selectedPromotion?.name }}
                </h3>
                <p class="text-sm text-muted-foreground">
                  {{ selectedPromotion?.createdAt ? new Date(selectedPromotion.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '' }}
                </p>
              </SheetHeader>

              <div v-if="selectedPromotion" class="px-4 space-y-6">
                <!-- Details Section -->
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <h4 class="text-sm font-semibold text-[#020721]">Details</h4>
                    <button 
                      @click="editPromotion"
                      class="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                    >
                      <Icon icon="mdi:pencil" class="w-4 h-4" />
                      Edit
                    </button>
                  </div>

                  <!-- Promotion Info Grid -->
                  <div class="space-y-3">
                    <div>
                      <p class="text-xs text-[#8B8D97] mb-1">Name</p>
                      <p class="text-sm font-medium text-[#020721]">{{ selectedPromotion.name }}</p>
                    </div>

                    <div>
                      <p class="text-xs text-[#8B8D97] mb-1">Description</p>
                      <p class="text-sm text-[#020721]">{{ selectedPromotion.description || 'No description' }}</p>
                    </div>

                    <div>
                      <p class="text-xs text-[#8B8D97] mb-1">Promotion Type</p>
                      <p class="text-sm font-medium text-[#020721]">{{ promotionsStore.formatPromotionType(selectedPromotion.promotionType) }}</p>
                    </div>

                    <div>
                      <p class="text-xs text-[#8B8D97] mb-1">Promo Code</p>
                      <p class="text-sm font-medium text-[#020721]">{{ selectedPromotion.promoCode || 'N/A' }}</p>
                    </div>

                    <div>
                      <p class="text-xs text-[#8B8D97] mb-1">Discount Value</p>
                      <p class="text-sm font-medium text-[#020721]">{{ promotionsStore.formatDiscountValue(selectedPromotion) }}</p>
                    </div>

                    <div>
                      <p class="text-xs text-[#8B8D97] mb-1">Applies To</p>
                      <p class="text-sm font-medium text-[#020721]">{{ promotionsStore.formatAppliesTo(selectedPromotion) }}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <p class="text-xs text-[#8B8D97] mb-1">Start Date</p>
                        <p class="text-sm font-medium text-[#020721]">{{ formatDate(selectedPromotion.startDate) }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-[#8B8D97] mb-1">End Date</p>
                        <p class="text-sm font-medium text-[#020721]">{{ formatDate(selectedPromotion.endDate) }}</p>
                      </div>
                    </div>

                    <div>
                      <p class="text-xs text-[#8B8D97] mb-1">Usage Count</p>
                      <p class="text-sm font-medium text-[#020721]">{{ promotionsStore.formatUsageCount(selectedPromotion) }}</p>
                    </div>

                    <div v-if="selectedPromotion.minimumPurchaseAmount">
                      <p class="text-xs text-[#8B8D97] mb-1">Minimum Purchase</p>
                      <p class="text-sm font-medium text-[#020721]">₦{{ selectedPromotion.minimumPurchaseAmount.toLocaleString() }}</p>
                    </div>

                    <div v-if="selectedPromotion.maximumDiscountCap">
                      <p class="text-xs text-[#8B8D97] mb-1">Maximum Discount Cap</p>
                      <p class="text-sm font-medium text-[#020721]">₦{{ selectedPromotion.maximumDiscountCap.toLocaleString() }}</p>
                    </div>

                    <!-- Selected Products -->
                    <div v-if="selectedPromotion.appliesTo === 'selected_products' && selectedPromotion.productIds?.length">
                      <p class="text-xs text-[#8B8D97] mb-1">Selected Products</p>
                      <div class="space-y-1">
                        <p v-for="productId in selectedPromotion.productIds" :key="productId" class="text-sm text-[#020721]">
                          {{ productId }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-2 pb-4">
                  <button 
                    v-if="selectedPromotion.status === 'draft'"
                    @click="publishSelectedPromotion"
                    class="flex-1 px-4 py-2 bg-[#00C37F] text-white rounded-lg text-sm hover:bg-[#00C37F]/90"
                  >
                    Publish
                  </button>
                  <button 
                    @click="deleteSelectedPromotion"
                    class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="promotionsStore.loading && promotionsStore.promotions.length === 0" class="flex items-center justify-center py-10">
        <Icon icon="eos-icons:loading" class="w-8 h-8 text-[#020721]" />
      </div>

      <!-- Table -->
      <div v-else class="overflow-auto bg-white rounded-lg">
        <Table class="lg:w-full w-[800px]">
          <TableHeader>
            <TableRow class="text-xs sm:text-sm text-[#8B8D97] font-medium border-b border-gray-200">
              <TableHead class="font-medium cursor-pointer hover:bg-gray-50" @click="sortBy('name')">
                <div class="flex items-center gap-1">
                  Promotion Name
                  <Icon icon="fluent:chevron-up-down-20-regular" class="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead class="font-medium">Type</TableHead>
              <TableHead class="font-medium">Discount Value</TableHead>
              <TableHead class="font-medium">Applies To</TableHead>
              <TableHead class="font-medium cursor-pointer hover:bg-gray-50" @click="sortBy('startDate')">
                <div class="flex items-center gap-1">
                  Start Date
                  <Icon icon="fluent:chevron-up-down-20-regular" class="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead class="font-medium">End Date</TableHead>
              <TableHead class="font-medium">Usage Count</TableHead>
              <TableHead class="font-medium">Status</TableHead>
              <TableHead class="font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="promo in promotionsStore.promotions" :key="promo._id" class="border-b border-gray-100 hover:bg-gray-50">
              <TableCell class="text-sm font-medium text-[#020721]">{{ promo.name }}</TableCell>
              <TableCell class="text-sm text-[#8B8D97]">{{ promotionsStore.formatPromotionType(promo.promotionType) }}</TableCell>
              <TableCell class="text-sm font-medium text-[#020721]">{{ promotionsStore.formatDiscountValue(promo) }}</TableCell>
              <TableCell class="text-sm text-[#8B8D97]">{{ promotionsStore.formatAppliesTo(promo) }}</TableCell>
              <TableCell class="text-sm text-[#8B8D97]">{{ formatDate(promo.startDate) }}</TableCell>
              <TableCell class="text-sm text-[#8B8D97]">{{ formatDate(promo.endDate) }}</TableCell>
              <TableCell class="text-sm text-[#8B8D97]">{{ promotionsStore.formatUsageCount(promo) }}</TableCell>
              <TableCell>
                <div
                  :class="statusBg(promo.status)"
                  class="rounded-full w-fit px-3 py-1 text-white text-xs font-medium capitalize"
                >
                  {{ promo.status }}
                </div>
              </TableCell>
              <TableCell>
                <!-- Actions Dropdown Menu -->
                <div class="relative">
                  <button 
                    @click.stop="showActionsMenu = showActionsMenu === promo._id ? null : promo._id"
                    class="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    <Icon icon="heroicons:ellipsis-vertical" class="w-5 h-5" />
                  </button>
                  
                  <div 
                    v-if="showActionsMenu === promo._id"
                    class="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                    @click.stop
                  >
                    <div class="py-1">
                      <button 
                        @click="viewPromotionDetails(promo._id)"
                        class="w-full text-left px-4 py-2 text-sm text-[#020721] hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Icon icon="heroicons:eye" class="w-4 h-4" />
                        View Details
                      </button>
                      <button 
                        @click="editPromotionFromTable(promo._id)"
                        class="w-full text-left px-4 py-2 text-sm text-[#020721] hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Icon icon="heroicons:pencil-square" class="w-4 h-4" />
                        Edit
                      </button>
                      <button 
                        v-if="promo.status === 'draft'"
                        @click="publishPromotion(promo._id)"
                        class="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Icon icon="heroicons:check-circle" class="w-4 h-4" />
                        Publish
                      </button>
                      <button 
                        @click="deletePromotion(promo._id)"
                        class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Icon icon="heroicons:trash" class="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Pagination -->
      <div v-if="promotionsStore.pagination.totalPages > 1" class="flex gap-2 max-w-full flex-wrap justify-end mt-8 mr-4 items-center text-[15px]">
        <Button 
          variant="secondary" 
          @click="changePage(promotionsStore.pagination.currentPage - 1)"
          :disabled="promotionsStore.pagination.currentPage === 1"
        > 
          <Icon icon="radix-icons:chevron-left" /> 
        </Button>
        <Button 
          v-for="page in visiblePages" 
          :key="page"
          :variant="page === promotionsStore.pagination.currentPage ? 'secondary' : 'outline'"
          :class="page === promotionsStore.pagination.currentPage ? 'bg-[#020721] text-gray-400' : ''"
          @click="changePage(page)"
        > 
          {{ page === '...' ? '&#8230;' : page }}
        </Button>
        <Button 
          variant="outline" 
          @click="changePage(promotionsStore.pagination.currentPage + 1)"
          :disabled="promotionsStore.pagination.currentPage === promotionsStore.pagination.totalPages"
        > 
          <Icon icon="radix-icons:chevron-right" /> 
        </Button>
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
import { ref, computed, onMounted, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import Search from '@/components/UseSearch.vue'
import VendorNav from '@/components/VendorNav.vue'
import { Archive, CalendarDays, Check, ScrollText } from 'lucide-vue-next'
import DashboardFooter from '@/components/DashboardFooter.vue'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet"
import { usePromotionsStore } from '@/stores/vendor-store/vendor-promotion'
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import { useToast } from '@/components/ui/toast'
import { debounce } from 'lodash'

const promotionsStore = usePromotionsStore()
const superAdminStore = useSuperAdminStore()
const { toast } = useToast()

// Get vendorId from superadmin store
const vendorId = computed(() => superAdminStore.vendorId)

// UI State
const sheetOpen = ref(false)
const viewSheetOpen = ref(false)
const currentStep = ref(1)
const isEditMode = ref(false)
const showActionsMenu = ref<string | null>(null)
const searchQuery = ref('')
const promotionStatus = ref<'active' | 'scheduled' | 'draft'>('draft')
const productSearch = ref('')

// Selected promotion for viewing/editing
const selectedPromotion = ref<any>(null)

// Form data
const formData = ref({
  name: '',
  description: '',
  promotionType: '' as '' | 'percentage_off' | 'fixed_amount_off' | 'bogo',
  promoCode: '',
  startDate: '',
  endDate: '',
  discountValue: '',
  minPurchaseAmount: '',
  maxDiscountCap: '',
  totalUsageLimit: '',
  limitPerCustomer: '',
  appliesTo: 'all_products' as 'all_products' | 'selected_products',
  productIds: [] as string[]
})

// Debounced search for products
const debouncedSearchProducts = debounce(async () => {
  if (currentStep.value === 3 && formData.value.appliesTo === 'selected_products') {
    await promotionsStore.fetchVendorProducts(productSearch.value)
  }
}, 500)

// Watch current step to fetch products when needed
watch(() => currentStep.value, async (newStep) => {
  if (newStep === 3 && formData.value.appliesTo === 'selected_products' && vendorId.value) {
    await fetchProducts()
  }
})

// Watch appliesTo to fetch products when changed
watch(() => formData.value.appliesTo, async (newValue) => {
  if (newValue === 'selected_products' && currentStep.value === 3 && vendorId.value) {
    await fetchProducts()
  }
})

// Fetch products from vendor
const fetchProducts = async () => {
  if (vendorId.value) {
    await promotionsStore.fetchVendorProducts(productSearch.value)
  }
}

// Open create promotion sheet
const openCreateSheet = () => {
  isEditMode.value = false
  resetForm()
  sheetOpen.value = true
}

// Handle next button click
const handleNext = async () => {
  if (currentStep.value < 3) {
    currentStep.value++
  } else {
    if (isEditMode.value && selectedPromotion.value) {
      await updatePromotion()
    } else {
      await createPromotion()
    }
  }
}

// Create promotion
const createPromotion = async () => {
  // Validate required fields
  if (!formData.value.name || !formData.value.promotionType || !formData.value.discountValue) {
    toast({
      description: 'Please fill all required fields',
      variant: 'destructive'
    })
    return
  }

  // Validate selected products if applies to selected products
  if (formData.value.appliesTo === 'selected_products' && formData.value.productIds.length === 0) {
    toast({
      description: 'Please select at least one product',
      variant: 'destructive'
    })
    return
  }

  const promotionData: any = {
    name: formData.value.name,
    promotionType: formData.value.promotionType,
    discountValue: Number(formData.value.discountValue),
    appliesTo: formData.value.appliesTo,
    startDate: formData.value.startDate,
    endDate: formData.value.endDate,
    status: promotionStatus.value
  }

  // Add optional fields only if they have values
  if (formData.value.description) {
    promotionData.description = formData.value.description
  }
  if (formData.value.promoCode) {
    promotionData.promoCode = formData.value.promoCode
  }
  if (formData.value.minPurchaseAmount) {
    promotionData.minimumPurchaseAmount = Number(formData.value.minPurchaseAmount)
  }
  if (formData.value.maxDiscountCap) {
    promotionData.maximumDiscountCap = Number(formData.value.maxDiscountCap)
  }
  if (formData.value.totalUsageLimit) {
    promotionData.totalUsageLimit = Number(formData.value.totalUsageLimit)
  }
  if (formData.value.limitPerCustomer) {
    promotionData.limitPerCustomer = Number(formData.value.limitPerCustomer)
  }
  if (formData.value.appliesTo === 'selected_products' && formData.value.productIds.length > 0) {
    promotionData.productIds = formData.value.productIds
  }

  const result = await promotionsStore.createPromotion(promotionData)
  
  if (result) {
    // Refresh promotions and counts after creation
    await refreshData()
    
    resetForm()
    sheetOpen.value = false
    
    toast({
      title: "Success!",
      description: "Promotion created successfully",
      variant: "default"
    })
  }
}

// Update promotion
const updatePromotion = async () => {
  if (!selectedPromotion.value) return

  // Validate required fields
  if (!formData.value.name || !formData.value.promotionType || !formData.value.discountValue) {
    toast({
      description: 'Please fill all required fields',
      variant: 'destructive'
    })
    return
  }

  const promotionData: any = {
    name: formData.value.name,
    promotionType: formData.value.promotionType,
    discountValue: Number(formData.value.discountValue),
    appliesTo: formData.value.appliesTo,
    startDate: formData.value.startDate,
    endDate: formData.value.endDate,
    status: promotionStatus.value
  }

  // Add optional fields
  if (formData.value.description) {
    promotionData.description = formData.value.description
  }
  if (formData.value.promoCode) {
    promotionData.promoCode = formData.value.promoCode
  }
  if (formData.value.minPurchaseAmount) {
    promotionData.minimumPurchaseAmount = Number(formData.value.minPurchaseAmount)
  }
  if (formData.value.maxDiscountCap) {
    promotionData.maximumDiscountCap = Number(formData.value.maxDiscountCap)
  }
  if (formData.value.totalUsageLimit) {
    promotionData.totalUsageLimit = Number(formData.value.totalUsageLimit)
  }
  if (formData.value.limitPerCustomer) {
    promotionData.limitPerCustomer = Number(formData.value.limitPerCustomer)
  }

  // Only include productIds if appliesTo is selected_products
  if (formData.value.appliesTo === 'selected_products') {
    promotionData.productIds = formData.value.productIds
  } else {
    promotionData.productIds = []
  }

  const result = await promotionsStore.updatePromotion(selectedPromotion.value._id, promotionData)
  
  if (result) {
    await refreshData()
    
    resetForm()
    sheetOpen.value = false
    viewSheetOpen.value = false
    
    toast({
      title: "Success!",
      description: "Promotion updated successfully",
      variant: "default"
    })
  }
}

// View promotion details
const viewPromotionDetails = async (id: string) => {
  const promotion = await promotionsStore.fetchPromotionById(id)
  if (promotion) {
    selectedPromotion.value = promotion
    viewSheetOpen.value = true
    showActionsMenu.value = null
  }
}

// Edit promotion from view sheet
const editPromotion = () => {
  if (!selectedPromotion.value) return
  
  isEditMode.value = true
  currentStep.value = 1
  
  // Populate form with promotion data
  formData.value = {
    name: selectedPromotion.value.name,
    description: selectedPromotion.value.description || '',
    promotionType: selectedPromotion.value.promotionType,
    promoCode: selectedPromotion.value.promoCode || '',
    startDate: selectedPromotion.value.startDate.split('T')[0],
    endDate: selectedPromotion.value.endDate.split('T')[0],
    discountValue: selectedPromotion.value.discountValue.toString(),
    minPurchaseAmount: selectedPromotion.value.minimumPurchaseAmount?.toString() || '',
    maxDiscountCap: selectedPromotion.value.maximumDiscountCap?.toString() || '',
    totalUsageLimit: selectedPromotion.value.totalUsageLimit?.toString() || '',
    limitPerCustomer: selectedPromotion.value.limitPerCustomer?.toString() || '',
    appliesTo: selectedPromotion.value.appliesTo,
    productIds: selectedPromotion.value.productIds || []
  }
  
  promotionStatus.value = selectedPromotion.value.status as any
  
  viewSheetOpen.value = false
  sheetOpen.value = true
  
  // Fetch products if editing selected products
  if (formData.value.appliesTo === 'selected_products') {
    fetchProducts()
  }
}

// Edit promotion from table
const editPromotionFromTable = async (id: string) => {
  const promotion = await promotionsStore.fetchPromotionById(id)
  if (promotion) {
    selectedPromotion.value = promotion
    editPromotion()
  }
}

// Publish promotion from view sheet
const publishSelectedPromotion = async () => {
  if (!selectedPromotion.value) return
  
  const result = await promotionsStore.publishPromotion(selectedPromotion.value._id)
  if (result) {
    viewSheetOpen.value = false
    await refreshData()
    
    toast({
      title: "Success!",
      description: "Promotion published successfully",
      variant: "default"
    })
  }
}

// Publish promotion from table
const publishPromotion = async (id: string) => {
  const result = await promotionsStore.publishPromotion(id)
  if (result) {
    showActionsMenu.value = null
    await refreshData()
    
    toast({
      title: "Success!",
      description: "Promotion published successfully",
      variant: "default"
    })
  }
}

// Delete promotion from view sheet
const deleteSelectedPromotion = async () => {
  if (!selectedPromotion.value) return
  
  if (confirm('Are you sure you want to delete this promotion?')) {
    const result = await promotionsStore.deletePromotion(selectedPromotion.value._id)
    if (result) {
      viewSheetOpen.value = false
      await refreshData()
      
      toast({
        title: "Success!",
        description: "Promotion deleted successfully",
        variant: "default"
      })
    }
  }
}

// Delete promotion from table
const deletePromotion = async (id: string) => {
  if (confirm('Are you sure you want to delete this promotion?')) {
    const result = await promotionsStore.deletePromotion(id)
    if (result) {
      showActionsMenu.value = null
      await refreshData()
      
      toast({
        title: "Success!",
        description: "Promotion deleted successfully",
        variant: "default"
      })
    }
  }
}

// Refresh data
const refreshData = async () => {
  if (vendorId.value) {
    await promotionsStore.fetchPromotions({ vendorId: vendorId.value })
    await promotionsStore.fetchPromotionStatusCounts(vendorId.value)
  }
}

// Reset form
const resetForm = () => {
  currentStep.value = 1
  promotionStatus.value = 'draft'
  isEditMode.value = false
  selectedPromotion.value = null
  productSearch.value = ''
  formData.value = {
    name: '',
    description: '',
    promotionType: '',
    promoCode: '',
    startDate: '',
    endDate: '',
    discountValue: '',
    minPurchaseAmount: '',
    maxDiscountCap: '',
    totalUsageLimit: '',
    limitPerCustomer: '',
    appliesTo: 'all_products',
    productIds: []
  }
}

// Format date
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

// Handle search
const handleSearch = (query: string) => {
  searchQuery.value = query
  promotionsStore.fetchPromotions({ 
    vendorId: vendorId.value,
    search: query 
  })
}

// Sort by field
const sortBy = (field: string) => {
  promotionsStore.fetchPromotions({ 
    vendorId: vendorId.value,
    sortBy: field 
  })
}

// Change page
const changePage = (page: number | string) => {
  if (typeof page === 'number' && page >= 1 && page <= promotionsStore.pagination.totalPages) {
    promotionsStore.fetchPromotions({ 
      vendorId: vendorId.value,
      page 
    })
  }
}

// Computed visible pages for pagination
const visiblePages = computed(() => {
  const current = promotionsStore.pagination.currentPage
  const total = promotionsStore.pagination.totalPages
  const pages: (number | string)[] = []

  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    
    if (current > 3) {
      pages.push('...')
    }
    
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i)
    }
    
    if (current < total - 2) {
      pages.push('...')
    }
    
    pages.push(total)
  }

  return pages
})

// Status background color
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
      return 'bg-gray-400'
  }
}

// Fetch promotions and counts on mount
onMounted(async () => {
  if (vendorId.value) {
    await refreshData()
  }
})
</script>