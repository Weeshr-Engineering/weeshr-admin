import { defineStore } from 'pinia'
import axios from "@/services/ApiService";
import { toast } from '@/components/ui/toast'
import router from '@/router'

interface Image {
  _id: string,
  type: string,
  url: string,
  [key: string]: any; // Optional property for any additional fields
}
  
interface Item {
  color: string;
  identifier: string;
  is_active: boolean;
  images: Image[];
  name: string;
  _id: string;
}

interface Color {
  name: string,
  hexacode: string
}

interface WeeshConfig {
  events: Item[],
  perPage: number,
  currentPage: number,
  totalPages: number,
  page: number,
  active: boolean,
  color: Color[],
}
export const useEventConfigStore = defineStore('weeshConfig', {
  state: (): WeeshConfig => ({
    perPage: 0,
    currentPage: 0,
    totalPages: 0,
    events: [],
    page: 1,
    active: false,
    color: []
  }),
  actions: {
    async getWeeshEvents(page: number, msg: string) {
            
      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        variant: 'loading',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `/api/v1/admin/weesh/event/all?per_page=5&page=${page}`,
      };
            
      axios.request(config)
        .then((response) => {
          this.perPage = response.data.data.perPage
          this.currentPage = response.data.data.currentPage
          this.totalPages = response.data.data.totalPages
          this.events = response.data.data.data
          toast({
            title: 'Success',
            description: `Successful: ${msg}`,
            variant: 'success'
          })
          console.log(this.events)
          return response.data.data
        })
        .catch((error) => {
          this.catchErr(error)
        });          
    },
    async getColors() {
      try {
        const color = await axios.get('/api/v1/colors')
        if (color.status === 200) {
          this.color = color.data.data
          toast({
            description: `Successful: ${color.data.message}`,
            variant: 'success'
          })
        }
      } catch (error) {
        this.catchErr(error)
      }
    },
    async handleSwitch(value: string, category: string, status: boolean) {
      toast({
        title: `${status ? `Disabling ${category}...` : `Activating ${category}...`}`,
        description: `${status ? `Disabling ${category} in progress...` : `Activating ${category} in progress...`}`,
        duration: 0, // Set duration to 0 to make it indefinite until manually closed
        variant: 'loading'
      })
      const data = {
        "is_active": !status
      };
         
      console.log(data) 
      const config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `/api/v1/admin/weesh/event/${value}`,
        data: data
      };
        
      axios.request(config)
        .then((response) => {
          // Check if response status is 200 or 201
          if (response.status === 200 || response.status === 201) {
            // Show success toast
            // this.adminStatus = !this.adminStatus
            this.getWeeshEvents(this.page, `${status ? `${category} Disabled` : `${category} Activated`}`)
            toast({
              title: 'Success',
              description: `${status ? `${category} Disabled` : `${category} Activated`}`,
              variant: 'success'
            })
          }
        })
        .catch((error) => {
          this.catchErr(error)
        });
    },
    handleActive() {
      this.active = !this.active
    },
    async deleteWeeshEvent(id: string) {
          
      toast({
        title: 'Deleting Data',
        description: 'Deleting data...',
        duration: 0, // Set duration to 0 to make it indefinite until manually closed
        variant: 'loading'
      })
          
            
      const config = {
        method: 'delete',
        url: `/api/v1/admin/weesh/event/${id}`,
      };
            
      axios.request(config)
        .then((response) => {
          toast({
            title: 'Success',
            description: `Successful: data deleted`,
            variant: 'success'
          })
          if (this.events.length === 1 && this.page !== 1) {
            this.getWeeshEvents(this.page - 1, '')
          } else {
            this.getWeeshEvents(this.page, '')
          }
        })
        .catch((error) => {
          this.catchErr(error)
        });
    },
    handlePageChange(newPage: number) {
      if (newPage > 0 && newPage <= this.totalPages) {
        this.currentPage = newPage;
        this.page = newPage
        this.getWeeshEvents(this.page, `Page ${this.page}`)
        toast({
          description: `Loading page ${newPage}`,
          duration: 0, // Set duration to 0 to make it indefinite until manually closed
          variant: 'loading'
        })
      }
    },
    catchErr(error: any) {
      if (error.response.status === 400) {
        toast({
          description: error.response.data.message || 'Bad Request',
          variant: 'destructive'
        })
      } else if (error.response.status === 401) {
        setTimeout(() => {
          router.push({ name: 'superAdmin-login' })
        }, 1000)
        toast({
          description: error.response.data.message || 'Unauthenticated',
          variant: 'destructive'
        })
        sessionStorage.removeItem('token')
      } else if (error.response.status === 403) {
        toast({
          description: error.response.data.message || 'Unauthorized',
          variant: 'destructive'
        })
        setTimeout(() => {
          router.push({ name: 'home' })
        }, 3000)
      } else if (error.response.status === 422) {
        toast({
          description: error.response.data.message || 'Validation Error',
          variant: 'destructive'
        })
      } else if (error.response.status === 500) {
        toast({
          description: error.response.data.message || 'Server Error',
          variant: 'destructive'
        })
      } else if (error.response.status === 404) {
        toast({
          description: error.response.data.message || 'Not found',
          variant: 'destructive'
        })
      }
    }
  },
})

//   const events = ref<any[]>([])
// const page = ref(1)
// const perPage = ref(0);
// const currentPage = ref(0);
// const totalPages = ref(0)
// const img = ref<any[]>([])
// const MAX_FILE_SIZE = 1024 * 1024 * 2;
// const active = ref(false)
// const currentCategory = ref('')
// const updateImg = ref<any[]>([])
// const updateName = ref('')