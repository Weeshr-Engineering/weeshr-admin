import { toast } from '@/components/ui/toast'
import router from '@/router'


// functions to catch all error and throw appropriate toast response.
// interface Error {
//     response: {
//         data: {
//             message: string
//         },
//         status: number
//     }
// }
export const catchErr = (error: any)=>{
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