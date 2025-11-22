<script setup lang="ts">
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
} from "@/components/ui/alert-dialog"

import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import { useRouter } from 'vue-router'

const superAdminStore = useSuperAdminStore()
const router = useRouter()
const endProxy = ()=>{
  useSuperAdminStore().setVendor(false, '')
  localStorage.setItem('vendor', JSON.stringify(''))
  sessionStorage.setItem('isProxy', JSON.stringify(false))
  router.push('/')
}
</script>

<template>
    <div v-if="superAdminStore.isProxy && superAdminStore.isVendor" class="fixed top-0 right-0 z-50 w-screen flex items-start justify-center">
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div class="border-2 rounded-b-3xl bg-white w-52 text-blue-700 flex items-center justify-center gap-4 py-2 shadow-lg">
                    <span class="border-2 border-blue-300 w-10 h-10 flex items-center justify-center rounded-full animate-pulse shadow-lg">
                        <span class="border-2 border-blue-300 w-8 h-8 flex items-center justify-center rounded-full animate-pulse shadow-lg cursor-pointer">
                        <span class="border-2 border-blue-300 w-6 h-6 flex items-center justify-center rounded-full animate-pulse shadow-lg">
                            X
                        </span>
                        </span>
                    </span>
                    Proxy mode
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    Do you want to end PROXY ACTIONS?
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction @click="endProxy">Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>
@/stores/super-admin/super-admin@/stores/super-admin/super-admin
