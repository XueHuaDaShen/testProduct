/**
 * 追号状态
 */
/* 1:进行中  2:已结束 3: 用户取消 4: 系统取消 */

export let Status = {

  /// <summary>
  /// 进行中
  /// </summary>
  Doing: 1,

  /// <summary>
  /// 已结束
  /// </summary>
  Finished: 2,

  /// <summary>
  /// 用户取消
  /// </summary>
  UserCanceled: 3,

  /// <summary>
  /// 系统取消
  /// </summary>
  SystemCanceled: 4,
};

export let StatusDesc = {
  /// <summary>
  /// 进行中
  /// </summary>
  1: '进行中',

  /// <summary>
  /// 已结束
  /// </summary>
  2: '已结束',

  /// <summary>
  /// 用户取消
  /// </summary>
  3: '用户取消',

  /// <summary>
  /// 系统取消
  /// </summary>
  4: '系统取消',
};

export function getStatusDesc(status) {
  let text = '';
  switch (status) {
    case Status.Doing:
      text = StatusDesc[1];
      break;
    case Status.Finished:
      text = StatusDesc[2];
      break;
    case Status.UserCanceled:
      text = StatusDesc[3];
      break;
    case Status.SystemCanceled:
      text = StatusDesc[4];
      break;
  }
  return text;
}