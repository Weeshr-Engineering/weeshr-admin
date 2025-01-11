import { ref, type Ref, computed } from 'vue'
import axios from "@/services/ApiService";
import { useToast } from '@/components/ui/toast'
import { useWeeshStore } from '@/stores/weeshes/weeshes-count';

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
  const store = useWeeshStore()
  const currentPage = computed(() => {
    return store.currentPage
  });

  const { toast } = useToast()
  const base = `/api/v1/admin/weeshes?per_page=20&`

  const loadWeeshes = async (option?: string | number) => {
    const url = () => {
      const statusOptions = new Set([
        'INITIATED',
        'ADDED',
        'OUTBOUND',
        'PENDING',
        'DELIVERED',
        'FULFILLED'
      ])

      const fulfillmentStatusOptions = new Set([
        'PURCHASE ELIGIBLE',
        'COST ABOVE PRICE',
        'OUT OF STOCK',
        'PROCURRED',
        'UNATTENDED'
      ])

      if (typeof option === 'string') {
        const numericValue = Number(option);

        if (!isNaN(numericValue) && option.trim() === numericValue.toString()) {
          // It's a number
          if (numericValue > totalPages.value) {
            return base + `page=${totalPages.value}`
          } else if (numericValue <= 0) {
            return base + `page=${1}`
          } else {
            return base + `page=${option}`
          }
        } else {
          // It's a string
          if (statusOptions.has(option)) {
            return base + `status=${option}`
          } else if (fulfillmentStatusOptions.has(option)) {
            return base + `fulfillment_status=${option}`
          } else {
            return base + `search=${option}`
          }
        }
      } 
      return base
    }
    try {
      toast({
        description: 'Loading....',
        variant: 'loading'
      })

      const response = await axios.get(url())

      if (response.data.code === 200) {
        weeshes.value = response.data.data.data
        totalPages.value = response.data.data.totalPages
        store.currentPage = response.data.data.currentPage

        toast({
          description: response.data.message,

          variant: 'success',

        })
      } else {
        error.value = 'Error getting Weeshes list. Kindly try again'
        toast({
          description: response.data.message,
          variant: 'destructive'
        })
      }
    } catch (err: any) {
      error.value = 'Error getting Weeshes list. Kindly try again'
      toast({
        description: err.message,
        variant: 'destructive'
      })
    }
  }

  return { weeshes, error, totalPages, currentPage, loadWeeshes }
}

export default getWeeshes
