import { ref, type Ref } from 'vue'
import axios from "@/services/ApiService";
import { useToast } from '@/components/ui/toast'

interface User {
  firstName: string
  middleName: string | null
  lastName: string
  userName: string
  phoneNumber: {
    normalizedNumber: string
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

interface Log {
  id: string
  timestamp: string
  user: {
    type: string
    extras: {
      email: string
      userName: string
    }
  }
  action: string
  status: string
  description: string
}


const { toast } = useToast()

export const getUser = () => {
  const appUser = ref<User | null>(null)
  const error: Ref<string> = ref('')

  const load = async (_id: string | string[]) => {
    try {
      toast({
        description: 'Loading....',
        variant: 'loading'
      })
      const response = await axios.get(
        '/api/v1/admin/accounts/users/' + _id,
      )

      if (response.data.code === 200) {
        appUser.value = response.data.data
        toast({
          description: response.data.message,
          variant: 'success'
        })
      } else {
        error.value = response.data.message
        toast({
          description: response.data.message,
          variant: 'warning'
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

  return { appUser, error, load }
}

export const getUserLog = () => {
  const userLog = ref<Log[]>([])
  const logError: Ref<string> = ref('')
  const count = ref<number>(0)

  const log = async (_id: string | string[], next: number, perPage: number) => {
    try {
      toast({
        description: 'Loading....',
        variant: 'loading'
      })
      const response = await axios.get(
        `/api/v1/admin/accounts/user/${_id}/logs?&per_page=${perPage}&page_item_from=${next}`,
      )

      if (response.data.code === 200) {
        userLog.value = response.data.data.data
        count.value = response.data.data.count

        toast({
          description: response.data.message,
          variant: 'success'
        })
      } else {
        logError.value = response.data.message
        toast({
          description: response.data.message,
          variant: 'destructive'
        })
      }
    } catch (err: any) {
      logError.value = err.message
      toast({
        description: err.message,
        variant: 'destructive'
      })
    }
  }

  return { userLog, count, logError, log }
}

export default {
  getUser,
  getUserLog
}
