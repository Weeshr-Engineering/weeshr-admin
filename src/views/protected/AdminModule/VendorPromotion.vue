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
              <span>{{ promotionsStore.scheduledCount }}</span>
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
              <span>{{ promotionsStore.draftCount }}</span>
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
              <span>{{ promotionsStore.expiredCount }}</span>
            </p>
          </CardContent>
        </div>
      </Card>
    </div>

    <!-- Main Content Card -->
    <Card class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-14 mb-4">
      <div class="flex flex-col sm:flex-row items-center justify-between py-4">
        <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-2 sm:mb-0">
          History
          <p class="text-xs sm:text-sm font-normal text-[#02072199]">
            Details of all promotions ({{ promotionsStore.promotions.length }} found)
          </p>
        </div>
        <div class="flex items-center flex-col md:flex-row gap-4">
          <Search class="mt-3 lg:mt-0" @search="handleSearch" :value="searchQuery" />
          
          <!-- Create Promotion Button -->
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
                  {{ isEditMode ? 'Editing' : 'Draft' }}
                </SheetDescription>
                <h3 class="text-2xl font-medium text-[#020721]">
                  {{ isEditMode ? 'Edit Promotion' : 'New Promotion' }}
                </h3>
                <p class="text-sm text-muted-foreground">
                  {{ isEditMode ? 'Last Updated' : 'Created Date' }}
                </p>
                <p class="text-sm font-medium text-[#020721]">
                  {{ new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) }}
                </p>
              </SheetHeader>

              <!-- Promotion Creation Tabs -->
              <div class="px-4 py-4">
                <div class="text-sm font-medium text-[#020721] mb-3">Promotion Status</div>
                <div class="flex gap-2">
                  <button 
                    @click="formData.status = 'scheduled'"
                    :class="formData.status === 'scheduled' ? 'bg-[#020721] text-white' : 'bg-white text-[#02072199]'"
                    class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200"
                  >
                    Schedule
                  </button>
                  <button 
                    @click="formData.status = 'draft'"
                    :class="formData.status === 'draft' ? 'bg-[#020721] text-white' : 'bg-white text-[#02072199]'"
                    class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200"
                  >
                    Draft
                  </button>
                  <button 
                    @click="formData.status = 'active'"
                    :class="formData.status === 'active' ? 'bg-[#020721] text-white' : 'bg-white text-[#02072199]'"
                    class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200"
                  >
                    Active
                  </button>
                </div>
              </div>

              <!-- Step Indicator -->
              <div class="px-4 flex items-center justify-between mb-4">
                <div :class="currentStep === 1 ? 'text-[#020721] font-semibold' : 'text-[#02072199]'" class="text-sm">
                  {{ currentStep === 1 ? 'Promotion Details' : currentStep === 2 ? 'Discount Configuration' : currentStep === 3 ? 'Target Products or Categories' : 'Review & Confirm' }}
                </div>
                <div class="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                  Step {{ currentStep }} of 4
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
                      placeholder="Enter promotion description (max 90 characters)"
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
                    min="0"
                    :placeholder="formData.promotionType === 'percentage_off' ? '20' : '5000'"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
                  />
                  <p class="text-xs text-[#8B8D97] mt-1">
                    {{ formData.promotionType === 'percentage_off' ? 'Enter percentage (e.g., 20 for 20%)' : 'Enter amount in Naira' }}
                  </p>
                </div>

                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">Minimum Purchase Amount (₦)</label>
                  <input 
                    v-model="formData.minPurchaseAmount"
                    type="number" 
                    min="0"
                    placeholder="5000"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
                  />
                </div>

                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">Maximum Discount Cap (₦)</label>
                  <input 
                    v-model="formData.maxDiscountCap"
                    type="number" 
                    min="0"
                    placeholder="2000"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
                  />
                </div>

                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">Total Usage Limit</label>
                  <input 
                    v-model="formData.totalUsageLimit"
                    type="number" 
                    min="0"
                    placeholder="500"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
                  />
                </div>

                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">Limit Per Customer</label>
                  <input 
                    v-model="formData.limitPerCustomer"
                    type="number" 
                    min="0"
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
                  
                  <div class="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    <div 
                      v-for="product in eligibleProducts" 
                      :key="product._id" 
                      class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                    >
                      <input 
                        type="checkbox" 
                        :id="product._id"
                        v-model="formData.productIds"
                        :value="product._id"
                        class="w-4 h-4"
                      />
                      <img 
                        v-if="product.image" 
                        :src="product.image" 
                        :alt="product.name" 
                        class="w-10 h-10 rounded object-cover" 
                      />
                      <div v-else class="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                        <Icon icon="mdi:package-variant" class="w-6 h-6 text-gray-400" />
                      </div>
                      <div class="flex-1">
                        <div class="text-sm font-medium text-[#020721]">{{ product.name }}</div>
                        <div class="text-xs text-muted-foreground">₦{{ (product.amount || 0).toLocaleString() }}</div>
                      </div>
                      <div class="text-xs text-muted-foreground">{{ product.size || 'N/A' }}</div>
                    </div>
                  </div>
                  <p class="text-xs text-[#8B8D97] mt-2">
                    {{ formData.productIds.length }} product(s) selected
                  </p>
                </div>
              </div>

              <!-- Step 4: Review & Confirm -->
              <div v-if="currentStep === 4" class="px-4 space-y-6 overflow-y-auto max-h-[calc(100vh-300px)]">
                <div class="bg-[#F0F8FF] border border-[#3A8EE5] rounded-lg p-4 mb-4">
                  <p class="text-sm text-[#020721] font-medium">
                    <Icon icon="mdi:information-outline" class="inline w-4 h-4 mr-2" />
                    Review all details before {{ isEditMode ? 'updating' : 'creating' }} the promotion
                  </p>
                </div>

                <!-- Promotion Status -->
                <div>
                  <p class="text-xs text-[#8B8D97] mb-2 font-semibold uppercase">Promotion Status</p>
                  <div class="px-3 py-2 bg-gray-50 rounded-lg">
                    <p class="text-sm font-medium text-[#020721] capitalize">{{ formData.status }}</p>
                  </div>
                </div>

                <!-- Details Section -->
                <div>
                  <p class="text-xs text-[#8B8D97] mb-3 font-semibold uppercase">Promotion Details</p>
                  <div class="space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-xs text-[#8B8D97] mb-1">Name</p>
                        <p class="text-sm font-medium text-[#020721]">{{ formData.name }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-[#8B8D97] mb-1">Type</p>
                        <p class="text-sm font-medium text-[#020721]">{{ promotionsStore.formatPromotionType(formData.promotionType) }}</p>
                      </div>
                    </div>

                    <div v-if="formData.description">
                      <p class="text-xs text-[#8B8D97] mb-1">Description</p>
                      <p class="text-sm text-[#020721]">{{ formData.description }}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-xs text-[#8B8D97] mb-1">Start Date</p>
                        <p class="text-sm font-medium text-[#020721]">{{ formatDate(formData.startDate) }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-[#8B8D97] mb-1">End Date</p>
                        <p class="text-sm font-medium text-[#020721]">{{ formatDate(formData.endDate) }}</p>
                      </div>
                    </div>

                    <div v-if="formData.promoCode">
                      <p class="text-xs text-[#8B8D97] mb-1">Promo Code</p>
                      <p class="text-sm font-medium text-[#020721]">{{ formData.promoCode }}</p>
                    </div>
                  </div>
                </div>

                <!-- Discount Configuration -->
                <div>
                  <p class="text-xs text-[#8B8D97] mb-3 font-semibold uppercase">Discount Configuration</p>
                  <div class="space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-xs text-[#8B8D97] mb-1">Discount Value</p>
                        <p class="text-sm font-medium text-[#020721]">
                          {{ formData.promotionType === 'percentage_off' ? formData.discountValue + '%' : '₦' + Number(formData.discountValue).toLocaleString() }}
                        </p>
                      </div>
                      <div v-if="formData.minPurchaseAmount">
                        <p class="text-xs text-[#8B8D97] mb-1">Minimum Purchase</p>
                        <p class="text-sm font-medium text-[#020721]">₦{{ Number(formData.minPurchaseAmount).toLocaleString() }}</p>
                      </div>
                    </div>

                    <div v-if="formData.maxDiscountCap">
                      <p class="text-xs text-[#8B8D97] mb-1">Maximum Discount Cap</p>
                      <p class="text-sm font-medium text-[#020721]">₦{{ Number(formData.maxDiscountCap).toLocaleString() }}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div v-if="formData.totalUsageLimit">
                        <p class="text-xs text-[#8B8D97] mb-1">Total Usage Limit</p>
                        <p class="text-sm font-medium text-[#020721]">{{ formData.totalUsageLimit }}</p>
                      </div>
                      <div v-if="formData.limitPerCustomer">
                        <p class="text-xs text-[#8B8D97] mb-1">Limit Per Customer</p>
                        <p class="text-sm font-medium text-[#020721]">{{ formData.limitPerCustomer }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Products/Categories -->
                <div>
                  <p class="text-xs text-[#8B8D97] mb-3 font-semibold uppercase">Applies To</p>
                  <div class="space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div>
                      <p class="text-xs text-[#8B8D97] mb-1">Application Scope</p>
                      <p class="text-sm font-medium text-[#020721] capitalize">
                        {{ formData.appliesTo === 'all_products' ? 'All Products' : 'Selected Products' }}
                      </p>
                    </div>

                    <div v-if="formData.appliesTo === 'selected_products' && formData.productIds.length > 0">
                      <p class="text-xs text-[#8B8D97] mb-2">Selected Products ({{ formData.productIds.length }})</p>
                      <div class="space-y-2 max-h-40 overflow-y-auto">
                        <div 
                          v-for="productId in formData.productIds" 
                          :key="productId"
                          class="flex items-center gap-2 p-2 bg-white rounded border border-gray-200"
                        >
                          <div class="flex-1">
                            <p class="text-sm text-[#020721] font-medium">
                              {{ eligibleProducts.find(p => p._id === productId)?.name || productId }}
                            </p>
                          </div>
                          <span class="text-xs text-[#8B8D97]">
                            ₦{{ (eligibleProducts.find(p => p._id === productId)?.amount || 0).toLocaleString() }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="px-4 py-4 mt-auto flex items-center justify-between border-t">
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
                  <span v-if="promotionsStore.loading && currentStep === 4">
                    {{ isEditMode ? 'Updating...' : 'Creating...' }}
                  </span>
                  <span v-else>{{ currentStep === 4 ? (isEditMode ? 'Update Promotion' : 'Create Promotion') : 'Next' }}</span>
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
                  {{ selectedPromotion?.createdAt ? formatDate(selectedPromotion.createdAt) : '' }}
                </p>
              </SheetHeader>

              <div v-if="selectedPromotion" class="px-4 space-y-6">
                <!-- Details Section -->
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <h4 class="text-sm font-semibold text-[#020721]">Details</h4>
                    <div class="flex gap-2">
                      <button 
                        v-if="selectedPromotion.status === 'draft'"
                        @click="publishSelectedPromotion"
                        class="flex items-center gap-2 px-3 py-1.5 bg-[#00C37F] text-white rounded-lg text-sm hover:bg-[#00b070]"
                      >
                        <Icon icon="mdi:publish" class="w-4 h-4" />
                        Publish
                      </button>
                      <button 
                        @click="editPromotion"
                        class="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                      >
                        <Icon icon="mdi:pencil" class="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                  </div>

                  <!-- Promotion Info Grid -->
                  <div class="space-y-3">
                    <div>
                      <p class="text-xs text-[#8B8D97] mb-1">Name</p>
                      <p class="text-sm font-medium text-[#020721]">{{ selectedPromotion.name }}</p>
                    </div>

                    <div v-if="selectedPromotion.description">
                      <p class="text-xs text-[#8B8D97] mb-1">Description</p>
                      <p class="text-sm text-[#020721]">{{ selectedPromotion.description }}</p>
                    </div>

                    <div>
                      <p class="text-xs text-[#8B8D97] mb-1">Promotion Type</p>
                      <p class="text-sm font-medium text-[#020721]">{{ promotionsStore.formatPromotionType(selectedPromotion.promotionType) }}</p>
                    </div>

                    <div>
                      <p class="text-xs text-[#8B8D97] mb-1">Discount Value</p>
                      <p class="text-sm font-medium text-[#020721]">{{ promotionsStore.formatDiscountValue(selectedPromotion) }}</p>
                    </div>

                    <div v-if="selectedPromotion.promoCode">
                      <p class="text-xs text-[#8B8D97] mb-1">Promo Code</p>
                      <p class="text-sm font-medium text-[#020721]">{{ selectedPromotion.promoCode }}</p>
                    </div>

                    <div>
                      <p class="text-xs text-[#8B8D97] mb-1">Applies To</p>
                      <p class="text-sm font-medium text-[#020721]">{{ promotionsStore.formatAppliesTo(selectedPromotion) }}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-xs text-[#8B8D97] mb-1">Start Date</p>
                        <p class="text-sm font-medium text-[#020721]">{{ formatDate(selectedPromotion.startDate) }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-[#8B8D97] mb-1">End Date</p>
                        <p class="text-sm font-medium text-[#020721]">{{ formatDate(selectedPromotion.endDate) }}</p>
                      </div>
                    </div>

                    <div v-if="selectedPromotion.minimumPurchaseAmount">
                      <p class="text-xs text-[#8B8D97] mb-1">Minimum Purchase</p>
                      <p class="text-sm font-medium text-[#020721]">₦{{ selectedPromotion.minimumPurchaseAmount.toLocaleString() }}</p>
                    </div>

                    <div v-if="selectedPromotion.maximumDiscountCap">
                      <p class="text-xs text-[#8B8D97] mb-1">Maximum Discount Cap</p>
                      <p class="text-sm font-medium text-[#020721]">₦{{ selectedPromotion.maximumDiscountCap.toLocaleString() }}</p>
                    </div>

                    <div>
                      <p class="text-xs text-[#8B8D97] mb-1">Usage Count</p>
                      <p class="text-sm font-medium text-[#020721]">{{ promotionsStore.formatUsageCount(selectedPromotion) }}</p>
                    </div>

                    <div v-if="selectedPromotion.limitPerCustomer">
                      <p class="text-xs text-[#8B8D97] mb-1">Limit Per Customer</p>
                      <p class="text-sm font-medium text-[#020721]">{{ selectedPromotion.limitPerCustomer }}</p>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-2 pb-4">
                  <button 
                    @click="openDeleteModal(selectedPromotion)"
                    class="flex-1 px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50"
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

      <!-- Empty State -->
      <div v-else-if="!promotionsStore.loading && promotionsStore.promotions.length === 0" class="flex flex-col items-center justify-center py-10">
        <Icon icon="mdi:tag-off-outline" class="w-16 h-16 text-gray-300 mb-4" />
        <p class="text-gray-500 text-sm">No promotions found</p>
        <button 
          @click="openCreateSheet"
          class="mt-4 px-4 py-2 bg-[#020721] text-white rounded-lg text-sm hover:bg-[#020721]/90"
        >
          Create Your First Promotion
        </button>
      </div>

      <!-- Table -->
      <div v-else class="overflow-auto bg-white rounded-lg">
        <Table class="lg:w-full w-[800px]">
          <TableHeader>
            <TableRow class="text-xs sm:text-sm text-[#8B8D97] font-medium border-b border-gray-200">
              <TableHead class="font-medium cursor-pointer hover:bg-gray-50" @click="sortBy('name')">
                <div class="flex items-center gap-1">
                  Name
                  <Icon icon="fluent:chevron-up-down-20-regular" class="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead class="font-medium">Type</TableHead>
              <TableHead class="font-medium">Discount</TableHead>
              <TableHead class="font-medium">Applies To</TableHead>
              <TableHead class="font-medium cursor-pointer hover:bg-gray-50" @click="sortBy('startDate')">
                <div class="flex items-center gap-1">
                  Start Date
                  <Icon icon="fluent:chevron-up-down-20-regular" class="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead class="font-medium">End Date</TableHead>
              <TableHead class="font-medium">Usage</TableHead>
              <TableHead class="font-medium">Status</TableHead>
              <TableHead class="font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow 
              v-for="promo in promotionsStore.promotions" 
              :key="promo._id" 
              class="border-b border-gray-100 hover:bg-gray-50"
            >
              <TableCell class="text-sm font-medium text-[#020721]">{{ promo.name || 'N/A' }}</TableCell>
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
                    title="Promotion Actions"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 10.8333C10.4602 10.8333 10.8333 10.4602 10.8333 10C10.8333 9.53976 10.4602 9.16667 10 9.16667C9.53976 9.16667 9.16667 9.53976 9.16667 10C9.16667 10.4602 9.53976 10.8333 10 10.8333Z"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M10 5C10.4602 5 10.8333 4.6269 10.8333 4.16667C10.8333 3.70643 10.4602 3.33333 10 3.33333C9.53976 3.33333 9.16667 3.70643 9.16667 4.16667C9.16667 4.6269 9.53976 5 10 5Z"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M10 16.6667C10.4602 16.6667 10.8333 16.2936 10.8333 15.8333C10.8333 15.3731 10.4602 15 10 15C9.53976 15 9.16667 15.3731 9.16667 15.8333C9.16667 16.2936 9.53976 16.6667 10 16.6667Z"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>

                  <!-- Actions Dropdown Menu -->
                  <Transition
                    enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95"
                    enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95"
                  >
                    <div 
                      v-if="showActionsMenu === promo._id"
                      @click.stop
                      class="absolute -top-16 right-0  mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
                    >
                      <button
                        @click="viewPromotionDetails(promo._id); showActionsMenu = null"
                        class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700 transition-colors"
                      >
                        <Icon icon="mdi:eye-outline" class="w-4 h-4" />
                        View
                      </button>
                      <button
                        @click="editPromotionFromList(promo); showActionsMenu = null"
                        class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700 transition-colors"
                      >
                        <Icon icon="mdi:pencil-outline" class="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        v-if="promo.status === 'draft'"
                        @click="publishPromotionFromList(promo); showActionsMenu = null"
                        class="w-full px-4 py-2 text-left hover:bg-green-50 flex items-center gap-2 text-sm text-green-600 transition-colors border-t border-gray-100"
                      >
                        <Icon icon="mdi:publish" class="w-4 h-4" />
                        Publish
                      </button>
                      <button
                        @click="openDeleteModal(promo)"
                        class="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-sm text-red-600 transition-colors border-t border-gray-100"
                      >
                        <Icon icon="mdi:delete-outline" class="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </Transition>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Pagination -->
      <!-- <div class="flex gap-2 max-w-full flex-wrap justify-end mt-8 mr-4 items-center text-[15px]">
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
        <a href="#"><p class="text-[blue]">See all</p></a>
      </div> -->
    </Card>
    <DashboardFooter />

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="deleteModalOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <Icon icon="mdi:alert-circle-outline" class="w-6 h-6 text-red-500" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the promotion "
            <span class="font-semibold text-[#020721]">{{ promotionToDelete?.name }}</span>"?
            This action cannot be undone and will permanently remove the promotion.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            @click="deleteModalOpen = false"
            class="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            @click="confirmDeletePromotion"
            :disabled="promotionsStore.loading"
            class="w-full sm:w-auto"
          >
            <Icon icon="mdi:delete" class="w-4 h-4 mr-2" />
            {{ promotionsStore.loading ? 'Deleting...' : 'Delete Promotion' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import VendorNav from '@/components/VendorNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import Search from '@/components/UseSearch.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { Check, Archive, CalendarDays, ScrollText } from 'lucide-vue-next'
import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { usePromotionsStore } from '@/stores/vendor-store/vendor-promotion'
import { useProductsStore } from '@/stores/vendor/product'
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import { useToast } from '@/components/ui/toast'
import type { Promotion } from '@/stores/vendor-store/vendor-promotion'


const promotionsStore = usePromotionsStore()
const productsStore = useProductsStore()
const superAdminStore = useSuperAdminStore()
const { toast } = useToast()

// Get vendorId from superadmin store
const vendorId = computed(() => superAdminStore.vendorId)

// Sheet states
const sheetOpen = ref(false)
const viewSheetOpen = ref(false)
const currentStep = ref(1)
const searchQuery = ref('')

// Edit mode
const isEditMode = ref(false)
const editingPromotionId = ref<string | null>(null)

// Delete modal state
const deleteModalOpen = ref(false)
const promotionToDelete = ref<Promotion | null>(null)

// Actions dropdown state
const showActionsMenu = ref<string | null>(null)

// Selected promotion for viewing
const selectedPromotion = ref<Promotion | null>(null)

// Eligible products (fetch from products store)
const eligibleProducts = ref<any[]>([])

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
  productIds: [] as string[],
  status: 'draft' as 'active' | 'scheduled' | 'draft' | 'expired'
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

// Open create sheet
const openCreateSheet = () => {
  isEditMode.value = false
  editingPromotionId.value = null
  resetForm()
  sheetOpen.value = true
}

// Handle next button click
const handleNext = async () => {
  // Validate step 1
  if (currentStep.value === 1) {
    if (!formData.value.name || !formData.value.promotionType) {
      toast({
        description: 'Please fill all required fields',
        variant: 'destructive'
      })
      return
    }
    currentStep.value++
    return
  }

  // Validate step 2
  if (currentStep.value === 2) {
    if (!formData.value.discountValue) {
      toast({
        description: 'Please enter discount value',
        variant: 'destructive'
      })
      return
    }
    currentStep.value++
    return
  }

  // Validate step 3
  if (currentStep.value === 3) {
    // Validate selected products if applies to selected products
    if (formData.value.appliesTo === 'selected_products' && formData.value.productIds.length === 0) {
      toast({
        description: 'Please select at least one product',
        variant: 'destructive'
      })
      return
    }
    // Move to step 4 (confirmation)
    currentStep.value++
    return
  }

  // Step 4 - Create or update promotion
  if (currentStep.value === 4) {
    if (isEditMode.value && editingPromotionId.value) {
      await updatePromotion()
    } else {
      await createPromotion()
    }
  }
}

// Create promotion
const createPromotion = async () => {
  const promotionData: any = {
    name: formData.value.name,
    promotionType: formData.value.promotionType,
    discountValue: Number(formData.value.discountValue),
    appliesTo: formData.value.appliesTo,
    startDate: formData.value.startDate,
    endDate: formData.value.endDate,
    status: formData.value.status
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

  // console.log('Creating promotion with data:', promotionData) // Debug

  try {
    const result = await promotionsStore.createPromotion(promotionData)
    
    // console.log('Promotion created:', result) // Debug
    
    if (result) {
      // Refresh promotions and counts after creation
      // console.log('Refreshing promotions list...') // Debug
      await promotionsStore.fetchPromotions({ vendorId: vendorId.value })
      await promotionsStore.fetchPromotionStatusCounts(vendorId.value)
      
      // console.log('Promotions after refresh:', promotionsStore.promotions) // Debug
      
      resetForm()
      sheetOpen.value = false
    }
  } catch (error) {
    console.error('Failed to create promotion:', error)
  }
}

// Update promotion
const updatePromotion = async () => {
  if (!editingPromotionId.value) return

  const promotionData: any = {
    name: formData.value.name,
    promotionType: formData.value.promotionType,
    discountValue: Number(formData.value.discountValue),
    appliesTo: formData.value.appliesTo,
    startDate: formData.value.startDate,
    endDate: formData.value.endDate,
    status: formData.value.status
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
  if (formData.value.appliesTo === 'selected_products' && formData.value.productIds.length > 0) {
    promotionData.productIds = formData.value.productIds
  }

  const result = await promotionsStore.updatePromotion(editingPromotionId.value, promotionData)
  
  if (result) {
    await promotionsStore.fetchPromotions({ vendorId: vendorId.value })
    await promotionsStore.fetchPromotionStatusCounts(vendorId.value)
    
    resetForm()
    sheetOpen.value = false
  }
}

// Reset form
const resetForm = () => {
  currentStep.value = 1
  isEditMode.value = false
  editingPromotionId.value = null
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
    productIds: [],
    status: 'draft'
  }
}

// Format date
const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A'
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
// const changePage = (page: number | string) => {
//   if (typeof page === 'number' && page >= 1 && page <= promotionsStore.pagination.totalPages) {
//     promotionsStore.fetchPromotions({ 
//       vendorId: vendorId.value,
//       page 
//     })
//   }
// }

// // Computed visible pages for pagination
// const visiblePages = computed(() => {
//   const current = promotionsStore.pagination.currentPage
//   const total = promotionsStore.pagination.totalPages
//   const pages: (number | string)[] = []

//   if (total <= 5) {
//     for (let i = 1; i <= total; i++) {
//       pages.push(i)
//     }
//   } else {
//     pages.push(1)
    
//     if (current > 3) {
//       pages.push('...')
//     }
    
//     for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
//       pages.push(i)
//     }
    
//     if (current < total - 2) {
//       pages.push('...')
//     }
    
//     pages.push(total)
//   }

//   return pages
// })

// View promotion details
const viewPromotionDetails = async (id: string) => {
  const promotion = await promotionsStore.fetchPromotionById(id)
  if (promotion) {
    selectedPromotion.value = promotion
    viewSheetOpen.value = true
  }
}

// Edit promotion from view sheet
const editPromotion = () => {
  if (!selectedPromotion.value) return
  
  isEditMode.value = true
  editingPromotionId.value = selectedPromotion.value._id
  
  formData.value = {
    name: selectedPromotion.value.name,
    description: selectedPromotion.value.description || '',
    promotionType: selectedPromotion.value.promotionType,
    promoCode: selectedPromotion.value.promoCode || '',
    startDate: selectedPromotion.value.startDate?.split('T')[0] || '',
    endDate: selectedPromotion.value.endDate?.split('T')[0] || '',
    discountValue: selectedPromotion.value.discountValue?.toString() || '',
    minPurchaseAmount: selectedPromotion.value.minimumPurchaseAmount?.toString() || '',
    maxDiscountCap: selectedPromotion.value.maximumDiscountCap?.toString() || '',
    totalUsageLimit: selectedPromotion.value.totalUsageLimit?.toString() || '',
    limitPerCustomer: selectedPromotion.value.limitPerCustomer?.toString() || '',
    appliesTo: selectedPromotion.value.appliesTo,
    productIds: selectedPromotion.value.productIds || [],
    status: selectedPromotion.value.status
  }
  
  viewSheetOpen.value = false
  sheetOpen.value = true
  currentStep.value = 1
}

// Edit promotion from dropdown menu
const editPromotionFromList = async (promotion: Promotion) => {
  isEditMode.value = true
  editingPromotionId.value = promotion._id
  
  const fullPromotion = await promotionsStore.fetchPromotionById(promotion._id)
  
  formData.value = {
    name: fullPromotion.name,
    description: fullPromotion.description || '',
    promotionType: fullPromotion.promotionType,
    promoCode: fullPromotion.promoCode || '',
    startDate: fullPromotion.startDate?.split('T')[0] || '',
    endDate: fullPromotion.endDate?.split('T')[0] || '',
    discountValue: fullPromotion.discountValue?.toString() || '',
    minPurchaseAmount: fullPromotion.minimumPurchaseAmount?.toString() || '',
    maxDiscountCap: fullPromotion.maximumDiscountCap?.toString() || '',
    totalUsageLimit: fullPromotion.totalUsageLimit?.toString() || '',
    limitPerCustomer: fullPromotion.limitPerCustomer?.toString() || '',
    appliesTo: fullPromotion.appliesTo,
    productIds: fullPromotion.productIds || [],
    status: fullPromotion.status
  }
  
  sheetOpen.value = true
  currentStep.value = 1
  showActionsMenu.value = null
}

// Publish promotion from list
const publishPromotionFromList = async (promotion: Promotion) => {
  await promotionsStore.publishPromotion(promotion._id)
  await promotionsStore.fetchPromotions({ vendorId: vendorId.value })
  await promotionsStore.fetchPromotionStatusCounts(vendorId.value)
}

// Publish selected promotion
const publishSelectedPromotion = async () => {
  if (!selectedPromotion.value) return
  
  await promotionsStore.publishPromotion(selectedPromotion.value._id)
  await promotionsStore.fetchPromotions({ vendorId: vendorId.value })
  await promotionsStore.fetchPromotionStatusCounts(vendorId.value)
  
  viewSheetOpen.value = false
}

// Open delete confirmation modal
const openDeleteModal = (promotion: Promotion) => {
  promotionToDelete.value = promotion
  deleteModalOpen.value = true
  showActionsMenu.value = null
}

// Confirm delete promotion
const confirmDeletePromotion = async () => {
  if (!promotionToDelete.value) return

  try {
    await promotionsStore.deletePromotion(promotionToDelete.value._id)
    
    // Close view sheet if it's open for the deleted promotion
    if (selectedPromotion.value?._id === promotionToDelete.value._id) {
      viewSheetOpen.value = false
      selectedPromotion.value = null
    }
    
    // Close the modal
    deleteModalOpen.value = false
    promotionToDelete.value = null
  } catch (error: any) {
    console.error('Delete promotion error:', error)
  }
}

// Close actions menu when clicking outside
const closeActionsMenuOnClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showActionsMenu.value = null
  }
}

// Fetch products and promotions on mount
onMounted(async () => {
  

  
  // console.log('Promotions after fetch:', promotionsStore.promotions)
  // console.log('Promotions count:', promotionsStore.promotions.length)
  
  // Fetch products for selection - get all products without limit
  await productsStore.fetchProducts({ vendorId: vendorId.value, limit: 1000, status: 'all' })
  // Map products to use _id as the identifier
  eligibleProducts.value = productsStore.products.map(product => ({
    _id: product._id, 
    name: product.name,
    amount: product.amount || 0,
    size: product.size || '',
    image: product.image || ''
  }))
    promotionsStore.fetchPromotions({ vendorId: vendorId.value })
    promotionsStore.fetchPromotionStatusCounts(vendorId.value)
  // console.log('Loaded promotions:', promotionsStore.promotions) // Debug log
  
  // Add click outside listener
  document.addEventListener('click', closeActionsMenuOnClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeActionsMenuOnClickOutside)
})
</script>

<style scoped>
.cardShadow1 {
  box-shadow:
    0px 31px 30px -23px #dddcdc,
    inset 0px -23px 20px -23px rgba(0, 0, 0, 0.25);
}

.weeshr-icon2 {
  background-color: white;
}
</style>