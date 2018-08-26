/**
 * validator
 * 常用的一些验证
 */

import {
  isNullOrUndefined,
  isString
} from './objectType'

/**
 * 必填
 * @param {Object} value
 * @return {Boolean}
 */
export function required(value) {
  if (isNullOrUndefined(value)) {
    return false
  } else if (isString(value)) {
    return !!value
  } else {
    return true
  }
}

/**
 * 长度不得小于
 * @param {Object} value
 * @param {Number} minLength
 * @return {Boolean}
 */
export function minLength(value, minLength) {
  if (!isNullOrUndefined(value)) {
    return value.length < minLength
  }
  return true
}

/**
 * 长度不得大于
 * @param {Object} value
 * @param {Number} maxLength
 * @return {Boolean}
 */
export function maxLength(value, maxLength) {
  if (!isNullOrUndefined(value)) {
    return value.length > maxLength
  }
  return true
}

/**
 * 数字
 * @param {Object} value
 * @return {Boolean}
 */
export function number(value) {
  return isNaN(value)
}

/**
 * 正整数 （包含0）
 * @param {Object} value
 * @return {Boolean}
 */
export function positiveInt(value) {
  if (value) {
    return /^([1-9]\d*|[0]{1,1})$/.test(value.toString())
  }
  return true
}

/**
 * 正浮点数（包含0）
 * @param {Object} value
 * @return {Boolean}
 */
export function positiveDecimal(value) {
  if (value) {
    return /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(value.toString())
  }
  return true
}

/**
 * 手机号
 * 11位
 * 13段：130、131、132、133、134、135、136、137、138、139
 * 14段：145、147
 * 15段：150、151、152、153、155、156、157、158、159
 * 17段：170、176、177、178
 * 18段：180、181、182、183、184、185、186、187、188、189
 * @param {Object} value
 * @return {Boolean}
 */
export function cellphone(value) {
  if (value) {
    return /^(((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))+\d{8})$/.test(value.toString())
  }
  return true
}

/**
 * 大陆身份证号码
 * @param {Object} value
 * @return {Boolean}
 */
export function idCard(value) {
  if (value) {
    value = value.toString()
    let reg
    let length = value.length
    if (length === 15) {
      reg = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{2})(\w)$/)
    } else if (length === 18) {
      reg = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/)
    } else {
      return false
    }
    let regMatch = value.match(reg)
    if (regMatch != null) {
      let a, r
      if (length === 15) {
        a = new Date('19' + regMatch[3] + '/' + regMatch[4] + '/' + regMatch[5])
        r = a.getYear() == regMatch[3] && a.getMonth() + 1 == regMatch[4] && a.getDate() == regMatch[5]
      } else {
        a = new Date(regMatch[3] + '/' + regMatch[4] + '/' + regMatch[5])
        r = a.getFullYear() == regMatch[3] && a.getMonth() + 1 == regMatch[4] && a.getDate() == regMatch[5]
      }
      return r
    }
    return reg.test(value)
  }
  return true
}

/**
 * 价格 大于0的浮点数
 * @param {Object} value
 */
export function price(value) {
  if (value) {
    value = value.toString()
    if (!/^[0-9]*[1-9][0-9]*$/.test(value.toString())) {
      return false
    }
  }
  return true
}

/**
 * 邮箱
 * 1.邮箱以a-z、A-Z、0-9开头，最小长度为1.
 * 2.如果左侧部分包含-、_、.则这些特殊符号的前面必须包一位数字或字母。
 * 3.@符号是必填项
 * 4.右则部分可分为两部分，第一部分为邮件提供商域名地址，第二部分为域名后缀，现已知的最短为2位。最长的为6为。
 * 5.邮件提供商域可以包含特殊字符-、_、.
 * @param {Object} value
 * @return {Boolean}
 */
export function email(value) {
  if (value) {
    return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(value)
  }
  return true
}

/**
 * ip
 * ipv4、ipv6
 * "192.168.0.0"
 * "192.168.2.3.1.1"
 * "235.168.2.1"
 * "192.168.254.10"
 * "192.168.254.10.1.1"
 * @param {Object} value
 * @return {Boolean}
 */
export function ip(value) {
  if (value) {
    return /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])((\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}|(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){5})$/.test(value.toString())
  }
  return true
}

/**
 * 判断是否为合法的浮点数 包括整数
 * @param {Object} value 值
 * @param {Boolean} positive 是否为正数
 * @param {Number} digits 小数点位数
 * @return {Boolean}
 */
export function decimal(value, positive, digits) {
  if (value) {
    if (digits < 0) {
      digits = 2
    }
    let reg
    if (positive) {
      reg = new RegExp('^\\d+(\\.\\d{1,' + digits + '})?$', 'gim')
    } else {
      reg = new RegExp('-^\\d+(\\.\\d{1,' + digits + '})?$', 'gim')
    }
    return reg.test(value.toString())
  }
  return true
}

/**
 * 13-19位的银行卡号
 * @param {Object} value
 */
export function bankCard(value) {
  if (value) {
    value = value.toString()
    if (!/^\d{13,19}$/.test(value.toString())) {
      return false
    }
  }
  return true
}

// 去除首尾空格
export function trim(str) {
  return str.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '')
}

// 匹配3-20位字母或者数字
export function regexpInput(input) {
  let exp = new RegExp("^[a-zA-Z0-9]{3,20}$");
  if (exp.test(input)) {
    return true;
  }
  return false;
}

//匹配6-16位数字和字母组合
export function regexpPsd(psd) {
  let exp = new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{3,16}$");
  if (exp.test(psd)) {
    return true;
  }
  return false;
}
