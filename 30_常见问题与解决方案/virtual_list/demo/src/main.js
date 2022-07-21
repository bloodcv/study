import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// createApp(App).mount('#app')
const app = createApp(App)
app.mount('#app')
const win = window
if (process.env.NODE_ENV === 'development') {
    if ('__VUE_DEVTOOLS_GLOBAL_HOOK__' in win) {
        win.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app
    }
}
  