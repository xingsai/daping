<template>
  <div class="wrap">
    <title-name :nameval="'求助处理列表'"></title-name>
    <div class="list-wrap" ref="scrollWrap">
      <div class="s-items" ref="scrollinnerWrap">
        <div class="list-table" v-for="(item, index) in showList" :key="index">
          <div class="f-b-w line-one">
            <div class="number">事件编号：{{ item.uid }}</div>
            <div
              align="right"
              class="status"
              :class="{ no: item.status == 1 ? false : true }"
              style="font-weight: bold"
            >
              {{ item.status == 1 ? "已处理" : "未处理" }}
            </div>
          </div>
          <div class="f-b-w">
            <div class="address">呼救地址：{{ item.address }}</div>
            <div align="right" class="time">时间：{{ item.created_at }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="pageNation-wrap">
      <my-pagenation
        :remoteTotals="tableList.length"
        :showNum="10"
        :curePage="curePage"
        v-if="tableList.length > 0"
      ></my-pagenation>
    </div>
  </div>
</template>

<script>
import titleName from "@/components/title.vue";
import myPagenation from "@/components/myPagenation.vue";
import { deepCopy } from "@/utils/deepcopy.js";
export default {
  name: "",
  props: {
    sosList: {
      type: Array,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function() {
        return [];
      }
    }
  },
  watch: {
    sosList: {
      handler: function(val, oldVal) {
        if (val && val.length > 0) {
          let data = deepCopy(val);
          this.dealInfo(data);
        }
      },
      // 深度观察监听
      // deep: true,
      immediate: true // 初始化的时候执行一次
    }
  },
  data() {
    return {
      curePage: 1,
      int: null,
      totals: "",
      tableList: [], //所有的数据
      showList: [], //要展示的数据
      dealList: [] //处理过的数据【【】，【】】
    };
  },
  components: { titleName, myPagenation },
  created() {},
  mounted() {
    //this.drawLine();、
    // ;
  },
  beforeDestroy() {
    clearInterval(this.int);
  },
  methods: {
    //滚动相关设置
    scrollSet() {
      if (this.int) {
        clearInterval(this.int);
      }
      let flag = 0;
      this.int = setInterval(() => {
        //+1  特殊处理，精度问题
        if (
          this.$refs.scrollWrap.scrollTop +
            this.$refs.scrollWrap.clientHeight +
            1 >=
          this.$refs.scrollinnerWrap.scrollHeight
        ) {
          //当条数不够滚动的时候
          if (
            this.$refs.scrollWrap.clientHeight >=
            this.$refs.scrollinnerWrap.scrollHeight
          ) {
            setTimeout(() => {
              this.showList = this.dealList[0];
              flag = 0;
              this.curePage = 1;
            }, 3000);
          } else {
            this.$refs.scrollWrap.scrollTop = 0;
            flag++;
            if (flag === this.dealList.length) {
              this.showList = this.dealList[0];
              flag = 0;
              this.curePage = 1;
            } else {
              this.showList = this.dealList[flag];
              this.curePage = flag + 1;
            }
          }
        } else {
          this.$refs.scrollWrap.scrollTop++;
        }
      }, 20);
    },
    //根据坐标反推地址，
    reset_location(point) {
      var geoc = new BMap.Geocoder();
      return new Promise((resolve, reject) => {
        var address = "";
        geoc.getLocation(point, rs => {
          var _value = rs.addressComponents;
          var province = _value.province;
          var city = _value.city;
          var county = _value.district;
          var street = _value.street + _value.streetNumber;
          address = province + city + county + street;

          resolve(address);
        });
      });
    },
    // 数组分割
    group(array, subGroupLength) {
      let index = 0;
      const newArray = [];
      while (index < array.length) {
        newArray.push(array.slice(index, (index += subGroupLength)));
      }
      return newArray;
    },
    //数据处理
    dealInfo(val) {
      this.tableList = val;
      this.tableList.forEach(item => {
        if (item.lng && item.lat) {
          this.reset_location(new BMap.Point(item.lng, item.lat)).then(res => {
            //item.address = res;
            this.$set(item, "address", res);
          });
        } else {
          item.address = "";
        }
      });
      // this.tableList = this.tableList
      //   .concat(this.tableList)
      //   .concat(this.tableList);
      this.dealList = this.group(this.tableList, 10);
      this.showList = this.dealList[0];

      this.$nextTick(() => {
        this.scrollSet();
      });
    }
  }
};
</script>

<style scoped lang="scss">
.wrap {
  color: #fff;
  font-size: 12px;
  height: 100%;
  position: relative;
}
.txt-style {
  font-size: 12px;
}
.list-wrap {
  position: absolute;
  top: 50px;
  right: 0;
  left: 0;
  bottom: 34px;
  overflow: auto;
}
.s-items {
  padding: 10px;
  box-sizing: border-box;
  height: auto;
}
.list-table {
  background: transparent !important;
  box-shadow: inset 0 0 15px 7px #0a1734;
  border: 1px solid transparent;
  width: 100%;
  border-radius: 2px;
  margin-bottom: 10px;
  padding: 10px;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  .line-one {
    margin-bottom: 10px;
  }
  .status {
    font-size: 14px;
    color: #6699d4;
  }
  .no {
    color: #ff2c2c;
  }
}
.pageNation-wrap {
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
}
::-webkit-scrollbar {
  width: 12px;
  height: 10px;
  background-color: rgba(0, 0, 0, 0.1);
  position: absolute;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(193, 193, 193, 0.3);
  border-radius: 6px;
}
</style>
