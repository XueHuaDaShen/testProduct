import Vue from 'vue'
import Router from 'vue-router'
// 1 login/reg, 2 首页, 3 个人信息, 4 彩票 5, 走势图 6.彩票详情 7.充值提现 8.棋牌竞技 9.帮助 10.必赢品牌 11.下载
const login = r => require.ensure([], () => r(require('@/components/login')), 'chunkname1-1')
const reg = r => require.ensure([], () => r(require('@/components/reg')), 'chunkname1-2')
const home = r => require.ensure([], () => r(require('@/components/home')), 'chunkname2')
const index = r => require.ensure([], () => r(require('@/components/index')), 'chunkname2')
const transactions = r => require.ensure([], () => r(require('@/components/transactions')), 'chunkname2-1')

const project = r => require.ensure([], () => r(require('@/components/project')), 'chunkname3')
const password = r => require.ensure([], () => r(require('@/components/password')), 'chunkname3-1')
const bank = r => require.ensure([], () => r(require('@/components/bank')), 'chunkname3-2')
const reward = r => require.ensure([], () => r(require('@/components/reward')), 'chunkname3-3')
const lotteryRecord = r => require.ensure([], () => r(require('@/components/lotteryRecord')), 'chunkname3-5')
const trackRecord = r => require.ensure([], () => r(require('@/components/trackRecord')), 'chunkname3-6')
const liveRecord = r => require.ensure([], () => r(require('@/components/liveRecord')), 'chunkname3-7')
const recreationRecord = r => require.ensure([], () => r(require('@/components/recreationRecord')), 'chunkname3-8')
const sportsRecord = r => require.ensure([], () => r(require('@/components/sportsRecord')), 'chunkname3-9')
const chessRecord = r => require.ensure([], () => r(require('@/components/chessRecord')), 'chunkname3-10')
const notice = r => require.ensure([], () => r(require('@/components/notice')), 'chunkname3-11')
const mail = r => require.ensure([], () => r(require('@/components/mail')), 'chunkname3-12')
const mydeposit = r => require.ensure([], () => r(require('@/components/mydeposit')), 'chunkname3-13')
const netbank = r => require.ensure([], () => r(require('@/components/netbank')), 'chunkname3-14')
const mywithdraw = r => require.ensure([], () => r(require('@/components/mywithdraw')), 'chunkname3-15')
const mytransfer = r => require.ensure([], () => r(require('@/components/mytransfer')), 'chunkname3-16')
const resetPsd = r => require.ensure([], () => r(require('@/components/resetPsd')), 'chunkname3-17')
const userSecurityQuestions = r => require.ensure([], () => r(require('@/components/userSecurityQuestions')), 'chunkname3-18')
const userCheckSafeQ = r => require.ensure([], () => r(require('@/components/userCheckSafeQ')), 'chunkname3-19')
const modifyBank = r => require.ensure([], () => r(require('@/components/modifyBank')), 'chunkname3-20')
const destroyBank = r => require.ensure([], () => r(require('@/components/destroyBank')), 'chunkname3-21')
const lockBank = r => require.ensure([], () => r(require('@/components/lockBank')), 'chunkname3-22')
const lotteryCommission = r => require.ensure([], () => r(require('@/components/lotteryCommission')), 'chunkname3-23')
const teamProfitLottery = r => require.ensure([], () => r(require('@/components/teamProfitLottery')), 'chunkname3-24')
const teamProfitChess = r => require.ensure([], () => r(require('@/components/teamProfitChess')), 'chunkname3-25')
const teamProfitLive = r => require.ensure([], () => r(require('@/components/teamProfitLive')), 'chunkname3-26')
const teamProfitRecreation = r => require.ensure([], () => r(require('@/components/teamProfitRecreation')), 'chunkname3-27')
const teamProfitSports = r => require.ensure([], () => r(require('@/components/teamProfitSports')), 'chunkname3-28')
const teamTopUp = r => require.ensure([], () => r(require('@/components/teamTopUp')), 'chunkname3-29')
const noticeDetail = r => require.ensure([], () => r(require('@/components/noticeDetail')), 'chunkname3-30')
const linkCreate = r => require.ensure([], () => r(require('@/components/linkCreate')), 'chunkname3-31')
const artificialCreate = r => require.ensure([], () => r(require('@/components/artificialCreate')), 'chunkname3-32')
const teamManagement = r => require.ensure([], () => r(require('@/components/teamManagement')), 'chunkname3-33')
const contractManagementSalary = r => require.ensure([], () => r(require('@/components/contractManagementSalary')), 'chunkname3-34')
const contractManagementBonus = r => require.ensure([], () => r(require('@/components/contractManagementBonus')), 'chunkname3-35')
const salaryGroupSet = r => require.ensure([], () => r(require('@/components/salaryGroupSet')), 'chunkname3-36')
const codeManagement = r => require.ensure([], () => r(require('@/components/codeManagement')), 'chunkname3-37')
const transformManagement = r => require.ensure([], () => r(require('@/components/transformManagement')), 'chunkname3-38')
const mailDetail = r => require.ensure([], () => r(require('@/components/mailDetail')), 'chunkname3-39')
const rewardDetail = r => require.ensure([], () => r(require('@/components/rewardDetail')), 'chunkname3-40')
const activityDetail = r => require.ensure([], () => r(require('@/components/activityDetail')), 'chunkname3-41')
const activityList = r => require.ensure([], () => r(require('@/components/activityList')), 'chunkname3-42')

