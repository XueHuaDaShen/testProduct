/**
 * 数据类型检查
 */

/**
 * 简单判断两个值的类型 是否相等
 * @param {Object} obj1
 * @param {Object} obj2
 * @return {Boolean} isEqual
 */
export function isEqual(obj1, obj2) {
  return Object.prototype.toString.call(obj1) === Object.prototype.toString.call(obj2);
}

export function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
}

export function isNumber(obj) {
  return Object.prototype.toString.call(obj) === '[object Number]';
}

export function isBoolean(obj) {
  return Object.prototype.toString.call(obj) === '[object Boolean]';
}

export function isUndefined(obj) {
  return Object.prototype.toString.call(obj) === '[object Undefined]';
}

export function isNull(obj) {
  return Object.prototype.toString.call(obj) === '[object Null]';
}

export function isNullOrUndefined(obj) {
  return isNull(obj) || isUndefined(obj);
}

export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

export function isNodeList(obj) {
  return Object.prototype.toString.call(obj) === '[object NodeList]';
}

export function isFunction(obj) {
  return Object.prototype.toString.call(obj) === '[object Function]';
}
