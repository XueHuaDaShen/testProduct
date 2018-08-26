export function getVoteStatus(status) {
  switch(status) {
    case 0: return '默认';
    case 1: return '待开奖';
    case 2: return '等待中';
    case 3: return '已撤销';
    case 4: return '未中奖';
    case 5: return '中奖';
  }
}
export function getChaseStatus(status) {
  switch(status) {
    case 1: return '进行中';
    case 2: return '已结束';
    case 3: return '用户取消';
    case 4: return '系统取消';
  }
}