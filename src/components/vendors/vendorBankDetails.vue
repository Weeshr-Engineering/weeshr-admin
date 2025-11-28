<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { Bank } from './vendor-types'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Icon } from '@iconify/vue'
import { toast } from '../ui/toast';
import axios from 'axios';
import { catchErr } from '@/composables/catchError';

// Props
const props = defineProps<{
  bankDetails: Bank[]
  cbnBankCodes: { code: string; name: string }[]
  frequency: string[],
  refresh: (msg: string)=> void;
  id: string
}>()

// Editing state - track which bank is being edited and store individual edit data
const editingBankId = ref<string | null>(null)
const editedBanks = reactive<Record<string, {
  bankCode: string
  accountNumber: string
  bankName: string
  payoutFrequency: 'daily' | 'weekly' | 'monthly'
}>>({})

// Verified state (local until API)
const verifiedMap = ref<Record<string, boolean>>({})

// initialize verified defaults
props.bankDetails.forEach((b) => {
  verifiedMap.value[b._id] = true
})

const startEdit = (bank: Bank) => {
  editingBankId.value = bank._id
  editedBanks[bank._id] = {
    bankCode: bank.bankCode,
    accountNumber: bank.accountNumber,
    payoutFrequency: bank.payoutFrequency,
    bankName: bank.bankName
  }
}

const deleteBankData = async (msg: string, _id: string) => {
  toast({
    title: 'Loading Data',
    description: 'Fetching data...',
    variant: 'loading',
    duration: 0 // Set duration to 0 to make it indefinite until manually closed
  })

  try {
    // Set loading to true
    // useGeneralStore().setLoading(true)
    const response = await axios.delete(`/api/v1/admin/market/banks/${_id}`)

    if (response.status === 200 || response.status === 201) {
      toast({
        title: 'Success',
        description: `Success- ${msg}`,
        variant: 'success'
      })
      props.refresh('Success')
    }
    // set Loading to false
  } catch (error: any) {
    catchErr(error)
    if (error.response.status === 401) {
      // sessionStorage.removeItem('token')
      // Clear token from superAdminStore
      // superAdminStore.setToken('')

      setTimeout(() => {
        // router.push({ name: 'super-admin-login' })
      }, 3000)

      toast({
        title: 'Unauthorized',
        description: 'You are not authorized to perform this action. Redirecting to home page...',
        variant: 'destructive'
      })
      // Redirect after 3 seconds
    } else {
      toast({
        title: error.response.data.message || 'An error occurred',
        variant: 'destructive'
      })
    }
  }
}

  const verifyDetails = async (accNum: string, code: string) => {
    toast({
      title: 'Loading Data',
      description: 'Verifying bank details...',
      variant: 'loading',
      duration: 0 // Set duration to 0 to make it indefinite until manually closed
    })
    if(!code || accNum === ''){
      toast({
        description: 'Incomplete data',
        variant: 'destructive'
      })
      return;
    }
    // VendorListStore.loadingControl(true)
    try {
      const response = await axios.post(
        '/api/v1/admin/market/banks/verify',
        {
          "bankCode": code,
          "accountNumber": accNum,
          // 'bankName': bankName,
          // 'vendorId': props.id
        }
      )

      // Check if response status is 200 or 201
      if (response.status === 200 || response.status === 201) {
        // Show success toast
        toast({
          title: 'Success',
          description: `Verification successfully.`,
          variant: 'success'
        })
      }
      // Handle success
    } catch (err: any) {
      //   VendorListStore.loadingControl(false)
      catchErr(err)
      // console.log(err)
      // Handle other errors
    }
  }

const cancelEdit = () => {
  editingBankId.value = null
}

const saveEdit = async (bankId: string) => {
  // console.log('Save bank', bankId, editedBanks[bankId])
  toast({
      title: 'Loading Data',
      description: 'Saving bank details...',
      variant: 'loading',
      duration: 0 // Set duration to 0 to make it indefinite until manually closed
    })
    // VendorListStore.loadingControl(true)
    try {
      const response = await axios.put(
        `/api/v1/admin/market/banks/${bankId}`,
        {
          "bankName": editedBanks[bankId].bankName,
          // "bankCode": bankCode.value,
          "accountNumber": editedBanks[bankId].accountNumber,
          "payoutFrequency": editedBanks[bankId].payoutFrequency.toLowerCase()
        }
      )

      // Check if response status is 200 or 201
      if (response.status === 200 || response.status === 201) {
        // Show success toast
        toast({
          title: 'Success',
          description: `${editedBanks[bankId].bankName} updated successfully.`,
          variant: 'success'
        })
        props.refresh('Success')
      }
      // Handle success
    } catch (err: any) {
      //   VendorListStore.loadingControl(false)
      catchErr(err)
      // Handle other errors
    }
  editingBankId.value = null
}

