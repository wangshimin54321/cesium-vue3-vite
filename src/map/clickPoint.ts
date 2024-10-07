import * as Cesium from "cesium"

let handler= null;

//创建ScreenSpaceEventHandler句柄，并添加左键单击事件
export function clickInit(viewer:Cesium.Viewer,callback:(...args:any[])=>void){
    handler= new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction((click:any)=>{
        //click.position 获取的是屏幕坐标
        // console.log('click',click)
        let cartesian = viewer.scene.pickPosition(click.position);
        let pickingEntity = viewer.scene.pick(click.position);   //获取三维坐标和点击的实体对象
        // console.log('entity===>',pickingEntity)
        let coord:any;
        //转经纬度坐标
        if (pickingEntity && pickingEntity.id && pickingEntity.id.position) {
            cartesian = pickingEntity.id.position._value;
            let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            let lontable = Number(
                Cesium.Math.toDegrees(cartographic.longitude).toFixed(7)
            );
            let lattable = Number(
                Cesium.Math.toDegrees(cartographic.latitude).toFixed(7)
            );
            let height = cartographic.height;
            coord = { lon: lontable, lat: lattable, height: height };
        } else {
            let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            let lontable =
                Cesium.Math.toDegrees(cartographic.longitude).toFixed(5) * 1;
            let lattable =
                Cesium.Math.toDegrees(cartographic.latitude).toFixed(5) * 1;
            let height = cartographic.height;
            coord = { lon: lontable, lat: lattable, height: height };
        }
        if (callback != undefined && typeof callback === "function") {
            callback(pickingEntity, coord);
        }
    },Cesium.ScreenSpaceEventType.LEFT_CLICK)
}
