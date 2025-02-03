import { ref, type Ref } from 'vue'
import axios from '@/services/ApiService'
import { useToast } from '@/components/ui/toast'

export interface User {
  _id: string
  firstName: string
  middleName: string | null
  lastName: string
  userName: string
  phoneNumber: {
    countryCode: string
    phoneNumber: string
    normalizedNumber: string
    _id: string
  }
  dob: string
  gender: string
  email: string
  address: string | null
  verificationBadge: string
  emailVerified: boolean
  isDisabled: boolean
  avatar: string | null
}

export type UserFilter = {
  page: number
  per_page: number
  gender?: string
  startDateMonth?: string
  endDateMonth?: string
  search?: string
  birthdayFilterConstants?: string
}

const getUsers = () => {
  const users: Ref<User[]> = ref([])
  const error: Ref<string> = ref('')
  const totalPages = ref(0)
  const currentPage = ref(0)
  const { toast } = useToast()

  const load = async (filter?: UserFilter) => {
    const base = `/api/v1/admin/accounts/users?`

    let queryString = ''

    for (const key in filter) {
      if (Object.prototype.hasOwnProperty.call(filter, key)) {
        const value = filter[key as keyof UserFilter]
        if (value !== undefined && value !== '') {
          if (queryString !== '') {
            queryString += '&'
          }
          queryString += `${key}=${value}`
        }
      }
    }

    const url = base + queryString

    try {
      toast({
        description: 'Loading....',
        variant: 'loading'
      })
      const response = await axios.get(url)

      if (response.data.code === 200) {
        users.value = response.data.data.data
        totalPages.value = response.data.data.totalPages
        currentPage.value = response.data.data.currentPage

        toast({
          description: response.data.message,
          variant: 'success'
        })
      }
    } catch (err: any) {
      error.value = `${err.response.data.message}, ${err.response.data.error}.`
      toast({
        description: err.response.data.message,
        variant: 'destructive'
      })
    }
  }

  return { users, error, totalPages, currentPage, load }
}

export default getUsers
