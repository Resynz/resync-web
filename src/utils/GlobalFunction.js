/**
 * @Author: Resynz
 * @Date: 2021/1/7 09:55
 */
const globalFunction = {
    async Sleep (time) {
        return new Promise((resolve)=>{
            setTimeout(()=>{
                resolve({})
            },time)
        })
    },
    removeEmptyField (list, field) {
        list.forEach(v => v[field].length === 0 ? delete v[field] : this.removeEmptyField(v[field], field))
        return list
    },
    formatDataTree (data, id = 'id', fid = 'fid', children = 'children') {
        const tempTree = []
        const tree = []
        const items = []
        data.forEach(v => {
            if (!tempTree[v[id]]) {
                const temp = v
                temp[children] = []
                tempTree[v[id]] = temp
                items.push(temp)
            }
        })
        items.forEach(v => (tempTree[v[fid]] && tempTree[v[fid]][children].push(tempTree[v[id]])) || tree.push(tempTree[v[id]]))
        return this.removeEmptyField(tree, children)
    },
    /**
     * 获取指定的时间戳范围 今天 pos = 0   昨天 pos = -1  前天 pos = -2 明天 pos = 1
     * @return {{start: number, end: number}}
     */
    getTimeStampRange (pos = 0) {
        const dayTimeStamp = 86400000
        const start = new Date(Date.now() + pos * dayTimeStamp).setHours(0, 0, 0, 0)
        const end = new Date(Date.now() + pos * dayTimeStamp).setHours(23, 59, 59, 999)
        return {
            start,
            end
        }
    },
    /**
     * 获取指定的周时间戳范围 本周 pos = 0  上周 pos = -1  上上周 pos = -2  下周 pos = 1 下下周 pos = 2
     * @param pos
     * @return {{start: number, end: number}}
     */
    getWeekTimeStampRange (pos = 0) {
        const dayTimeStamp = 86400000
        const date = new Date()
        const today = date.getDay()
        let stepSunDay = -today + 1
        let stepMonday = 7 - today
        if (today === 0) {
            stepSunDay = -7
            stepMonday = 0
        }
        const start = new Date(Date.now() + stepSunDay * dayTimeStamp + 7 * dayTimeStamp * pos).setHours(0, 0, 0, 0)
        const end = new Date(Date.now() + stepMonday * dayTimeStamp + 7 * dayTimeStamp * pos).setHours(23, 59, 59, 999)
        return {
            start,
            end
        }
    },
    /**
     * 获取指定的月时间戳范围 本月 pos = 0  上月 pos = -1  上上月 pos = -2  下月 pos = 1 下下月 pos = 2
     * @param pos
     * @return {{start: number, end: number}}
     */
    getMonthTimeStampRange (pos = 0) {
        const d = new Date()
        const d1 = new Date(d.setMonth(d.getMonth() + pos))
        let t1 = 0
        let t2 = 0
        t1 = new Date(d1.setDate(1)).setHours(0, 0, 0, 0)
        const d2 = new Date(t1)
        t2 = new Date(d2.setMonth(d2.getMonth() + 1)).setMilliseconds(-1)
        return {
            start: t1,
            end: t2
        }
    },
    /**
     * 获取指定季度的时间戳范围 本季度 pos = 0 上季度 pos = -1 下季度 pos = 1
     * @param pos
     * @return {{start: number, end: number}}
     */
    getSeasonTimeStampRange (pos = 0) {
        const seasonMonths = [0, 3, 6, 9]
        let seasonIndex = 0
        const now = new Date()
        let seasonYear = now.getFullYear()
        const nowMonth = now.getMonth()
        if (nowMonth < 3) {
            seasonIndex = 0
        }

        if (nowMonth > 2 && nowMonth < 6) {
            seasonIndex = 1
        }

        if (nowMonth > 5 && nowMonth < 9) {
            seasonIndex = 2
        }
        if (nowMonth > 8) {
            seasonIndex = 3
        }
        seasonIndex += pos
        const diffYears = Math.floor(seasonIndex / 4)
        seasonYear += diffYears
        seasonIndex %= 4
        if (seasonIndex < 0) {
            seasonIndex += 4
        }
        // 获取季度开端月份 和 截止月份
        const startMonth = seasonMonths[seasonIndex]
        const endMonth = startMonth + 2
        const endMonthDays = this.getMonthDays(seasonYear, endMonth)
        return {
            start: new Date(seasonYear, startMonth, 1).getTime(),
            end: new Date(seasonYear, endMonth, endMonthDays).getTime()
        }
    },
    getYearTimeStampRange (pos = 0) {
        const curYear = new Date().getFullYear()
        let t1 = 0
        let t2 = 0
        // new Date(year, month, day, hours, minutes, seconds, milliseconds);
        t1 = new Date(curYear+pos,0,1,0,0,0,0).getTime()
        t2 = new Date(curYear+pos,11,31,23,59,59,999).getTime()
        return {
            start: t1,
            end: t2
        }
    },
    formatTime (time = Date.now(), formula = 'yyyy-MM-DD hh:mm:ss') {
        const date = new Date(time)
        const year = date.getFullYear()
        let month = date.getMonth() + 1
        month = month.toString().padStart(2, '0')
        let day = date.getDate()
        day = day.toString().padStart(2, '0')
        let hour = date.getHours()
        hour = hour.toString().padStart(2, '0')
        let minutes = date.getMinutes()
        minutes = minutes.toString().padStart(2, '0')
        let second = date.getSeconds()
        second = second.toString().padStart(2, '0')
        return formula.replace('yyyy', year).replace('MM', month).replace('DD', day).replace('hh', hour).replace('mm', minutes).replace('ss', second)
    },
    getMonthDays (year, month) {
        const monthStartDate = new Date(year, month, 1)
        const monthEndDate = new Date(year, month + 1, 1)
        return (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
    },
    /**
     * 检测是否是手机号
     * @param mobile
     * @return {boolean}
     */
    isMobile (mobile) {
        const reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
        return reg.test(mobile);
    },
    /**
     * 首字母大写
     * @param text
     * @return {string}
     */
    firstUpperCase (text) {
        return text.split('').map((v,i)=>i&&v.toLowerCase()||v.toUpperCase()).join('')
    },
    getPlatform () {
        const u = navigator.userAgent;
        //是否是android浏览器
        var isAndroid = u.indexOf('Android') > -1;
        //是否是ios浏览器
        var isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        var msg = '';
        if (isAndroid) {
            msg = "android";
        } else if (isIos) {
            msg = 'ios';
        } else {
            msg = 'pc';
        };
        return msg
    },
    genFileIdentifyName (f) {
        return `${f.name}|${f.size}|${f.type.toString().split("/").join('-')}|${f.lastModified}`
    },
    lazyText (txt,size=15) {
        let res = '';
        if (txt.length<=size) {
            res = txt;
        }else {
            res  = txt.substr(0,size)+'...'
        }
        return  res
    },
    brText (txt)  {
        if (txt.length<=15) {
            return txt;
        }
        let len =txt.length;
        let slice = 15;
        let num = Math.ceil(len/slice);
        let res  = [];
        for (let i=0;i<num;i++) {
            res.push(txt.substr(i*slice,slice));
        }
        return res.join('<br/>')
    },
    _removePad (arr,padStr) {
        let flag = false;
        let res = [];
        for (let i =0;i<arr.length;i++) {
            let v = arr[i];
            if (v!==padStr) {
                flag = true;
            }
            if (flag) {
                res.push(v);
            }
        }
        if (res.length===0) {
            res.push(padStr)
        }
        return res.join('')
    },
    padAppVersion (version) {
        let vs = version.split('.');
        vs = vs.map(v=>v.toString().padStart(4,'0'));
        return vs.join('.');
    },
    removePadAppVersion (version) {
        let vs = version.split('.');
        vs = vs.map(v=>{
            let vvs = v.split('');
            return this._removePad(vvs,'0')
        });
        return vs.join('.')
    },
    /**
     * 英文标点符号转换为中文
     * @param str
     */
    transformPunctuation(str) {
        const en = ['(',')','[',']','{','}','<','>',',','.','?','!']
        const zh = ['（','）','【','】','「','」','《','》','，','。','？','！']
        let newStr = "";
        str.split("").forEach(v => {
            if (en.indexOf(v)>=0) {
                newStr+=zh[en.indexOf(v)]
            } else {
                newStr+=v
            }
        })
        return newStr
    },
    transFromZhToEn(str) {
        const en = ['(',')','[',']','{','}','<','>',',','.','?','!']
        const zh = ['（','）','【','】','「','」','《','》','，','。','？','！']
        let newStr = "";
        str.split("").forEach(v => {
            if (zh.indexOf(v)>0) {
                newStr+=en[zh.indexOf(v)]
            } else {
                newStr+=v
            }
        })
        return newStr
    },


    formatAmount (amount) {
        return parseFloat(amount/100).toFixed(2)
    },

    formatSeconds(a) {
        let hh = parseInt(a / 3600);
        if(hh<10) hh = "0" + hh;
        let mm = parseInt((a - hh * 3600) / 60);
        if(mm<10) mm = "0" + mm;
        let ss = parseInt((a - hh * 3600) % 60);
        if(ss<10) ss = "0" + ss;
        const length = hh + "小时" + mm + "分" + ss + "秒";
        if(a>0){
            return length;
        }else{
            return "0秒";
        }
    }
};

export default {
    install (Vue) {
        Vue.prototype.$globalFunction = globalFunction
    }
}
