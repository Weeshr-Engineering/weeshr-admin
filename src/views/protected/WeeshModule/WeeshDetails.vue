<template>
    <div class="flex-col flex bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10">
        <MainNav class="mx-6" headingText="Weeshes" />
        <div class="flex flex-col gap-4">
            <Card>
                <div class="w-full px-8 my-4 flex items-center justify-between">
                    <h3 class="text-lg font-semibold">Weesh Details</h3>
                    <Badge class="rounded-full">Added</Badge>
                </div>
                <div class="flex flex-col gap-2 lg:flex-row md:p-4 px-4 pt-2">
                    <Card class="flex-auto rounded-3xl bg-[#34389B1A] bg-opacity-10">
                        <CardContent class="flex flex-col md:flex-row justify-start items-center gap-4 p-4">
                            <img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720071091/Rectangle_3624_om6xeb.png"/>
                                <div>
                                    <h1 class="text-base text-[#02072199]">Gadget</h1>
                                    <p class="text-[#020721] text-2xl font-bold">iPhone 15 Pro Max</p>
                                    <h1 class="text-base text-[#02072199]">A Pink 256GB phone, new one oh</h1>
                                </div>
                        </CardContent>
                    </Card>
                        <div class="flex-1 rounded-3xl bg-[#34389B1A] bg-opacity-10 min-h-32 max-w-64 lg:max-w-72 flex flex-col justify-between md:flex-row md:justify-stretch gap-4 pt-4 pb-8 px-4 lg:px-6">
                            <div class="h-full flex flex-col items-start min-w-8"><img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720070852/money-4_pu9pa9.svg"/></div>
                            <div class="min-h-full flex flex-col justify-end items-end min-w-fit mr-4"> <p class="text-[#020721] text-xl md:text-2xl font-bold">₦ 1,565,987.00</p></div>
                        </div>
                </div>
                <div class="flex flex-row flex-wrap w-full gap-2 py-2 px-4 md:p-4">
                        <div class="min-h-32 rounded-3xl bg-[#DCDEFF] flex flex-col md:flex-row flex-auto justify-stretch gap-4 py-6 px-4 max-w-64">
                            <div class="h-full flex flex-col items-start w-1/5">
                                <img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720074062/profile-circle_t6oidm.svg"/>
                            </div>
                            <div class="min-h-full md:flex flex-col justify-end w-full"> 
                                <h1 class="text-sm text-[#02072199]">Weesh by</h1>
                                <p class="text-[#020721] text-base font-bold">Alicia Colins</p>
                            </div>
                        </div>
                        <div class="min-h-32 md:flex md:max-w-fit flex-col w-full max-h-full md:flex-row md:flex-auto gap-4 rounded-3xl bg-[#F4D5F6] p-4">
                            <div class="md:h-full my-2 flex md:flex-col md:items-start w-8">
                                <img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720070989/calendar-2_fjyoy5.svg"/>
                            </div>
                            <div class="min-h-full md:flex flex-row md:justify-end gap-4 mr-2 md:items-center w-full mt-4 md:mt-0">
                                <div class="min-h-full flex flex-col justify-end w-full"> 
                                    <h1 class="text-sm text-[#02072199]">Fulfiled on</h1>
                                    <p class="text-[#020721] text-base font-bold">19 July 2024</p>
                                </div>
                                <div class="min-h-full flex flex-col justify-end w-full"> 
                                    <h1 class="text-sm text-[#02072199]">Birthday</h1>
                                    <div class="text-[#020721] text-nowrap text-base font-bold">23 August 2024</div>
                                </div>
                            </div>
                        </div>
                        <div class="min-h-32 max-w-fit lg:max-w-lg flex flex-col md:flex-row flex-auto md:justify-stretch gap-4 rounded-3xl bg-[#E9F4D1] py-6 px-4">
                            <div class="md:h-full flex flex-col items-start min-w-8 flex-1">
                                <img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720070951/map_uxvr5x.svg"/>
                            </div>
                            <div class="min-h-full md:flex md:justify-end items-center lg:min-w-fit gap-2 lg:gap-8 md:flex-auto">
                                <div class="md:min-h-full md:flex flex-col justify-end lg:min-w-fit">
                                    <h1 class="text-xs md:text-sm text-[#02072199]">Street Adress</h1>
                                    <p class="text-[#020721] text-sm md:text-base font-bold">5, Boulevard Estate, Idi Vintage</p>
                                </div>
                                <div class="md:min-h-full md:flex flex-col justify-end w-1/5 flex-2 mb-2 md:mb-0 mt-2 md:mt-0"> 
                                    <h1 class="text-sm text-[#02072199]">City</h1>
                                    <div class="text-[#020721] text-base font-bold">Calibe</div>
                                </div>
                                <div class="md:min-h-full md:flex flex-col justify-end w-1/5 flex-2 md:mb-2 md:mb-0"> 
                                    <h1 class="text-sm text-[#02072199]">State</h1>
                                    <div class="text-[#020721] text-base font-bold">Lagos</div>
                                </div>
                            </div>
                        </div>
                </div>
                <div class="flex flex-row flex-wrap w-full gap-2 px-4 pb-4 md:p-4">
                    <div class="min-h-32 w-full md:max-w-fit md:flex flex-auto justify-stretch gap-0 lg:gap-4 rounded-3xl bg-[#C6EDF6] py-6 px-4">
                        <div class="md:h-full md:flex flex-col items-start w-8">
                            <img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720071004/device-message_wy0vu2.svg"/>
                        </div>
                        <div class="min-h-full md:flex justify-end w-full gap-4 mr-4 mt-4 md:mt-0">
                            <div class="md:min-h-full flex flex-col justify-end w-full mb-2 md:mb-0"> 
                                <h1 class="text-sm text-[#02072199]">Email</h1>
                                <p class="text-[#020721] text-sm md:text-base font-bold">alisha@milly.co.uk</p>
                            </div>
                            <div class="md:min-h-full text-nowrap flex flex-col justify-end w-full"> 
                                <h1 class="text-sm text-[#02072199]">Phone Number</h1>
                                <div class="text-[#020721] text-sm md:text-base font-bold">+234 908 004 3174</div>
                            </div>
                        </div>
                    </div>
                    <div class="min-h-32 rounded-3xl bg-[#EBCE7E] md:flex flex-1 justify-stretch gap-4 py-6 px-4 min-w-44 max-w-64">
                        <div class="md:h-full flex flex-col items-start w-1/5">
                            <img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720077681/truck-fast_dqi4bx.svg"/>
                        </div>
                        <div class="md:min-h-full mt-4 md:mt-0 flex flex-col justify-end w-full"> 
                            <h1 class="text-sm text-[#02072199]">Deliery Status</h1>
                            <p class="text-[#020721] text-base font-bold">Not Initiated</p>
                        </div>
                    </div>
                    <div class="min-h-32 rounded-3xl bg-[#3A8EE5] md:flex flex-1 justify-stretch gap-4 py-6 px-4 min-w-44 max-w-64">
                        <div class="md:h-full flex flex-col items-start w-1/5">
                            <img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720071004/device-message_wy0vu2.svg"/>
                        </div>
                        <div class="md:min-h-full mt-4 md:mt-0 flex flex-col justify-end w-full"> 
                            <h1 class="text-sm text-[#02072199]">Procurement Status</h1>
                            <p class="text-[#020721] text-base font-bold">Not Initiated</p>
                        </div>
                    </div>
                </div>
            </Card>
            <Card class="rounded-3xl">
                <CardHeader class="bg-[#020721] text-white rounded-tr-3xl rounded-tl-3xl">
                    Vendor Details
                </CardHeader>
                <CardContent class="min-h-24 mt-4 lg:mt-0 flex flex-col lg:flex-row items-start justify-between lg:items-center gap-4 lg:gap-0">
                    <div>
                        <h1 class="text-sm md:text-base text-[#02072199]">Source</h1>
                        <p class="text-[#020721] text-base md:text-lg">Media</p>
                    </div>
                    <div>
                        <h1 class="text-sm md:text-base text-[#02072199]">Location</h1>
                        <p class="text-[#020721] text-base md:text-lg">Lagos State</p>
                    </div>
                    <div class='max-w-full'>
                        <h1 class="text-sm md:text-base text-[#02072199]">Link</h1>
                        <p class="text-[#020721] text-base overflow-clip lg:text-lg text-wrap">https://www.instagram.com/phonoflix</p>
                    </div>
                    <Sheet>
                        <SheetTrigger as-child>
                            <Button class="bg-[#4145A7] opacity-10">Start Verification <Icon icon="mdi:chevron-right" class="ml-2" /></Button>
                        </SheetTrigger>
                        <SheetContent class="overflow-y-auto max-w-fit">
                            <!-- <SheetHeader> -->
                                <h1 class="text-xl my-4">Verification</h1>
                                <Tabs :value="stage" class="w-[400px]" :modelValue="stage">
                                    <TabsList class="gap-2 bg-transparent">
                                      <TabsTrigger value="1" @click="setStage('1')" :class="{'bg-[#02072199] bg-opacity-60 text-white min-w-10 min-h-10 no-underline rounded-full md:min-h-10': stage === '1', 'bg-[#DCE0F2] text-[#02072199] min-w-10 min-h-10 rounded-full p-2 no-underline': stage !== '1'}">
                                        <p :class="{'text-white': stage === '1', 'text-[#02072199]': stage !== '1'}">1 <span class='hidden md:inline-block'>{{ stage == '1' ? 'Vender Details' : '' }}</span></p>
                                      </TabsTrigger>
                                      <TabsTrigger value="2" @click="setStage('2')" :class="{'bg-[#02072199] bg-opacity-60 text-white no-underline rounded-full min-w-10 min-h-10 md:min-h-10': stage === '2', 'bg-[#DCE0F2] text-[#02072199] min-w-10 min-h-10 rounded-full p-2 no-underline': stage !== '2'}">
                                        <p :class="{'text-white': stage === '2', 'text-[#02072199]': stage !== '2'}">2 <span class='hidden md:inline-block'>{{ stage == '2' ? 'Product Status' : '' }}</span></p>
                                      </TabsTrigger>
                                      <TabsTrigger value='3' @click="setStage('3')" :class="{'bg-[#02072199] bg-opacity-60 text-white no-underline rounded-full min-w-10 min-h-10': stage === '3', 'bg-[#DCE0F2] text-[#02072199] min-w-10 min-h-10 rounded-full p-2 no-underline': stage !== '3'}">
                                        <p :class="{'text-white': stage === '3', 'text-[#02072199]': stage !== '3'}">3 <span class='hidden md:inline-block'>{{ stage == '3' ? 'Purchase Initiation' : '' }}</span></p>
                                      </TabsTrigger>
                                      <TabsTrigger value="4" @click="setStage('4')" :class="{'bg-[#02072199] bg-opacity-60 text-white no-underline rounded-full min-w-10 min-h-10': stage === '4', 'bg-[#DCE0F2] text-[#02072199] min-w-10 min-h-10 rounded-full p-2 no-underline': stage !== '4'}">
                                        <p :class="{'text-white': stage === '4', 'text-[#02072199]': stage !== '4'}">4 <span class='hidden md:inline-block'>{{ stage == '4' ? 'Payment' : '' }}</span></p>
                                      </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="1">
                                        <Card class="rounded-3xl w-fit md:w-11/12">
                                            <CardHeader class="bg-[#D7DBF5] text-[#020721] font-medium rounded-tr-3xl rounded-tl-3xl">
                                                Vendor Details
                                            </CardHeader>
                                            <CardContent class="">
                                                <div class='flex flex-col md:flex-row gap-2 my-4 px-2'>
                                                    <div>
                                                        <h1 class="text-xs text-[#02072199]">Source</h1>
                                                        <p class="text-[#020721] text-sm">Media</p>
                                                    </div>
                                                    <div>
                                                        <h1 class="text-xs text-[#02072199]">Link</h1>
                                                        <p class="text-[#020721] text-sm">https://www.instagram.com/phonoflix</p>
                                                    </div>
                                                </div>
                                                <div class="w-full flex flex-col md:grid md:grid-cols-3 gap-2 my-4 px-2">
                                                    <div class="grid col-span-2 w-36 md:max-w-sm items-center gap-1.5">
                                                        <Label for="address">Address</Label>
                                                        <Input id="address" type="text" placeholder="Street" />
                                                    </div>
                                                    <div class="col-span-1 w-28 md:min-w-sm h-full flex justify-end items-end">
                                                        <Select
                                                            id="gender"
                                                            class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block min-w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                                            <SelectTrigger class="">
                                                                <SelectValue placeholder="State" />
                                                                </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Edo">Female</SelectItem>
                                                                <SelectItem value="Lagos">Male</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div class='flex flex-col gap-4 max-w-fit bg-[#F2F2F2] m-2 rounded-md'>
                                                    <!-- <CardContent> -->
                                                        <div>
                                                            <Table>
                                                                <TableHeader>
                                                                  <TableRow class='flex'>
                                                                    <TableHead class="w-[100px] font-medium text-base flex-auto text-[#020721]">
                                                                      Digital Footprint Checklist
                                                                    </TableHead>
                                                                    <TableHead class='flex-none'>Pass</TableHead>
                                                                    <TableHead class='flex-none'>Fail</TableHead>
                                                                  </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                  <TableRow v-for="item in digitalFootprint" :key="item" class='flex'>
                                                                    <TableCell class="text-xs font-normal flex-auto">
                                                                      {{item}}
                                                                    </TableCell>
                                                                    <TableCell class='flex-none'>
                                                                        <Input
                                                                        type="radio"
                                                                        class="w-4 h-4"
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell class='flex-none'>
                                                                        <Input
                                                                        type="radio"
                                                                        class="w-4 h-4"
                                                                        />
                                                                    </TableCell>
                                                                  </TableRow>
                                                                </TableBody>
                                                              </Table>
                                                        </div>
                                                        <div>
                                                            <Table>
                                                                <TableHeader>
                                                                  <TableRow class='flex'>
                                                                    <TableHead class="w-[100px] font-medium text-base flex-auto text-[#020721]">
                                                                        Additional Checklist
                                                                    </TableHead>
                                                                    <TableHead>Pass</TableHead>
                                                                    <TableHead>Fail</TableHead>
                                                                  </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                  <TableRow v-for="item in additionalFootprint" :key="item" class='flex'>
                                                                    <TableCell class="text-xs font-normal flex-auto">
                                                                      {{item}}
                                                                    </TableCell>
                                                                    <TableCell class='flex-none'>
                                                                        <Input
                                                                        type="radio"
                                                                        class='w-4 h-4'
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell class='flex-none'>
                                                                        <Input
                                                                        type="radio"
                                                                        class='w-4 h-4'
                                                                        />
                                                                    </TableCell>
                                                                  </TableRow>
                                                                </TableBody>
                                                              </Table>
                                                        </div>
                                                    <!-- </CardContent> -->
                                                        <div class='text-[#020721] flex items-center justify-between p-4 text-xs font-medium bg-[#D7DBF5] w-full rounded-md'>
                                                            <p>Verification Score</p>
                                                            <p>10</p>
                                                        </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <div class='flex flex-col md:flex-row md:justify-between my-4 w-5/6 md:w-11/12 p-2 px-4'>
                                        <div class='flex flex-col'>
                                            <h1 class="text-xs text-[#02072199]">Vendor Status</h1>
                                            <p class="text-[#020721] text-sm">Unattended</p>
                                        </div>
                                        <Button @click="toggleStatus" class='w-28 md:min-w-sm'>
                                            Change Status
                                        </Button>
                                        </div>
                                        <div v-if="status" class='sticky bottom-0 w-5/6 bg-[#F8F9FF] z-50 min-h-56 transition ease-in-out duration-300 p-2'>
                                            <div class="col-span-1 max-w-sm items-center gap-1.5">
                                                <Select
                                                    id="gender"
                                                    class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block min-w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                                    <SelectTrigger class="">
                                                        <SelectValue placeholder="Status" />
                                                        </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Edo">Female</SelectItem>
                                                        <SelectItem value="Lagos">Male</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Textarea placeholder="Type your message here." />
                                            <Button @click="stageTab(stage)">
                                                Change Status
                                            </Button>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="2">
                                        <Card class="rounded-3xl w-fit">
                                            <CardHeader class="bg-[#D7DBF5] text-[#020721] font-medium rounded-tr-3xl rounded-tl-3xl">
                                                Product Status
                                            </CardHeader>
                                            <CardContent class="w-11/12">
                                                <div class="md:flex justify-start items-start gap-4 p-2">
                                                    <img src="https://res.cloudinary.com/dotojp6xu/image/upload/v1720071091/Rectangle_3624_om6xeb.png"/>
                                                        <div>
                                                        <h1 class="text-sm text-[#02072199]">Gadget</h1>
                                                        <p class="text-[#020721] text-xl font-bold">iPhone 15 Pro Max</p>
                                                        <h1 class="text-sm text-[#02072199]">A Pink 256GB phone, new one oh</h1>
                                                        </div>
                                                </div>

                                                <div class='px-2 my-4'>
                                                    <h1 class="text-sm text-[#02072199]">Product Description</h1>
                                                    <div class='flex w-full items-center justify-between bg-[#0000000D] bg-opacity-5 h-12 p-2 rounded-md'>
                                                        <h2 class="text-base font-medium text-[#02072199]">Check</h2>
                                                        <div class='flex gap-4'>
                                                            <li class='flex gap-2'>
                                                                <Label for="checkpass" class="text-sm text-lime-500">Pass</Label>
                                                                <Input
                                                                id='checkpass'
                                                                type="radio"
                                                                class='w-4 h-4'
                                                                />
                                                            </li>
                                                            <li class='flex gap-2'>
                                                                <Label for="checkfail" class="text-sm text-red-500">Fail</Label>
                                                                <Input
                                                                id='checkfail'
                                                                type="radio"
                                                                class='w-4 h-4'
                                                                />
                                                            </li>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class='px-2 my-4'>
                                                    <h1 class="text-sm text-[#02072199]">Availability Status</h1>
                                                    <div class='w-full'>
                                                        <Select
                                                            id="gender"
                                                            class='bg-[#0000000D] bg-opacity-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block min-w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                                            <SelectTrigger class="">
                                                                <SelectValue placeholder="Purchase Eligible" />
                                                                </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="true">True</SelectItem>
                                                                <SelectItem value="false">False</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div class='px-2 my-4'>
                                                    <div class='md:flex w-full items-center justify-between h-12 p-2 rounded-md'>
                                                        <h1 class="text-sm text-[#02072199]">Price Status</h1>
                                                        <p class="text-[#020721] text-xl font-bold">₦ 1,558,100.50</p>
                                                    </div>
                                                    <div class='w-full my-4 md:my-0'>
                                                        <Select
                                                            id="gender"
                                                            class='bg-[#0000000D] bg-opacity-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block min-w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                                            <SelectTrigger class="">
                                                                <SelectValue placeholder="Exact Price" />
                                                                </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Edo">1,500,000. 50</SelectItem>
                                                                <SelectItem value="Lagos">234211</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div class='flex justify-start md:justify-end px-4'>
                                                    <Button @click="stageTab(stage)">
                                                        Change Status
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                      
                                    </TabsContent>
                                    <TabsContent value="3">
                                        <Card class="rounded-3xl w-4/6 md:w-11/12">
                                            <CardHeader class="bg-[#D7DBF5] text-[#020721] font-medium rounded-tr-3xl rounded-tl-3xl">
                                                Vendor Bank Details
                                            </CardHeader>
                                            <CardContent class="">
                                                <div class='px-2 my-4'>
                                                            <div class='flex flex-col gap-2'>
                                                                <Label for="checkpass" class="text-sm text-gray-500">Account Name</Label>
                                                                <Input
                                                                id='checkpass'
                                                                type="text"
                                                                class='w-full h-9 bg-[#0000000D] bg-opacity-5'
                                                                />
                                                            </div>
                                                            <div class='md:grid grid-cols-3 my-4'>
                                                                <div class='col-span-1'>
                                                                    <Select
                                                                        id="gender"
                                                                        class='w-full bg-[#0000000D] bg-opacity-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block min-w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                                                        <SelectTrigger class="">
                                                                            <SelectValue placeholder="Select Bank" />
                                                                            </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="Edo">1,500,000. 50</SelectItem>
                                                                            <SelectItem value="Lagos">234211</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div class='col-span-2 gap-2'>
                                                                    <Input
                                                                    id='checkpass'
                                                                    type="text"
                                                                    class='w-full h-10'
                                                                    placeholder='000 0000 000'
                                                                    />
                                                                </div>
                                                            </div>
                                                </div>
                                                    <div class='w-full px-2'>
                                                            <div class="text-sm text-gray-500">
                                                                Concluded Price
                                                            </div>
                                                            <div class='bg-[#0000000D] bg-opacity-5 w-full h-9 my-4 py-2 px-4 rounded-md'>
                                                                0.00
                                                            </div>
                                                    </div>

                                                <div class='md:flex justify-center px-4 mt-14 min-h-28 w-full'>
                                                    <Button @click="stageTab(stage)" class='w-full flex items-center justify-between'>
                                                        <p>Request Payment</p>
                                                        <p class='hidden md:inline-block'>₦ 1,558,100.50</p>
                                                    </Button>
                                                    <p class='block md:hidden bg-[#0000000D] bg-opacity-5 w-full h-9 my-4 py-2 px-4 rounded-md'>₦ 1,558,100.50</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                      </TabsContent>
                                      <TabsContent value="4">
                                            <Card class="rounded-3xl w-4/6 md:w-11/12">
                                                <CardHeader class="bg-[#D7DBF5] text-[#020721] font-medium rounded-tr-3xl rounded-tl-3xl">
                                                    Payment Status
                                                </CardHeader>
                                                <CardContent class='min-h-72'>
                                                    <div class='md:flex justify-center px-4 mt-32 min-h-28 w-full'>
                                                        <Button @click="stageTab(stage)" class='w-full flex items-center justify-between'>
                                                            <p>Requested Payment</p>
                                                            <p class='hidden md:inline-block'>₦ 1,558,100.50</p>
                                                        </Button>
                                                        <p class='block md:hidden bg-[#0000000D] bg-opacity-5 w-full h-9 my-4 py-2 px-4 rounded-md'>₦ 1,558,100.50</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                      </TabsContent>
                                  </Tabs>
                        </SheetContent>
                    </Sheet>


                </CardContent>
            </Card>
            <Card class="rounded-3xl">
                <CardHeader class="bg-[#020721] text-white rounded-tr-3xl rounded-tl-3xl">
                    Weesh Log
                </CardHeader>
                <CardContent class="min-h-24">
                </CardContent>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import MainNav from '@/components/MainNav.vue'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/vue'
