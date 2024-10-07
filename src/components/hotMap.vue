<script setup>
import * as Cesium from "cesium";
// import { useStore } from "vuex";
import { onUnmounted, ref, onMounted } from "vue";
import { CesiumHeatmap } from "./common/js/cesiumHeatMap.js";
import heatMap from "../assets/heatMap.json"

// const store = useStore();
// const { viewer } = store.state;
// const viewer = ref();
let viewer =null;
let cesiumHeatMap = null;
const containerRef =ref();
const getData = async () => {
//   const { res } = await getGeojson("/json/heatMap.json");
  const { features } = heatMap;
//   console.log(res);
  let heatData = [];
  if (features?.length) {
    heatData = features.map((item) => {
      return {
        x: item.properties.lng - 0.05,
        y: item.properties.lat - 0.04,
        value: item.properties.num,
      };
    });
  }
  cesiumHeatMap = new CesiumHeatmap(viewer, {
    zoomToLayer: true,
    points: heatData,
    heatmapDataOptions: { max: 1, min: 0 },
    heatmapOptions: {
      maxOpacity: 1,
      minOpacity: 0,
    },
  });
};

const onClear = () => {
  cesiumHeatMap?.remove();
};
onMounted(() => {
  let viewerOption = {
        baseLayerPicker: false, // 地图切换控件(底图以及地形图)是否显示,默认显示true  （图中6）
        fullscreenButton: false, // 全屏按钮,默认显示true  （图中4）
        geocoder: false, // 地名查找,默认true  （图中9）
        homeButton: false, // 主页按钮，默认true  （图中8）
        infoBox: false, // 点击要素之后显示的信息,默认true
        selectionIndicator: false, // 选中元素显示,默认true
        CreditsDisplay: false, // 展示数据版权属性
        shouldAnimate: true,
        sceneModePicker: false, // 二三维切换按钮
        navigationHelpButton: false, // 问号图标，导航帮助按钮，显示默认的地图控制帮助
        contextOptions: {
            webgl: {
                preserveDrawingBuffer: true, // cesium状态下允许canvas转图片convertToImage
            },
        },
    };
    //初始化地球
    viewer= new Cesium.Viewer(containerRef.value,{
        ...viewerOption,
        terrainProvider: Cesium.createWorldTerrain(),
        //高德影像地形地图
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
            url:"https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"
        })
    });
    // 高德影像标记地图
    viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
        url:"http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8"
    }))
});
onUnmounted(() => {
  onClear();
});
</script>
<template>
  <operate-box>
    <el-button type="primary" @click="getData">开始</el-button>
    <el-button type="primary" @click="onClear">清除</el-button>
  </operate-box>
</template>

<style scoped lang='less'>
</style>

