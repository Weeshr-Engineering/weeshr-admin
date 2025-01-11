import { defineStore } from "pinia"
import axios from "@/services/ApiService";
import { useToast } from '@/components/ui/toast';
import { useGeneralStore } from "../general-use";

// const store = useGeneralStore()
export const useWeeshStore = defineStore('weeshStore', {
    state: () => ({
        addedCount: 0,
        initiatedCount: 0,
        fufilledCount: 0,
        deliveredCount: 0,
        pendingCount: 0,
        outboundCount: 0,
        loading: false,
        currentPage: 1
    }),
    actions: {
        async getWeeshesCount() {
            const { toast } = useToast()
            
            try {
                this.loading = true
                const response = await axios.get(
                    '/api/v1/admin/weeshes/count/status'
                )
                if (response.status === 200 || response.status === 201) {
                    this.addedCount = response.data.data.status.ADDED;
                    this.initiatedCount = response.data.data.status.INITIATED;
                    this.fufilledCount = response.data.data.status.FULFILLED;
                    this.deliveredCount = response.data.data.status.DELIVERED;
                    this.pendingCount = response.data.data.status.PENDING;
                    this.outboundCount = response.data.data.status.OUTBOUND;

                    this.loading = false
                } else {
                    toast({
                        description: response.data.message || 'Network Error',
                        variant: 'destructive'
                    })
                }
            }
            catch (err: any) {
                if (err.response) {
                    useGeneralStore().catchErr(err)
                } else {
                    toast({
                        description: err.message || 'Poor network',
                        variant: 'destructive'
                    })      
                }
            }
        }
    }
})