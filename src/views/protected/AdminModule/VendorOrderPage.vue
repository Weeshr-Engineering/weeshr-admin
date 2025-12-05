<template>
  <div class="flex-col flex bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10">
    <VendorNav class="mx-6" headingText="Order" />

    <div class="w-full grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-5 pt-6">
      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#DF6C50] border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Overdue</p>
            <div>
              <SquareArrowOutUpRight width="24px" height="24px" color="#ffffff" />
            </div>
            <p class="text-2xl lg:text-3xl font-medium text-[#FFFFFF] absolute bottom-2 left-5">
              {{ orderStore.analytics.overdue || 0 }}
            </p>
          </CardContent>
        </div>
      </Card>

      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#3A8EE5] border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">New</p>
            <div>
              <RefreshCcw
                width="24px"
                height="24px"
                color="#3A8EE5"
                class="bg-[white] rounded-sm"
              />
            </div>
            <p class="text-2xl lg:text-3xl font-medium text-[#FFFFFF] absolute bottom-2 left-5">
              {{ orderStore.analytics.new || 0 }}
            </p>
          </CardContent>
        </div>
      </Card>

      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#6A70FF] border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Processing</p>
            <div>
              <SlidersVertical
                width="24px"
                height="24px"
                color="#3A8EE5"
                class="bg-[white] rounded-sm"
              />
            </div>
            <p class="text-2xl lg:text-3xl font-medium text-[#FFFFFF] absolute bottom-2 left-5">
              {{ orderStore.analytics.processing || 0 }}
            </p>
          </CardContent>
        </div>
      </Card>

      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#EE9F39] border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Outbound</p>
            <div>
              <Truck width="24px" height="24px" color="#ffffff" />
            </div>
            <p class="text-2xl lg:text-3xl font-medium text-[#FFFFFF] absolute bottom-2 left-5">
              {{ orderStore.analytics.outbound || 0 }}
            </p>
          </CardContent>
        </div>
      </Card>

      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#00C37F] cardShadow1 border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#FFFFFF]">Delivered</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Check width="24px" height="24px" color="#00C37F" />
            </div>
            <p class="text-2xl lg:text-3xl font-medium text-[#FFFFFF] absolute bottom-2 left-5">
              {{ orderStore.analytics.delivered || 0 }}
            </p>
          </CardContent>
        </div>
      </Card>
    </div>

    <Card
      class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-14 mb-4"
    >
      <div class="flex flex-col sm:flex-row items-center justify-between py-4">
        <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-2 sm:mb-0">
          Order Sheet
          <p class="text-xs sm:text-sm font-normal text-[#02072199]">Details of all orders</p>
        </div>
        <div class="flex items-center flex-col md:flex-row gap-4">
          <!-- Status Filter Dropdown -->
          <div class="relative" data-status-filter>
            <Button 
              variant="outline" 
              class="flex items-center gap-2 w-full sm:w-auto bg-[#EEEFF5]"
              @click.stop="showStatusFilter = !showStatusFilter"
            >
              <ListFilter class="w-4 h-4"/>
              {{ getStatusFilterDisplay() }}
              <Icon icon="mdi:chevron-down" class="w-4 h-4" />
            </Button>

            <!-- Status Filter Dropdown Menu -->
            <Transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div 
                v-if="showStatusFilter"
                @click.stop
                class="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
              >
                <button
                  @click="applyStatusFilter('all')"
                  :class="[
                    'w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 transition-colors',
                    statusFilter === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  ]"
                >
                  <div class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <Icon v-if="statusFilter === 'all'" icon="mdi:check" class="w-4 h-4 text-blue-600" />
                  </div>
                  <span class="text-sm font-medium">All Status</span>
                </button>
                
                <button
                  @click="applyStatusFilter('new')"
                  :class="[
                    'w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 transition-colors',
                    statusFilter === 'new' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  ]"
                >
                  <div class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <Icon v-if="statusFilter === 'new'" icon="mdi:check" class="w-4 h-4 text-blue-600" />
                  </div>
                  <span class="text-sm font-medium">New</span>
                </button>

                <button
                  @click="applyStatusFilter('processing')"
                  :class="[
                    'w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 transition-colors',
                    statusFilter === 'processing' ? 'bg-purple-50 text-purple-600' : 'text-gray-700'
                  ]"
                >
                  <div class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <Icon v-if="statusFilter === 'processing'" icon="mdi:check" class="w-4 h-4 text-purple-600" />
                  </div>
                  <span class="text-sm font-medium">Processing</span>
                </button>

                <button
                  @click="applyStatusFilter('outbound')"
                  :class="[
                    'w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 transition-colors',
                    statusFilter === 'outbound' ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                  ]"
                >
                  <div class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <Icon v-if="statusFilter === 'outbound'" icon="mdi:check" class="w-4 h-4 text-orange-600" />
                  </div>
                  <span class="text-sm font-medium">Outbound</span>
                </button>

                <button
                  @click="applyStatusFilter('delivered')"
                  :class="[
                    'w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 transition-colors',
                    statusFilter === 'delivered' ? 'bg-green-50 text-green-600' : 'text-gray-700'
                  ]"
                >
                  <div class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <Icon v-if="statusFilter === 'delivered'" icon="mdi:check" class="w-4 h-4 text-green-600" />
                  </div>
                  <span class="text-sm font-medium">Delivered</span>
                </button>

                <button
                  @click="applyStatusFilter('overdue')"
                  :class="[
                    'w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 transition-colors',
                    statusFilter === 'overdue' ? 'bg-red-50 text-red-600' : 'text-gray-700'
                  ]"
                >
                  <div class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <Icon v-if="statusFilter === 'overdue'" icon="mdi:check" class="w-4 h-4 text-red-600" />
                  </div>
                  <span class="text-sm font-medium">Overdue</span>
                </button>

                <button
                  @click="applyStatusFilter('cancelled')"
                  :class="[
                    'w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors',
                    statusFilter === 'cancelled' ? 'bg-gray-50 text-gray-600' : 'text-gray-700'
                  ]"
                >
                  <div class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <Icon v-if="statusFilter === 'cancelled'" icon="mdi:check" class="w-4 h-4 text-gray-600" />
                  </div>
                  <span class="text-sm font-medium">Cancelled</span>
                </button>
              </div>
            </Transition>
          </div>

          <Search @search="handleSearch" class="mt-3 lg:mt-0" />
          <button class="bg-[#020721] px-4 py-2 rounded-xl w-50 h-12" @click="downloadReport">
            <div class="text-base text-[#F8F9FF] text-center flex items-center">
              Download Report
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
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="orderStore.loading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="orderStore.error" class="text-red-500 text-center py-4">
        {{ orderStore.error }}
        <button @click="clearError" class="ml-2 text-blue-600 underline">Try Again</button>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="orderStore.filteredOrders.length === 0"
        class="text-center py-8 text-gray-500"
      >
        <p class="text-lg font-medium">No orders found</p>
        <p class="text-sm">Orders will appear here once customers make purchases</p>
      </div>

      <!-- Orders Table -->
      <div v-else class="overflow-auto bg-white rounded-lg shadow">
        <Table class="lg:w-full w-[800px]">
          <TableHeader>
            <TableRow
              class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
            >
              <TableHead>
                <div class="flex items-center">Order Date</div>
              </TableHead>
              <TableHead>
                <div class="flex items-center">Total Amount</div>
              </TableHead>
              <TableHead>
                <div class="flex items-center">Item Count</div>
              </TableHead>
              <TableHead>
                <div class="flex items-center">Payment Status</div>
              </TableHead>
              <TableHead>
                <div class="flex items-center">Status</div>
              </TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="order in orderStore.filteredOrders" :key="order._id">
              <TableCell class="text-xs md:text-sm lg:text-sm">
                {{ formatDate(order.createdAt) }}
              </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">
                ₦{{ order.totalAmount?.toLocaleString() || '0' }}
              </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">
                {{ order.items?.length || 0 }}
              </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm capitalize">
                {{ order.paymentStatus || 'pending' }}
              </TableCell>
              <TableCell>
                <div
                  :class="statusBg(order.status)"
                  class="rounded-[10px] w-fit px-2 py-0.5 text-white text-sm capitalize"
                >
                  {{ order.status }}
                </div>
              </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">
                {{ order._id?.substring(0, 8) }}...
              </TableCell>
              <TableCell>
                <button @click="openOrderDetails(order._id)" class="p-1 hover:bg-gray-100 rounded">
                  <svg
                    width="20"
                    height="24"
                    viewBox="0 0 20 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 31L12.5118 26.0606C13.1627 25.4773 13.1627 24.5227 12.5118 23.9394L7 19"
                      stroke="#54586D"
                      stroke-opacity="0.8"
                      stroke-width="2"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
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

    <!-- Order Details Sheet -->
    <Sheet :open="isSheetOpen" @update:open="handleSheetOpenChange">
      <SheetContent
        length="mid_low"
        class="flex flex-col space-y-0 overflow-y-scroll pb-6 w-full sm:max-w-lg"
      >
        <SheetHeader class="flex flex-col items-start px-4 pt-4">
          <SheetDescription class="text-xs text-muted-foreground"> Order Number </SheetDescription>

          <!-- Loading state for sheet -->
          <div v-if="isSheetLoading" class="w-full py-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-2 text-sm text-muted-foreground">Loading order details...</p>
          </div>

          <!-- Error state -->
          <div v-else-if="orderStore.error && isSheetOpen" class="text-red-500 text-center py-4">
            {{ orderStore.error }}
            <Button @click="openOrderDetails(selectedOrderId!)" variant="outline" class="ml-2"
              >Retry</Button
            >
          </div>

          <!-- Order details content -->
          <div v-else-if="currentOrderForDisplay">
            <h3 class="text-xl font-bold truncate">{{ currentOrderForDisplay._id }}</h3>
            <div class="flex items-center justify-between w-full mt-3">
              <div>
                <p class="text-xs text-muted-foreground">Initiated Date</p>
                <p class="text-sm font-medium mt-1">
                  {{ formatDate(currentOrderForDisplay.createdAt) }}
                </p>
              </div>
              <Badge
                variant="outline"
                :class="statusBg(currentOrderForDisplay.status)"
                class="text-xs text-white px-3 py-1 capitalize"
              >
                {{ currentOrderForDisplay.status }}
              </Badge>
            </div>
          </div>
        </SheetHeader>

        <!-- Order Items Section - only show if we have data -->
        <div v-if="currentOrderForDisplay && !isSheetLoading" class="px-4 mt-6">
          <div class="flex items-center gap-2 mb-4">
            <h3 class="text-base font-semibold">Order</h3>
            <Badge class="bg-[#E9F4d1] text-primary text-xs">{{
              currentOrderForDisplay.items?.length || 0
            }}</Badge>
            <span class="ml-auto text-lg font-bold"
              >₦{{ currentOrderForDisplay.totalAmount?.toLocaleString() || '0' }}</span
            >
          </div>

          <!-- Order Items List -->
          <div
            v-if="currentOrderForDisplay.items && currentOrderForDisplay.items.length > 0"
            class="space-y-3"
          >
            <div
              v-for="(item, index) in currentOrderForDisplay.items"
              :key="index"
              class="flex items-center gap-3 pb-3 border-b last:border-b-0"
            >
              <img
                :src="getProductImage(item)"
                class="w-12 h-12 rounded-md object-cover"
                @error="handleImageError($event, item)"
              />
              <div class="flex-1">
                <p class="text-sm font-medium text-[#020721]">{{ item.name || 'Product' }}</p>
                <p class="text-xs text-muted-foreground">
                  ₦{{ (item.price || item.amount || 0)?.toLocaleString() || '0' }}
                </p>
              </div>
              <span class="text-sm text-muted-foreground">{{ item.quantity || 1 }}x</span>
            </div>
          </div>
          <div v-else class="text-center py-4 text-muted-foreground">
            No items found in this order
          </div>

          <!-- Order Summary -->
          <div class="mt-6 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Total Value</span>
              <span class="font-medium"
                >₦{{ currentOrderForDisplay.totalAmount?.toLocaleString() || '0' }}</span
            >
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Delivery Charge</span>
              <span class="font-medium"
                >₦{{ (currentOrderForDisplay.deliveryCharge || 2500).toLocaleString() }}</span
            >
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Discount</span>
              <span class="font-medium">{{
                currentOrderForDisplay.discount
                  ? '₦' + currentOrderForDisplay.discount.toLocaleString()
                  : 'N/A'
              }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div
            v-if="
              currentOrderForDisplay.status === 'new' || currentOrderForDisplay.status === 'pending'
            "
            class="flex justify-center mt-6"
          >
            <Button
              class="bg-[#6A70FF] hover:bg-[#5a60ef] text-white rounded-xl h-11 px-6 gap-2"
              @click="handleStartProcess(currentOrderForDisplay._id)"
              :disabled="orderStore.loading"
            >
              Start Process
              <CircleChevronRight class="w-5 h-5" />
            </Button>
          </div>

          <div v-else-if="currentOrderForDisplay.status === 'processing'" class="flex gap-3 mt-6">
            <Button
              variant="outline"
              class="flex-1 border-2 border-[#020721] text-[#020721] hover:bg-gray-50 rounded-xl h-11 gap-2"
              @click="handleMarkOutbound(currentOrderForDisplay._id)"
              :disabled="orderStore.loading"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 11H7.83L12.71 6.12C13.1 5.73 13.1 5.09 12.71 4.7C12.32 4.31 11.69 4.31 11.3 4.7L4.71 11.29C4.32 11.68 4.32 12.31 4.71 12.7L11.3 19.29C11.69 19.68 12.32 19.68 12.71 19.29C13.1 18.9 13.1 18.27 12.71 17.88L7.83 13H19C19.55 13 20 12.55 20 12C20 11.45 19.55 11 19 11Z"
                  fill="currentColor"
                />
              </svg>
              Mark Outbound
            </Button>
            <Button
              class="flex-1 bg-[#00C37F] hover:bg-[#00a86b] text-white rounded-xl h-11 gap-2"
              @click="handleMarkDelivered(currentOrderForDisplay._id)"
              :disabled="orderStore.loading"
            >
              Mark Delivered
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                  fill="currentColor"
                />
              </svg>
            </Button>
          </div>

          <div
            v-else-if="currentOrderForDisplay.status === 'outbound'"
            class="flex justify-center mt-6"
          >
            <Button
              class="bg-[#00C37F] hover:bg-[#00a86b] text-white rounded-xl h-11 px-6 gap-2"
              @click="handleMarkDelivered(currentOrderForDisplay._id)"
              :disabled="orderStore.loading"
            >
              Mark Delivered
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                  fill="currentColor"
                />
              </svg>
            </Button>
          </div>

          <div
            v-else-if="
              currentOrderForDisplay.status === 'delivered' ||
              currentOrderForDisplay.status === 'cancelled'
            "
            class="flex justify-center mt-6"
          >
            <p class="text-sm text-muted-foreground">Order {{ currentOrderForDisplay.status }}</p>
          </div>
        </div>

        <!-- Receiver and Sender Information -->
        <div v-if="currentOrderForDisplay && !isSheetLoading" class="px-4 mt-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <!-- Receiver -->
            <div>
              <h4 class="text-sm font-semibold text-[#020721] mb-3">Receiver</h4>
              <div class="space-y-2">
                <p class="text-sm font-medium text-[#020721]">
                  {{
                    currentOrderForDisplay.shippingAddress?.recipientName ||
                    currentOrderForDisplay.customerName ||
                    'N/A'
                  }}
                </p>
                <div
                  v-if="
                    currentOrderForDisplay.shippingAddress?.phone ||
                    currentOrderForDisplay.customerPhone
                  "
                >
                  <p class="text-xs text-muted-foreground">Phone Number</p>
                  <p class="text-xs text-[#020721]">
                    {{
                      currentOrderForDisplay.shippingAddress?.phone ||
                      currentOrderForDisplay.customerPhone ||
                      'N/A'
                    }}
                  </p>
                </div>
                <div v-if="currentOrderForDisplay.customerEmail">
                  <p class="text-xs text-muted-foreground">Email</p>
                  <p class="text-xs text-[#020721] break-all">
                    {{ currentOrderForDisplay.customerEmail }}
                  </p>
                </div>
                <div v-if="currentOrderForDisplay.shippingAddress?.address">
                  <p class="text-xs text-muted-foreground">Address</p>
                  <p class="text-xs text-[#020721]">
                    {{ currentOrderForDisplay.shippingAddress.address }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Sender -->
            <div>
              <h4 class="text-sm font-semibold text-[#020721] mb-3">Sender</h4>
              <div class="space-y-2">
                <p class="text-sm font-medium text-[#020721]">
                  {{ superAdminStore.vendor?.companyName || 'Your Store' }}
                </p>
                <div v-if="superAdminStore.vendor?.companyEmail">
                  <p class="text-xs text-muted-foreground">Email</p>
                  <p class="text-xs text-[#020721] break-all">
                    {{ superAdminStore.vendor.companyEmail }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, computed, ref, watch, onBeforeUnmount } from 'vue'
import { useOrderStore } from '@/stores/order-store/orderStore'
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import { useProductsStore } from '@/stores/vendor/product'
import type { Product } from '@/stores/vendor/product'

import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import Search from '@/components/UseSearch.vue'
import { Sheet, SheetContent, SheetDescription, SheetHeader } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import VendorNav from '@/components/VendorNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import {
  Check,
  SquareArrowOutUpRight,
  RefreshCcw,
  SlidersVertical,
  Truck,
  CircleChevronRight,
  ListFilter
} from 'lucide-vue-next'

// Stores
const orderStore = useOrderStore()
const superAdminStore = useSuperAdminStore()
const productsStore = useProductsStore()

// Ref for sheet state
const isSheetOpen = ref(false)
const selectedOrderId = ref<string | null>(null)
const sheetOrderData = ref<any>(null)
const isSheetLoading = ref(false)

// Status filter state
const statusFilter = ref('all')
const showStatusFilter = ref(false)

// Cache for product images to avoid repeated API calls
const productImageCache = ref<Record<string, string>>({})

// Get vendor ID from super admin store
const vendorId = computed(() => superAdminStore.vendorId)

// Lifecycle
onMounted(() => {
  if (vendorId.value) {
    loadOrders()
    if (!superAdminStore.vendor) {
      superAdminStore.fetchUsersData('Vendor data loaded', vendorId.value)
    }
  } else {
    console.error('Vendor ID not found. Please log in as a vendor.')
    orderStore.error = 'Vendor ID not found. Please log in as a vendor.'
  }
  
  // Add event listener for closing dropdown
  document.addEventListener('click', closeDropdownOnClickOutside)
})

onBeforeUnmount(() => {
  // Remove event listener
  document.removeEventListener('click', closeDropdownOnClickOutside)
})

// Watch for currentOrder changes
watch(
  () => orderStore.currentOrder,
  (newOrder) => {
    if (newOrder && selectedOrderId.value === newOrder._id) {
      sheetOrderData.value = newOrder
      isSheetLoading.value = false
    }
  }
)

// Methods
const loadOrders = async () => {
  if (!vendorId.value) {
    orderStore.error = 'Vendor ID not found'
    return
  }
  try {
    await Promise.all([
      orderStore.fetchVendorOrders(vendorId.value),
      orderStore.fetchVendorAnalytics(vendorId.value)
    ])
  } catch (error) {
    console.error('Failed to load orders:', error)
  }
}

const handleSearch = (searchTerm: string) => {
  orderStore.setFilters({ search: searchTerm })
}

// Apply status filter
const applyStatusFilter = (status: string) => {
  statusFilter.value = status
  showStatusFilter.value = false
  
  if (status === 'all') {
    orderStore.setFilters({ status: undefined })
  } else {
    orderStore.setFilters({ status })
  }
  
  if (vendorId.value) {
    loadOrders()
  }
}

// Get display name for status filter
const getStatusFilterDisplay = () => {
  switch (statusFilter.value) {
    case 'all': return 'All'
    case 'new': return 'New'
    case 'processing': return 'Processing'
    case 'outbound': return 'Outbound'
    case 'delivered': return 'Delivered'
    case 'overdue': return 'Overdue'
    case 'cancelled': return 'Cancelled'
    default: return 'All'
  }
}

// Close dropdown when clicking outside
const closeDropdownOnClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const statusFilterDropdown = document.querySelector('[data-status-filter]')
  if (statusFilterDropdown && !statusFilterDropdown.contains(target)) {
    showStatusFilter.value = false
  }
}