// Get edit data for a specific bank
// const getEditData = (bankId: string) => {
//   return editedBanks[bankId] || {
//     bankCode: '',
//     accountNumber: '',
//     payoutFrequency: '' as 'daily' | 'weekly' | 'monthly'
//   }
// }

// Get display value for inputs
const getDisplayValue = (bank: Bank, field: keyof typeof editedBanks[string]) => {
  if (isEditing(bank._id) && editedBanks[bank._id]) {
    return editedBanks[bank._id][field]
  }
  return bank[field]
}

// Dropdown action handler
const handleAction = (action: string, bank: Bank) => {
  switch (action) {
    case 'edit':
      startEdit(bank)
      break

    case 'delete':
      deleteBankData('Success', bank._id)
      // console.log('Delete', bank._id)
      break

    case 'verify':
      verifyDetails(bank.accountName, bank.bankCode)
      // verifiedMap.value[bank._id] = true
      break
  }
}

const isEditing = (id: string) => editingBankId.value === id
</script>

<template>
  <div 
    v-for="bank in bankDetails"
    :key="bank._id"
    class="bg-white dark:bg-gray-800 border rounded-xl p-6 shadow-sm hover:shadow-md transition-all mb-6"
  >
    <div class="flex justify-between items-start mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
        {{ isEditing(bank._id) ? (cbnBankCodes.find(b => b.code === getDisplayValue(bank, 'bankCode'))?.name || bank.bankName) : bank.bankName }}
      </h3>

      <!-- Verified Badge -->
      <!-- <span
        class="px-3 py-1 text-xs rounded-full"
        :class="
          verifiedMap[bank._id]
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
        "
      >
        {{ verifiedMap[bank._id] ? 'Verified' : 'Pending' }}
      </span> -->

      <!-- Actions Dropdown -->
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button
            class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <Icon icon="mdi:dots-vertical" width="20" height="20" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent class="w-40">
          <DropdownMenuItem @click="handleAction('edit', bank)">
            <Icon icon="uil:edit" class="mr-2" /> Edit
          </DropdownMenuItem>

          <DropdownMenuItem @click="handleAction('verify', bank)">
            <Icon icon="mdi:check-circle-outline" class="mr-2" /> Verify
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem class="text-red-600" @click="handleAction('delete', bank)">
            <Icon icon="mi:delete" class="mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <!-- Editable Inputs -->
    <div class="grid md:grid-cols-3 gap-6">
      <!-- Bank Select -->
      <div>
        <Label>Bank</Label>
        <Select
          :model-value="getDisplayValue(bank, 'bankCode')"
          @update:model-value="(value) => { 
            if (!editedBanks[bank._id]) editedBanks[bank._id] = { ...bank };
            editedBanks[bank._id].bankCode = value 
          }"
          :disabled="!isEditing(bank._id)"
        >
          <SelectTrigger class="h-11">
            <SelectValue>
              {{ isEditing(bank._id) 
                ? (cbnBankCodes.find(b => b.code === getDisplayValue(bank, 'bankCode'))?.name || 'Select bank')
                : bank.bankName 
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem 
              v-for="b in cbnBankCodes" 
              :key="b.code" 
              :value="b.code"
            >
              {{ b.name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Account Number -->
      <div>
        <Label>Account Number</Label>
        <Input
          :model-value="getDisplayValue(bank, 'accountNumber')"
          @update:model-value="(value) => { 
            if (!editedBanks[bank._id]) editedBanks[bank._id] = { ...bank };
            editedBanks[bank._id].accountNumber = String(value) 
          }"
          :readonly="!isEditing(bank._id)"
          class="h-11"
          :placeholder="bank.accountNumber"
        />
      </div>

      <!-- Payout Frequency -->
      <div>
        <Label>Payout Frequency</Label>
        <Select
          :model-value="getDisplayValue(bank, 'payoutFrequency')"
          @update:model-value="(value) => { 
            if (!editedBanks[bank._id]) editedBanks[bank._id] = { ...bank };
            editedBanks[bank._id].payoutFrequency = value as 'daily' | 'weekly' | 'monthly'
          }"
          :disabled="!isEditing(bank._id)"
        >
          <SelectTrigger class="h-11">
            <SelectValue>
              {{ getDisplayValue(bank, 'payoutFrequency') || bank.payoutFrequency }}
            </SelectValue>
          </SelectTrigger>

          <SelectContent>
            <SelectItem 
              v-for="f in frequency"
              :key="f"
              :value="f"
            >
              {{ f }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Save / Cancel -->
    <div v-if="isEditing(bank._id)" class="flex justify-end gap-3 mt-4">
      <Button variant="outline" @click="cancelEdit">Cancel</Button>
      <Button class="bg-blue-600 text-white" @click="saveEdit(bank._id)">
        Save Changes
      </Button>
    </div>
  </div>
</template>