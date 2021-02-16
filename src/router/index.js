import Vue from 'vue'
import VueRouter from 'vue-router'

// 主路由
const Home = () => import('page/home/Home')

// 二级路由
const Recommend = () => import('page/recommend/recommend')
const Singer = () => import('page/singer/singer')
const Rank = () => import('page/rank/rank')
const Search = () => import('page/search/search')
const Disc = () => import('common/disc/disc')

// 子路由
const SingerDetail = () => import('common/singer-detail/singer-detail')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/home', redirect: '/recommend', component: Home, children: [
      { path: '/recommend', component: Recommend, children:[
        { path: ':id', component: Disc }
      ] },
      {
        path: '/singer', component: Singer, children: [
          { path: ':id', component: SingerDetail }
        ]
      },
      { path: '/rank', component: Rank },
      { path: '/search', component: Search },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
