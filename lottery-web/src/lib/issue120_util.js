/**
 * Created by zhouyu on 8/5/2018.
 */

require('date-utils');
var moment = require('moment');

var timezoneOffset = 8;

function getTomorrowIssueDate() {
    var now = new Date();
    var tomorrow = now.add({days: 1});
    var tomorrow_issue_date = moment(tomorrow).utcOffset(timezoneOffset)
        .format('YYYY-MM-DD HH:mm:ss').split(' ')[0].replace(/-/g, '');

    return tomorrow_issue_date;
}


function getAfterTomorrowIssueDate() {
    var now = new Date();
    var afterTomorrow = now.add({days: 2});
    var after_tomorrow_issue_date = moment(afterTomorrow).utcOffset(timezoneOffset)
        .format('YYYY-MM-DD HH:mm:ss').split(' ')[0].replace(/-/g, '');

    return after_tomorrow_issue_date;
}


/**
 * 河内5分彩 288期
 *
 */
function getHnwfcIssues(start_issue, num) {
    var result = []
    var MAX = 288;
    var start_issue_num = parseInt(start_issue.substring(start_issue.length-3));
    var start_issue_date = start_issue.substring(0, start_issue.length-3)

    if(start_issue_num + num - 1 <= MAX) {
        for(var i = start_issue_num; i<= start_issue_num + num - 1; i++) {
            result.push(start_issue_date + (Array(3).join(0) + i).slice(-3))
        }
    } else {

        var tomorrow_issue_date = getTomorrowIssueDate();

        for(var i = start_issue_num; i<= MAX; i++) {
            result.push(start_issue_date + (Array(3).join(0) + i).slice(-3))
        }

        for(var i= 1; i<=(num-1)-(MAX-start_issue_num); i++) {
            result.push(tomorrow_issue_date + (Array(3).join(0) + i).slice(-3))
        }
    }

    return result;
}


/*
 * 重庆时时彩 120期
 * 中国时间 10:00-22:00~22:00~02:00
 * 标准时间 02:00-14:00~14:00~16:00,前一天16:00~前一天的18:00
 * @returns {number}
 */
function getCqsscIssues(start_issue, num) {
    var result = []
    var MAX = 120;
    var start_issue_num = parseInt(start_issue.substring(start_issue.length-3));
    var start_issue_date = start_issue.substring(0, start_issue.length-3)

    if(start_issue_num + num - 1 <= MAX) {
        for(var i = start_issue_num; i<= start_issue_num + num - 1; i++) {
            result.push(start_issue_date + (Array(3).join(0) + i).slice(-3))
        }
    } else {

        var tomorrow_issue_date = getTomorrowIssueDate();

        for(var i = start_issue_num; i<= MAX; i++) {
            result.push(start_issue_date + (Array(3).join(0) + i).slice(-3))
        }

        for(var i= 1; i<=(num-1)-(MAX-start_issue_num); i++) {
            result.push(tomorrow_issue_date + (Array(3).join(0) + i).slice(-3))
        }
    }

    return result;
}


/*
 * 天津时时彩 84期
 * 中国时间 08:50~22:40
 * @returns {number}
 */
function getTjsscIssues(start_issue, num) {
    var result = []
    var MAX = 84;
    var start_issue_num = parseInt(start_issue.substring(start_issue.length-3));
    var start_issue_date = start_issue.substring(0, start_issue.length-3)

    var issue_no = '';
    if(start_issue_num + num - 1 <= MAX) {
        for(var i = start_issue_num; i<= start_issue_num + num - 1; i++) {
            issue_no = start_issue_date + (Array(3).join(0) + i).slice(-3);
            result.push(issue_no);
            ;
        }
    } else if(start_issue_num + num - 1 <= 2*MAX) {

        var tomorrow_issue_date = getTomorrowIssueDate();

        for(var i = start_issue_num; i<= MAX; i++) {
            issue_no = start_issue_date + (Array(3).join(0) + i).slice(-3);
            result.push(issue_no)
            
        }

        for(var i= 1; i<=(num-1)-(MAX-start_issue_num); i++) {
            issue_no = tomorrow_issue_date + (Array(3).join(0) + i).slice(-3)
            result.push(issue_no)
            
        }
    } else {
        var tomorrow_issue_date = getTomorrowIssueDate();
        var after_tomorrow_issue_date = getAfterTomorrowIssueDate();

        for(var i = start_issue_num; i<= MAX; i++) {
            issue_no = start_issue_date + (Array(3).join(0) + i).slice(-3);
            result.push(issue_no)
            
        }

        for(var i= 1; i<=MAX; i++) {
            issue_no = tomorrow_issue_date + (Array(3).join(0) + i).slice(-3)
            result.push(issue_no)
            
        }

        for(var i=1; i<=(num-1) - (MAX + (MAX-start_issue_num)); i++){
            issue_no = after_tomorrow_issue_date + (Array(3).join(0) + i).slice(-3)
            result.push(issue_no)
            
        }
    }

    return result;
}

