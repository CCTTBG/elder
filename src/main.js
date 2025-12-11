import { createApp } from 'vue'
import { createPinia } from 'pinia'

// import App from './App.vue' 
import startPage from './component/startPage.vue'
import router from './router'

const app = createApp(startPage)

app.use(createPinia())
app.use(router)

app.mount('#app')
