<template>
  <div class="wrap">
    <title-name :nameval="'求助事件'"></title-name>
    <div class="tip-wrap f-a-w">
      <div class="list-one">
        <div class="name-label f-c-w">
          求助事件总数
          <span class="val-wrap equipment">{{ allInfo.allNum }}</span>
        </div>
      </div>
    </div>
    <div class="tip-wrap f-a-w">
      <div class="list-one">
        <div class="name-label f-c-w">
          当月总数
          <span class="val-wrap equipment">{{ allInfo.currentMonthNum }}</span>
        </div>
        <div class="name-label f-c-w">
          已处理
          <span class="val-wrap equipment">{{
            allInfo.currentMonthDealed
          }}</span>
        </div>
      </div>
      <div class="list-one">
        <div class="name-label f-c-w">
          当日总数
          <span class="val-wrap equipment">{{ allInfo.currentDayNum }}</span>
        </div>
        <div class="name-label f-c-w">
          已处理
          <span class="val-wrap equipment">{{ allInfo.currentDayDealed }}</span>
        </div>
      </div>
    </div>

    <div class="txt-style" style="margin-top: 3%">
      发起求助时间与响应求助时间
    </div>

    <div id="leiChart" :style="{ width: '100%', height: '100%' }"></div>
  </div>
</template>

<script>
import titleName from "@/components/title.vue";
export default {
  name: "",
  props: {
    sosList: {
      type: Array,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return [];
      },
    },
  },
  watch: {
    sosList: {
      handler: function (val, oldVal) {
        if (val && val.length > 0) {
          this.dealInfo(val);
        }
      },
      // 深度观察监听
      // deep: true,
      immediate: true, // 初始化的时候执行一次
    },
  },
  data() {
    return {
      allInfo: {
        allNum: 0,
        currentMonthNum: 0,
        currentMonthDealed: 0,
        currentDayNum: 0,
        currentDayDealed: 0,
      },
    };
  },
  components: { titleName },
  created() {},
  mounted() {
    this.drawLine();
  },
  methods: {
    //处理数据
    dealInfo(val) {
      this.$set(this.allInfo, "allNum", val.length);
      let currentMonthNum = 0,
        currentMonthDealed = 0,
        currentDayNum = 0,
        currentDayDealed = 0;
      let listEcharts = [];
      val.forEach((item) => {
        item.minDiff = this.GetDateDiff(
          item.created_at,
          item.updated_at,
          "minute"
        );
        item.hourDiff = this.GetDateDiff(
          item.created_at,
          item.updated_at,
          "hour"
        );
        listEcharts.push([
          Math.floor((item.minDiff % 60) / 10),
          item.hourDiff,
          4,
        ]);
        //  listEcharts.push([6, 6, 8]);
        // listEcharts.push([3, 7, 4]);
        // listEcharts.push([3, 8, 2]);
        let today = new Date().toISOString().substring(0, 10);
        let currentMonth = new Date().toISOString().substring(0, 7);
        if (currentMonth === item.created_at.substring(0, 7)) {
          currentMonthNum++;
          if (item.status === 1) {
            currentMonthDealed++;
          }
        }
        if (today === item.created_at.substring(0, 10)) {
          currentDayNum++;
          if (item.status === 1) {
            currentDayDealed++;
          }
        }
      });
      this.$set(this.allInfo, "currentMonthNum", currentMonthNum);
      this.$set(this.allInfo, "currentMonthDealed", currentMonthDealed);
      this.$set(this.allInfo, "currentDayNum", currentDayNum);
      this.$set(this.allInfo, "currentDayDealed", currentDayDealed);
      this.drawLine(listEcharts);
    },
    GetDateDiff(startTime, endTime, diffType) {
      //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
      startTime = startTime.replace(/\-/g, "/");
      endTime = endTime.replace(/\-/g, "/");
      //将计算间隔类性字符转换为小写
      diffType = diffType.toLowerCase();
      var sTime = new Date(startTime); //开始时间
      var eTime = new Date(endTime); //结束时间
      //作为除数的数字
      var timeType = 1;
      switch (diffType) {
        case "second":
          timeType = 1000;
          break;
        case "minute":
          timeType = 1000 * 60;
          break;
        case "hour":
          timeType = 1000 * 3600;
          break;
        case "day":
          timeType = 1000 * 3600 * 24;
          break;
        default:
          break;
      }
      return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType));
    },
    drawLine(list) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("leiChart"));
      window.addEventListener("resize", () => {
        myChart.resize();
      });
      // 绘制图表
      var hours = [
        "u",
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
      ];
      var mins = ["10min", "20min", "30min", "40min", "50min", "60min"];

      var data = list;
      myChart.setOption({
        polar: {},
        //  backgroundColor: "red",

        angleAxis: {
          type: "category",
          data: hours,
          boundaryGap: false,
          splitLine: {
            show: true,
          },
          axisLine: {
            show: true,
          },
          axisLabel: {
            color: "#fff",
            // rotate: 45,
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: "#fff",
              opacity: 0.3,
            },
          },
        },
        radiusAxis: {
          type: "category",
          data: mins,
          splitLine: {
            show: true,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#fff",
            },
          },
          axisLabel: {
            interval: 0,
            color: "#fff",

            // rotate: 45,
          },
        },
        series: [
          {
            name: "",
            type: "scatter",
            itemStyle: {
              shadowColor: "red",
            },
            coordinateSystem: "polar",
            symbolSize: function (val) {
              return val[2] * 2;
            },
            data: data,

            animationDelay: function (idx) {
              return idx * 5;
            },
          },
        ],
      });
    },
  },
};
</script>

<style scoped lang="scss">
.wrap {
  color: #fff;
}
.txt-style {
  font-size: 12px;
}
.tip-wrap {
  margin-top: 5px;
}
.list-one {
  flex: 1;
  margin: 0px 10px;
  background-color: transparent;
  text-align: center;
  vertical-align: middle;
  padding: 6px 10px;
  border-radius: 2px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-box-shadow: inset 0 0 15px 7px #0a1734;
  box-shadow: inset 0 0 15px 7px #0a1734;
  .name-label {
    font-size: 12px;
    color: #fff;
  }
  .val-wrap {
    color: #ffa200;
    font-size: 16px;
    font-weight: bold;
    margin-top: 10px;
  }
  .equipment {
    margin-top: 0px;
    margin-left: 5px;
  }
  .red-text {
    color: rgb(255, 44, 44);
  }
}
.icon-point {
  height: 6px;
  width: 6px;
  border-radius: 10px;
  background-color: red;
  display: inline-block;
  margin-right: 3px;
}

.blue-point {
  background-color: blue;
}
</style>