const lotteryDetail = r => require.ensure([], () => r(require('@/components/lotteryDetail')), 'chunkname6-1')
const trackDetail = r => require.ensure([], () => r(require('@/components/trackDetail')), 'chunkname6-2')
const topUp = r => require.ensure([], () => r(require('@/components/topUp')), 'chunkname7-1')
const withdraw = r => require.ensure([], () => r(require('@/components/withdraw')), 'chunkname7-2')
const topUpResult = r => require.ensure([], () => r(require('@/components/topUpResult')), 'chunkname7-3')
const transfer = r => require.ensure([], () => r(require('@/components/transfer')), 'chunkname7-4')
const transform = r => require.ensure([], () => r(require('@/components/transform')), 'chunkname7-5')

const lottery = r => require.ensure([], () => r(require('@/components/lottery')), 'chunkname4')
// const ssc = r => require.ensure([], () => r(require('@/components/lotteryMode/ssc')), 'chunkname4-1')
const bw60 = r => require.ensure([], () => r(require('@/components/ssc/bw60')), 'chunkname4-1-1')
const bw120 = r => require.ensure([], () => r(require('@/components/ssc/bw120')), 'chunkname4-1-2')
const cqssc = r => require.ensure([], () => r(require('@/components/ssc/cqssc')), 'chunkname4-1-3')
const hljssc = r => require.ensure([], () => r(require('@/components/ssc/hljssc')), 'chunkname4-1-4')
const hnkw = r => require.ensure([], () => r(require('@/components/ssc/hnkw')), 'chunkname4-1-5')
const hnky = r => require.ensure([], () => r(require('@/components/ssc/hnky')), 'chunkname4-1-6')
const tjssc = r => require.ensure([], () => r(require('@/components/ssc/tjssc')), 'chunkname4-1-7')
const xjssc = r => require.ensure([], () => r(require('@/components/ssc/xjssc')), 'chunkname4-1-8')

// const lhc = r => require.ensure([], () => r(require('@/components/lotteryMode/lhc')), 'chunkname4-2')
const bwlhc = r => require.ensure([], () => r(require('@/components/lhc/bwlhc')), 'chunkname4-2-1')
const xglhc = r => require.ensure([], () => r(require('@/components/lhc/xglhc')), 'chunkname4-2-2')

// const syxw = r => require.ensure([], () => r(require('@/components/lotteryMode/syxw')), 'chunkname4-3')
const ahsyxw = r => require.ensure([], () => r(require('@/components/syxw/ahsyxw')), 'chunkname4-3-1')
const bjsyxw = r => require.ensure([], () => r(require('@/components/syxw/bjsyxw')), 'chunkname4-3-2')
const bwsyxw = r => require.ensure([], () => r(require('@/components/syxw/bwsyxw')), 'chunkname4-3-3')
const gdsyxw = r => require.ensure([], () => r(require('@/components/syxw/gdsyxw')), 'chunkname4-3-4')
const gxsyxw = r => require.ensure([], () => r(require('@/components/syxw/gxsyxw')), 'chunkname4-3-5')
const hebsyxw = r => require.ensure([], () => r(require('@/components/syxw/hebsyxw')), 'chunkname4-3-6')
const jssyxw = r => require.ensure([], () => r(require('@/components/syxw/jssyxw')), 'chunkname4-3-7')
const jxsyxw = r => require.ensure([], () => r(require('@/components/syxw/jxsyxw')), 'chunkname4-3-8')
const lnsyxw = r => require.ensure([], () => r(require('@/components/syxw/lnsyxw')), 'chunkname4-3-9')
const sdsyydj = r => require.ensure([], () => r(require('@/components/syxw/sdsyydj')), 'chunkname4-3-10')
const shsyxw = r => require.ensure([], () => r(require('@/components/syxw/shsyxw')), 'chunkname4-3-11')
const tjsyxw = r => require.ensure([], () => r(require('@/components/syxw/tjsyxw')), 'chunkname4-3-12')

