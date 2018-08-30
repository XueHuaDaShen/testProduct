import Vue from 'vue'
import Router from 'vue-router'
const login = r => require.ensure([], () => r(require('@/components/login')), 'chunkname-dl')
const home = r => require.ensure([], () => r(require('@/components/home')), 'chunkname-sy')
const wellcome = r => require.ensure([], () => r(require('@/components/wellcome')), 'chunkname-wellcome')

const accountManager = r => require.ensure([], () => r(require('@/components/accountManager/accountManager')), 'chunkname-accountManager')
const userList = r => require.ensure([], () => r(require('@/components/accountManager/userList')), 'chunkname-yhlb')
const group = r => require.ensure([], () => r(require('@/components/accountManager/group')), 'chunkname-yhlb')

const riskManager = r => require.ensure([], () => r(require('@/components/riskManager/riskManager')), 'chunkname-riskManager')
const userLog = r => require.ensure([], () => r(require('@/components/riskManager/userLog')), 'chunkname-yhrz')
const ipManager = r => require.ensure([], () => r(require('@/components/riskManager/ipManager')), 'chunkname-ipgl')
const stakecountList = r => require.ensure([], () => r(require('@/components/riskManager/stakecountList')), 'chunkname-stakecountList')

const lotteryConfig = r => require.ensure([], () => r(require('@/components/lotteryConfig/lotteryConfig')), 'chunkname-lotteryConfig')
const lottery = r => require.ensure([], () => r(require('@/components/lotteryConfig/lottery')), 'chunkname-kjgl')
const lotteryType = r => require.ensure([], () => r(require('@/components/lotteryConfig/lotteryType')), 'chunkname-czgl')
const playType = r => require.ensure([], () => r(require('@/components/lotteryConfig/playType')), 'chunkname-wfgl')

// const rechangerManager = r => require.ensure([], () => r(require('@/components/rechangerManager/rechangerManager')), 'chunkname-rechangerManager')
// const recharge = r => require.ensure([], () => r(require('@/components/rechangerManager/recharge')), 'chunkname-cz')
// const rechargeLog = r => require.ensure([], () => r(require('@/components/rechangerManager/rechargeLog')), 'chunkname-czjl')

// const withdrawManager = r => require.ensure([], () => r(require('@/components/withdrawManager/withdrawManager')), 'chunkname-withdrawManager')
// const withdrawSet = r => require.ensure([], () => r(require('@/components/withdrawManager/withdrawSet')), 'chunkname-txsz')
// const stakecount = r => require.ensure([], () => r(require('@/components/withdrawManager/stakecount')), 'chunkname-dml')

// const paymentManager = r => require.ensure([], () => r(require('@/components/paymentManager/paymentManager')), 'chunkname-paymentManager')
// // const paymentWx = r => require.ensure([], () => r(require('@/components/paymentManager/paymentWx')), 'chunkname-skwx')
// const paymentAli = r => require.ensure([], () => r(require('@/components/paymentManager/paymentAli')), 'chunkname-skali')
// const paymentBank = r => require.ensure([], () => r(require('@/components/paymentManager/paymentBank')), 'chunkname-skbank')

const activitySet = r => require.ensure([], () => r(require('@/components/activitySet/activitySet')), 'chunkname-activitySet')
const activityLog = r => require.ensure([], () => r(require('@/components/activitySet/activityLog')), 'chunkname-gghd')

// 平台管理
const activityManager = r => require.ensure([], () => r(require('@/components/activityManager/activityManager')), 'chunkname-activityManager')
const activityList = r => require.ensure([], () => r(require('@/components/activityManager/activityList')), 'chunkname-activityList')
const activityDetail = r => require.ensure([], () => r(require('@/components/activityManager/activityDetail')), 'chunkname-activityDetail')
const banner = r => require.ensure([], () => r(require('@/components/activityManager/banner')), 'chunkname-banner')
const activityPromotion = r => require.ensure([], () => r(require('@/components/activityManager/activityPromotion')), 'chunkname-activityPromotion')
const notice = r => require.ensure([], () => r(require('@/components/activityManager/notice')), 'chunkname-notice')
const linkManager = r => require.ensure([], () => r(require('@/components/activityManager/linkManager')), 'chunkname-linkManager')

