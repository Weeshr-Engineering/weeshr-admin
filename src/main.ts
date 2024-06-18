import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { abilitiesPlugin } from '@casl/vue';
// import ability from './services/ability';
import { ability } from './lib/ability';
// import { useAbilityStore } from './stores/permissions/permission-store';
import './assets/base.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
// const ability = useAbilityStore().ability
app.use(router)
app.use(abilitiesPlugin, ability, {
    useGlobalProperties: true
  })
app.mount('#app')
