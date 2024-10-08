<script setup lang="tsx">
import {onMounted, ref} from "vue";
import * as Cesium from "cesium";
import {clickInit} from "../map/clickPoint"
import {createPopup} from "@/components/dialog";
import Content from "@/components/Content1.vue"
import geoJson from "../assets/beijingBoundary.json"
import heatMap from "../assets/heatMap.json"
// import { getGeojson } from "../../public/api/api.js"
import { CesiumHeatmap } from "../assets/cesiumHeatMap.js" 
import { HeatmapMaterialProperty } from 'cesium';

Cesium.Ion.defaultAccessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3Y2YzMzhjNy03MmViLTRlNjItOWMzMi1mYzg3MmZkMGE5ZjYiLCJpZCI6MTIwNzI1LCJpYXQiOjE2NzMyNDczMDF9.FVuv-GXxuLCZvztzncNHaHhKyqYLQKaS1GO7v1MvtGU"


let viewer:Cesium.Viewer|null =null;
const containerRef =ref();
const pipelineEntity = ref(null);
const pipePosition = ref(Cesium.Cartesian3.fromDegrees(116.55, 40.26));
function loadIcon(){
    const entity = (viewer as Cesium.Viewer).entities.add({
        name:"test",
        position: pipePosition.value,
        cylinder:{
            topRadius:500,
            bottomRadius:500,
            length:200,
            material:Cesium.Color.BLUE
        }
    })
}
const line = () => {
    // 创建管道实体
  const pipelinePosition = (viewer as Cesium.Viewer).scene.globe.pick(
    (viewer as Cesium.Viewer).camera.getPickRay(
      new Cesium.Cartesian2((viewer as Cesium.Viewer).canvas.clientWidth / 2, (viewer as Cesium.Viewer).canvas.clientHeight / 2)
    ),
    (viewer as Cesium.Viewer).scene.globe.ellipsoid
  );
 
  pipelineEntity.value = (viewer as Cesium.Viewer).entities.add({
    name: 'oil pipeline',
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        118.30594,  32.39439
        -115.0, 42.0,
        119.923116, 32.455778,
        116.20, 39.56,
        115.25, 39.26,
        116.55, 40.26
        // -115.0, 44.0,
        // 118.30594, 32.39439
      ]), // new Cesium.CallbackProperty(() => [[-115.0, 44.0],[118.30594, 32.39439]], false),
      width: 10.0,
      material: new Cesium.PolylineDashMaterialProperty({
        color: Cesium.Color.YELLOW,
      }),
    },
  });
 // 更新管道顶点位置
//   function updatePipeline() {
//     const positions = pipelineEntity.value.polyline.positions.getValue();
//     console.log('positions--->', positions)
//     for (let i = 0; i < positions.length; i += 3) {
//       positions[i + 1] += 0.1; // 假设上升速度为0.1
//       if (positions[i + 1] > 44.0) {
//         positions[i + 1] = 44.0;
//       }
//     }
//     pipelineEntity.value.polyline.positions = positions;
//   }
 
  // 定时更新管道顶点
//   setInterval(updatePipeline, 2000);
  // 定义管道的起点和终点位置
//   const startPoint = Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, 0.0);
//   const endPoint = Cesium.Cartesian3.fromDegrees(118.30594,  32.39439, 0.0);
 
  // 动态更新管道的位置
//   function getPipelinePositions() {
//     // console.log('1212121--->>>', (viewer as Cesium.Viewer).clock.currentTime)
//     let time = (viewer as Cesium.Viewer).clock.currentTime.secondsOfDay;// secondsOfDay; // new Date().getTime() 
//     const timeInSeconds = time / 1000;
 