// const pks = r => require.ensure([], () => r(require('@/components/lotteryMode/pks')), 'chunkname4-4')
const bjpks = r => require.ensure([], () => r(require('@/components/pks/bjpks')), 'chunkname4-4-1')
const bwpks = r => require.ensure([], () => r(require('@/components/pks/bwpks')), 'chunkname4-4-2')

// const ks = r => require.ensure([], () => r(require('@/components/lotteryMode/ks')), 'chunkname4-5')
const ahks = r => require.ensure([], () => r(require('@/components/ks/ahks')), 'chunkname4-5-1')
const bjks = r => require.ensure([], () => r(require('@/components/ks/bjks')), 'chunkname4-5-2')
const bwks = r => require.ensure([], () => r(require('@/components/ks/bwks')), 'chunkname4-5-3')
const gsks = r => require.ensure([], () => r(require('@/components/ks/gsks')), 'chunkname4-5-4')
const gxks = r => require.ensure([], () => r(require('@/components/ks/gxks')), 'chunkname4-5-5')
const hbks = r => require.ensure([], () => r(require('@/components/ks/hbks')), 'chunkname4-5-6')
const jsks = r => require.ensure([], () => r(require('@/components/ks/jsks')), 'chunkname4-5-7')

const sd = r => require.ensure([], () => r(require('@/components/lotteryMode/qt')), 'chunkname4-6-1')
// const sd = r => require.ensure([], () => r(require('@/components/qt/sd')), 'chunkname4-6-1')
const plw = r => require.ensure([], () => r(require('@/components/lotteryMode/plw')), 'chunkname4-6-2')
// const plw = r => require.ensure([], () => r(require('@/components/qt/plw')), 'chunkname4-6-2')
const dataCharts = r => require.ensure([], () => r(require('../bets/dataCharts')), 'chunkname5')

const chessBoard = r => require.ensure([], () => r(require('@/components/chessBoard')), 'chunkname8-1')
const liveCasino = r => require.ensure([], () => r(require('@/components/liveCasino')), 'chunkname8-2')
const slots = r => require.ensure([], () => r(require('@/components/slots')), 'chunkname8-3')
const fishGame = r => require.ensure([], () => r(require('@/components/fishGame')), 'chunkname8-4')

const help = r => require.ensure([], () => r(require('@/components/help/help')), 'chunkname9-1')
const hdefault = r => require.ensure([], () => r(require('@/components/help/hdefault')), 'chunkname9-2')
const cpwf = r => require.ensure([], () => r(require('@/components/help/cpwf')), 'chunkname9-3')
const cjwt = r => require.ensure([], () => r(require('@/components/help/cjwt')), 'chunkname9-4')
const zhgl = r => require.ensure([], () => r(require('@/components/help/zhgl')), 'chunkname9-5')
const rhgc = r => require.ensure([], () => r(require('@/components/help/rhgc')), 'chunkname9-6')
const rhdj = r => require.ensure([], () => r(require('@/components/help/rhdj')), 'chunkname9-7')

const introduce = r => require.ensure([], () => r(require('@/components/introduce')), 'chunkname10-1')
const download = r => require.ensure([], () => r(require('@/components/download')), 'chunkname11-1')
const antiHijacking = r => require.ensure([], () => r(require('@/components/antiHijacking')), 'chunkname12-1')

