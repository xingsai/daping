<template>
  <div class="wrap">
    <title-name :nameval="'体系成员'"></title-name>
    <div class="tip-wrap f-a-w">
      <div class="list-one">
        <div class="name-label">执勤人数</div>
        <div class="val-wrap">{{ allInfo.patrolNum }}</div>
      </div>
      <div class="list-one">
        <div class="name-label">成员总数</div>
        <div class="val-wrap">{{ allInfo.allNum }}</div>
      </div>
      <div class="list-one">
        <div class="name-label">本月新增</div>
        <div class="val-wrap">{{ allInfo.currentmonthAdd }}</div>
      </div>
    </div>
    <div class="txt-style" style="margin-top: 3%">体系成员比例</div>
    <div id="myChart" :style="{ width: '100%', height: '100%' }"></div>
  </div>
</template>

<script>
import titleName from "@/components/title.vue";
import { getChestList, getFirstAidList, getsystemMember } from "@/utils/api.js";
export default {
  name: "",
  data() {
    return {
      timer: null,
      memberList: [],
      allInfo: {
        allNum: 1,
        patrolNum: 1,
        currentmonthAdd: 1
      }
    };
  },
  components: { titleName },
  created() {},
  mounted() {
    this.init();
    this.timer = setInterval(() => {
      this.init();
    }, 60 * 1000);
  },
  beforeDestroy() {
    //实例销毁前青出于定时器

    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    init() {
      getsystemMember({
        company_id: this.$route.query.id ? this.$route.query.id : 3 //公司id
      }).then(response => {
        const data = response.data;
        if (data.status_code === 200) {
          this.memberList = data.data;
          let currentmonthAdd = 0; //当月新增人数
          let patrolNum = 0; //执勤人数  ，获取的是一个月的数据
          let peopleType0 = 0; ////0 运维  1志愿者 2，导师
          let peopleType1 = 0; ////0 运维  1志愿者 2，导师
          let peopleType2 = 0; ////0 运维  1志愿者 2，导师

          this.memberList.forEach(item => {
            if (item.attribute === 0) {
              peopleType0++;
            }
            if (item.attribute === 1) {
              peopleType1++;
            }
            if (item.attribute === 2) {
              peopleType2++;
            }
            let time = item.created_at.substring(0, 7);
            let CurrentMonth = new Date().toISOString().substring(0, 7);
            if (CurrentMonth === time) {
              currentmonthAdd++;
            }
            let patrolTime = item.lastPatrolTime.created_at
              ? item.lastPatrolTime.created_at.substring(0, 7)
              : "";
            if (CurrentMonth === patrolTime) {
              patrolNum++;
            }
          });
          //0 运维  1志愿者 2，导师
          this.$set(this.allInfo, "patrolNum", patrolNum);
          this.$set(this.allInfo, "allNum", this.memberList.length);
          this.$set(this.allInfo, "currentmonthAdd", currentmonthAdd);
          this.drawLine(peopleType0, peopleType1, peopleType2);
        } else {
          this.$message({
            message: data.message,
            type: "warning"
          });
        }
      });
    },
    drawLine(val0, val1, val2) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      window.addEventListener("resize", () => {
        myChart.resize();
      });
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          top: "2",
          orient: "horizontal",
          align: "left",
          // left: "center",
          itemWidth: 10,
          itemHeight: 10,
          borderRadius: [15, 5, 0, 0],
          // itemStyle: {},
          textStyle: {
            color: "#fff"
          }
        },
        series: [
          {
            name: "体系成员比例",
            type: "pie",
            radius: "50%",
            label: {
              formatter: "{b}\n" + "占比" + "{d}%",
              color: "#fff"
            },
            data: [
              {
                value: val0,
                name: "普通成员",
                itemStyle: {
                  color: "#29E0F4"
                },
                textStyle: {
                  color: "#fff"
                }
              },
              {
                value: val1,
                name: "急救志愿者",
                itemStyle: {
                  color: "#FF126A"
                },

                textStyle: {
                  color: "#fff"
                }
              },
              {
                value: val2,
                name: "急救导师",
                itemStyle: {
                  color: "#2096FC"
                },

                textStyle: {
                  color: "#fff"
                }
              }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    }
  }
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
