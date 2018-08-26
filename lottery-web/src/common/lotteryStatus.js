/**
 * 投注状态
 */

export let Status = {
  /// <summary>
  /// 默认
  /// </summary>
  Default: 0,

  /// <summary>
  /// 待开奖
  /// </summary>
  ToLottery: 1,

  /// <summary>
  /// 等待中
  /// </summary>
  Waiting: 2,

  /// <summary>
  /// 已撤销
  /// </summary>
  Canceled: 3,

  /// <summary>
  /// 未中奖
  /// </summary>
  NotWinning: 4,

  /// <summary>
  /// 中奖
  /// </summary>
  Winning: 5,
};

export let StatusDesc = {
  /// <summary>
  /// 默认
  /// </summary>
  0: '默认',

  /// <summary>
  /// 待开奖
  /// </summary>
  1: '待开奖',

  /// <summary>
  /// 等待中
  /// </summary>
  2: '等待中',

  /// <summary>
  /// 已撤销
  /// </summary>
  3: '已撤销',

  /// <summary>
  /// 未中奖
  /// </summary>
  4: '未中奖',

  /// <summary>
  /// 中奖
  /// </summary>
  5: '中奖',
};

export function getStatusDesc(status) {
  let text = '';
  switch (status) {
    case Status.Default:
      text = StatusDesc[0];
      break;
    case Status.ToLottery:
      text = StatusDesc[1];
      break;
    case Status.Waiting:
      text = StatusDesc[2];
      break;
    case Status.Canceled:
      text = StatusDesc[3];
      break;
    case Status.NotWinning:
      text = StatusDesc[4];
      break;
    case Status.Winning:
      text = StatusDesc[5];
      break;
  }
  return text;
}