'use strict'
export default {
  // 直选复式 参数: arrs => 位数上的选中号码的个数的组合；如：万千百十个，就是5个数组，每个位数上选中的号码的个数，就是每个数组的长度;
  // unit => 单位，如：从这几个位数上任选一个组成 一注，单位是1，组成5注，单位是5; 实例：时时彩 五星直选复式
  compound(arrs, unit) {
    const bets = arrs.reduce(function(p, c) {
      const value = Number(c)
      if (value) {
        return p * c
      } else {
        return 0
      }
    })
    return bets * unit
  },
  // 定位胆 参数: arrs => 位数上的选中号码的个数的组合；如：万千百十个，就是5个数组，每个位数上选中的号码的个数，就是每个数组的长度; 实例： 时时彩 一星 定位胆
  pos(arrs) {
    const bets = arrs.reduce(function(p, c) {
      return p + c
    })
    return bets
  },
  group(arrs) {
    const bets = arrs.reduce(function(p, c) {
      const value = Number(c)
      if (value) {
        return p * c
      } else {
        return 0
      }
    })
    return bets * arrs.length
  },
  // 组选： 第一种， 从一个位数上的0-9中任选 count 个数字 组成 unit 注，len 是选中的号码个数； 实例：时时彩 五星 组选120
  groupSelectOne(len, count, unit) {
    var bets
    if (len < count) {
      bets = 0
    } else {
      var n = 1
      var m = len
      for (var i = 1; i < count; i++) {
        bets = (m *= (len - i)) / (n *= (i + 1))
      }
    }
    return bets * unit
  },
  // 组选： 第二种， 总共两位； 从第一位上的0-9中任选1个数，从第二位上任选 num 个数，组成1注 arr1 和 arr2 分别是两个 位上 选中的号码的组合； 实例：时时彩 五星 组选60
  groupSelectTwoNum(arr1, arr2, num) {
    var bets = 0
    var len = 0
    for (var i in arr1) {
      if (arr2.indexOf(arr1[i]) > -1) {
        len = arr2.length - 1
      } else {
        len = arr2.length
      }
      var n = len
      var m = 1
      for (var j = 1; j < num; j++) {
        n *= (len - j)
        m *= (j + 1)
      }
      bets += n / m
    }
    return bets
  },
  // 组选： 第三种， 总共三位； 从三个位上任选一个不一样的号码组成一注；arr1 / arr2 /arr3 同上； 实例： 十一选五 前三直选复式
  groupSelectThreeNum(arr1, arr2, arr3) {
    var bets = 0
    let newArr = []
    arr1.filter(v => {
      arr2.filter(k => {
        arr3.filter(m => {
          if (k !== v) {
            if (m !== k && m !== v) {
              newArr.push([v, k, m])
            }
          }
        })
      })
    })
    bets = newArr.length
    return bets
  },
  // 组选： 第四种， 同上；实例，PK10 猜排位，前四
  groupSelectFourNum(arr1, arr2, arr3, arr4) {
    var bets = 0
    let newArr = []
    arr1.filter(v => {
      arr2.filter(k => {
        arr3.filter(m => {
          arr4.filter(n => {
            if (k !== v) {
              if (m !== k && m !== v) {
                if (n !== m && n !== k && n !== v) {
                  newArr.push([v, k, m, n])
                }
              }
            }
          })
        })
      })
    })
    bets = newArr.length
    return bets
  },
  // 组选： 第五种， 同上；实例，PK10 猜排位，前五
  groupSelectFiveNum(arr1, arr2, arr3, arr4, arr5) {
    var bets = 0
    let newArr = []
    arr1.filter(v => {
      arr2.filter(k => {
        arr3.filter(m => {
          arr4.filter(n => {
            arr5.filter(l => {
              if (k !== v) {
                if (m !== k && m !== v) {
                  if (n !== m && n !== k && n !== v) {
                    if (l !== n && l !== m && l !== k && l !== v) {
                      newArr.push([v, k, m, n, l])
                    }
                  }
                }
              }
            })
          })
        })
      })
    })
    bets = newArr.length
    return bets
  },
  // 胆拖：从胆码中任选 num 个 号码组成 arr1，注意 胆码 最多不能超过 num； 然后从 拖码中 任选(num+1)-arr1.length 个 组成一注； 实例：十一选五 任选胆拖
  countDanTuo(arr1, arr2, num) {
    let bets = 0
    let len = num + 1
    let count = len - arr1.length
    let andLen = arr1.length + arr2.length
    if (andLen < len || arr1.length === 0) {
      bets = 0
    } else {
      if (arr2.length < count) {
        bets = 0
      } else {
        var n = 1
        var m = arr2.length
        if (count === 1) {
          bets = arr2.length
        } else {
          for (var i = 1; i < count; i++) {
            bets = (m *= (arr2.length - i)) / (n *= (i + 1))
          }
        }
      }
    }
    return bets
  },
  // 直选和值 开奖号码的star（1,2,3）位数， 这位数上的每一位的相加之和；betsArr 是选中的号码组合 （可以是豹子号或对字号）; 实例：时时彩，前三直选和值
  sunOfValue(betsArr, star) {
    var arr = []
    let count = Math.pow(10, star)
    for (var i = 0; i < count; i++) {
      arr.push(i)
    }
    var newArr = []
    arr.filter(function(v) {
      var numArr = v.toString().split('')
      var num = numArr.reduce(function(p, c) {
        const value = Number(c)
        if (!isNaN(value)) {
          return p * 1 + c * 1
        } else {
          return p * 1
        }
      })
      newArr.push(num)
    })
    var n = 0
    for (var j in betsArr) {
      for (let i in newArr) {
        if (Number(newArr[i]) === Number(betsArr[j])) {
          n++
        }
      }
    }
    return n
  },
  // 组选和值 开奖号码的star（1,2,3）位数， 这位数上的每一位的相加之和；betsArr 是选中的号码组合 （不可以是豹子号或对字号）; 实例：时时彩，前三组选和值
  groupSunOfValue(betsArr, star) {
    var arr = []
    let count = Math.pow(10, star)
    for (let i = 1; i < count; i++) {
      var val = i.toString().split('')
      if (count === 1000) {
        if (val[0] === val[1] && val[2]) {
          // console.log(i)
          continue
        }
        if (i < 10) {
          arr.push('00' + i)
        } else if (i < 100) {
          arr.push('0' + i)
        } else {
          arr.push(i)
        }
      } else if (count === 100) {
        if (val[0] === val[1]) {
          // console.log(i)
          continue
        }
        if (i < 10) {
          arr.push('0' + i)
        } else if (i < 100) {
          arr.push(i)
        }
      }
    }
    var newArr = []
    arr.filter(function(v) {
      var numArr = v.toString().split('')
      var newNum = Number(numArr.sort(function(a, b) {
        return a - b
      }).join(''))
      newArr.push(newNum)
    })
    var arr1 = []
    for (let i in newArr) {
      if (arr1.indexOf(newArr[i]) < 0) {
        arr1.push(newArr[i])
      }
    }
    var newArr1 = []
    arr1.filter(function(v) {
      var numArr = v.toString().split('')
      var num = numArr.reduce(function(p, c) {
        const value = Number(c)
        if (!isNaN(value)) {
          return p * 1 + c * 1
        } else {
          return p * 1
        }
      })
      newArr1.push(num)
    })
    var n = 0
    for (let j in betsArr) {
      for (let i in newArr1) {
        if (Number(newArr1[i]) === Number(betsArr[j])) {
          n++
        }
      }
    }
    return n
  },
  // 直选跨度 开奖号码的star（1,2,3）位数， 这位数上的最大最小值 的差值；betsArr 是选中的号码组合 （不可以是豹子号或对字号）; 实例：时时彩，前三直选跨度
  dValue(betsArr, star) {
    var arr = []
    let count = Math.pow(10, star)
    for (var i = 0; i < count; i++) {
      if (count === 1000) {
        if (i < 10) {
          arr.push('00' + i)
        } else if (i < 100) {
          arr.push('0' + i)
        } else {
          arr.push(i.toString())
        }
      } else if (count === 100) {
        if (i < 10) {
          arr.push('0' + i)
        } else if (i < 100) {
          arr.push(i.toString())
        }
      }
    }
    var newArr = []
    arr.filter(function(v) {
      var numArr = v.toString().split('')
      var minNum = Math.min.apply(Math, numArr)
      var maxNum = Math.max.apply(Math, numArr)
      var num = maxNum - minNum
      newArr.push(num)
    })
    var n = 0
    for (var j in betsArr) {
      for (let i in newArr) {
        if (newArr[i].toString() === betsArr[j]) {
          n++
        }
      }
    }
    return n
  },
  // 和值尾数，五星和值，特殊号码， 适用于 单个位数上，选择一个号码就是一注 的情况；实例：时时彩-> 和值-> 五星和值/大小单双，前三->特殊号码， 
  valueEnd(betsArr) {
    return betsArr.length
  },
  // 包胆 从0-9中任选一个号码，于中奖号码的 star 位数 相匹配，只要于其中一个相同即可； 实例： 时时彩 前三 包胆
  guts(betsArr, star) {
    var arr = []
    let count = Math.pow(10, star)
    if (betsArr.length === 0) return 0
    for (let i = 1; i < count; i++) {
      var val = i.toString().split('')
      if (count === 1000) {
        if (val[0] === val[1] && val[2]) {
          // console.log(i)
          continue
        }
        if (i < 10) {
          arr.push('00' + i)
        } else if (i < 100) {
          arr.push('0' + i)
        } else {
          arr.push(i)
        }
      } else if (count === 100) {
        if (val[0] === val[1]) {
          // console.log(i)
          continue
        }
        if (i < 10) {
          arr.push('0' + i)
        } else if (i < 100) {
          arr.push(i)
        }
      }
    }
    var newArr = []
    arr.filter(function(v) {
      var numArr = v.toString().split('')
      var newNum = numArr.sort(function(a, b) {
        return a - b
      }).join('')
      newArr.push(newNum)
    })
    var arr1 = []
    for (let i in newArr) {
      if (arr1.indexOf(newArr[i]) < 0) {
        arr1.push(newArr[i])
      }
    }
    var n = 0
    for (let i in arr1) {
      if (arr1[i].toString().split('').indexOf(betsArr[0].toString()) > -1) {
        n++
      }
    }
    return n
  },
  // 任选 第一种： 从万千百十个 中 任选两个位， 在这两个位上任选一个号码组成一注，betsArr 每一个位上的 选中号码的长度 的 组合； 实例： 时时彩 任选二
  optionalOne(betsArr) {
    var n = 0
    var len = 0
    var r = 0
    for (var i = 0; i < betsArr.length; i++) {
      len = 0
      for (var j = i + 1; j < betsArr.length; j++) {
        len += betsArr[j]
      }
      n = betsArr[i] * len
      r += n
      // console.log(n)
    }
    return r
  },
  // 任选 第二种： 从万千百十个 中 任选三个位， 在这两个位上任选一个号码组成一注，betsArr 每一个位上的 选中号码的长度 的 组合； 实例： 时时彩 任选三
  optionalTwo(betsArr) {
    var n = 0
    var len = 0
    var r = 0
    for (var i = 0; i < betsArr.length; i++) {
      for (var k = i + 1; k < betsArr.length; k++) {
        len = 0
        for (var j = k + 1; j < betsArr.length; j++) {
          len += betsArr[j]
        }
        n = (betsArr[i] * betsArr[k]) * len
        r += n
      }
    }
    return r
  },
  // 任选 第三种： 从万千百十个 中 任选四个位， 在这两个位上任选一个号码组成一注，betsArr 每一个位上的 选中号码的长度 的 组合； 实例： 时时彩 任选四
  optionalThree(betsArr) {
    var n = 0
    var len = 0
    var r = 0
    for (var i = 0; i < betsArr.length; i++) {
      for (var k = i + 1; k < betsArr.length; k++) {
        for (var m = k + 1; m < betsArr.length; m++) {
          len = 0
          for (var j = m + 1; j < betsArr.length; j++) {
            len += betsArr[j]
          }
          n = (betsArr[i] * betsArr[k] * betsArr[m]) * len
          r += n
        }
      }
    }
    return r
  },

  pushCode() {}
}
