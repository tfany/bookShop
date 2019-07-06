import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

export const constantRouterMap = [
  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: {title: '首页', icon: 'home'}
    }]
  },
  {
    path: '/pms',
    component: Layout,
    redirect: '/pms/product',
    name: 'pms',
    meta: {title: '书籍', icon: 'product'},
    children: [{
      path: 'product',
      name: 'product',
      component: () => import('@/views/pms/product/index'),
      meta: {title: '所有书籍', icon: 'product-list'}
    },
      {
        path: 'addProduct',
        name: 'addProduct',
        component: () => import('@/views/pms/product/add'),
        meta: {title: '添加书籍', icon: 'product-add'}
      },
      {
        path: 'updateProduct',
        name: 'updateProduct',
        component: () => import('@/views/pms/product/update'),
        meta: {title: '修改书籍', icon: 'product-add'},
        hidden: true
      },
      {
        path: 'productCate',
        name: 'productCate',
        component: () => import('@/views/pms/productCate/index'),
        meta: {title: '书籍分类', icon: 'product-cate'}
      },
      {
        path: 'addProductCate',
        name: 'addProductCate',
        component: () => import('@/views/pms/productCate/add'),
        meta: {title: '添加书籍分类'},
        hidden: true
      },
      {
        path: 'updateProductCate',
        name: 'updateProductCate',
        component: () => import('@/views/pms/productCate/update'),
        meta: {title: '修改书籍分类'},
        hidden: true
      },
      {
        path: 'supplier',
        name: 'supplier',
        component: () => import('@/views/pms/supplier/index'),
        meta: {title: '供应商管理', icon: 'product-brand'}
      },
      {
        path: 'addSupplier',
        name: 'addSupplier',
        component: () => import('@/views/pms/supplier/add'),
        meta: {title: '添加供应商'},
        hidden: true
      },
      {
        path: 'updateSupplier',
        name: 'updateSupplier',
        component: () => import('@/views/pms/supplier/update'),
        meta: {title: '编辑供应商'},
        hidden: true
      }
    ]
  },
  {
    path: '/oms',
    component: Layout,
    redirect: '/oms/order',
    name: 'oms',
    meta: {title: '订单', icon: 'order'},
    children: [
      {
        path: 'order',
        name: 'order',
        component: () => import('@/views/oms/order/index'),
        meta: {title: '订单列表', icon: 'product-list'}
      },
      {
        path: 'orderDetail',
        name: 'orderDetail',
        component: () => import('@/views/oms/order/orderDetail'),
        meta: {title: '订单详情'},
        hidden: true
      },
      {
        path: 'deliverOrderList',
        name: 'deliverOrderList',
        component: () => import('@/views/oms/order/deliverOrderList'),
        meta: {title: '发货列表'},
        hidden: true
      },
      {
        path: 'orderSetting',
        name: 'orderSetting',
        component: () => import('@/views/oms/order/setting'),
        meta: {title: '订单设置', icon: 'order-setting'}
      },
      {
        path: 'returnApply',
        name: 'returnApply',
        component: () => import('@/views/oms/apply/index'),
        meta: {title: '退货申请处理', icon: 'order-return'}
      },
      {
        path: 'returnReason',
        name: 'returnReason',
        component: () => import('@/views/oms/apply/reason'),
        meta: {title: '退货原因设置', icon: 'order-return-reason'}
      },
      {
        path: 'returnApplyDetail',
        name: 'returnApplyDetail',
        component: () => import('@/views/oms/apply/applyDetail'),
        meta: {title: '退货原因详情'},
        hidden: true
      }
    ]
  },
  {
    path: '/ums',
    component: Layout,
    redirect: '/ums/user',
    name: 'ums',
    meta: {title: '会员', icon: 'product'},
    children: [{
      path: 'user',
      name: 'user',
      component: () => import('@/views/ums/user/index'),
      meta: {title: '所有会员', icon: 'product-list'}
    },
      {
        path: 'updateUser',
        name: 'updateUser',
        component: () => import('@/views/ums/user/update'),
        meta: {title: '修改会员信息', icon: 'product-add'},
        hidden: true
      },
      {
        path: 'rank',
        name: 'rank',
        component: () => import('@/views/ums/rank/index'),
        meta: {title: '会员等级', icon: 'product-cate'}
      },
      {
        path: 'addRank',
        name: 'addRank',
        component: () => import('@/views/ums/rank/add'),
        meta: {title: '添加等级'},
        hidden: true
      },
      {
        path: 'updateRank',
        name: 'updateRank',
        component: () => import('@/views/ums/rank/update'),
        meta: {title: '修改等级'},
        hidden: true
      },
    ]
  },
  {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

