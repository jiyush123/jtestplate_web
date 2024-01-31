import { ref } from 'vue'
import { createRouter ,createWebHistory} from 'vue-router'
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
        path: '/home',
        name: 'HomePage',
        component: () => import(/* webpackChunkName: "homepage" */ '../views/HomePage.vue'),
        meta: {
          isShow: true,
          title: "首页",
        }
      },
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
      {
        path: '/api/edit/:id',
        name: 'apiedit',
        component: () => import(/* webpackChunkName: "apilist" */ '../views/ApiEdit.vue'),
        props: true,
        meta: {
          isShow: false,
          title: "修改接口",
        }
      },
      {
        path: '/apicase/list',
        name: 'apicaselist',
        component: () => import(/* webpackChunkName: "apicaselist" */ '../views/ApiCaseList.vue'),
        meta: {
          isShow: true,
          title: "接口用例管理",
        },
      },
      {
        path: '/apicase/add',
        name: 'apicaseadd',
        component: () => import(/* webpackChunkName: "apicaseadd" */ '../views/ApiCaseAdd.vue'),
        meta: {
          isShow: false,
          title: "新增测试用例",
        }
      },
      {
        path: '/apicase/edit/:id',
        name: 'apicaseedit',
        component: () => import(/* webpackChunkName: "apicaseedit" */ '../views/ApiCaseEdit.vue'),
        meta: {
          isShow: false,
          title: "修改测试用例",
        }
      },
      {
        path: '/report/list',
        name: 'reportlist',
        component: () => import(/* webpackChunkName: "reportlist" */ '../views/ReportList.vue'),
        meta: {
          isShow: true,
          title: "报告管理",
        }
      },
      {
        path: '/report/info/:id',
        name: 'reportinfo',
        component: () => import(/* webpackChunkName: "reportinfo" */ '../views/ReportInfo.vue'),
        meta: {
          isShow: false,
          title: "报告详情",
        }
      },
      {
        path: '/environment/list',
        name: 'environmentlist',
        component: () => import(/* webpackChunkName: "environmentlist" */ '../views/EnvironmentList.vue'),
        meta: {
          isShow: true,
          title: "环境管理",
        }
      },
      {
        path: '/monaco/test',
        name: 'monaco',
        component: () => import(/* webpackChunkName: "monaco" */ '../views/MonacoEdit.vue'),
        meta: {
          isShow: true,
          title: "编辑器测试",
        }
      },
      {
        path: '/monaco/test1',
        name: 'monaco1',
        component: () => import(/* webpackChunkName: "monaco1" */ '../views/TestMonacoEdit.vue'),
        meta: {
          isShow: true,
          title: "编辑器嵌入页面",
        }
      },
      // {
      //   path: '/websocket/test',
      //   name: 'websocket',
      //   component: () => import(/* webpackChunkName: "websocket" */ '../views/TestWebSocket.vue'),
      //   meta: {
      //     isShow: true,
      //     title: "测试websocket",
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
  history: createWebHistory(),
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
        next('/login');
      }
  }
  else {
  // 如果已经登录，并且不是跳转至登录页
    if (to.name !== "login") {
    // 直接跳转
      next();
    }
    else {
    // 否则直接强制跳转至首页
      router.push('/home');
    }
  }
});

export default router