/*
 * 新疆时时彩 96期
 * 中国时间 08:50~22:40
 * @returns {number}
 */
function getXjsscIssues(start_issue, num) {
    var result = []
    var MAX = 96;
    var start_issue_num = parseInt(start_issue.substring(start_issue.length-3));
    var start_issue_date = start_issue.substring(0, start_issue.length-3)

    var issue_no = '';
    if(start_issue_num + num - 1 <= MAX) {
        for(var i = start_issue_num; i<= start_issue_num + num - 1; i++) {
            issue_no = start_issue_date + (Array(3).join(0) + i).slice(-3);
            result.push(issue_no);
            ;
        }
    } else if(start_issue_num + num - 1 <= 2*MAX) {

        var tomorrow_issue_date = getTomorrowIssueDate().substring(2);

        for(var i = start_issue_num; i<= MAX; i++) {
            issue_no = start_issue_date + (Array(3).join(0) + i).slice(-3);
            result.push(issue_no)
            
        }

        for(var i= 1; i<=(num-1)-(MAX-start_issue_num); i++) {
            issue_no = tomorrow_issue_date + (Array(3).join(0) + i).slice(-3)
            result.push(issue_no)
            
        }
    } else {
        var tomorrow_issue_date = getTomorrowIssueDate().substring(2);
        var after_tomorrow_issue_date = getAfterTomorrowIssueDate().substring(2);

        for(var i = start_issue_num; i<= MAX; i++) {
            issue_no = start_issue_date + (Array(3).join(0) + i).slice(-3);
            result.push(issue_no)
            
        }

        for(var i= 1; i<=MAX; i++) {
            issue_no = tomorrow_issue_date + (Array(3).join(0) + i).slice(-3)
            result.push(issue_no)
            
        }

        for(var i=1; i<=(num-1) - (MAX + (MAX-start_issue_num)); i++){
            issue_no = after_tomorrow_issue_date + (Array(3).join(0) + i).slice(-3)
            result.push(issue_no)
            
        }
    }

    return result;
}

/*
 * 黑龙江时时彩 递增
 * 中国时间 08:50~22:40
 * @returns {number}
 */
function getHljsscIssues(start_issue, num) {
    var result = []

    start_issue = parseInt(start_issue);
    for(var i=start_issue; i<=start_issue+ num -1; i++) {
        var issue_no = '' + i;
        result.push(issue_no);
        ;
    }

    return result;
}


/*
 * 11x5
 * 中国时间 08:50~22:40
 * @returns {number}
 */
function getLong11x5Issues(start_issue, num, MAX) {
    var result = []
    var start_issue_num = parseInt(start_issue.substring(start_issue.length-2));
    var start_issue_date = start_issue.substring(0, start_issue.length-2)
    var issue_no_length = 2

    var issue_no = '';
    if(start_issue_num + num - 1 <= MAX) {
        for(var i = start_issue_num; i<= start_issue_num + num - 1; i++) {
            issue_no = start_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length);
            result.push(issue_no);
            ;
        }
    } else if(start_issue_num + num - 1 <= 2*MAX) {

        var tomorrow_issue_date = getTomorrowIssueDate();

        for(var i = start_issue_num; i<= MAX; i++) {
            issue_no = start_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length);
            result.push(issue_no)

        }

        for(var i= 1; i<=(num-1)-(MAX-start_issue_num); i++) {
            issue_no = tomorrow_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length)
            result.push(issue_no)

        }
    } else {
        var tomorrow_issue_date = getTomorrowIssueDate();
        var after_tomorrow_issue_date = getAfterTomorrowIssueDate();

        for(var i = start_issue_num; i<= MAX; i++) {
            issue_no = start_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length);
            result.push(issue_no)

        }

        for(var i= 1; i<=MAX; i++) {
            issue_no = tomorrow_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length)
            result.push(issue_no)

        }

        for(var i=1; i<=(num-1) - (MAX + (MAX-start_issue_num)); i++){
            issue_no = after_tomorrow_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length)
            result.push(issue_no)

        }
    }

    return result;
}