//     // 流动线的动态效果可以通过移动顶点来实现
//     // 这里只是一个简单的示例，实际情况可能需要更复杂的动画逻辑
//     const offset = Math.sin(timeInSeconds * 0.001) * 1000;
//     const start = Cesium.Cartesian3.add(startPoint, new Cesium.Cartesian3(0.0, offset, 0.0), new Cesium.Cartesian3());
//     const end = Cesium.Cartesian3.add(endPoint, new Cesium.Cartesian3(0.0, offset, 0.0), new Cesium.Cartesian3());
//     console.log('start--->>>', start)
//     console.log('end--->>>', end)
//     return [start, end];
//   }
}
const createLine = (scene:any) => {
    // 后端返回的经纬度数据
    const positions = [ //115.25, 39.26
        { lon: 116.55, lat: 40.26 },
        { lon: 116.20, lat: 39.56 },
        { lon: 119.923116, lat: 32.255778 },
        { lon: 119.923116, lat: 32.355778 },
    { lon: 119.923116, lat: 32.455778 },
    { lon: 119.923126, lat: 32.555788 },
    { lon: 119.923116, lat: 31.39439 },
    ];
    const positions1 = [
        { lon: 116.05, lat: 40.26 },
        { lon: 116.20, lat: 39.56 },
        { lon: 119.823116, lat: 32.255778 },
        { lon: 119.923116, lat: 32.355778 },
    { lon: 119.723116, lat: 32.455778 },
    { lon: 119.623126, lat: 32.555788 },
    { lon: 119.923116, lat: 31.39439 },
    ];
    // 添加点-红色
    positions.forEach((position, index) => {
    (viewer as Cesium.Viewer).entities.add({
        position: Cesium.Cartesian3.fromDegrees(position.lon, position.lat),
        point: {
        pixelSize: 10,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 4,
        },
        label: {
        text: `点${index + 1}`,
        font: '14pt monospace',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 4,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -9),
        },
    });
    });
    // 添加点-蓝色
    positions1.forEach((position, index) => {
    (viewer as Cesium.Viewer).entities.add({
        position: Cesium.Cartesian3.fromDegrees(position.lon, position.lat),
        point: {
        pixelSize: 10,
        color: Cesium.Color.BLUE,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 4,
        },
        label: {
        text: `点${index + 1}`,
        font: '14pt monospace',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 4,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -9),
        },
    });
    });
    // 添加轨迹线
    var polyline = (viewer as Cesium.Viewer).entities.add({
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(positions.flatMap(pos => [pos.lon, pos.lat])),
            width: 3,
            material: Cesium.Color.RED,
        },
    });
    // 动态改变Polyline的位置
    // var property = new Cesium.SampledPositionProperty();
    // property.addSample(Cesium.JulianDate.now(), Cesium.Cartesian3.fromDegrees(-122.34911, 37.60382));
    // polyline.polyline.positions = property;
    
    // // 动态更新位置
    // (viewer as Cesium.Viewer).clock.onTick.addEventListener(function(clock) {
    //     property.addSample(clock.startTime, Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883));
    //     (viewer as Cesium.Viewer).entities.add(polyline);
    // });
    // 添加轨迹线
    (viewer as Cesium.Viewer).entities.add({
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(positions1.flatMap(pos => [pos.lon, pos.lat])),
            width: 3,
            material: Cesium.Color.BLUE,
        },
    });
    // createLine0((viewer as Cesium.Viewer).scene);
    // const taizhouBoundary = geoJson.features[0].geometry.coordinates[0][0];
    const maskpointArray = [];
        const arr = geoJson.features[0].geometry.coordinates[0][0];
    for (let i = 0, l = arr.length; i < l; i++) {
        maskpointArray.push(arr[i][0]);
        maskpointArray.push(arr[i][1]);
    }
    var maskspoint = Cesium.Cartesian3.fromDegreesArray(maskpointArray);
    console.log("---maskspoint", maskspoint);
    const area = new Cesium.Entity({
        polygon: {
        hierarchy: {
            // 定义多边形的环区域
            positions: Cesium.Cartesian3.fromDegreesArray([
            100, 0, 100, 89, 160, 89, 160, 0,
            ]),
            // 定义多边形的孔
            holes: [
            {
                positions: maskspoint,
            },
            ],
        },
        material: Cesium.Color.BLACK.withAlpha(0.5), //外部颜色
        },
    });
    const line = new Cesium.Entity({
        polyline: {
        positions: maskspoint,
        width: 4, //边界线宽
        material: Cesium.Color.fromCssColorString("#6dcdeb"), //边界线颜色
        clampToGround: true, // 贴地
        },
    });
    (viewer as Cesium.Viewer).entities.add(area);
    (viewer as Cesium.Viewer).entities.add(line);
    (viewer as Cesium.Viewer).flyTo(line, { duration: 3 });
    let long = 116.55; // 116.55, 40.26
    let lat = 40.26;
    let height = 50;
    
    (viewer as Cesium.Viewer).entities.add({
        name: "动态线",
        polyline: {
            positions: new Cesium.CallbackProperty(() => {
                // 每次更新下一个点的位置
                long += 0.005;
                lat += 0.005;
                height += 0.005;
                return Cesium.Cartesian3.fromDegreesArrayHeights([116.55,40.26,50,long,lat,height])
            }, false),
            width: 5,
            material: Cesium.Color.GRAY,
        },
    });
};
const drawLine = () => {
    const scene = (viewer as Cesium.Viewer).scene;
    // 创建一条直线
  const redLine = createLine(scene);
  // 添加水流效果
//   const updatePosition = () => {
//     const time = (viewer as Cesium.Viewer).clock.currentTime;
//     const green = (time.secondsOfDay * 2) % 1;
//     console.log('redLine.material---->>', redLine)
//     redLine.material.uniforms.color = new Cesium.Color(0.0, green, 0.0, 0.5);
 
//     const offset = time.secondsOfDay * 2;
//     const positions = redLine.positions.getValue();
//     for (let i = 0; i < positions.length; i += 3) {
//       positions[i + 2] = Cesium.Math.cos(offset + i / 30) * 20 + 100;
//     }
//     redLine.positions = new Cesium.SampledPositionProperty();
//     redLine.positions.addSample(time, positions);
//   };
 
  // 每一帧更新线的位置
//   scene.preRender.addEventListener(updatePosition);
 // 添加水流动画
//   scene.postRender.addEventListener(function () {
//     const time = (viewer as Cesium.Viewer).clock.currentTime.secondsOfDay;// secondsOfDay;
//     console.log('redLine---->>', redLine)
//     const pipeTransforms = redLine._actualEntity.computeModelMatrix(
//       time,
//       new Cesium.Matrix4()
//     );
 
//     // 根据实际情况调整水流方向和速度
//     const flowSpeed = 10.0; // 水流速度
//     const flowDirection = Cesium.Cartesian3.UNIT_Z; // 水流方向
 
//     pipeTransforms._matrix3.multiplyByVector(flowDirection, flowDirection);
//     Cesium.Cartesian3.multiplyByScalar(flowDirection, flowSpeed, flowDirection);
 
//     redLine.model.minimumHeight = -flowSpeed; // 管道底部与水面接触
//     redLine.model.maximumHeight = 0.0; // 管道顶部与水面接触
 
//     // 更新管道模型的变换矩阵
//     redLine.position = pipePosition.value;
//     redLine.orientation = Cesium.Transforms.headingPitchRollQuaternion(
//       pipeTransforms._transform,
//       new Cesium.HeadingPitchRoll(0.0, 0.0, Math.atan2(flowDirection.x, flowDirection.y))
//     );
//   });
}
onMounted(()=>{
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
    loadIcon();
    // line();
    drawLine();
    // renderHeat();
    clickInit(viewer as Cesium.Viewer,(entity,coord)=>{
        console.log(entity,coord)
        //
       if(entity.id){
           createPopup(
               viewer as Cesium.Viewer,
               coord,
               {top:0,left:135},
               {
                   default:()=>(<Content/>)
               }
           )
       }
    });
    (viewer as Cesium.Viewer).camera.flyTo({
        destination:Cesium.Cartesian3.fromDegrees(
            118.345332,
        32.18228,
        6721.35,
        ),
        orientation:{
            heading: Cesium.Math.toRadians(344.58),
            pitch: Cesium.Math.toRadians(-27.44),
            roll: 0,
        }
    })
})
// 绘制路线
const createLine0 = async(scene: any) => {
    if (!scene.clampToHeightSupported) {
        window.alert(
            "This browser does not support clampToHeightMostDetailed."
        );
    }

    scene.camera.setView({
        destination: new Cesium.Cartesian3(
            1216411.0748779264,
            -4736313.10747583,
            4081359.5125561724
        ),
        orientation: new Cesium.HeadingPitchRoll(
            4.239925103568368,
            -0.4911293834802475,
            6.279849292088564
        ),
        endTransform: Cesium.Matrix4.IDENTITY,
    });

    try {
        const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(40866);
        scene.primitives.add(tileset);
    } catch (error) {
        console.log(`Error loading tileset: ${error}`);
    }

    async function sampleHeights() {
        (viewer as Cesium.Viewer).entities.removeAll();

        const cartesian1 = new Cesium.Cartesian3(
            1216390.063324395,
            -4736314.814479433,
            4081341.9787972216
        );
        const cartesian2 = new Cesium.Cartesian3(
            1216329.5413318684,
            -4736272.029009798,
            4081407.9342479417
        );

        const count = 30;
        const cartesians = new Array(count);
        for (let i = 0; i < count; ++i) {
            const offset = i / (count - 1);
            cartesians[i] = Cesium.Cartesian3.lerp(
            cartesian1,
            cartesian2,
            offset,
            new Cesium.Cartesian3()
            );
        }

        const clampedCartesians = await scene.clampToHeightMostDetailed(
            cartesians
        );

        for (let i = 0; i < count; ++i) {
            (viewer as Cesium.Viewer).entities.add({
            position: clampedCartesians[i],
            ellipsoid: {
                radii: new Cesium.Cartesian3(0.2, 0.2, 0.2),
                material: Cesium.Color.RED,
            },
            });
        }

        (viewer as Cesium.Viewer).entities.add({
            polyline: {
            positions: clampedCartesians,
            arcType: Cesium.ArcType.NONE,
            width: 2,
            material: new Cesium.PolylineOutlineMaterialProperty({
                color: Cesium.Color.YELLOW,
            }),
            depthFailMaterial: new Cesium.PolylineOutlineMaterialProperty({
                color: Cesium.Color.YELLOW,
            }),
            },
        });
    }
};
let cesiumHeatMap = null;
const getData = async () => {
//   const { res } = await getGeojson("/json/heatMap.json");
  const { features } = heatMap;
  console.log('heatMap------------------',features);
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
  cesiumHeatMap = new CesiumHeatmap((viewer as Cesium.Viewer), {
    zoomToLayer: true,
    points: heatData,
    heatmapDataOptions: { max: 1, min: 0 },
    heatmapOptions: {
      maxOpacity: 1,
      minOpacity: 0,
    },
  });
};
const renderHeat = () => {
    // 定义热力图数据点   119.923116, 32.455778
// const heatmapData = [
//   { position: Cesium.Cartesian3.fromDegrees(-75.60417, 39.92893), intensity: 0.5 },
//   // ... 添加更多热力图数据点
// ];
// 创建热点图材料属性
// const heatmapMaterial = new CesiumHeatmap({
//   radius: new Cesium.CallbackProperty(() => 20000, false),
//   intensity: new Cesium.CallbackProperty(() => 0.5, false),
//   color: new Cesium.Color.fromBytes(255, 255, 255, 255), // new Cesium.Color(1.0, 0.0, 0.0, 0.7),
//   size: new Cesium.Cartesian2(200.0, 200.0),
//   intensity: 2,
// });
 
// 创建热力图实体
// const heatmapEntity = (viewer as Cesium.Viewer).entities.add({
//   position: Cesium.Cartesian3.fromDegrees(-75.60417, 39.92893),
//   point: {
//     pixelSize: 10,
//     material: heatmapMaterial,
//     outlineWidth: 0,
//     position: heatmapData,
//   },
// });
// // 将实体放置在热力图数据点的中心
// (viewer as Cesium.Viewer).zoomTo(heatmapEntity);



//     (viewer as Cesium.Viewer)._cesiumWidget._creditContainer.style.display = "none";
//     const bounds = {
//     west: 103,
//     east: 104,
//     south: 30,
//     north: 31,
//   };

//   const heatMap = cesiumHeatMap.create((viewer as Cesium.Viewer), bounds, {
//     minOpacity: 0.16,
//     maxOpacity: 0.85,
//     gradient: {
//       0.05: "rgb(0,0,255)",
//       0.25: "rgb(0 255 127)",
//       0.45: "rgb(0,255,0)",
//       0.65: "rgb(255 255 0)",
//       0.85: "rgb(255 165 0)",
//       "1.00": "rgb(255,0,0)",
//     },
//     radius: 150,
//     blur: 0.7,
//   });

//   const minValue = 0;
//   const maxValue = 100;
//   const data = [];
//   for (let i = 0; i < 100; i++) {
//     data.push({
//       x: 103 + Math.random(),
//       y: 30 + Math.random(),
//       value: Math.floor(Math.random() * 100), //[0,100]
//     });
//   }

//   heatMap.setWGS84Data(minValue, maxValue, data);

//   (viewer as Cesium.Viewer).camera.setView({
//     destination: Cesium.Rectangle.fromDegrees(
//       bounds.west,
//       bounds.south,
//       bounds.east,
//       bounds.north
//     ),
//   });
}
const init = () => {
    const viewer = new Cesium.Viewer("cesiumContainer", {
        infoBox: false,
        selectionIndicator: false,
        navigation: false,
        animation: false,
        shouldAnimate: false,
        timeline: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
    });
  viewer._cesiumWidget._creditContainer.style.display = "none";
  const bounds = {
    west: 103,
    east: 104,
    south: 30,
    north: 31,
  };

  const heatMap = CesiumHeatmap.create(viewer, bounds, {
    minOpacity: 0.16,
    maxOpacity: 0.85,
    gradient: {
      0.05: "rgb(0,0,255)",
      0.25: "rgb(0 255 127)",
      0.45: "rgb(0,255,0)",
      0.65: "rgb(255 255 0)",
      0.85: "rgb(255 165 0)",
      "1.00": "rgb(255,0,0)",
    },
    radius: 150,
    blur: 0.7,
  });

  const minValue = 0;
  const maxValue = 100;
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      x: 103 + Math.random(),
      y: 30 + Math.random(),
      value: Math.floor(Math.random() * 100), //[0,100]
    });
  }

  heatMap.setWGS84Data(minValue, maxValue, data);

  viewer.camera.setView({
    destination: Cesium.Rectangle.fromDegrees(
      bounds.west,
      bounds.south,
      bounds.east,
      bounds.north
    ),
  });
}
</script>

<template>
    <div class="cesium-container" ref="containerRef"></div>
     <div id="cesiumContainer" style="width: 100%; height: 100vh"></div>
</template>

<style scoped>
.container{
    height: 100%;
    width: 100%;
}
</style>
