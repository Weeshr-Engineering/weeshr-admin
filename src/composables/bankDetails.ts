import { ref, type Ref } from 'vue'
import axios from '@/services/ApiService'
import { useToast } from '@/components/ui/toast'

const { toast } = useToast()

export const getBank = () => {
  const balance: Ref<number> = ref(0)
  const bankError: Ref<string> = ref('')

  const getBankDetails = async () => {
    const base = `api/v1/admin/weeshr/bank/balance`

    try {
      toast({
        description: 'Loading....',
        variant: 'loading'
      })
      const response = await axios.get(base)

      if (response.data.code === 200) {
        balance.value = response.data.data.balance
        toast({
          description: response.data.message,
          variant: 'success'
        })
      }
    } catch (err: any) {
      bankError.value = `${err.response.data.message}, ${err.response.data.error}.`
      toast({
        description: err.response.data.message,
        variant: 'destructive'
      })
    }
  }

  return {
    getBankDetails,
    balance
  }
}

export default {
  getBank
}