/*
 * 11x5
 * 中国时间 08:50~22:40
 * @returns {number}
 */
function get11x5Issues(start_issue, num, MAX) {
    var result = []
    var start_issue_num = parseInt(start_issue.substring(start_issue.length-2));
    var start_issue_date = start_issue.substring(0, start_issue.length-2)
    var issue_no_length = 2

    var issue_no = '';
    if(start_issue_num + num - 1 <= MAX) {
        for(var i = start_issue_num; i<= start_issue_num + num - 1; i++) {
            issue_no = start_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length);
            result.push(issue_no);
            ;
        }
    } else if(start_issue_num + num - 1 <= 2*MAX) {

        var tomorrow_issue_date = getTomorrowIssueDate().substring(2);

        for(var i = start_issue_num; i<= MAX; i++) {
            issue_no = start_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length);
            result.push(issue_no)
            
        }

        for(var i= 1; i<=(num-1)-(MAX-start_issue_num); i++) {
            issue_no = tomorrow_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length)
            result.push(issue_no)
            
        }
    } else {
        var tomorrow_issue_date = getTomorrowIssueDate().substring(2);
        var after_tomorrow_issue_date = getAfterTomorrowIssueDate().substring(2);

        for(var i = start_issue_num; i<= MAX; i++) {
            issue_no = start_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length);
            result.push(issue_no)
            
        }

        for(var i= 1; i<=MAX; i++) {
            issue_no = tomorrow_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length)
            result.push(issue_no)
            
        }

        for(var i=1; i<=(num-1) - (MAX + (MAX-start_issue_num)); i++){
            issue_no = after_tomorrow_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length)
            result.push(issue_no)
            
        }
    }

    return result;
}

/**
 * 山东 87期
 */
function getSd11x5Issues(start_issue, num) {
    var MAX = 87;
    return getLong11x5Issues(start_issue, num, MAX );
}

/**
 * 江西 84期
 */
function getJx11x5Issues(start_issue, num) {
    var MAX = 84;
    return getLong11x5Issues(start_issue, num, MAX );
}

/**
 * 广东 84期
 */
function getGd11x5Issues(start_issue, num) {
    var MAX = 84;
    return get11x5Issues(start_issue, num, MAX );
}


/**
 * 上海 90期
 */
function getSh11x5Issues(start_issue, num) {
    var MAX = 90;
    return getLong11x5Issues(start_issue, num, MAX );
}


/**
 * 安徽 81期
 */
function getAh11x5Issues(start_issue, num) {
    var MAX = 81;
    return get11x5Issues(start_issue, num, MAX );
}


/**
 * 江苏 82期
 */
function getJs11x5Issues(start_issue, num) {
    var MAX = 82;
    return get11x5Issues(start_issue, num, MAX );
}

/**
 * 北京 85期
 */
function getBj11x5Issues(start_issue, num) {
    var MAX = 85;
    return get11x5Issues(start_issue, num, MAX );
}


/**
 * 辽宁 83期
 */
function getLn11x5Issues(start_issue, num) {
    var MAX = 83;
    return get11x5Issues(start_issue, num, MAX );
}

/**
 * 河北 85期
 */
function getHb11x5Issues(start_issue, num) {
    var MAX = 85;
    return get11x5Issues(start_issue, num, MAX );
}


/**
 * 广西 90期
 */
function getGx11x5Issues(start_issue, num) {
    var MAX = 90;
    return get11x5Issues(start_issue, num, MAX );
}

/**
 * 天津 90期
 */
function getTj11x5Issues(start_issue, num) {
    var MAX = 90;
    return get11x5Issues(start_issue, num, MAX );
}


/*
 * 北京kuai3
 * 中国时间 08:50~22:40
 * @returns {number}
 */
function getBjkuai3Issues(start_issue, num) {
    var result = []

    start_issue = parseInt(start_issue);
    for(var i=start_issue; i<=start_issue+ num -1; i++) {
        var issue_no = '' + i;
        result.push(issue_no);
        ;
    }

    return result;
}

/*
 * 江苏kuai3 82期
 * 中国时间 08:50~22:40
 * @returns {number}
 */
