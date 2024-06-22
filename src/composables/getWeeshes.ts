import { ref, type Ref } from 'vue'
import axios from 'axios'
import { useToast } from '@/components/ui/toast'

interface Weeshes {
  _id: string
  name: string
  user: {
    _id: string
    userName: string
  }
  category: {
    name: string
  }
  price: {
    price: string
    genieGratuity: string
  }
  currency: {
    code: string
  }
  status: string
  fulfilledStatus: string
}

const getWeeshes = () => {
  const weeshes: Ref<Weeshes[]> = ref([])
  const error: Ref<string> = ref('')
  const totalPages = ref(0)
  const currentPage = ref(0)
  const token = sessionStorage.getItem('token') || ''
  const { toast } = useToast()

  const loadWeeshes = async () => {
    try {
      toast({
        description: 'Loading....'
      })
      const response = await axios.get(
        `https://api.staging.weeshr.com/api/v1/admin/weeshes?search`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.code === 200) {
        console.log(response.data)
        weeshes.value = response.data.data.data
        totalPages.value = response.data.data.totalPages
        currentPage.value = response.data.data.currentPage

        toast({
          description: response.data.message,
          variant: 'success'
        })
      } else {
        error.value = response.data.message
        toast({
          description: response.data.message,
          variant: 'destructive'
        })
      }
    } catch (err: any) {
      error.value = err.message
      toast({
        description: err.message,
        variant: 'destructive'
      })
    }
  }

  return { weeshes, error, totalPages, currentPage, loadWeeshes }
}

export default getWeeshes
