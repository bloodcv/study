import { createApp, defineAsyncComponent } from 'vue'
import App from './App.vue'
import MyApp from './MyApp.vue'
import './index.css'

// createApp(App).mount('#app')

const AsyncCom = defineAsyncComponent(() => import('./components/AsyncCom.vue'))

const app = createApp(App)

app.component('AsyncCom', AsyncCom)
app.mount('#app')

const myapp = createApp(MyApp)

myapp.component('AsyncCom', AsyncCom)
myapp.mount('#root')
