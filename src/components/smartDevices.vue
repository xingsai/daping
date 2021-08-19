<template>
  <div class="wrap">
    <title-name :nameval="'智能设备'"></title-name>
    <div class="flex-d-wrap">
      <div class="tip-wrap f-b-w">
        <div class="list-one">
          <div class="name-label">总数</div>
          <div class="val-wrap">{{ allInfo.allNum }}</div>
        </div>
        <div class="list-one">
          <div class="name-label">本月新增</div>
          <div class="val-wrap">{{ allInfo.currentmonth }}</div>
        </div>
        <div class="list-one">
          <div class="name-label">上月新增</div>
          <div class="val-wrap">{{ allInfo.beforemonth }}</div>
        </div>
      </div>
      <div class="tip-wrap f-a-w">
        <div class="list-one">
          <div class="name-label f-c-w">
            设备运行中
            <span class="val-wrap equipment">{{ allInfo.runing }}</span>
          </div>
        </div>
        <div class="list-one">
          <div class="name-label f-c-w">
            设备异常中
            <span class="val-wrap equipment red-text">{{
              allInfo.unnormal
            }}</span>
          </div>
        </div>
      </div>
      <div class="flex-d-wrap">
        <div class="txt-style" style="margin-top: 3%">各年总体统计及新增</div>
        <div class="tip-wrap f-c-w">
          <div class="f-c-w">
            <span class="icon-point blue-point"></span>
            <span class="txt-style">总数</span>
          </div>
          <div class="f-c-w" style="margin-left: 20px">
            <span class="icon-point"></span>
            <span class="txt-style">新增</span>
          </div>
        </div>
        <div class="year-wrap">
          <div
            v-for="(item, index) in yearList"
            :key="index"
            class="year-one f-c-w"
          >
            <div class="yearName txt-style">{{ item.yearnum }}年</div>
            <div class="num-line-wrap">
              <div class="f-c-w">
                <div class="flex1">
                  <div
                    class="linePre line-style"
                    :style="{
                      width: (item.allnum / allInfo.allNum) * 100 + '%',
                    }"
                  ></div>
                </div>
              </div>
              <div class="f-c-w">
                <div class="flex1">
                  <div
                    class="line-style linered"
                    :style="{
                      width: (item.addnum / allInfo.allNum) * 100 + '%',
                    }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="num-wrap">
              <div class="f-c-w">
                <div class="txt-style">{{ item.allnum }}</div>
              </div>
              <div class="f-c-w">
                <div class="txt-style">{{ item.addnum }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import titleName from "@/components/title.vue";
export default {
  name: "",
  props: {
    devicesList: {
      type: Array,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return [];
      },
    },
  },
  watch: {
    devicesList: {
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
        currentmonth: 0,
        beforemonth: 0,
        runing: 0,
        unnormal: 0,
      },
      yearList: [
        { yearnum: "xxxx", allnum: 0, addnum: 0 },
        { yearnum: "xxxx", allnum: 0, addnum: 0 },
        { yearnum: "xxxx", allnum: 0, addnum: 0 },
      ],
      maxNum: "",
    };
  },
  components: { titleName },
  created() {
    this.maxNum = this.getMax(this.yearList);
  },
  mounted() {},
  methods: {
    dealInfo(list) {
      this.$set(this.allInfo, "allNum", list.length);
      let currentmonthAdd = 0, //当月新增
        beforemonthAdd = 0, //上月新增
        unnormal = 0,
        runing = 0,
        currentYear = new Date().getFullYear(), //年
        currentYearNum = 0, //当年的新增数量
        currentYearAddNum = 0, //当年的新增数量
        beforeYearNum = 0, //去年的数量
        beforeYearAddNum = 0, //去年的新增数量
        yearBeforeLastNum = 0, //前年的数量
        yearBeforeLastAddNum = 0; //前年的新增数量

      list.forEach((element) => {
        if (element.created_at) {
          let time = element.created_at.substring(0, 7);
          let creatYear = element.created_at.substring(0, 4) - 0;

          if (currentYear >= creatYear) {
            currentYearNum++;
          }
          if (currentYear === creatYear) {
            currentYearAddNum++;
          }
          if (currentYear - 1 >= creatYear) {
            beforeYearNum++;
          }
          if (currentYear - 1 === creatYear) {
            beforeYearAddNum++;
          }
          if (currentYear - 2 >= creatYear) {
            yearBeforeLastNum++;
          }
          if (currentYear - 2 === creatYear) {
            yearBeforeLastAddNum++;
          }
          if (new Date().toISOString().substring(0, 7) === time) {
            currentmonthAdd++;
          }
          if (this.getPreMonth() === time) {
            beforemonthAdd++;
          }
        }
        if (element.status === 3) {
          unnormal++;
        }
        if (element.status === 2) {
          runing++;
        }
      });
      this.yearList[0] = {
        yearnum: currentYear,
        allnum: currentYearNum,
        addnum: currentYearAddNum,
      };
      this.yearList[1] = {
        yearnum: currentYear - 1,
        allnum: beforeYearNum,
        addnum: beforeYearAddNum,
      };
      this.yearList[2] = {
        yearnum: currentYear - 2,
        allnum: yearBeforeLastNum,
        addnum: yearBeforeLastAddNum,
      };
      this.$set(this.allInfo, "currentmonth", currentmonthAdd);
      this.$set(this.allInfo, "beforemonth", beforemonthAdd);
      this.$set(this.allInfo, "unnormal", unnormal);
      this.$set(this.allInfo, "runing", runing);
    },
    //获取上一个月的月份
    getPreMonth() {
      let today = new Date().toISOString().substring(0, 7);
      var arr = today.split("-");
      var year = parseInt(arr[0]),
        month = parseInt(arr[1]);
      var year2 = year,
        month2,
        month2 = month - 1;
      if (month2 == 0) {
        //如当前是一月份
        month2 = 12;
        year2 = year - 1;
      }
      return year2 + "-" + month2;
    },
    getMax(list) {
      var max = list[0].allnum;
      var len = list.length;
      for (var i = 1; i < len; i++) {
        if (list[i] > max) {
          max = list[i];
        }
      }
      return max;
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
  width: 100%;
}
.flex-d-wrap {
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
}
.list-one {
  flex: 1;
  margin: 0px 10px;
  background-color: transparent;
  text-align: center;
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
.year-wrap {
  flex: 1;
  overflow: auto;
  width: 100%;
  display: block;
  margin-top: 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .year-one {
    display: flex;
    padding: 5px 10px;
    box-sizing: border-box;
  }
  .yearName {
    flex: 0 0 50px;
  }
  .num-line-wrap {
    flex: 1;
  }
  .line-style {
    width: 100%;
    background-color: rgba(0, 165, 255, 0.1);
    height: 5px;
    border-radius: 5px;
  }
  .flex1 {
    flex: 1;
  }
  .linePre {
    background-image: linear-gradient(to right, #4496fb, #5deaff);
  }
  .linered {
    margin-top: 10px;
    background-image: linear-gradient(to right, #fd3022, #ff6f6f);
  }
}
</style>