const menuManager = r => require.ensure([], () => r(require('@/components/menuManager/menuManager')), 'chunkname-menuManager')
const menu = r => require.ensure([], () => r(require('@/components/menuManager/menu')), 'chunkname-cdgl')

const adminManager = r => require.ensure([], () => r(require('@/components/adminManager/adminManager')), 'chunkname-adminManager')
const admin = r => require.ensure([], () => r(require('@/components/adminManager/admin')), 'chunkname-glygl')
const role = r => require.ensure([], () => r(require('@/components/adminManager/role')), 'chunkname-jsgl')
const loginLog = r => require.ensure([], () => r(require('@/components/adminManager/loginLog')), 'chunkname-loginLog')
const operationLog = r => require.ensure([], () => r(require('@/components/adminManager/operationLog')), 'chunkname-operationLog')

const peopleNum = r => require.ensure([], () => r(require('@/components/peopleNum')), 'chunkname-zd1')
const productName = r => require.ensure([], () => r(require('@/components/productName')), 'chunkname-zd2')
const setAttr = r => require.ensure([], () => r(require('@/components/setAttr')), 'chunkname-zd3')

const aggentManager = r => require.ensure([], () => r(require('@/components/aggentManager/aggentManager')), 'chunkname-aggentManager')
const contractManage = r => require.ensure([], () => r(require('@/components/aggentManager/contractManage')), 'chunkname-dl2')
const contractSet = r => require.ensure([], () => r(require('@/components/aggentManager/contractSet')), 'chunkname-dl3')

const transferManager = r => require.ensure([], () => r(require('@/components/transferManager/transferManager')), 'chunkname-transferManager')
const transfer = r => require.ensure([], () => r(require('@/components/transferManager/transfer')), 'chunkname-zzgl')

const tradeConfig = r => require.ensure([], () => r(require('@/components/tradeConfig/tradeConfig')), 'chunkname-tradeConfig')
const tradeLog = r => require.ensure([], () => r(require('@/components/tradeConfig/tradeLog')), 'chunkname-jyjl')

const salaryTable = r => require.ensure([], () => r(require('@/components/salaryTable/salaryTable')), 'chunkname-salaryTable')
const daySalary = r => require.ensure([], () => r(require('@/components/salaryTable/daySalary')), 'chunkname-rgz')
const monthProfit = r => require.ensure([], () => r(require('@/components/salaryTable/monthProfit')), 'chunkname-ygz')
const gameRebate = r => require.ensure([], () => r(require('@/components/salaryTable/gameRebate')), 'chunkname-yxfd')

const colligateTable = r => require.ensure([], () => r(require('@/components/colligateTable/colligateTable')), 'chunkname-colligateTable')
const userColligate = r => require.ensure([], () => r(require('@/components/colligateTable/userColligate')), 'chunkname-yhzhbb')
const teamColligate = r => require.ensure([], () => r(require('@/components/colligateTable/teamColligate')), 'chunkname-tdzhbb')
const platformColligate = r => require.ensure([], () => r(require('@/components/colligateTable/platformColligate')), 'chunkname-ptzhbb')
const lotteryColligate = r => require.ensure([], () => r(require('@/components/colligateTable/lotteryColligate')), 'chunkname-tzzhbb')
const thirdpartTable = r => require.ensure([], () => r(require('@/components/colligateTable/thirdpartTable')), 'chunkname-thirdpartTable')

// 帐变记录
const accountChangeManager = r => require.ensure([], () => r(require('@/components/accountChangeManager/accountChangeManager')), 'chunkname-accountChangeManager')
const accountChange = r => require.ensure([], () => r(require('@/components/accountChangeManager/accountChange')), 'chunkname-accountChange')

// 人工存提
const rgctManager = r => require.ensure([], () => r(require('@/components/rgctManager/rgctManager')), 'chunkname-rgctManager')
const rgcr = r => require.ensure([], () => r(require('@/components/rgctManager/rgcr')), 'chunkname-rgcr')
const rgtc = r => require.ensure([], () => r(require('@/components/rgctManager/rgtc')), 'chunkname-rgtc')

