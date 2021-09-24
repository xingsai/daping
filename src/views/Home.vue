<template>
  <div class="home" :style="mainBg">
    <div class="tilte-wrap" :style="titleBg">
      <div class="f-w">
        <div class="time">
          <div class="t">{{ nowTime }}</div>
          <div style="height: 50px; transform: scale(0.7)">
            <div style="height: 50%; line-height: 30px">{{ nowWeek }}</div>
            <div style="height: 50%; line-height: 25px">{{ nowDay }}</div>
          </div>
        </div>
        <div class="title-name" @click="goOtherLink">
          重药席勒救护服务中心智慧应急救护保障体系
        </div>
        <div class="right-wrap"></div>
      </div>
    </div>

    <div class="main-wrap">
      <div class="f-w" style="height: 50%">
        <div class="between-wrap">
          <smart-devices
            class="bg-style"
            :devicesList="devicesList"
          ></smart-devices>
        </div>
        <div class="middle-wrap">
          <bmap class="bg-style" :devicesList="devicesList"></bmap>
        </div>

        <div class="between-wrap">
          <system-member class="bg-style"></system-member>
        </div>
      </div>
      <div class="f-w" style="height: 50%">
        <div class="between-wrap">
          <help-events :sosList="sosList" class="bg-style"></help-events>
        </div>
        <div class="middle-wrap">
          <events-deal-list
            :sosList="sosList"
            class="bg-style"
          ></events-deal-list>
        </div>

        <div class="between-wrap">
          <user-info class="bg-style"></user-info>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import bmap from "@/components/map.vue";
import smartDevices from "@/components/smartDevices.vue";
import systemMember from "@/components/systemMember.vue";
import helpEvents from "@/components/helpEvents.vue";
import eventsDealList from "@/components/eventsDealList.vue";
import userInfo from "@/components/userInfo.vue";
import { getChestList, getFirstAidList, getsystemMember } from "@/utils/api.js";

export default {
  name: "Home",
  components: {
    bmap,
    smartDevices,
    systemMember,
    helpEvents,
    eventsDealList,
    userInfo,
  },
  data() {
    return {
      devicesList: [], //柜子列表
      sosList: [], //求助列表
      nowTime: "", //
      nowDay: "", //
      nowWeek: "",
      mainBg: {
        backgroundImage: "url(" + require("@/assets/img/pic_bg.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      },
      titleBg: {
        backgroundImage: "url(" + require("@/assets/img/top_bg.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      },
    };
  },
  created() {
    this.init();
  },

  mounted() {
    this.timeId = setInterval(() => {
      this.nowDay = this.$tools.dataYMD(new Date());
      this.nowTime = this.$tools.dataHM(new Date());
      this.nowWeek = this.$tools.getWeekDate();
    }, 1000);
  },
  methods: {
    goOtherLink() {
      window.location.href = window.location.origin + "/admin";
    },

    init() {
      getChestList({
        company_id: this.$route.query.id ? this.$route.query.id : 3, //
        //radius: 1, //查询范围 km
        // lat: 1, //经度 radius 存在时必填
        // lng: 1, //纬度 radius 存在时必填
        status: 1, //柜子状态 状态 0 已经安装完毕 | 1 已使用 | 2 正常使用 | 3 异常
      }).then((response) => {
        const data = response.data;
        console.log(data);
        if (data.status_code === 200) {
          this.devicesList = data.data;
        } else {
          this.$message({
            message: data.message,
            type: "warning",
          });
        }
      });
      getFirstAidList({
        company_id: this.$route.query.id ? this.$route.query.id : 3, //公司id
        created_at: "2020-11-04 11:07:32", //查询起始时间
        // after_id: 1, //查询大于id的列表
      }).then((response) => {
        const data = response.data;
        if (data.status_code === 200) {
          this.sosList = data.data;
        } else {
          this.$message({
            message: data.message,
            type: "warning",
          });
        }
      });
    },
  },
  beforeDestroy: function () {
    //实例销毁前青出于定时器
    if (this.timeId) {
      clearInterval(this.timeId);
    }
  },
};
</script>
<style scoped lang="scss">
.home {
  background-size: cover;
  height: 100%;
  width: 100%;
  min-width: 1200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.main-wrap {
  flex: 1;
  overflow: hidden;
}

.tilte-wrap {
  height: 50px;
  width: 100%;
  background-size: 100% 100%;
  background-position-y: 0;
  line-height: 50px;
  flex: 0 0 50px;
}

.time {
  color: rgba(0, 165, 255, 1);
  display: flex;
  flex: 1;
  justify-content: center;
}

.t {
  font-size: 20px;
  line-height: 50px;
}

.title-name {
  cursor: pointer;
  flex: 2;
  font-size: 22px;
  font-weight: bold;
  letter-spacing: 5px;
  background-image: -webkit-linear-gradient(
    top,
    rgba(98, 200, 255, 1),
    #1a4ebe
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  min-width: 690px;
  max-width: 1000px;
  /* padding: 0 20px; */
  text-align: center;
}

.right-wrap {
  flex: 1;
}

.between-wrap {
  width: 21%;
  margin: 10px;
}

.middle-wrap {
  width: 57%;
  margin: 10px;
}
.bg-style {
  background: transparent
    url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAESCAYAAACPaJcSAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAX9JREFUeJzt1LFRAzEURVGZUWpCN0EPRK6K2twGTTh1DnSwBDdYaeacCu68r93L++fX71jYfN3uH2dHHJljjJ+zI45sEbj2GxwWbCxYWbDaItCJCwtWAqstAn0kxfKBb2cH/Gf5BQVWAiuBlf9gZcFq+UAnrixYLb/g8oFOXAms5vX58AYLgZXASmAlsBJYCawEVgIrgZXASmAlsBJYCawEVgIrgZXASmAlsBJYCawEVgIrgZXASmAlsBJYCawEVgIrgZXASmAlsBJYCawEVgIrgZXASmAlsBJYCawEVgIrgZXASmAlsBJYCawEVgIrgZXASmAlsBJYCawEVgIrgZXASmAlsBJYCawEVgIrgZXASmAlsBJYCawEVgIrgZXASmAlsBJYCawEVgIrgZXASmA1X7f75eyII8svKLCaYwxvsFg+0IkrC1bLL7h8oBNXFqwEVgIrgZX/YLVF4NJn3mJBgcUWgT6SwoLVFoFOXFiwsmC1xYJrB16fj++zI478ATZwLXU4diEaAAAAAElFTkSuQmCC)
    no-repeat center;
  background-size: calc(100% - 100px) 100%;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}
.bg-style::before {
  display: block;
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 50px;
  height: 100%;
  background: url(data:image/png;base64,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)
    no-repeat;
  background-size: 100% 100%;
}
.bg-style::after {
  display: block;
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 100%;
  background: url(data:image/png;base64,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)
    no-repeat;
  background-size: 100% 100%;
}
</style>
