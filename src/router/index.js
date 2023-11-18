import { ref } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'


const routes = [
  {
    path: '/home',
    name: 'HomeView',
    component: HomeView,
    meta: {
      isShow: false,
    },
    children: [
      {
        path: '/user/list',
        name: 'userlist',
        component: () => import(/* webpackChunkName: "userlist" */ '../views/UserList.vue'),
        meta: {
          isShow: true,
          title: "用户列表",
        }
      },
      {
        path: '/api/list',
        name: 'apilist',
        component: () => import(/* webpackChunkName: "apilist" */ '../views/ApiList.vue'),
        meta: {
          isShow: true,
          title: "接口管理",
        },
      },
      {
        path: '/api/add',
        name: 'apiadd',
        component: () => import(/* webpackChunkName: "apiadd" */ '../views/ApiAdd.vue'),
        meta: {
          isShow: false,
          title: "新增接口",
        }
      },
      // {
      //   path: '/api/edit/:id',
      //   name: 'apiedit',
      //   component: () => import(/* webpackChunkName: "apilist" */ '../views/ApiEdit.vue'),
      //   props: true,
      //   meta: {
      //     isShow: false,
      //     title: "修改接口",
      //   }
      // },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      isShow: false,
    }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫

router.beforeEach((to, from, next) => {
  const token = ref(localStorage.getItem('token'));
  // 判断有没有登录
  if (!token.value) {
  // 如果没有登录，并且是跳转至登录页
      if (to.name == "login") {
      // 直接跳转
        next();
      } else {
      // 否则直接强制跳转至登录页
        router.push('/login');
      }
  }
  else {
  // 如果已经登录，并且不是跳转至登录页
    if (to.name !== "login") {
    // 直接跳转
      next();
    }
    else {
    // 否则直接强制跳转至上一个页面
      router.push(from.path)
      next();
    }
  }
});

export default router