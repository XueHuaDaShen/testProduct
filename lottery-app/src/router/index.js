import Vue from 'vue'
import Router from 'vue-router'
const login = r => require.ensure([], () => r(require('@/components/login')), 'chunkname1-1')
const reg = r => require.ensure([], () => r(require('@/components/reg')), 'chunkname1-2')

// 登陆后所有内容的view
const wrap = r => require.ensure([], () => r(require('@/components/wrap')), 'chunkname2')

// 首页
const home = r => require.ensure([], () => r(require('@/components/home')), 'chunkname3')

const activityList = r => require.ensure([], () => r(require('@/components/homeFiles/activityList')), 'chunkname3-1')
const activityDetail = r => require.ensure([], () => r(require('@/components/homeFiles/activityDetail')), 'chunkname3-2')
const noticeDetail = r => require.ensure([], () => r(require('@/components/homeFiles/noticeDetail')), 'chunkname3-3')

// 游戏中心
const youxizhongxin = r => require.ensure([], () => r(require('@/components/youxizhongxin')), 'chunkname4')
const yxzxsy = r => require.ensure([], () => r(require('@/components/youxizhongxinFiles/index')), 'chunkname4')

const lottery = r => require.ensure([], () => r(require('@/components/youxizhongxinFiles/lottery')), 'chunkname4-1')
const betsView = r => require.ensure([], () => r(require('@/components/youxizhongxinFiles/lotteryFiles/betsView')), 'chunkname4-1-1')
const lhc = r => require.ensure([], () => r(require('@/components/youxizhongxinFiles/lotteryFiles/lhc')), 'chunkname4-1-1')
const shoppingCart = r => require.ensure([], () => r(require('@/components/youxizhongxinFiles/lotteryFiles/shoppingCart')), 'chunkname4-1-2')
const betsDetail = r => require.ensure([], () => r(require('@/components/youxizhongxinFiles/lotteryFiles/betsDetail')), 'chunkname4-1-3')
const chaseDetail = r => require.ensure([], () => r(require('@/components/youxizhongxinFiles/lotteryFiles/chaseDetail')), 'chunkname4-1-4')
const chessBoard = r => require.ensure([], () => r(require('@/components/youxizhongxinFiles/chessBoard')), 'chunkname4-1-5') // 棋牌竞技

const electron = r => require.ensure([], () => r(require('@/components/youxizhongxinFiles/electron')), 'chunkname4-2')
const soccer = r => require.ensure([], () => r(require('@/components/youxizhongxinFiles/soccer')), 'chunkname4-3')
const liveVideo = r => require.ensure([], () => r(require('@/components/youxizhongxinFiles/liveVideo')), 'chunkname4-4')
const chess = r => require.ensure([], () => r(require('@/components/youxizhongxinFiles/chess')), 'chunkname4-5')

// 资金管理
const zijinguanli = r => require.ensure([], () => r(require('@/components/zijinguanli')), 'chunkname5')
const zjglsy = r => require.ensure([], () => r(require('@/components/zijinguanliFiles/index')), 'chunkname5-1')
// 提现
const tixian = r => require.ensure([], () => r(require('@/components/zijinguanliFiles/tixian/tixian')), 'chunkname5-1-1')
const confirmTixian = r => require.ensure([], () => r(require('@/components/zijinguanliFiles/tixian/confirmTixian')), 'chunkname5-1-2')
// 转账
const zhuanzhang = r => require.ensure([], () => r(require('@/components/zijinguanliFiles/zhuanzhang/zhuanzhang')), 'chunkname5-2-1')
// 额度转换
const zhuanhuan = r => require.ensure([], () => r(require('@/components/zijinguanliFiles/zhuanhuan/zhuanhuan')), 'chunkname5-3-1')
// 充值
const recharge = r => require.ensure([], () => r(require('@/components/zijinguanliFiles/recharge/recharge')), 'chunkname5-4-1')
const bankCard = r => require.ensure([], () => r(require('@/components/zijinguanliFiles/recharge/bank_card')), 'chunkname5-4-2')
const qrCode = r => require.ensure([], () => r(require('@/components/zijinguanliFiles/recharge/qr_code')), 'chunkname5-4-3')

