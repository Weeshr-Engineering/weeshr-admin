import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import moment from 'moment'

// @ts-ignore
import App from './App.vue'
import router from './router'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

const app = createApp(App)

app.use(router)
app.use(autoAnimatePlugin)
app.use(createPinia())

app.config.globalProperties.$moment = moment

app.mount('#app')
