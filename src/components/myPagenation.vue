<template>
  <div class="pagenation">
    <div class="pagenation-operate">
      <button
        type="text"
        class="home-btn"
        v-if="isExtreme"
        :disabled="!isPrevBtnAble"
        :class="{ disabled: !isPrevBtnAble }"
        @click="first()"
      >
        首页
      </button>

      <div class="main clear">
        <button
          type="text"
          class="prev"
          @click="prev"
          :disabled="!isPrevBtnAble"
          :class="{ disabled: !isPrevBtnAble }"
        >
          <div class="ctrls pre"></div>
        </button>

        <span class="cure-page">{{ pageProperty.curePage }}</span>

        <span class="total-Page">/ {{ pageProperty.totalPage }}</span>
        <button
          type="text"
          class="next"
          @click="next"
          :disabled="!isNextBtnAble"
          :class="{ disabled: !isNextBtnAble }"
        >
          <div class="ctrls nextarr"></div>
        </button>
      </div>

      <button
        type="text"
        class="last-btn"
        v-if="isExtreme"
        :disabled="!isNextBtnAble"
        :class="{ disabled: !isNextBtnAble }"
        @click="last()"
      >
        尾页
      </button>
    </div>
  </div>
</template>  

<script>
export default {
  name: "my-pagenation",

  props: {
    //需要分页的数据(本地数据时调用)
    data: {
      type: Array,
      default: function () {
        return [];
      },
    },
    //每页显示条数(本地数据、远程请求时都可调用)
    showNum: {
      type: [Number, String],
      default: 5,
    },
    //远程请求数据的总条数(远程请求时调用)
    remoteTotals: {
      type: [Number, String],
      default: 1,
    },
    //分页器当前页码(远程请求时调用)
    curePage: {
      type: [Number, String],
      default: 1,
    },
    //首页、尾页按钮显示隐藏
    isExtreme: {
      type: Boolean,
      defualt: false,
    },
  },

  data() {
    return {
      pageProperty: {
        curePage: 1, //分页器当前页码
        totalPage: 1, //分页器总页数
        totalDatas: 1, //数据总条数
        pagenationShowNum: 1, //分页显示条数
        pageData: [],
      },
      isPrevBtnAble: false,
      isNextBtnAble: true,
      isRimote: false, //是否是请求数据
    };
  },

  watch: {
    data: {
      handler(val) {
        this.$emit("initData", val);
      },
      deep: true,
      immediate: false,
    },
    curePage: {
      handler(val) {
        this.pageProperty.curePage = parseInt(val);
      },
      deep: true,
      immediate: false,
    },
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      this.pageProperty.pagenationShowNum = parseInt(this.showNum);
      this.pageProperty.totalDatas = parseInt(this.remoteTotals);
      console.log(this.remoteTotals);
      console.log(11111111111111);
      console.log(this.pageProperty.totalDatas);
      if (this.data.length > 0) {
        this.isRimote = false;
        this.pageProperty.pageData = this.data;
        this.initData();
      } else {
        this.isRimote = true;
        this.pageProperty.curePage = parseInt(this.curePage);
      }
      this.totalPage();
      this.pageScope();
    },

    //初始显示的数据(本地同步数据时调用)
    initData() {
      let total = this.pageProperty.pageData;
      let curePage = this.pageProperty.curePage;
      let data = this.setPagenationData(total, curePage);
      this.$emit("initData", data);
    },

    //总分页数
    totalPage() {
      if (!this.isRimote) {
        let num = Math.ceil(
          this.pageProperty.pageData.length /
            this.pageProperty.pagenationShowNum
        );
        this.pageProperty.totalPage = num;
      } else {
        let num = Math.ceil(
          this.pageProperty.totalDatas / this.pageProperty.pagenationShowNum
        );
        this.pageProperty.totalPage = num;
      }
    },

    //对数据分页-默认5条一页
    setPagenationData(data, curPage) {
      let scopeNum = this.pageProperty.pagenationShowNum;
      let curPageData = [];
      curPageData = data.slice((curPage - 1) * scopeNum, curPage * scopeNum);
      return curPageData;
    },

    //户号分页器切换-上一页
    prev(e) {
      this.pageProperty.curePage--;
      this.pageScope();
      if (!this.isRimote) {
        let total = this.pageProperty.pageData;
        let curePage = this.pageProperty.curePage;
        let data = this.setPagenationData(total, curePage);
        this.$emit("initData", data);
      } else {
        this.backEvent("change");
      }
      if (e) {
        e.preventDefault();
      }
    },

    //户号分页器切换-下一页
    next(e) {
      this.pageProperty.curePage++;
      this.pageScope();
      if (!this.isRimote) {
        let total = this.pageProperty.pageData;
        let curePage = this.pageProperty.curePage;
        let data = this.setPagenationData(total, curePage);
        this.$emit("initData", data);
      } else {
        this.backEvent("change");
      }
      if (e) {
        e.preventDefault();
      }
    },

    //首页
    first(e) {
      if (!this.isRimote) {
        let total = this.pageProperty.pageData;
        let curePage = (this.pageProperty.curePage = 1);
        this.pageScope();
        let data = this.setPagenationData(total, curePage);
        this.$emit("initData", data);
      } else {
        this.pageProperty.curePage = 1;
        this.backEvent("change");
      }
      if (e) {
        e.preventDefault();
      }
    },

    //尾页
    last(e) {
      if (!this.isRimote) {
        let total = this.pageProperty.pageData;
        let curePage = (this.pageProperty.curePage =
          this.pageProperty.totalPage);
        this.pageScope();
        let data = this.setPagenationData(total, curePage);
        this.$emit("initData", data);
      } else {
        this.pageProperty.curePage = this.pageProperty.totalPage;
        this.backEvent("change");
      }
      if (e) {
        e.preventDefault();
      }
    },

    //页面范围
    pageScope() {
      let curePage = this.pageProperty.curePage,
        totalPage = this.pageProperty.totalPage;
      if (totalPage <= 1) {
        this.pageProperty.curePage = 1;
        this.isPrevBtnAble = false;
        this.isNextBtnAble = false;
        return;
      }
      if (curePage <= 1) {
        this.pageProperty.curePage = 1;
        this.isPrevBtnAble = false;
        this.isNextBtnAble = true;
      } else if (curePage >= totalPage) {
        this.pageProperty.curePage = totalPage;
        this.isPrevBtnAble = true;
        this.isNextBtnAble = false;
      } else {
        this.isPrevBtnAble = true;
        this.isNextBtnAble = true;
      }
    },

    //控制分页器-输入当前页码范围
    setCurePageScope(e, curePage) {
      if (!this.isRimote) {
        let total = this.pageProperty.pageData,
          totalPage = this.pageProperty.totalPage;
        let data = [];
        if (curePage <= 1) {
          let pages = (this.pageProperty.curePage = 1);
          data = this.setPagenationData(total, pages);
          this.$emit("initData", data);
          this.isPrevBtnAble = false;
          this.isNextBtnAble = true;
        } else if (curePage >= totalPage) {
          let pages = (this.pageProperty.curePage = totalPage);
          data = this.setPagenationData(total, pages);
          this.$emit("initData", data);
          this.isPrevBtnAble = true;
          this.isNextBtnAble = false;
        } else if (1 < curePage < totalPage) {
          let pages = (this.pageProperty.curePage = curePage);
          data = this.setPagenationData(total, pages);
          this.$emit("initData", data);
          this.isPrevBtnAble = true;
          this.isNextBtnAble = true;
        }
      } else {
        let totalPage = this.pageProperty.totalPage;
        if (totalPage <= 1) {
          this.pageProperty.curePage = 1;
          return;
        }
        this.backEvent("change");
      }
      this.pageScope();
    },

    //事件触发返回数据
    backEvent(name) {
      let curePage = this.pageProperty.curePage;
      let showNum = this.pageProperty.pagenationShowNum;
      this.pageScope();
      this.$emit(name, { curePage, showNum });
    },
  },
};
</script>

