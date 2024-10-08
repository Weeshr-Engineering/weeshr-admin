import { defineStore } from "pinia"
import axios from "@/services/ApiService";
import { toast } from "@/components/ui/toast";
import router from '@/router'

// const store = useGeneralStore()

interface WeeshDetailsStore {
    detail: any,
    stage: string,
    category: any,
    image: any,
    loading: boolean
}
export const useWeeshDetailStore = defineStore('weeshDetail', {
    state: () : WeeshDetailsStore => ({
        stage: '1',
        detail: {},
        category: {},
        image: {},
        loading: false
    }),
    actions: {
    async getWeeshDetails(id: any){
        try{
            this.loading = true
            // useGeneralStore().setLoadingToTrue()
            const response = await axios.get(`/api/v1/admin/weesh/${id}`)
            if (response.status === 200 || response.status === 201) {
                const data = response.data.data
                this.detail = data;
                if(data.category?.length !== 0){
                    this.category = data.category[0]
                }
                if(data.images?.length !== 0){
                    this.image = data.images[0]
                }
                // useGeneralStore().setLoadingToFalse()
                this.loading = false;
            }
        }catch(error){
            // useGeneralStore().setLoadingToFalse()
            // useGeneralStore().setLoading(false)
            this.catchErr(error)
            this.loading = false;
        }
    }, 
    setStage (val: string){
        this.stage = val
    },
    stageTab (strNumber: string){
        let number = parseInt(strNumber, 10);

        // Check if the number is between 1 and 4
        if (number >= 1 && number <= 4) {
            // Increment the number by 1, but not more than 4
            number = Math.min(number + 1, 4);
        }
        this.stage = number.toString();
    },
    formatPrice (val: string){
        const price = parseInt(val)
        const formattedPrice = new Intl.NumberFormat('en-US').format(price);
        return formattedPrice;
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
// /accounts/users/:id/weeshes

// const stage = ref('1');
// const setStage = (val: string)=>{
//     stage.value = val
// }
// const stageTab = (strNumber: string)=> {
  // Convert the string to a number
//   let number = parseInt(strNumber, 10);

//   // Check if the number is between 1 and 4
//   if (number >= 1 && number <= 4) {
//     // Increment the number by 1, but not more than 4
//     number = Math.min(number + 1, 4);
//   }
//   stage.value = number.toString();
// }