// 入款管理
const incomeManager = r => require.ensure([], () => r(require('@/components/incomeManager/incomeManager')), 'chunkname-incomeManager')
const rechargeLog = r => require.ensure([], () => r(require('@/components/incomeManager/rechargeLog')), 'chunkname-rechargeLog')
const paymentBank = r => require.ensure([], () => r(require('@/components/incomeManager/paymentBank')), 'chunkname-paymentBank')
const paymentWx = r => require.ensure([], () => r(require('@/components/incomeManager/paymentWx')), 'chunkname-paymentWx')
const thirdpartyManager = r => require.ensure([], () => r(require('@/components/incomeManager/thirdpartyManager')), 'chunkname-thirdpartyManager')
const tradeAccountLog = r => require.ensure([], () => r(require('@/components/incomeManager/tradeAccountLog')), 'chunkname-tradeAccountLog')

// 出款管理
const outcomeManager = r => require.ensure([], () => r(require('@/components/outcomeManager/outcomeManager')), 'chunkname-outcomeManager')
const outcomeLog = r => require.ensure([], () => r(require('@/components/outcomeManager/outcomeLog')), 'chunkname-outcomeLog')

// 出入款设置
const outInSetManager = r => require.ensure([], () => r(require('@/components/outInSet/outInSetManager')), 'chunkname-outInSetManager')
const limitCashSet = r => require.ensure([], () => r(require('@/components/outInSet/limitCashSet')), 'chunkname-limitCashSet')
const dmlSet = r => require.ensure([], () => r(require('@/components/outInSet/dmlSet')), 'chunkname-dmlSet')

// 银行卡列表管理
const bankManager = r => require.ensure([], () => r(require('@/components/bankManager/bankManager')), 'chunkname-bankManager')
const bankList = r => require.ensure([], () => r(require('@/components/bankManager/bankList')), 'chunkname-bankList')

// 游戏记录
const gameManager = r => require.ensure([], () => r(require('@/components/gameManager/gameManager')), 'chunkname-gameManager')
const betsLog = r => require.ensure([], () => r(require('@/components/gameManager/betsLog')), 'chunkname-betsLog')
const chaseLog = r => require.ensure([], () => r(require('@/components/gameManager/chaseLog')), 'chunkname-chaseLog')
const thirdpart = r => require.ensure([], () => r(require('@/components/gameManager/thirdpart')), 'chunkname-thirdpart')

// 第三方游戏
const thirdpartGame = r => require.ensure([], () => r(require('@/components/thirdpartGame/thirdpartGame')), 'chunkname-thirdpartGame')
const paramSet = r => require.ensure([], () => r(require('@/components/thirdpartGame/paramSet')), 'chunkname-paramSet')