<style scoped>
.pagenation {
  width: 100%;
  height: auto;
  text-align: center;
}
.pagenation::after {
  content: "";
  display: block;
  width: 0;
  height: 0;
  clear: both;
}
.pagenation-operate {
  display: inline-block;
  width: auto;
  height: 32px;
  padding: 0 10px;
  box-sizing: border-box;
  line-height: 32px;
}
.pagenation-operate .main {
  width: 160px;
  height: auto;
  float: left;
  margin: 0 20px;
  box-sizing: border-box;
}
.pagenation-operate .prev,
.pagenation-operate .next {
  width: 32px;
  height: 32px;
  float: left;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 16px;
  line-height: 32px;
  text-align: center;
  cursor: pointer;
  outline: none;
  font-weight: bold;
}
.pagenation-operate .next {
  float: right;
}
.pagenation-operate .prev:hover,
.pagenation-operate .next:hover {
  background: #f38700;
}
.pagenation-operate .home-btn,
.pagenation-operate .last-btn {
  width: auto;
  height: auto;
  background: transparent;
  color: #f38700;
  font-size: 14px;
  line-height: 32px;
  border: none;
  cursor: pointer;
  outline: none;
  text-decoration: underline;
}
.pagenation-operate .home-btn {
  float: left;
}
.pagenation-operate .last-btn {
  float: left;
}
.pagenation-operate .home-btn:hover,
.pagenation-operate .last-btn:hover {
  color: #f38700;
}
.pagenation-operate .disabled,
.pagenation-operate .disabled:hover {
  background: transparent;
  cursor: not-allowed;
}
.pagenation-operate .home-btn.disabled,
.pagenation-operate .home-btn.disabled:hover,
.pagenation-operate .last-btn.disabled,
.pagenation-operate .last-btn.disabled:hover {
  background: transparent;
  color: #000;
}
.pagenation-operate .cure-page {
  display: block;
  min-width: 18px;
  height: 32px;
  float: left;
  margin: 0 12px 0 20px;
  line-height: 32px;
  font-size: 14px;
}
.pagenation-operate .cure-page > input {
  min-width: 20px;
  height: 18px;
  text-align: center;
}
.pagenation-operate .total-Page {
  display: block;
  height: 32px;
  float: left;
  color: #fff;
  font-size: 14px;
  line-height: 32px;
}
.ctrls {
  display: block;
  border-top: 2px solid #fff;
  border-right: 2px solid #fff;
  width: 8px;
  height: 8px;
  cursor: pointer;
}
.ctrls.nextarr {
  transform: rotate(45deg);
  margin-left: 3px;
}
.ctrls.pre {
  transform: rotate(225deg);
  margin-left: 5px;
}
</style>
