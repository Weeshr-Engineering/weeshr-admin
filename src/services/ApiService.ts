import axios from "axios";
import router from "@/router";
import { toast } from '@/components/ui/toast';
import { useSuperAdminStore } from "@/stores/super-admin/super-admin";

// Set base URL for Axios
axios.defaults.baseURL = import.meta.env.VITE_APP_API_BASE_URL;

// Set default headers
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";
// axios.defaults.withCredentials = true

// Axios response interceptor
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const { name, fullPath } = router.currentRoute.value;

        if (error.response && error.response.status === 401 && !["superAdmin-login"].includes(name as unknown as string)) {

            toast({
                title: `You are unauthenticated`,
                variant: 'destructive'
            });

            const { clearToken } = useSuperAdminStore();

            clearToken();

            router.push({ name: "superAdmin-login", ...(fullPath) && { query: { redirect_to: fullPath } } });
        }

        return Promise.reject(error);
    }
);

if (localStorage.getItem("token") && localStorage.getItem("token") !== null) {
    axios.defaults.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
}

// Export axios instance
export default axios;