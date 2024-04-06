import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'; // 引入 Element Plus 的消息提示组件


const app = createApp(App);

app.config.errorHandler = (err, instance, info) => {
  // 向追踪服务报告错误，全局错误处理
  console.log(err, instance, info);
  ElMessage({
    showClose: true,
    center: true,
    message: err,
    type: 'error',
  })
}

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(store).use(router).use(ElementPlus, { locale: zhCn, }).mount('#app')