const openOrderDetails = async (orderId: string) => {
  selectedOrderId.value = orderId
  isSheetOpen.value = true
  isSheetLoading.value = true

  try {
    // Check if we already have the order in the store
    const existingOrder = orderStore.orders.find((o) => o._id === orderId)

    if (existingOrder) {
      // Use existing order initially for fast display
      sheetOrderData.value = existingOrder
    }

    // Always fetch fresh data from API
    await orderStore.fetchOrderById(orderId)
  } catch (error) {
    console.error('Failed to load order details:', error)
    isSheetLoading.value = false
  }
}

const handleSheetOpenChange = (open: boolean) => {
  isSheetOpen.value = open
  if (!open) {
    // Reset when sheet closes
    setTimeout(() => {
      selectedOrderId.value = null
      sheetOrderData.value = null
      orderStore.clearCurrentOrder()
    }, 300)
  }
}

const handleStartProcess = async (orderId: string) => {
  await updateOrderStatus(orderId, 'processing')
}

const handleMarkOutbound = async (orderId: string) => {
  await updateOrderStatus(orderId, 'outbound')
}

const handleMarkDelivered = async (orderId: string) => {
  await updateOrderStatus(orderId, 'delivered')
}

const updateOrderStatus = async (orderId: string, newStatus: string) => {
  if (!vendorId.value) return

  try {
    await orderStore.updateOrderStatus(orderId, newStatus)
    // Refresh analytics to get updated counts
    await orderStore.fetchVendorAnalytics(vendorId.value)

    // Refresh the current order if it's the one we're viewing
    if (selectedOrderId.value === orderId) {
      await orderStore.fetchOrderById(orderId)
    }
  } catch (error) {
    console.error('Failed to update order status:', error)
  }
}

