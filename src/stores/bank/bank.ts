import { defineStore } from "pinia"
import axios from "@/services/ApiService";
import { toast } from "@/components/ui/toast";
import router from '@/router'

interface BankStore {
    outFlow: TransferDetails[],
    loading: boolean,
    perPage: number,
    currentPage: number,
    totalPages: number,
    page: number,
    balance: string,
    currency: string
}

export const useBankStore = defineStore('bank', {
    state: () : BankStore => ({
        outFlow: [],
        loading: false,
        perPage : 0,
        currentPage : 0,
        totalPages : 0,
        page: 1,
        balance: '',
        currency: ''
    }),
    actions: {
    async getoutFlow(){
        try{
          toast({
            description: 'Fetching data...',
            variant: 'loading',
            duration: 0 // Set duration to 0 to make it indefinite until manually closed
          })
            const response = await axios.get(`/api/v1/admin/weeshr/bank/transfers?page=${this.page}`)
            if (response.status === 200 || response.status === 201) {
              toast({
                description: `Successful`,
                variant: 'success'
              })
                const data = response.data.data
                this.outFlow = data.data;
                this.perPage = data.meta.perPage
                this.currentPage = data.meta.pageCount
                this.totalPages = data.meta.total
                
                
            }
        }catch(error){
            
            this.catchErr(error)
            this.loading = false;
        }
    },
    async getBalance(){
      try{
        toast({
          description: 'Fetching data...',
          variant: 'loading',
          duration: 0 // Set duration to 0 to make it indefinite until manually closed
        })
          const response = await axios.get(`/api/v1/admin/weeshr/bank/balance`)
          if (response.status === 200 || response.status === 201) {
            toast({
              description: `Successful`,
              variant: 'success'
            })
             
             this.balance = response.data.data[0].balance
             this.currency = response.data.data[0].currency
          }
      }catch(error){
          
          this.catchErr(error)
          this.loading = false;
      }
  },
    handlePageChange (newPage: number){
        if (newPage > 0 && newPage <= this.totalPages) {
          this.currentPage = newPage;
          this.page = newPage
          this.getoutFlow()
        //   this.getWeesheCategories(this.page, `Page ${this.page}`)
        }
      },
    catchErr (error: any){
      if(error.response.status === 400){
        toast({
          description:  error.response.data.message || 'Bad Request',
          variant: 'destructive'
        })
      }else if(error.response.status === 401){
        setTimeout(() => {
          router.push({ name: 'superAdmin-login' })
        }, 1000)
        toast({
          description:  error.response.data.message || 'Unauthenticated',
          variant: 'destructive'
        })
        sessionStorage.removeItem('token')
      }else if(error.response.status === 403){
        toast({
          description:  error.response.data.message || 'Unauthorized',
          variant: 'destructive'
        })
        setTimeout(() => {
          router.push({ name: 'home' })
        }, 3000)
      }else if(error.response.status === 422 ){
        toast({
          description:  error.response.data.message || 'Validation Error',
          variant: 'destructive'
        })
      }else if(error.response.status === 500 ){
        toast({
          description:  error.response.data.message || 'Server Error',
          variant: 'destructive'
        })
      }else if(error.response.status === 404 ){
        toast({
          description:  error.response.data.message || 'Not found',
          variant: 'destructive'
        })
      }
    }
    }
})

interface TransferDetails {
  amount: number;
  createdAt: string;
  currency: string;
  domain: string;
  failures: any;
  id: number;
  integration: number;
  reason: string;
  reference: string;
  source: string;
  source_details: any;
  status: string;
  titan_code: any;
  transfer_code: string;
  request: number;
  transferred_at: any;
  updatedAt: string;
  recipient: {
    active: boolean;
    createdAt: string;
    currency: string;
    description: any;
    domain: string;
    email: string;
    id: number;
    integration: number;
    metadata: any;
    name: string;
    recipient_code: string;
    type: string;
    updatedAt: string;
    is_deleted: boolean;
    isDeleted: boolean;
    details: {
      authorization_code: any;
      account_number: string;
      account_name: string;
      bank_code: string;
      bank_name: string;
    };
  };
  session: {
    provider: any;
    id: any;
  };
  fee_charged: number;
  fees_breakdown: any;
}
