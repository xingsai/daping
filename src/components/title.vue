<template>
  <div>
    <div class="title-wrap f-c-w">
      <div class="title-name" :style="titleBg">{{ nameval }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      titleBg: {
        backgroundImage: "url(" + require("@/assets/img/title_bg.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      },
    };
  },
  props: {
    nameval: String,
  },
  components: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="scss">
.title-wrap {
  .title-name {
    background-size: 100% 100%;
    width: 50%;
    height: 36px;
    cursor: default;
    line-height: 36px;
    padding: 0 10px;
    box-sizing: border-box;
    text-align: center;
    font-size: 14px;
    color: #fff;
  }
}
</style>
