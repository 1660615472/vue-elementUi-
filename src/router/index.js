import Vue from 'vue'
import VueRouter from 'vue-router'
//安装插件
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
    {
        path: '',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('views/login/login')
    },
    {
        path: '/home',
        name: 'Home',
        redirect: '/welcome',
        component: () => import('views/home/home'),
        children: [
            {
                path: '/welcome',
                name: 'Welcome',
                component: () => import('views/welcome/welcome')
            },
            {
                path: '/users',
                name: 'User',
                component: () => import('views/user/user')
            },
            {
                path: '/roles',
                name: 'Roles',
                component: () => import('views/roles/roles')
            },
            {
                path: '/rights',
                name: 'Rights',
                component: () => import('views/rights/rights')
            },
            {
                path: '/goods',
                name: 'GoodsLsit',
                component: () => import('views/goods/goodsLsit')
            },
            {
                path: '/goods/addGoods',
                name: 'AddGoods',
                component: () => import('views/goods/addGoods')
            },
            {
                path: '/params',
                name: 'ClassifyParam',
                component: () => import('views/goods/classifyParam')
            },
            {
                path: '/categories',
                name: 'GoodsCategory',
                component: () => import('views/goods/goodsCategory')
            },
            {
                path: '/orders',
                name: 'OrderList',
                component: () => import('views/order/orderList')
            },
            {
                path: '/reports',
                name: 'DataReport',
                component: () => import('views/dataStatistics/dataReport')
            }
        ]
    }
]

const router = new VueRouter({
    routes,
    mode: 'history'
})
//路由导航
router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        next();
    } else {
        const token = window.sessionStorage.getItem('token');
        if (!token) {
            next('/login');
        } else {
            next();
        }
    }

})

export default router