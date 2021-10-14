const tools = {
    // 时间戳格式转化 2018-07-30 11:11:11
    dataYMDHSS: function (timestamp) {
        if (!timestamp) {
            return '--'
        }
        var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear();
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        var D = (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate());
        var h = (date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours());
        var m = (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
        var s = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds();
        return `${Y}-${M}-${D} ${h}:${m}:${s}`;
    },
    // 时间戳格式转化 2018-07-30
    dataYMD: function (timestamp) {
        if (!timestamp) {
            return '--'
        }
        var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        // var Y = date.getFullYear() + '-';
        // var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        // var D = date.getDate() + ' ';

        // return Y + M + D;
        var Y = date.getFullYear();
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        var D = (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate());

        return `${Y}-${M}-${D}`;
    },

    // 时间戳格式转化 2018-07
    dataYM: function (timestamp) {
        if (!timestamp) {
            return '--'
        }
        var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        // var Y = date.getFullYear() + '-';
        // var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        // var D = date.getDate() + ' ';

        // return Y + M ;
        var Y = date.getFullYear();
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        // var D = (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate());

        return `${Y}-${M}`;
    },

    // 时间戳转化为 12：03
    dataHMS: function (timestamp) {
        if (!timestamp) {
            return '--'
        }
        var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var h = (date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours());
        var m = (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
        var s = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds();
        return `${h}:${m}:${s}`;
    },
    // 时间戳转化为 12：03
    dataHM: function (timestamp) {
        if (!timestamp) {
            return '--'
        }
        var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var h = (date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours());
        var m = (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());

        return `${h}:${m}`;
    },
    /**
     *获取当前星期几
     *
    */
    getWeekDate() {
        var now = new Date();
        var day = now.getDay();
        var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
        var week = weeks[day];
        return week;
    }

}
export default tools