// 钱包管理
const walletManager = r => require.ensure([], () => r(require('@/components/walletManager/walletManager')), 'chunkname-walletManager')
const exchange = r => require.ensure([], () => r(require('@/components/walletManager/exchange')), 'chunkname-exchange')
const userBlance = r => require.ensure([], () => r(require('@/components/walletManager/userBlance')), 'chunkname-userBlance')

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      component: home,
      children: [{
          path: '',
          redirect: 'wellcome'
        },
        {
          path: 'wellcome',
          name: 'wellcome',
          component: wellcome
        },
        {
          path: 'accountManager',
          component: accountManager,
          children: [{
              path: '',
              redirect: 'userList'
            },
            {
              path: 'userList',
              name: 'userList',
              component: userList
            },
            {
              path: 'group',
              name: 'group',
              component: group
            }
          ]
        },
        {
          path: 'riskManager',
          component: riskManager,
          children: [{
              path: '',
              redirect: 'userLog'
            },
            {
              path: 'userLog',
              name: 'userLog',
              component: userLog
            },
            {
              path: 'ipManager',
              name: 'ipManager',
              component: ipManager
            },
            {
              path: 'stakecountList',
              name: 'stakecountList',
              component: stakecountList
            }
          ]
        },
        {
          path: 'walletManager',
          component: walletManager,
          children: [{
              path: '',
              redirect: 'exchange'
            },
            {
              path: 'exchange',
              name: 'exchange',
              component: exchange
            },
            {
              path: 'userBlance',
              name: 'userBlance',
              component: userBlance
            }
          ]
        },
        {
          path: 'lotteryConfig',
          component: lotteryConfig,
          children: [{
              path: '',
              redirect: 'lottery'
            },
            {
              path: 'lottery',
              name: 'lottery',
              component: lottery
            },
            {
              path: 'lotteryType',
              name: 'lotteryType',
              component: lotteryType
            },
            {
              path: 'playType',
              name: 'playType',
              component: playType
            }
          ]
        },
        // {
        //   path: 'rechangerManager',
        //   component: rechangerManager,
        //   children: [{
        //       path: '',
        //       redirect: 'recharge'
        //     },
        //     {
        //       path: 'recharge',
        //       name: 'recharge',
        //       component: recharge
        //     },
        //     // {
        //     //   path: 'rechargeLog',
        //     //   name: 'rechargeLog',
        //     //   component: rechargeLog
        //     // }
        //   ]
        // },
        // {
        //   path: 'withdrawManager',
        //   component: withdrawManager,
        //   children: [
        //     /* {
        //           path: '',
        //           redirect: 'withdrawLog'
        //         }, */
        //     {
        //       path: 'withdrawSet',
        //       name: 'withdrawSet',
        //       component: withdrawSet
        //     },
        //     {
        //       path: 'stakecount',
        //       name: 'stakecount',
        //       component: stakecount
        //     }
        //   ]
        // },
        // {
        //   path: 'paymentManager',
        //   component: paymentManager,
        //   children: [{
        //       path: '',
        //       redirect: 'paymentWx'
        //     },
        //     // {
        //     //   path: 'paymentWx',
        //     //   name: 'paymentWx',
        //     //   component: paymentWx
        //     // },
        //     {
        //       path: 'paymentAli',
        //       name: 'paymentAli',
        //       component: paymentAli
        //     },
        //     // {
        //     //   path: 'paymentBank',
        //     //   name: 'paymentBank',
        //     //   component: paymentBank
        //     // }
        //   ]
        // },
        {
          path: 'activitySet',
          component: activitySet,
          children: [{
              path: '',
              redirect: 'activityLog'
            },
            {
              path: 'activityLog',
              name: 'activityLog',
              component: activityLog
            }
          ]
        },
        {
          path: 'activityManager',
          component: activityManager,
          children: [{
              path: '',
              redirect: 'activityList'
            },
            {
              path: 'activityList',
              name: 'activityList',
              component: activityList
            },
            {
              path: 'activityDetail',
              name: 'activityDetail',
              component: activityDetail
            },
            {
              path: 'banner',
              name: 'banner',
              component: banner
            },
            {
              path: 'activityPromotion',
              name: 'activityPromotion',
              component: activityPromotion
            },
            {
              path: 'notice',
              name: 'notice',
              component: notice
            },
            {
              path: 'linkManager',
              name: 'linkManager',
              component: linkManager
            }
          ]
        },
        {
          path: 'menuManager',
          component: menuManager,
          children: [{
              path: '',
              redirect: 'menu'
            },
            {
              path: 'menu',
              name: 'menu',
              component: menu
            }
          ]
        },
        {
          path: 'adminManager',
          component: adminManager,
          children: [{
              path: '',
              redirect: 'admin'
            },
            {
              path: 'admin',
              name: 'admin',
              component: admin
            },
            {
              path: 'role',
              name: 'role',
              component: role
            },
            {
              path: 'loginLog',
              name: 'loginLog',
              component: loginLog
            },
            {
              path: 'operationLog',
              name: 'operationLog',
              component: operationLog
            }
          ]
        },
        {
          path: 'peopleNum',
          name: 'peopleNum',
          component: peopleNum
        },
        {
          path: 'productName',
          name: 'productName',
          component: productName
        },
        {
          path: 'setAttr',
          name: 'setAttr',
          component: setAttr
        },
        {
          path: 'aggentManager',
          component: aggentManager,
          children: [{
              path: '',
              redirect: 'contractManage'
            },
            {
              path: 'contractManage',
              name: 'contractManage',
              component: contractManage
            },
            {
              path: 'contractSet',
              name: 'contractSet',
              component: contractSet
            }
          ]
        },
        {
          path: 'transferManager',
          component: transferManager,
          children: [{
              path: '',
              redirect: 'transfer'
            },
            {
              path: 'transfer',
              name: 'transfer',
              component: transfer
            }
          ]
        },
        {
          path: 'tradeConfig',
          component: tradeConfig,
          children: [{
              path: '',
              redirect: 'tradeLog'
            },
            {
              path: 'tradeLog',
              name: 'tradeLog',
              component: tradeLog
            }
          ]
        },
        {
          path: 'salaryTable',
          component: salaryTable,
          children: [{
              path: '',
              redirect: 'gameRebate'
            },
            {
              path: 'gameRebate',
              name: 'gameRebate',
              component: gameRebate
            },
            {
              path: 'daySalary',
              name: 'daySalary',
              component: daySalary
            },
            {
              path: 'monthProfit',
              name: 'monthProfit',
              component: monthProfit
            }
          ]
        },
        {
          path: 'colligateTable',
          component: colligateTable,
          children: [{
              path: '',
              redirect: 'userColligate'
            },
            {
              path: 'userColligate',
              name: 'userColligate',
              component: userColligate
            },
            {
              path: 'teamColligate',
              name: 'teamColligate',
              component: teamColligate
            },
            {
              path: 'platformColligate',
              name: 'platformColligate',
              component: platformColligate
            },
            {
              path: 'lotteryColligate',
              name: 'lotteryColligate',
              component: lotteryColligate
            },
            {
              path: 'thirdpartTable',
              name: 'thirdpartTable',
              component: thirdpartTable
            }
          ]
        },
        // 帐变记录
        {
          path: 'accountChangeManager',
          component: accountChangeManager,
          children: [{
              path: '',
              redirect: 'accountChange'
            },
            {
              path: 'accountChange',
              name: 'accountChange',
              component: accountChange
            }
          ]
        },
        // 人工存提
        {
          path: 'rgctManager',
          component: rgctManager,
          children: [{
              path: '',
              redirect: 'rgtc'
            },
            {
              path: 'rgcr',
              name: 'rgcr',
              component: rgcr
            },
            {
              path: 'rgtc',
              name: 'rgtc',
              component: rgtc
            }
          ]
        },
        // 入款管理
        {
          path: 'incomeManager',
          component: incomeManager,
          children: [{
              path: '',
              redirect: 'rechargeLog'
            },
            {
              path: 'rechargeLog',
              name: 'rechargeLog',
              component: rechargeLog
            },
            {
              path: 'paymentBank',
              name: 'paymentBank',
              component: paymentBank
            },
            {
              path: 'paymentWx',
              name: 'paymentWx',
              component: paymentWx
            },
            {
              path: 'thirdpartyManager',
              name: 'thirdpartyManager',
              component: thirdpartyManager
            },
            {
              path: 'tradeAccountLog',
              name: 'tradeAccountLog',
              component: tradeAccountLog
            }
          ]
        },
        // 出款管理
        {
          path: 'outcomeManager',
          component: outcomeManager,
          children: [{
            path: 'outcomeLog',
            name: 'outcomeLog',
            component: outcomeLog
          }]
        },
        // 出入款设置
        {
          path: 'outInSet',
          component: outInSetManager,
          children: [{
              path: '',
              redirect: 'limitCashSet'
            },
            {
              path: 'limitCashSet',
              name: 'limitCashSet',
              component: limitCashSet
            },
            {
              path: 'dmlSet',
              name: 'dmlSet',
              component: dmlSet
            }
          ]
        },
        // 银行卡列表
        {
          path: 'bankManager',
          component: bankManager,
          children: [{
            path: 'bankList',
            name: 'bankList',
            component: bankList
          }]
        },
        // 游戏记录
        {
          path: 'gameManager',
          component: gameManager,
          children: [{
              path: '',
              redirect: 'betsLog'
            },
            {
              path: 'betsLog',
              name: 'betsLog',
              component: betsLog
            },
            {
              path: 'chaseLog',
              name: 'chaseLog',
              component: chaseLog
            },
            {
              path: 'thirdpart',
              name: 'thirdpart',
              component: thirdpart
            }
          ]
        },
        // 第三方游戏  - 参数配置
        {
          path: 'thirdpartGame',
          component: thirdpartGame,
          children: [{
            path: 'paramSet',
            name: 'paramSet',
            component: paramSet
          }]
        }
      ]
    }
  ]
})