Vue.use(Router)
const router = new Router({
  // mode: 'history',
  routes: [
  {
    // login
    path: '/reg/*',
    name: 'reg',
    component: reg,
    meta: {
      title: '注册'
    }
  },
  {
    // login
    path: '/',
    redirect: '/login',
  },
  {
    path: '/introduce',
    name: 'introduce',
    component: introduce,
    meta: {
      title: '必赢品牌'
    }
  },
  {
    path: '/download',
    name: 'download',
    component: download,
    meta: {
      title: '下载'
    }
  },
  {
    path: '/antiHijacking',
    name: 'antiHijacking',
    component: antiHijacking,
    meta: {
      title: '防劫持教程'
    }
  },
  {
    // help
    path: '/help',
    name: 'help',
    component: help,
    // redirect: '/help/hdefault',
    children: [
    {
      // 默认首页
      path: 'hdefault',
      component: hdefault,
      name: 'hdefault',
      meta: {
        title: '帮助'
      },
    }, {
      // 彩票玩法
      path: 'cpwf',
      component: cpwf,
      name: 'cpwf',
      meta: {
        title: '帮助'
      },
    }, {
      // 常见问题
      path: 'cjwt',
      component: cjwt,
      name: 'cjwt',
      meta: {
        title: '帮助'
      },
    }, {
      // 账户管理
      path: 'zhgl',
      component: zhgl,
      name: 'zhgl',
      meta: {
        title: '帮助'
      },
    }, {
      // 如何购彩
      path: 'rhgc',
      component: rhgc,
      name: 'rhgc',
      meta: {
        title: '帮助'
      },
    }, {
      // 如何兑奖
      path: 'rhdj',
      component: rhdj,
      name: 'rhdj',
      meta: {
        title: '帮助'
      },
    }]
  },
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/chessBoard',
    name: 'chessBoard',
    component: chessBoard,
    meta: {
      title: '游戏记录'
    }
  },
  {
    path: '/liveCasino',
    name: 'liveCasino',
    component: liveCasino,
    meta: {
      title: '真人娱乐'
    }
  },
  {
    path: '/slots',
    name: 'slots',
    component: slots,
    meta: {
      title: '电子游戏'
    }
  },
  {
    path: '/fishGame',
    name: 'fishGame',
    component: fishGame,
    meta: {
      title: '捕鱼达人'
    }
  },
  {
    // 首页
    path: '/home',
    component: home,
    children: [
      {
        // 默认首页
        path: '',
        component: index,
      },
      {
        // 默认首页
        path: 'index',
        component: index,
        name: 'home',
        meta: {
          title: '首页'
        }
      },
      {
        // 用户管理中心
        path: '/project',
        name: 'project',
        component: project,
        children: [
        {
          // 密码管理
          path: 'password',
          component: password,
          name: 'password',
          meta: {
            title: '密码管理'
          }
        },
        {
          // 资金密码管理
          path: 'resetPsd',
          component: resetPsd,
          name: 'resetPsd',
          meta: {
            title: '安全管理'
          }
        },
        {
          // 安全问题管理
          path: 'userSecurityQuestions',
          component: userSecurityQuestions,
          name: 'userSecurityQuestions',
          meta: {
            title: '安全管理'
          }
        },
        {
          // 银行卡管理
          path: 'bank',
          component: bank,
          name: 'bank',
          meta: {
            title: '银行卡管理'
          }
        },
        {
          // 修改银行卡
          path: 'modifyBank',
          component: modifyBank,
          name: 'modifyBank',
          meta: {
            title: '银行卡管理'
          }
        },
        {
          // 删除银行卡
          path: 'destroyBank',
          component: destroyBank,
          name: 'destroyBank',
          meta: {
            title: '银行卡管理'
          }
        },
        {
          // 删除银行卡
          path: 'lockBank',
          component: lockBank,
          name: 'lockBank',
          meta: {
            title: '银行卡管理'
          }
        },
        {
          // 我的奖金
          path: 'reward',
          component: reward,
          name: 'reward',
          meta: {
            title: '我的奖金'
          }
        },
        {
          // 彩票管理
          path: 'lotteryRecord',
          name: 'lotteryRecord',
          component: lotteryRecord,
          meta: {
            title: '彩票记录'
          }
        },
        {
          // 追号记录
          path: 'trackRecord',
          name: 'trackRecord',
          component: trackRecord,
          meta: {
            title: '追号记录'
          }
        },
        {
          // 真人娱乐
          path: 'liveRecord',
          component: liveRecord,
          name: 'liveRecord',
          meta: {
            title: '真人娱乐'
          }
        },
        {
          // 电子游艺
          path: 'recreationRecord',
          component: recreationRecord,
          name: 'recreationRecord',
          meta: {
            title: '电子游艺'
          }
        },
        {
          // 体育竞技
          path: 'sportsRecord',
          component: sportsRecord,
          name: 'sportsRecord',
          meta: {
            title: '体育竞技'
          }
        },
        {
          // 棋牌竞技
          path: 'chessRecord',
          component: chessRecord,
          name: 'chessRecord',
          meta: {
            title: '棋牌游戏'
          }
        },
        {
          // 平台公告
          path: 'notice',
          name: 'notice',
          component: notice,
          meta: {
            title: '平台公告'
          }
        },
        {
          // 站内信
          path: 'mail',
          component: mail,
          name: 'mail',
          meta: {
            title: '站内信'
          }
        },
        {
          // 帐变记录
          path: 'transactions',
          component: transactions,
          name: 'transactions',
          meta: {
            title: '帐变记录'
          }
        },
        {
          // 充值记录
          path: 'mydeposit',
          component: mydeposit,
          name: 'mydeposit',
          meta: {
            title: '充值记录'
          }
        },
        {
          // 充值申请
          path: 'netbank',
          component: netbank,
          name: 'netbank',
          meta: {
            title: '充值申请'
          }
        },
        {
          // 提现申请
          path: 'mywithdraw',
          component: mywithdraw,
          name: 'mywithdraw',
          meta: {
            title: '提现申请'
          }
        },
        {
          // 转账记录
          path: 'mytransfer',
          component: mytransfer,
          name: 'mytransfer',
          meta: {
            title: '转账记录'
          }
        },
        {
          // 打码量管理
          path: 'codeManagement',
          component: codeManagement,
          name: 'codeManagement',
          meta: {
            title: '打码记录'
          }
        },
        {
          // 额度兑换记录
          path: 'transformManagement',
          component: transformManagement,
          name: 'transformManagement',
          meta: {
            title: '额度兑换记录'
          }
        },
        {
          // 验证安全问题
          path: 'userCheckSafeQ',
          component: userCheckSafeQ,
          name: 'userCheckSafeQ',
          meta: {
            title: '验证安全问题'
          }
        },
        {
          // 彩票佣金
          path: 'lotteryCommission',
          component: lotteryCommission,
          name: 'lotteryCommission',
          meta: {
            title: '彩票佣金'
          }
        },
        {
          // 团队盈亏 - 彩票
          path: 'teamProfitLottery',
          component: teamProfitLottery,
          name: 'teamProfitLottery',
          meta: {
            title: '团队盈亏'
          }
        },
        {
          // 团队盈亏 - 真人娱乐
          path: 'teamProfitLive',
          component: teamProfitLive,
          name: 'teamProfitLive',
          meta: {
            title: '团队盈亏'
          }
        },
        {
          // 团队盈亏 - 电子游艺
          path: 'teamProfitRecreation',
          component: teamProfitRecreation,
          name: 'teamProfitRecreation',
          meta: {
            title: '团队盈亏'
          }
        },
        {
          // 团队盈亏 - 体育竞技
          path: 'teamProfitSports',
          component: teamProfitSports,
          name: 'teamProfitSports',
          meta: {
            title: '团队盈亏'
          }
        },
        {
          // 团队盈亏 - 棋牌竞技
          path: 'teamProfitChess',
          component: teamProfitChess,
          name: 'teamProfitChess',
          meta: {
            title: '团队盈亏'
          }
        },
        {
          // 团队充提
          path: 'teamTopUp',
          component: teamTopUp,
          name: 'teamTopUp',
          meta: {
            title: '团队充提'
          }
        },
        {
          // 团队管理
          path: 'teamManagement',
          component: teamManagement,
          name: 'teamManagement',
          meta: {
            title: '团队管理'
          }
        },
        {
          // 下级开户 - 链接开户
          path: 'linkCreate',
          component: linkCreate,
          name: 'linkCreate',
          meta: {
            title: '链接开户'
          }
        },
        {
          // 下级开户 - 人工开户
          path: 'artificialCreate',
          component: artificialCreate,
          name: 'artificialCreate',
          meta: {
            title: '人工开户'
          }
        },
        {
          // 契约管理 - 工资契约
          path: 'contractManagementSalary',
          component: contractManagementSalary,
          name: 'contractManagementSalary',
          meta: {
            title: '契约管理'
          }
        },
        {
          // 契约管理 - 分红契约
          path: 'contractManagementBonus',
          component: contractManagementBonus,
          name: 'contractManagementBonus',
          meta: {
            title: '契约管理'
          }
        },
        {
          // 奖金组设置 
          path: 'salaryGroupSet',
          component: salaryGroupSet,
          name: 'salaryGroupSet',
          meta: {
            title: '奖金组设置'
          }
        }, ]
      },
      {
        // 重庆时时彩
        path: 'lottery',
        name: 'lottery',
        component: lottery,
        children: [
          // {
          //   // 时时彩
          //   path: 'ssc',
          //   name: 'ssc',
          //   component: ssc
          // },
          {
            // 时时彩
            path: 'bw60',
            name: 'bw60',
            component: bw60,
            meta: {
              title: '极速60秒'
            }
          },
          {
            // 时时彩
            path: 'bw120',
            name: 'bw120',
            component: bw120,
            meta: {
              title: '极速120秒'
            }
          },
          {
            // 时时彩
            path: 'cqssc',
            name: 'cqssc',
            component: cqssc,
            meta: {
              title: '重庆时时彩'
            }
          },
          {
            // 时时彩
            path: 'hljssc',
            name: 'hljssc',
            component: hljssc,
            meta: {
              title: '黑龙江时时彩'
            }
          },
          {
            // 时时彩
            path: 'hnkw',
            name: 'hnkw',
            component: hnkw,
            meta: {
              title: '河内5分彩'
            }
          },
          {
            // 时时彩
            path: 'hnky',
            name: 'hnky',
            component: hnky,
            meta: {
              title: '极速60秒'
            }
          },
          {
            // 时时彩
            path: 'tjssc',
            name: 'tjssc',
            component: tjssc,
            meta: {
              title: '天津时时彩'
            }
          },
          {
            // 时时彩
            path: 'xjssc',
            name: 'xjssc',
            component: xjssc,
            meta: {
              title: '新疆时时彩'
            }
          },
          // {
          //   // 六合彩
          //   path: 'lhc',
          //   name: 'lhc',
          //   component: lhc
          // },
          {
            // 六合彩
            path: 'bwlhc',
            name: 'bwlhc',
            component: bwlhc,
            meta: {
              title: '极速六合彩'
            }
          },
          {
            // 六合彩
            path: 'xglhc',
            name: 'xglhc',
            component: xglhc,
            meta: {
              title: '香港六合彩'
            }
          },
          // {
          //   // 十一选五
          //   path: 'syxw',
          //   name: 'syxw',
          //   component: syxw
          // },
          {
            // 十一选五
            path: 'ahsyxw',
            name: 'ahsyxw',
            component: ahsyxw,
            meta: {
              title: '安徽11选5'
            }
          },
          {
            // 十一选五
            path: 'bjsyxw',
            name: 'bjsyxw',
            component: bjsyxw,
            meta: {
              title: '北京11选5'
            }
          },
          {
            // 十一选五
            path: 'bwsyxw',
            name: 'bwsyxw',
            component: bwsyxw,
            meta: {
              title: '极速11选5'
            }
          },
          {
            // 十一选五
            path: 'gdsyxw',
            name: 'gdsyxw',
            component: gdsyxw,
            meta: {
              title: '广东11选5'
            }
          },
          {
            // 十一选五
            path: 'gxsyxw',
            name: 'gxsyxw',
            component: gxsyxw,
            meta: {
              title: '广西11选5'
            }
          },
          {
            // 十一选五
            path: 'hebsyxw',
            name: 'hebsyxw',
            component: hebsyxw,
            meta: {
              title: '河北11选5'
            }
          },
          {
            // 十一选五
            path: 'jssyxw',
            name: 'jssyxw',
            component: jssyxw,
            meta: {
              title: '江苏11选5'
            }
          },
          {
            // 十一选五
            path: 'jxsyxw',
            name: 'jxsyxw',
            component: jxsyxw,
            meta: {
              title: '江西11选5'
            }
          },
          {
            // 十一选五
            path: 'lnsyxw',
            name: 'lnsyxw',
            component: lnsyxw,
            meta: {
              title: '辽宁11选5'
            }
          },
          {
            // 十一选五
            path: 'sdsyydj',
            name: 'sdsyydj',
            component: sdsyydj,
            meta: {
              title: '山东11选5'
            }
          },
          {
            // 十一选五
            path: 'shsyxw',
            name: 'shsyxw',
            component: shsyxw,
            meta: {
              title: '上海11选5'
            }
          },
          {
            // 十一选五
            path: 'tjsyxw',
            name: 'tjsyxw',
            component: tjsyxw,
            meta: {
              title: '天津11选5'
            }
          },
          // {
          //   // PK10
          //   path: 'pks',
          //   name: 'pks',
          //   component: pks
          // },
          {
            // PK10
            path: 'bjpks',
            name: 'bjpks',
            component: bjpks,
            meta: {
              title: '北京PK10'
            }
          },
          {
            // PK10
            path: 'bwpks',
            name: 'bwpks',
            component: bwpks,
            meta: {
              title: '疯狂PK10'
            }
          },
          // {
          //   // 快三
          //   path: 'ks',
          //   name: 'ks',
          //   component: ks
          // },
          {
            // 快三
            path: 'ahks',
            name: 'ahks',
            component: ahks,
            meta: {
              title: '安徽快3'
            }
          },
          {
            // 快三
            path: 'bjks',
            name: 'bjks',
            component: bjks,
            meta: {
              title: '北京快3'
            }
          },
          {
            // 快三
            path: 'bwks',
            name: 'bwks',
            component: bwks,
            meta: {
              title: '极速快3'
            }
          },
          {
            // 快三
            path: 'gsks',
            name: 'gsks',
            component: gsks,
            meta: {
              title: '甘肃快3'
            }
          },
          {
            // 快三
            path: 'gxks',
            name: 'gxks',
            component: gxks,
            meta: {
              title: '广西快3'
            }
          },
          {
            // 快三
            path: 'hbks',
            name: 'hbks',
            component: hbks,
            meta: {
              title: '河北快3'
            }
          },
          {
            // 快三
            path: 'jsks',
            name: 'jsks',
            component: jsks,
            meta: {
              title: '江苏快3'
            }
          },
          {
            // 其他 3d
            path: 'sd',
            name: 'sd',
            component: sd,
            meta: {
              title: '福彩3D'
            }
          },
          {
            // 其他 体彩
            path: 'plw',
            name: 'plw',
            component: plw,
            meta: {
              title: '体彩P3/5'
            }
          }
        ]
      },
      {
        // 走势图
        path: 'dataCharts',
        name: 'dataCharts',
        component: dataCharts,
        meta: {
          title: '走势图'
        }
      },
      {
        // 投注记录详情
        path: 'lotteryDetail',
        name: 'lotteryDetail',
        component: lotteryDetail,
        meta: {
          title: '投注详情'
        }
      },
      {
        // 追号记录详情
        path: 'trackDetail',
        name: 'trackDetail',
        component: trackDetail,
        meta: {
          title: '追号详情'
        }
      },
      {
        // 平台公告详情
        path: 'noticeDetail',
        component: noticeDetail,
        name: 'noticeDetail',
        meta: {
          title: '公告详情'
        }
      },
      {
        // 消息详情
        path: 'mailDetail',
        component: mailDetail,
        name: 'mailDetail',
        meta: {
          title: '站内信详情'
        }
      },
      {
        // 我的奖金-详情
        path: 'rewardDetail',
        component: rewardDetail,
        name: 'rewardDetail',
        meta: {
          title: '详情 - 我的奖金'
        }
      },
      {
        // 精彩活动-详情
        path: 'activityDetail',
        component: activityDetail,
        name: 'activityDetail',
        meta: {
          title: '活动详情'
        }
      },
      {
        // 精彩活动-列表
        path: 'activityList',
        component: activityList,
        name: 'activityList',
        meta: {
          title: '精彩活动'
        }
      },
      {
        // 充值
        path: 'topUp',
        name: 'topUp',
        component: topUp,
        meta: {
          title: '充值'
        }
      },
      {
        // 提现
        path: 'withdraw',
        name: 'withdraw',
        component: withdraw,
        meta: {
          title: '提现'
        }
      },
      {
        // 转账
        path: 'transfer',
        name: 'transfer',
        component: transfer,
        meta: {
          title: '转账'
        }
      },
      {
        // 额度转换
        path: 'transform',
        name: 'transform',
        component: transform,
        meta: {
          title: '额度转换'
        }
      },
      {
        // 充值结果
        path: 'topUpResult',
        name: 'topUpResult',
        component: topUpResult,
        meta: {
          title: '充值结果'
        }
      },
      /* {
        // 棋牌竞技
        path: 'chessBoard',
        name: 'chessBoard',
        component: chessBoard
      },  */
    ]
  }]
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title + ' - BWIN彩票'
  }
  next()
})

export default router;