function getJskuai3Issues(start_issue, num) {
    var result = []
    var MAX = 82;
    var issue_no_length = 3
    var start_issue_num = parseInt(start_issue.substring(start_issue.length-issue_no_length));
    var start_issue_date = start_issue.substring(0, start_issue.length-issue_no_length)


    var issue_no = '';
    if(start_issue_num + num - 1 <= MAX) {
        for(var i = start_issue_num; i<= start_issue_num + num - 1; i++) {
            issue_no = start_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length);
            result.push(issue_no);
            ;
        }
    } else if(start_issue_num + num - 1 <= 2*MAX) {

        var tomorrow_issue_date = getTomorrowIssueDate().substring(2);

        for(var i = start_issue_num; i<= MAX; i++) {
            issue_no = start_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length);
            result.push(issue_no)
            
        }

        for(var i= 1; i<=(num-1)-(MAX-start_issue_num); i++) {
            issue_no = tomorrow_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length)
            result.push(issue_no)
            
        }
    } else {
        var tomorrow_issue_date = getTomorrowIssueDate().substring(2);
        var after_tomorrow_issue_date = getAfterTomorrowIssueDate().substring(2);

        for(var i = start_issue_num; i<= MAX; i++) {
            issue_no = start_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length);
            result.push(issue_no)
            
        }

        for(var i= 1; i<=MAX; i++) {
            issue_no = tomorrow_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length)
            result.push(issue_no)
            
        }

        for(var i=1; i<=(num-1) - (MAX + (MAX-start_issue_num)); i++){
            issue_no = after_tomorrow_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length)
            result.push(issue_no)
            
        }
    }

    return result;
}

/*
 * 河北kuai3 81期
 * 中国时间 08:50~22:40
 * @returns {number}
 */
function getHbkuai3Issues(start_issue, num, MAX) {
    var result = []
    var MAX = 81;
    var issue_no_length = 3
    var start_issue_num = parseInt(start_issue.substring(start_issue.length-issue_no_length));
    var start_issue_date = start_issue.substring(0, start_issue.length-issue_no_length)


    var issue_no = '';
    if(start_issue_num + num - 1 <= MAX) {
        for(var i = start_issue_num; i<= start_issue_num + num - 1; i++) {
            issue_no = start_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length);
            result.push(issue_no);
            ;
        }
    } else if(start_issue_num + num - 1 <= 2*MAX) {

        var tomorrow_issue_date = getTomorrowIssueDate();

        for(var i = start_issue_num; i<= MAX; i++) {
            issue_no = start_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length);
            result.push(issue_no)
            
        }

        for(var i= 1; i<=(num-1)-(MAX-start_issue_num); i++) {
            issue_no = tomorrow_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length)
            result.push(issue_no)
            
        }
    } else {
        var tomorrow_issue_date = getTomorrowIssueDate();
        var after_tomorrow_issue_date = getAfterTomorrowIssueDate();

        for(var i = start_issue_num; i<= MAX; i++) {
            issue_no = start_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length);
            result.push(issue_no)
            
        }

        for(var i= 1; i<=MAX; i++) {
            issue_no = tomorrow_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length)
            result.push(issue_no)
            
        }

        for(var i=1; i<=(num-1) - (MAX + (MAX-start_issue_num)); i++){
            issue_no = after_tomorrow_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length)
            result.push(issue_no)
            
        }
    }

    return result;
}

/*
 * 安徽kuai3 80期
 * 中国时间 08:50~22:40
 * @returns {number}
 */
function getAhkuai3Issues(start_issue, num, MAX) {
    var result = []
    var MAX = 80;
    var issue_no_length = 3
    var start_issue_num = parseInt(start_issue.substring(start_issue.length-issue_no_length));
    var start_issue_date = start_issue.substring(0, start_issue.length-issue_no_length)


    var issue_no = '';
    if(start_issue_num + num - 1 <= MAX) {
        for(var i = start_issue_num; i<= start_issue_num + num - 1; i++) {
            issue_no = start_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length);
            result.push(issue_no);
            ;
        }
    } else if(start_issue_num + num - 1 <= 2*MAX) {

        var tomorrow_issue_date = getTomorrowIssueDate();

        for(var i = start_issue_num; i<= MAX; i++) {
            issue_no = start_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length);
            result.push(issue_no)
            
        }

        for(var i= 1; i<=(num-1)-(MAX-start_issue_num); i++) {
            issue_no = tomorrow_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length)
            result.push(issue_no)
            
        }
    } else {
        var tomorrow_issue_date = getTomorrowIssueDate();
        var after_tomorrow_issue_date = getAfterTomorrowIssueDate();

        for(var i = start_issue_num; i<= MAX; i++) {
            issue_no = start_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length);
            result.push(issue_no)
            
        }

        for(var i= 1; i<=MAX; i++) {
            issue_no = tomorrow_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length)
            result.push(issue_no)
            
        }

        for(var i=1; i<=(num-1) - (MAX + (MAX-start_issue_num)); i++){
            issue_no = after_tomorrow_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length)
            result.push(issue_no)
            
        }
    }

    return result;
}

