'use strict'
export default {
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
  valueEnd(betsArr) {
    return betsArr.length
  },
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