import { Badge } from '@/components/ui/badge';
import { useWeeshDetailStore } from '@/stores/weeshes/weesh-details';
import { ref } from 'vue'
import {
  Sheet,
  SheetContent,
  SheetHeader,
//   SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Textarea } from '@/components/ui/textarea'


const store = useWeeshDetailStore()
// import axios from "@/services/ApiService";
import { useRoute } from 'vue-router';
import { HttpStatusCode } from 'axios';

const status = ref(false)
const toggleStatus = ()=>{
    status.value = !status.value
}

const stage = ref('1');
const setStage = (val: string)=>{
    stage.value = val
}
const stageTab = (strNumber: string)=> {
    status.value = false
  // Convert the string to a number
  let number = parseInt(strNumber, 10);

  // Check if the number is between 1 and 4
  if (number >= 1 && number <= 4) {
    // Increment the number by 1, but not more than 4
    number = Math.min(number + 1, 4);
  }
  stage.value = number.toString();
  console.log(stage.value, number)
}

const digitalFootprint = [
    'Change of Social Media Name',
    'Date of First Published',
    'Social Media Commentary',
    'Engagement Quality',
    'Followership Rating'
]

const additionalFootprint = [
    'Google Review Checker',
    'WHOIS Status',
    'CAC',
    'Bank Account Details'
]
const route = useRoute();
// const id = route.params.Id;
const id = '65a41c16e7004dd9b408b60c'
// '6639626d054298235b7d5bb8'
// store.getWeeshDetails(id)
</script>