/*
 * 甘肃kuai3 72期
 * 中国时间 08:50~22:40
 * @returns {number}
 */
function getGskuai3Issues(start_issue, num, MAX) {
    var result = []
    var MAX = 72;
    var issue_no_length = 3
    var start_issue_num = parseInt(start_issue.substring(start_issue.length-issue_no_length));
    var start_issue_date = start_issue.substring(0, start_issue.length-issue_no_length)


    var issue_no = '';
    if(start_issue_num + num - 1 <= MAX) {
        for(var i = start_issue_num; i<= start_issue_num + num - 1; i++) {
            issue_no = start_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length);
            result.push(issue_no);
            ;
        }
    } else if(start_issue_num + num - 1 <= 2*MAX) {

        var tomorrow_issue_date = getTomorrowIssueDate().substring(2);

        for(var i = start_issue_num; i<= MAX; i++) {
            issue_no = start_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length);
            result.push(issue_no)
            
        }

        for(var i= 1; i<=(num-1)-(MAX-start_issue_num); i++) {
            issue_no = tomorrow_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length)
            result.push(issue_no)
            
        }
    } else {
        var tomorrow_issue_date = getTomorrowIssueDate().substring(2);
        var after_tomorrow_issue_date = getAfterTomorrowIssueDate().substring(2);

        for(var i = start_issue_num; i<= MAX; i++) {
            issue_no = start_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length);
            result.push(issue_no)
            
        }

        for(var i= 1; i<=MAX; i++) {
            issue_no = tomorrow_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length)
            result.push(issue_no)
            
        }

        for(var i=1; i<=(num-1) - (MAX + (MAX-start_issue_num)); i++){
            issue_no = after_tomorrow_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length)
            result.push(issue_no)
            
        }
    }

    return result;
}

/*
 * 广西kuai3 78期
 * 中国时间 08:50~22:40
 * @returns {number}
 */
function getGxkuai3Issues(start_issue, num, MAX) {
    var result = []
    var MAX = 78;
    var issue_no_length = 3
    var start_issue_num = parseInt(start_issue.substring(start_issue.length-issue_no_length));
    var start_issue_date = start_issue.substring(0, start_issue.length-issue_no_length)


    var issue_no = '';
    if(start_issue_num + num - 1 <= MAX) {
        for(var i = start_issue_num; i<= start_issue_num + num - 1; i++) {
            issue_no = start_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length);
            result.push(issue_no);
            ;
        }
    } else if(start_issue_num + num - 1 <= 2*MAX) {

        var tomorrow_issue_date = getTomorrowIssueDate().substring(2);

        for(var i = start_issue_num; i<= MAX; i++) {
            issue_no = start_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length);
            result.push(issue_no)
            
        }

        for(var i= 1; i<=(num-1)-(MAX-start_issue_num); i++) {
            issue_no = tomorrow_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length)
            result.push(issue_no)
            
        }
    } else {
        var tomorrow_issue_date = getTomorrowIssueDate().substring(2);
        var after_tomorrow_issue_date = getAfterTomorrowIssueDate().substring(2);

        for(var i = start_issue_num; i<= MAX; i++) {
            issue_no = start_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length);
            result.push(issue_no)
            
        }

        for(var i= 1; i<=MAX; i++) {
            issue_no = tomorrow_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length)
            result.push(issue_no)
            
        }

        for(var i=1; i<=(num-1) - (MAX + (MAX-start_issue_num)); i++){
            issue_no = after_tomorrow_issue_date + (Array(issue_no_length).join(0) + i).slice(-issue_no_length)
            result.push(issue_no)
            
        }
    }

    return result;
}


function getBjpk10Issues(start_issue, num) {
    var result = []

    start_issue = parseInt(start_issue);
    for(var i=start_issue; i<=start_issue+ num -1; i++) {
        var issue_no = '' + i;
        result.push(issue_no);
    }

    return result;
}

function getFc3dIssues(start_issue, num) {
    var result = []

    start_issue = parseInt(start_issue);
    for(var i=start_issue; i<=start_issue+ num -1; i++) {
        var issue_no = '' + i;
        result.push(issue_no);
    }

    return result;
}