// 个人中心
const gerenzhongxin = r => require.ensure([], () => r(require('@/components/gerenzhongxin')), 'chunkname6')
const grzxsy = r => require.ensure([], () => r(require('@/components/gerenzhongxinFiles/index')), 'chunkname6-1')
// 个人资料
const grzl = r => require.ensure([], () => r(require('@/components/gerenzhongxinFiles/grzl/grzl')), 'chunkname6-1-1')
const mmgl = r => require.ensure([], () => r(require('@/components/gerenzhongxinFiles/grzl/mmgl')), 'chunkname6-1-2')
const mbwt = r => require.ensure([], () => r(require('@/components/gerenzhongxinFiles/grzl/mbwt')), 'chunkname6-1-3')
const yhkgl = r => require.ensure([], () => r(require('@/components/gerenzhongxinFiles/grzl/yhkgl')), 'chunkname6-1-4')
const yhkbd1 = r => require.ensure([], () => r(require('@/components/gerenzhongxinFiles/grzl/yhkbd1')), 'chunkname6-1-5')
const yhkbd2 = r => require.ensure([], () => r(require('@/components/gerenzhongxinFiles/grzl/yhkbd2')), 'chunkname6-1-6')
const yhkbd3 = r => require.ensure([], () => r(require('@/components/gerenzhongxinFiles/grzl/yhkbd3')), 'chunkname6-1-7')
// 资金明细
const zbjl = r => require.ensure([], () => r(require('@/components/gerenzhongxinFiles/zjmx/zbjl')), 'chunkname6-2-1')
const czsq = r => require.ensure([], () => r(require('@/components/gerenzhongxinFiles/zjmx/czsq')), 'chunkname6-2-2')
const txsq = r => require.ensure([], () => r(require('@/components/gerenzhongxinFiles/zjmx/txsq')), 'chunkname6-2-3')
const zzjl = r => require.ensure([], () => r(require('@/components/gerenzhongxinFiles/zjmx/zzjl')), 'chunkname6-2-4')
const eddhjl = r => require.ensure([], () => r(require('@/components/gerenzhongxinFiles/zjmx/eddhjl')), 'chunkname6-2-5')
const dmljl = r => require.ensure([], () => r(require('@/components/gerenzhongxinFiles/zjmx/dmljl')), 'chunkname6-2-6')
// 投注记录
const cpjl = r => require.ensure([], () => r(require('@/components/gerenzhongxinFiles/tzjl/cpjl')), 'chunkname6-3-1')
const zhjl = r => require.ensure([], () => r(require('@/components/gerenzhongxinFiles/tzjl/zhjl')), 'chunkname6-3-2')
const yxjl = r => require.ensure([], () => r(require('@/components/gerenzhongxinFiles/tzjl/yxjl')), 'chunkname6-3-3')
// 代理中心
const tdgl = r => require.ensure([], () => r(require('@/components/gerenzhongxinFiles/dlzx/tdgl')), 'chunkname6-3-3')
const tglj = r => require.ensure([], () => r(require('@/components/gerenzhongxinFiles/dlzx/tglj')), 'chunkname6-3-3')
const khzc = r => require.ensure([], () => r(require('@/components/gerenzhongxinFiles/dlzx/khzc')), 'chunkname6-3-3')

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/reg/*',
      name: 'reg',
      component: reg
    },
    {
      path: '/chessBoard',
      name: 'chessBoard',
      component: chessBoard
    },
    {
      path: '/wrap',
      component: wrap,
      children: [
        {
          path: '',
          redirect: 'home'
        },
        {
          path: 'home',
          name: 'home',
          meta: {index: 1},
          component: home
        },
        {
          path: 'activityList',
          name: 'activityList',
          meta: {index: 2},
          component: activityList
        },
        {
          path: 'activityDetail',
          name: 'activityDetail',
          meta: {index: 3},
          component: activityDetail
        },
        {
          path: 'noticeDetail',
          name: 'noticeDetail',
          meta: {index: 4},
          component: noticeDetail
        },
        {
          path: '/youxizhongxin',
          component: youxizhongxin,
          children: [
            {
              path: 'yxzxsy',
              component: yxzxsy,
              children: [
                {
                  path: '',
                  redirect: 'lottery'
                },
                {
                  path: 'lottery',
                  name: 'lottery',
                  meta: {index: 2},
                  component: lottery
                },
                {
                  path: 'electron',
                  name: 'electron',
                  meta: {index: 2},
                  component: electron
                },
                {
                  path: 'soccer',
                  name: 'soccer',
                  meta: {index: 2},
                  component: soccer
                },
                {
                  path: 'liveVideo',
                  name: 'liveVideo',
                  meta: {index: 2},
                  component: liveVideo
                },
                {
                  path: 'chess',
                  name: 'chess',
                  meta: {index: 2},
                  component: chess
                }
              ]
            }
          ]
        },
        {
          path: '/betsView',
          name: 'betsView',
          meta: {index: 5, keepAlive: true},
          component: betsView
        },
        {
          path: '/lhc',
          name: 'lhc',
          meta: {index: 5, keepAlive: true},
          component: lhc
        },
        {
          path: '/shoppingCart',
          name: 'shoppingCart',
          meta: {index: 6},
          component: shoppingCart
        },
        {
          path: '/betsDetail',
          name: 'betsDetail',
          meta: {index: 7},
          component: betsDetail
        },
        {
          path: '/chaseDetail',
          name: 'chaseDetail',
          meta: {index: 8},
          component: chaseDetail
        },
        {
          path: '/zijinguanli',
          component: zijinguanli,
          children: [
            {
              path: 'zjglsy',
              name: 'zjglsy',
              meta: {index: 3},
              component: zjglsy
            }
          ]
        },
        {
          path: '/tixian',
          name: 'tixian',
          meta: {index: 27},
          component: tixian
        },
        {
          path: '/confirmTixian',
          name: 'confirmTixian',
          meta: {index: 28},
          component: confirmTixian
        },
        {
          path: '/zhuanzhang',
          name: 'zhuanzhang',
          meta: {index: 29},
          component: zhuanzhang
        },
        {
          path: '/zhuanhuan',
          name: 'zhuanhuan',
          meta: {index: 30},
          component: zhuanhuan
        },
        {
          path: '/recharge',
          name: 'recharge',
          meta: {index: 31},
          component: recharge
        },
        {
          path: '/bankCard',
          name: 'bankCard',
          meta: {index: 32},
          component: bankCard
        },
        {
          path: '/qrCode',
          name: 'qrCode',
          meta: {index: 33},
          component: qrCode
        },
        {
          path: '/gerenzhongxin',
          component: gerenzhongxin,
          children: [
            {
              path: 'grzxsy',
              name: 'grzxsy',
              meta: {index: 4},
              component: grzxsy
            }
          ]
        },
        {
          path: '/grzl',
          name: 'grzl',
          meta: {index: 8},
          component: grzl
        },
        {
          path: '/mmgl',
          name: 'mmgl',
          meta: {index: 9},
          component: mmgl
        },
        {
          path: '/mbwt',
          name: 'mbwt',
          meta: {index: 10},
          component: mbwt
        },
        {
          path: '/yhkgl',
          name: 'yhkgl',
          meta: {index: 11},
          component: yhkgl
        },
        {
          path: '/yhkbd1',
          name: 'yhkbd1',
          meta: {index: 12},
          component: yhkbd1
        },
        {
          path: '/yhkbd2',
          name: 'yhkbd2',
          meta: {index: 13},
          component: yhkbd2
        },
        {
          path: '/yhkbd3',
          name: 'yhkbd3',
          meta: {index: 14},
          component: yhkbd3
        },
        {
          path: '/zbjl',
          name: 'zbjl',
          meta: {index: 15},
          component: zbjl
        },
        {
          path: '/czsq',
          name: 'czsq',
          meta: {index: 16},
          component: czsq
        },
        {
          path: '/txsq',
          name: 'txsq',
          meta: {index: 17},
          component: txsq
        },
        {
          path: '/zzjl',
          name: 'zzjl',
          meta: {index: 18},
          component: zzjl
        },
        {
          path: '/eddhjl',
          name: 'eddhjl',
          meta: {index: 19},
          component: eddhjl
        },
        {
          path: '/dmljl',
          name: 'dmljl',
          meta: {index: 20},
          component: dmljl
        },
        {
          path: '/cpjl',
          name: 'cpjl',
          meta: {index: 21},
          component: cpjl
        },
        {
          path: '/zhjl',
          name: 'zhjl',
          meta: {index: 22},
          component: zhjl
        },
        {
          path: '/yxjl',
          name: 'yxjl',
          meta: {index: 23},
          component: yxjl
        },
        {
          path: '/tdgl',
          name: 'tdgl',
          meta: {index: 24},
          component: tdgl
        },
        {
          path: '/tglj',
          name: 'tglj',
          meta: {index: 25},
          component: tglj
        },
        {
          path: '/khzc',
          name: 'khzc',
          meta: {index: 26},
          component: khzc
        }
      ]
    }
  ]
})
