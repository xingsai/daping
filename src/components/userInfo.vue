<template>
  <div class="wrap">
    <title-name :nameval="'用户信息'"></title-name>
    <div class="tip-wrap f-a-w">
      <div class="list-one">
        <div class="name-label">总人数</div>
        <div class="val-wrap">{{ allInfo.allNum }}</div>
      </div>

      <div class="list-one">
        <div class="name-label">本月新增</div>
        <div class="val-wrap">{{ allInfo.newUserCount }}</div>
      </div>
    </div>

    <div class="txt-style" style="margin-top: 3%">用户男女比例</div>
    <div id="userChart" :style="{ width: '100%', height: '100%' }"></div>
  </div>
</template>

<script>
import titleName from "@/components/title.vue";
import { getUserInfo } from "@/utils/api.js";

export default {
  name: "",
  data() {
    return {
      allInfo: {
        allNum: 0,
        newUserCount: 0,
        sex0: 0,
        sex1: 0,
        sex2: 0,
      },
    };
  },
  components: { titleName },
  created() {},
  mounted() {
    //this.drawLine();
    // 初始化页面，获取用户信息
    this.init();
  },
  methods: {
    init() {
      getUserInfo().then((res) => {
        let data = res.data;
        console.log(data);
        if (data.status_code === 200) {
          let allNum = 0;
          console.log(data.usersGenderCount);
          data.data.usersGenderCount.forEach((item, index) => {
            allNum += item.num;
            // if(item.gender===0){
            //gender 0 未知  1 男 2 女
            this.$set(this.allInfo, "sex" + item.gender, item.num);
          });
          this.$set(this.allInfo, "allNum", allNum);
          //newUserCount 30天内新增的用户数量
          this.$set(this.allInfo, "newUserCount", data.data.newUserCount);
          this.drawLine();
        } else {
          this.$message({
            message: data.message,
            type: "warning",
          });
        }
      });
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("userChart"));
      window.addEventListener("resize", () => {
        myChart.resize();
      });
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
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
            color: "#fff",
          },
        },
        series: [
          {
            name: "体系成员比例",
            type: "pie",
            radius: [40, 80],
            label: {
              formatter: "{b}\n" + "占比" + "{d}%",
              color: "#fff",
            },
            data: [
              {
                value: this.allInfo.sex1,
                name: "男",
                itemStyle: {
                  color: "#29E0F4",
                },
                textStyle: {
                  color: "#fff",
                },
              },
              {
                value: this.allInfo.sex2,
                name: "女",
                itemStyle: {
                  color: "#FF126A",
                },

                textStyle: {
                  color: "#fff",
                },
              },
              {
                value: this.allInfo.sex0,
                name: "未知",
                itemStyle: {
                  color: "#2096FC",
                },

                textStyle: {
                  color: "#fff",
                },
              },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
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