const downloadReport = () => {
  // Implement CSV/PDF download functionality
  const orders = orderStore.filteredOrders
  const csvContent = [
    ['Order ID', 'Date', 'Total Amount', 'Items', 'Status', 'Payment Status'],
    ...orders.map((order) => [
      order._id,
      formatDate(order.createdAt),
      order.totalAmount,
      order.items?.length || 0,
      order.status,
      order.paymentStatus
    ])
  ]
    .map((row) => row.join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `orders-report-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

const clearError = () => {
  orderStore.clearError()
  loadOrders()
}

const statusBg = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'failed':
    case 'cancelled':
      return 'bg-[#E45044]'
    case 'pending':
    case 'new':
      return 'bg-[#EE9F39]'
    case 'processing':
      return 'bg-[#6A70FF]'
    case 'outbound':
    case 'shipped':
      return 'bg-[#3A8EE5]'
    case 'delivered':
    case 'completed':
      return 'bg-[#00C37F]'
    case 'overdue':
      return 'bg-[#DF6C50]'
    default:
      return 'bg-gray-500'
  }
}

const formatDate = (dateStr: string | Date | undefined) => {
  if (!dateStr) return 'N/A'
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return 'Invalid Date'
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  } catch (error) {
    return 'Invalid Date'
  }
}

// Add a computed property to get the current order for display
const currentOrderForDisplay = computed(() => {
  return sheetOrderData.value || orderStore.currentOrder
})

// Get product image - using the same approach as in ProductPage
const getProductImage = (item: any): string => {
  // First, check if the item already has an image
  if (item.image) {
    return item.image
  }
  
  // Get product ID from the item
  const productId = item.productId || item._id
  if (!productId) {
    return getPlaceholderImage()
  }
  
  // Check cache first
  if (productImageCache.value[productId]) {
    return productImageCache.value[productId]
  }
  
  // Check if product exists in products store
  const productInStore = productsStore.products.find(
    (p: Product) => p._id === productId
  )
  
  if (productInStore?.image) {
    // Cache the image URL
    productImageCache.value[productId] = productInStore.image
    return productInStore.image
  }
  
  // Try to fetch the product if not in store
  if (productId && !productImageCache.value[productId]) {
    fetchProductImage(productId)
  }
  
  return getPlaceholderImage()
}

// Fetch product image by ID
const fetchProductImage = async (productId: string) => {
  try {
    const product = await productsStore.fetchProductById(productId)
    if (product?.image) {
      productImageCache.value[productId] = product.image
    }
  } catch (error) {
    console.error('Error fetching product image:', error)
  }
}

// Get placeholder image (simple SVG)
const getPlaceholderImage = (): string => {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iNCIgZmlsbD0iI0YwRjBGMSIvPgo8Y2lyY2xlIGN4PSIyNCIgY3k9IjE5IiByPSI1IiBmaWxsPSIjQzVDNUM1Ii8+CjxwYXRoIGQ9Ik0xMiAzMEMxMiAzNS41MjI4IDE2LjQ3NzIgNDAgMjIgNDBIMjZDMzEuNTIyOCA0MCAzNiAzNS41MjI4IDM2IDMwQzM2IDI0LjQ3NzIgMzEuNTIyOCAyMCAyNiAyMEgyMkMxNi40NzcyIDIwIDEyIDI0LjQ3NzIgMTIgMzBaIiBmaWxsPSIjQzVDNUM1Ii8+Cjwvc3ZnPgo='
}

// Handle image error
const handleImageError = (event: Event, item: any) => {
  const target = event.target as HTMLImageElement
  target.src = getPlaceholderImage()
  
  // Try to fetch the product image if it failed
  const productId = item.productId || item._id
  if (productId && !productImageCache.value[productId]) {
    fetchProductImage(productId)
  }
}

// Pre-fetch products when component mounts
onMounted(async () => {
  if (vendorId.value) {
    // Pre-fetch products to have them available for order items
    await productsStore.fetchProducts({ vendorId: vendorId.value })
  }
})
</script>

<style scoped>
.cardShadow1 {
  box-shadow: 0px 20px 35px 0px #00c37f24;
}
.weeshr-icon2 {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
}
</style>