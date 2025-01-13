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
  const perPage = computed(() => {
    return store.perPage
  });

  const { toast } = useToast()
  let base = `/api/v1/admin/weeshes?`

  const loadWeeshes = async (option?: string | number) => {
    base = base + `per_page=${perPage.value}&`
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
        if (statusOptions.has(option)) {
          return base + `status=${option}`
        } else if (fulfillmentStatusOptions.has(option)) {
          return base + `fulfillment_status=${option}`
        } else {
          return base + `search=${option}`
        }
      } else if (typeof option === 'number') {
        return base + `page=${option}`
      }
      console.log(base)
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
  const searchWeeshPage = async (pageNum: number) => {
    try {
      toast({
        description: 'Loading....',
        variant: 'loading'
      })
      const response = await axios.get(`/api/v1/admin/weeshes?per_page=${perPage.value}&page=${pageNum}`)

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

  const weeshPerPage = async (perPage: number) => {
    try {
      toast({
        description: 'Loading....',
        variant: 'loading'
      })
      const response = await axios.get(`/api/v1/admin/weeshes?per_page=${perPage}&page=1`)

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

  return { weeshes, error, totalPages, currentPage, loadWeeshes, searchWeeshPage, weeshPerPage }
}

export default getWeeshes
