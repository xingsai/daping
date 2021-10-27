<template>
  <div class="map">
    <div class="baidumap" id="allmap"></div>
  </div>
</template>

<script>
import locationIcon from "@/assets/img/mark.png";
import locationIcon1 from "@/assets/img/mark1.png";
import locationIcon2 from "@/assets/img/mark2.png";

import { getChestDetail } from "@/utils/api.js";

export default {
  name: "",
  components: {},
  props: {
    devicesList: {
      type: Array,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function() {
        return [];
      }
    }
  },
  watch: {
    devicesList: {
      handler: function(val, oldVal) {
        if (val && val.length > 0) {
          this.baiduMap();
        }
      },
      // 深度观察监听
      // deep: true,
      immediate: true // 初始化的时候执行一次
    }
  },
  data() {
    return {};
  },

  mounted() {
    this.$nextTick(() => {
      this.baiduMap();
    });
  },
  methods: {
    async setMark(id) {
      return await getChestDetail({ id });
    },
    baiduMap() {
      var map = new BMap.Map("allmap"); // 创建地图实例
      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      map.clearOverlays();
      var myIcon1 = new BMap.Icon(locationIcon1, new BMap.Size(52, 50), {
        imageSize: new BMap.Size(40, 44)
      });
      var myIcon2 = new BMap.Icon(locationIcon2, new BMap.Size(52, 50), {
        imageSize: new BMap.Size(40, 44)
      });

      this.devicesList.forEach((item, index) => {
        //自定义信息窗口内容

        // 创建小车图标

        var point = new BMap.Point(item.lng, item.lat); // 创建点坐标
        var marker = new BMap.Marker(point, {
          icon: item.status == 2 ? myIcon2 : myIcon1
        });
        map.addOverlay(marker);
        // //点击图标时候调用信息窗口

        marker.addEventListener("click", () => {
          this.setMark(item.id).then(res => {
            console.log(11111);
            console.log(res);
            let goods = res.data.data.goods;
            console.log(goods);
            let srt = "";
            // for (var i = 0; i < goods.length; i++) {
            //   srt =
            //     srt +
            //     '<p style="font-size:13px;margin: 5px 0;border:1px solid #999;padding:5px;box-sizing:border-box;">' +
            //     "名称：" +
            //     goods[i].name +
            //     " &nbsp;&nbsp;&nbsp;<br/>品牌：" +
            //     goods[i].brand +
            //     " &nbsp;&nbsp;&nbsp;<br/>过期时间：" +
            //     goods[i].expiration_at +
            //     "</p>";
            // }
            console.log(srt);
            let color = item.status == 2 ? "#999" : "#999";
            var sContent =
              '<div style="width:300px;color:' +
              color +
              '"><p style="font-size:13px;margin: 5px 0;">箱子编号：' +
              item.product +
              '</p><p style="font-size:13px;margin: 5px 0;">详细地址：' +
              item.address +
              '</p><p style="font-size:13px;margin: 5px 0;">所属区域：' +
              item.system.name +
              '</p><p style="font-size:13px;margin: 5px 0;">机箱状态：' +
              (item.patrol_cabinet_status && item.patrol_cabinet_status == 2
                ? "正常"
                : "异常 ") +
              '</p><p style="font-size:13px;margin: 5px 0;">AED状态：' +
              (item.patrol_aed_status && item.patrol_aed_status == 2
                ? "正常"
                : "异常 ") +
              '</p><p style="font-size:13px;margin: 5px 0;">电池状态：' +
              (item.patrol_firstAid_status && item.patrol_firstAid_status == 2
                ? "正常"
                : "异常 ") +
              '</p><p style="font-size:13px;margin: 5px 0;">电极片状态：' +
              (item.patrol_other_status && item.patrol_other_status == 2
                ? "正常"
                : "异常 ") +
              '</p><p style="font-size:13px;margin: 5px 0;">安装时间：' +
              item.created_at +
              '</p><p style="font-size:13px;margin: 5px 0;">最近巡检时间：' +
              item.updated_at +
              "</p>" +
              "</div>";
            var infoWindow = new BMap.InfoWindow(sContent);
            marker.openInfoWindow(infoWindow);
          });
        });
      });
      if (this.devicesList && this.devicesList.length > 0) {
        let arrlng = this.devicesList[0].lng;
        let arrlat = this.devicesList[0].lat;
        //将数据遍历
        map.centerAndZoom(new BMap.Point(arrlng, arrlat), 18); // 初始化地图，设置中心点坐标和地图级别
      } else {
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 18); // 初始化地图，设置中心点坐标和地图级别
      }
    }
  }
};
</script>
<style scoped>
.baidumap {
  width: 96%;
  height: 96%;

  margin: 2%;
}
/* 去除百度地图版权那行字 和 百度logo */
.baidumap /deep/ .BMap_cpyCtrl {
  display: none !important;
}
.baidumap /deep/ .anchorBL {
  display: none !important;
}
</style>
