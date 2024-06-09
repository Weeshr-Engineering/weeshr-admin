import { ref, type Ref } from 'vue';
import axios from 'axios';
import { useToast } from '@/components/ui/toast';

interface User {
    firstName: string,
    middleName: string | null,
    lastName: string,
    userName: string,
    phoneNumber: {
        countryCode: string,
        phoneNumber: string,
    },
    dob: string,
    gender: string,
    email: string,
    address: string | null,
    verificationBadge: string,
    emailVerified: boolean,
    isDisabled: boolean,
    avatar: string | null
}

const getUser = () => {
    const appUser = ref<User | null>(null);
    const error: Ref<string> = ref('')
    const token = sessionStorage.getItem('token') || ''
    const { toast } = useToast()
    
    const load = async (_id: string | string[]) => {
        try {
            toast({
                description: "Loading...."
            })
            const response = await axios.get('https://api.staging.weeshr.com/api/v1/admin/accounts/users/' + _id,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );
        
            if (response.data.code === 200) {
                appUser.value = response.data.data;
                toast({
                    description: response.data.message,
                    variant: 'success'
                })
            } else {
                error.value = response.data.message;
                toast({
                    description: response.data.message,
                    variant: 'destructive'
                })
            }
        }
        catch(err: any) {
            error.value = err.message
            toast({
                description: err.message,
                variant: 'destructive'
            })
        }
    }

    return {appUser, error, load}
}

export default getUser