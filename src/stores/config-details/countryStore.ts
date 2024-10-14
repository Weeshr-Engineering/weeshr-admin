import { defineStore } from "pinia";
import axios from "@/services/ApiService";
import { toast } from '@/components/ui/toast'
import { catchErr } from '@/composables/catchError'

export const useCountryStore = defineStore({
  id: 'countries',
  state: (): CountryStore => ({
    countries: [],
    state: false,
    editState: false,
    perPage : 0,
    currentPage : 0,
    totalPages : 0,
    page: 1,
  }),
  actions: {
    async createCountry(data: any) {

      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        variant: 'loading',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `/api/v1/admin/country`,
        data: data
      };

      axios.request(config)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            this.getcountries(this.page, 'New country Created')
            this.state = false
          }
        })
        .catch((error) => {
          catchErr(error)
        });
    },
    async getcountries(page: number, msg: string) {

      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        variant: 'loading',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })
      try {
        const response = await axios.get(
          `/api/v1/admin/countries?page=${page}`,
         
        )

        if (response.status === 200 || response.status === 201) {
          toast({
            title: 'Success',
            description: msg,
            variant: 'success'
          })
        }
        this.countries = response.data.data.data
        this.perPage = response.data.data.perPage
        this.currentPage = response.data.data.currentPage
        this.totalPages = response.data.data.totalPages
        // set Loading to false

      } catch (error: any) {
        catchErr(error)
      }
    },
    async resetSeed() {

        toast({
          title: 'Loading Data',
          description: 'Fetching data...',
          variant: 'loading',
          duration: 0 // Set duration to 0 to make it indefinite until manually closed
        })
        try {
          const response = await axios.get(
            `/api/v1/admin/countries/seed`,
           
          )
  
          if (response.status === 200 || response.status === 201) {
            toast({
              title: 'Success',
              description: response.data.message,
              variant: 'success'
            })
          }
          // set Loading to false
  
        } catch (error: any) {
          catchErr(error)
        }
      },
    updateCountry(data: any, code: string) {

      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        variant: 'loading',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })

      const config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `/api/v1/admin/country/${code}`,
        data: data
      };

      axios.request(config)
        .then(() => {
          // console.log(JSON.stringify(response.data));
          this.getcountries(this.page, 'Country Updated Successfully')
          this.editState = false
        })
        .catch((error) => {
          catchErr(error)
        });
    },
    updateState(state: boolean, code: string) {
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
          url: `/api/v1/admin/country/${code}`,
          data: data
        };
  
        axios.request(config)
          .then(() => {
            // console.log(JSON.stringify(response.data));
            this.getcountries(this.page, 'Country Updated Successfully')
          })
          .catch((error) => {
            catchErr(error)
          });
      },
    async deleteCountry(code: string) {

      toast({
        title: 'Deleting Data',
        description: 'Deleting data...',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })


      const config = {
        method: 'delete',
        url: `/api/v1/admin/countries?codes=${code}`,
      };

      axios.request(config)
        .then(() => {

          this.getcountries(this.page, 'Currency Deleted Successfully')
        })
        .catch((error) => {
          catchErr(error)
        });
    },
    handlePageChange (newPage: number){
        if (newPage > 0 && newPage <= this.totalPages) {
          this.currentPage = newPage;
          this.page = newPage
          this.getcountries(this.page, `Page ${this.page}`)
          toast({
            description: `Loading page ${newPage}`,
            duration: 0, // Set duration to 0 to make it indefinite until manually closed
            variant: 'loading'
          })
        }
      },
  }
})

interface CountryStore {
  countries: any[],
  state: boolean,
  editState: boolean,
  perPage : number,
  currentPage : number,
  totalPages : number,
  page: number,
}
