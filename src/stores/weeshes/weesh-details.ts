import { defineStore } from "pinia"
import axios from "@/services/ApiService";
// import { useToast } from '@/components/ui/toast';

export const useWeeshDetailStore = defineStore('weeshDetail', {
    state: () => ({

    }),
    actions: {
    async getWeeshDetails(id: any){
        const response = await axios.get(`/api/v1/admin/accounts/users/${id}/weeshes`)
        console.log(response)
    }
    }
})
// /accounts/users/:id/weeshes