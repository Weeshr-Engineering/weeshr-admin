import { defineStore } from "pinia";
import axios from "@/services/ApiService";
import { toast } from '@/components/ui/toast'
import router from '@/router'

export const useCurrencyStore = defineStore({
  id: 'currencies',
  state: (): CurrencyStore => ({
    currencies: [],
    state: false,
    editState: false
  }),
  actions: {
    async createCurrency(data: any) {

      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        variant: 'loading',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `/api/v1/admin/currency`,
        data: data
      };

      axios.request(config)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            this.getCurrencies('New Currency Created')
            this.state = false
          }
        })
        .catch((error) => {
          this.catchErr(error)
        });
    },
    async getCurrencies(msg: string) {

      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        variant: 'loading',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })
      try {
        const response = await axios.get(
          `/api/v1/admin/currencies`,
         
        )

        if (response.status === 200 || response.status === 201) {
          toast({
            title: 'Success',
            description: msg,
            variant: 'success'
          })
        }
        this.currencies = response.data.data.data
        console.log(this.currencies)
        // set Loading to false

      } catch (error: any) {
        this.catchErr(error)
      }
    },
    updateCurrency(data: any, id: string) {

      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        variant: 'loading',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })

      const config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `/api/v1/admin/currency/${id}`,
        data: data
      };

      axios.request(config)
        .then((response) => {
          // console.log(JSON.stringify(response.data));
          this.getCurrencies('Currency Updated Successfully')
          this.editState = false
        })
        .catch((error) => {
          console.log(error)
          this.catchErr(error)
        });
    },
    updateState(state: boolean, id: string) {
        const data = {
            isEnabled: state
        }
        toast({
          title: 'Loading Data',
          description: 'Fetching data...',
          variant: 'loading',
          duration: 0 // Set duration to 0 to make it indefinite until manually closed
        })
  
        const config = {
          method: 'patch',
          maxBodyLength: Infinity,
          url: `/api/v1/admin/currency/${id}`,
          data: data
        };
  
        axios.request(config)
          .then((response) => {
            // console.log(JSON.stringify(response.data));
            this.getCurrencies('Currency Updated Successfully')
          })
          .catch((error) => {
            console.log(error)
            this.catchErr(error)
          });
      },
    async deleteCurrency(id: string) {

      toast({
        title: 'Deleting Data',
        description: 'Deleting data...',
        variant: 'loading',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })


      const config = {
        method: 'delete',
        url: `/api/v1/admin/currency/${id}`,
      };

      axios.request(config)
        .then((response) => {

          this.getCurrencies('Currency Deleted Successfully')
        })
        .catch((error) => {
          this.catchErr(error)
        });
    },
    catchErr (error: any){
        console.log(error)
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

interface CurrencyStore {
  currencies: any[],
  state: boolean,
  editState: boolean
}
