
// 格式化json
export function formatJson (json, options) {
  var reg = null,
    formatted = '',
    pad = 0,
    PADDING = '    '
  options = options || {}
  options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true)
  options.spaceAfterColon = options.spaceAfterColon !== false
  if (typeof json !== 'string') {
    json = JSON.stringify(json)
  } else {
    json = JSON.parse(json)
    json = JSON.stringify(json)
  }
  reg = /([\{\}])/g
  json = json.replace(reg, '\r\n$1\r\n')
  reg = /([\[\]])/g
  json = json.replace(reg, '\r\n$1\r\n')
  reg = /(\,)/g
  json = json.replace(reg, '$1\r\n')
  reg = /(\r\n\r\n)/g
  json = json.replace(reg, '\r\n')
  reg = /\r\n\,/g
  json = json.replace(reg, ',')
  if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
    reg = /\:\r\n\{/g
    json = json.replace(reg, ':{')
    reg = /\:\r\n\[/g
    json = json.replace(reg, ':[')
  }
  if (options.spaceAfterColon) {
    reg = /\:/g
    json = json.replace(reg, ':')
  }
  (json.split('\r\n')).forEach(function (node, index) {
    var i = 0,
      indent = 0,
      padding = ''

    if (node.match(/\{$/) || node.match(/\[$/)) {
      indent = 1
    } else if (node.match(/\}/) || node.match(/\]/)) {
      if (pad !== 0) {
        pad -= 1
      }
    } else {
      indent = 0
    }

    for (i = 0; i < pad; i++) {
      padding += PADDING
    }

    formatted += padding + node + '\r\n'
    pad += indent
  })
  return formatted
};

// 6-16位字符，只能包含英文字母或数字
export function regexpInput (input) {
  let exp = new RegExp('^[a-zA-Z0-9]{3,16}$')
  if (exp.test(input)) {
    return true
  }
  return false
}

// 6-16位字符，只能包含英文字母或数字，且必须同时包含数字和字母，不允许连续三位相同
export function regexpPsd (psd) {
  let exp = /^(?!(?:\d+|[a-zA-Z]+)$)[\da-zA-Z]{6,}$/
  let exp2 = /(\w)*(\w)\2{2}(\w)*/g
  if (exp.test(psd) && !exp2.test(psd)) {
    return true
  }
  return false
}
