<script setup lang="ts">
import { defineProps, computed, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Icon } from '@iconify/vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

// Define props
const props = defineProps<{
  name: string
  ids: string[] // Expecting an array of IDs
}>()

const formattedIds = computed(() => props.ids.join(', '))

// Temporary state for selected variables
const tempSelectedVariables = ref<string[]>([])
const userDetails = ref<string[]>([
  'firstName',
  'middleName',
  'lastName',
  'phoneNumber',
  'dob',
  'gender',
  'email',
  'address',
  'verificationBadge',
  'emailVerified'
])

// Function to toggle selected variables
const toggleVariable = (variable: string) => {
  if (tempSelectedVariables.value.includes(variable)) {
    tempSelectedVariables.value = tempSelectedVariables.value.filter((item) => item !== variable)
  } else {
    tempSelectedVariables.value.push(variable)
  }
}

const searchQuery = ref('')

// Filter user details based on search query
const filteredUserDetails = computed(() => {
  const trimmedQuery = searchQuery.value.trim().toLowerCase()
  return userDetails.value.filter((detail) => detail.toLowerCase().includes(trimmedQuery))
})

// Confirmation state
const showConfirmation = ref(false)
const emailMessage = ref('')

// Function to handle email sending
const sendEmail = () => {
  // Your email sending logic here
  console.log('Email sent with message:', emailMessage.value)
  // Close the confirmation popover after sending email
  showConfirmation.value = false
}
</script>

<template>
  <div
    class="p-0 overflow-y-auto rounded-lg shadow-md md:border md:border-gray-300 md:p-4 email-template md:bg-gray-50"
  >
    <main
      class="grid flex-1 gap-4 p-4 md:p-4 md:grid-cols-2 lg:grid-cols-3 min-h-[80vh] overflow-y-auto overflow-scroll"
    >
      <div class="relative flex-col items-start gap-8 md:flex">
        <form class="grid items-start w-full gap-6">
          <fieldset class="grid gap-6 p-4 border rounded-lg">
            <legend class="px-1 -ml-1 text-sm font-medium">Settings</legend>
            <div class="grid gap-3">
              <div class="grid gap-2">
                <Popover>
                  <PopoverTrigger as-child>
                    <Button variant="outline" class="w-full gap-2 ml-auto">
                      <span v-if="tempSelectedVariables.length === 0">Select Variables</span>
                      <span v-else-if="tempSelectedVariables.length <= 2">{{
                        tempSelectedVariables.join(', ')
                      }}</span>
                      <span v-else> ... {{ tempSelectedVariables.slice(-2).join(', ') }} </span>

                      <Icon
                        icon="gridicons:chevron-down"
                        width="16"
                        height="16"
                        class="inline-block mr-2"
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="p-0" align="end">
                    <Command>
                      <CommandInput placeholder="Select variable..." v-model="searchQuery" />
                      <CommandList>
                        <CommandEmpty>No variables found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            v-for="detail in filteredUserDetails"
                            :key="detail"
                            class="flex flex-row items-center justify-start w-full gap-2 px-4 py-2"
                          >
                            <div class="flex items-center space-x-2">
                              <Checkbox
                                :id="detail"
                                :checked="tempSelectedVariables.includes(detail)"
                                @update:checked="() => toggleVariable(detail)"
                              />
                              <label
                                :for="detail"
                                class="text-sm font-medium leading-none cursor-pointer"
                              >
                                {{ detail }}
                              </label>
                            </div>
                          </CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </fieldset>

          <!-- Selected Variables Display -->
          <fieldset class="grid gap-6 p-4 border rounded-lg min-h-[150px]">
            <legend class="px-1 -ml-1 text-sm font-medium">Selected Variables</legend>
            <div class="grid gap-3">
              <div v-if="tempSelectedVariables.length === 0">No variables selected</div>
              <div v-else class="flex flex-wrap gap-2">
                <Badge
                  disable
                  v-for="variable in tempSelectedVariables"
                  :key="variable"
                  variant="outline"
                  class="p-2 min-w-[70px] text-center items-center justify-center flex rounded-lg bg-[#020721] text-white bg-primary pointer-events-none"
                >
                  {{ variable }}
                </Badge>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
      <div
        class="relative flex flex-col h-full md:p-4 rounded-xl lg:col-span-2 min-h-[50vh] md:min-h-full bg-white"
      >
        <form
          class="relative flex flex-col h-full gap-2 p-4 border rounded-lg md:gap-4 justify-evenly"
        >
          <Textarea
            v-model="emailMessage"
            placeholder="Type your message here..."
            class="p-3 shadow-none resize-none min-h-[85%] min-full"
          />

          <!-- Confirmation Popover for sending email -->
          <Popover v-model:open="showConfirmation">
            <PopoverTrigger as-child>
              <Button
                class="p-4 m-2 mr-1 lg:w-40 lg:ml-auto md:px-4"
                size="xxxl"
                aria-label="Send your email"
              >
                Send Email
              </Button>
            </PopoverTrigger>

            <PopoverContent class="w-80">
              <div class="grid gap-4">
                <h4 class="font-medium leading-none">Are you sure you want to send this email?</h4>
                <p class="text-sm text-muted-foreground">
                  Please confirm to proceed with sending your email.
                </p>
                <div class="flex justify-end gap-2">
                  <Button variant="outline" @click="showConfirmation = false"> Cancel </Button>
                  <Button @click="sendEmail"> Yes, Send </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </form>
      </div>
    </main>
  </div>
</template>