function getPk35Issues(start_issue, num) {
    var result = []

    start_issue = parseInt(start_issue);
    for(var i=start_issue; i<=start_issue+ num -1; i++) {
        var issue_no = '' + i;
        result.push(issue_no);
    }

    return result;
}


function getBwin60Issues (start_issue, num) {

    var result = []
    var MAX = 1440;
    var start_issue_num = parseInt(start_issue.substring(start_issue.length-4));
    var start_issue_date = start_issue.substring(0, start_issue.length-4)

    if(start_issue_num + num - 1 <= MAX) {
        for(var i = start_issue_num; i<= start_issue_num + num - 1; i++) {
            result.push(start_issue_date + (Array(4).join(0) + i).slice(-4))
        }
    } else {

        var tomorrow_issue_date = getTomorrowIssueDate();

        for(var i = start_issue_num; i<= MAX; i++) {
            result.push(start_issue_date + (Array(4).join(0) + i).slice(-4))
        }

        for(var i= 1; i<=(num-1)-(MAX-start_issue_num); i++) {
            result.push(tomorrow_issue_date + (Array(4).join(0) + i).slice(-4))
        }
    }

    return result;
}


function getBwin720Issues (start_issue, num) {

    var result = []
    var MAX = 720;
    var start_issue_num = parseInt(start_issue.substring(start_issue.length-3));
    var start_issue_date = start_issue.substring(0, start_issue.length-3);

    if(start_issue_num + num - 1 <= MAX) {
        for(var i = start_issue_num; i<= start_issue_num + num - 1; i++) {
            result.push(start_issue_date + (Array(3).join(0) + i).slice(-3))
        }
    } else {

        var tomorrow_issue_date = getTomorrowIssueDate();

        for(var i = start_issue_num; i<= MAX; i++) {
            result.push(start_issue_date + (Array(3).join(0) + i).slice(-3))
        }

        for(var i= 1; i<=(num-1)-(MAX-start_issue_num); i++) {
            result.push(tomorrow_issue_date + (Array(3).join(0) + i).slice(-3))
        }
    }

    return result;
}

function getBwinLhcIssues (start_issue, num) {

    var result = []
    var MAX = 144;
    var start_issue_num = parseInt(start_issue.substring(start_issue.length-3));
    var start_issue_date = start_issue.substring(0, start_issue.length-3);

    if(start_issue_num + num - 1 <= MAX) {
        for(var i = start_issue_num; i<= start_issue_num + num - 1; i++) {
            result.push(start_issue_date + (Array(3).join(0) + i).slice(-3))
        }
    } else {

        var tomorrow_issue_date = getTomorrowIssueDate();

        for(var i = start_issue_num; i<= MAX; i++) {
            result.push(start_issue_date + (Array(3).join(0) + i).slice(-3))
        }

        for(var i= 1; i<=(num-1)-(MAX-start_issue_num); i++) {
            result.push(tomorrow_issue_date + (Array(3).join(0) + i).slice(-3))
        }
    }

    return result;
}

exports.getLatestNumIssue = function (code, start_issue, num) {
    var funcs = {
        cqssc: getCqsscIssues,
        tjssc: getTjsscIssues,
        xjssc: getXjsscIssues,
        hljssc: getHljsscIssues,
        hnkw: getHnwfcIssues,

        sdsyydj: getSd11x5Issues,
        jxsyxw: getJx11x5Issues,
        gdsyxw: getGd11x5Issues,
        shsyxw: getSh11x5Issues,
        ahsyxw: getAh11x5Issues,
        jssyxw: getJs11x5Issues,
        bjsyxw: getBj11x5Issues,
        lnsyxw: getLn11x5Issues,
        hebsyxw: getHb11x5Issues,
        gxsyxw: getGx11x5Issues,
        tjsyxw: getTj11x5Issues,

        jsks: getJskuai3Issues,
        ahks: getAhkuai3Issues,
        gsks: getGskuai3Issues,
        gxks: getGxkuai3Issues,
        hbks: getHbkuai3Issues,
        bjks: getBjkuai3Issues,

        bjpks: getBjpk10Issues,
        sd: getFc3dIssues,
        plw: getPk35Issues,

        bw60: getBwin60Issues,
        bw120: getBwin720Issues,
        bwsyxw: getBwin720Issues,
        bwks: getBwin720Issues,
        bwpks: getBwin720Issues,
        bwlhc: getBwinLhcIssues
    }

    if(funcs.hasOwnProperty(code)) {
        return  funcs[code](start_issue, num);
    } else {
        return -1;
    }
}
