import {isObject,camelize} from "@vue/shared"
import {entriesOf, WGS84_POSITION,PopViewer,PopApp,Point} from "./type.ts"
import {createApp, CSSProperties} from "vue";
import ElementPlus from "element-plus"
//@ts-ignore
import Dialog from "./Dialog.vue";
import * as Cesium from "cesium"
import {Cartesian2,Viewer} from "cesium"

let popupApp:PopApp

/**
 * create Vue app with the Dialog.vue
 */
function createSlotDialog(viewer:Viewer,options:any,template:Record<string, any>){
    if(popupApp){
        popupApp.unmount();
    }
    if(!template){
        template={}
    }
    const app = createApp({
        render(){
            // @ts-ignore
            return <Dialog
            remove={removeFn}
            left={options.left}
            top={options.top}
            height={options.height}
            width={options.width}
            >{template}</Dialog>
        }
    }) as PopApp;
    // if you want to use UI library like Element-Plus, you must register it like you did in the entry file!
    /**
     * app.use(Element-Plus)
     * // in main.js
     * import "element-plus/dist/index.css"
     */
    app.use(ElementPlus)
    if(popupApp){
        popupApp.handleClose()
    }
    function removeFn(){
        app.unmount();
        clearListener(viewer as PopViewer)
    }
    (app as PopApp).handleClose=removeFn
    return app
}

/**
 * create popup dialog
 * @param  viewer Viewer instance
 * @param  position the position of popup
 * @param  options Dialog.vue props
 * @param  template Dialog.vue slots
 * @param {*} offset th offset of the position
 * @returns
 */
export function createPopup(viewer:Viewer,position:WGS84_POSITION,options:any,template:Record<string, any>,offset:WGS84_POSITION={
    lon:0,
    lat:0
}){
    const pos=
    {
        x:position.lon + (offset.lon ?? 0),
        y:position.lat + (offset.lat ?? 0),
        height:(position.height ?? 0) + (offset.height ?? 0),
    };
    const popDiv = document.createElement("div");
    const widgetEl =viewer.cesiumWidget.container;
    widgetEl.appendChild(popDiv);
    clearListener(viewer as PopViewer)
    popupApp=createSlotDialog(viewer,options,template);
    const unmount = popupApp.unmount;
    popupApp.unmount=()=>{
        unmount();
        //do something else
        if(widgetEl.contains(popDiv)){
            popDiv.remove();
        }
    }
    popupApp.mount(popDiv);
    setListener(viewer as PopViewer,pos,popDiv)
}




//from element-plus
function setStyle(element:HTMLElement,styleName:CSSProperties|keyof CSSProperties,value?:string|number){
    if(!element || !styleName) return;
    if(isObject(styleName)){
        entriesOf(styleName).forEach(([prop,value])=>{
            setStyle(element,prop,value)
        })
    } else{
        const key:any=camelize(styleName);
        element.style[key]=value as any
    }
}

/**
 * update the popup position in the Cesium Event Scene.preRender
 * @param viewer
 * @param popPoint
 * @param el
 */
function setListener(viewer:PopViewer,popPoint:Point,el:HTMLDivElement){
 const cart3 =Cesium.Cartesian3.fromDegrees(
     popPoint.x,
     popPoint.y,
     popPoint.height??0
 )

    let screenPoint = popPoint;
    viewer.movePositionEventListener=function() {
        //wgs64 coordinate to screen coordinate(Cartesian2)
        let screen =Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            viewer.scene,
            cart3
        );
        if(screenPoint){
            //todo:if the position change, set the popup position!
            if(screenPoint.x !== screen.x || screenPoint.y !== screen.y){
                setPopupPosition(screen,el);
            }
        }
    }
    viewer.scene.postRender.addEventListener(viewer.movePositionEventListener)
}

/**
 * remove the listener
 * @param viewer
 */
function clearListener(viewer:PopViewer){
    if(typeof viewer.movePositionEventListener === 'function'){
        viewer.scene.postRender.removeEventListener(
            viewer.movePositionEventListener
        );
    }
    viewer.movePositionEventListener=null
}

/**
 * update the position of popup
 * @param position
 * @param popDiv
 */
function setPopupPosition(position:Cartesian2,popDiv:HTMLDivElement){
    const el=(popDiv.getElementsByClassName("trackPopUpContent")?.[0] as HTMLDivElement) ?? null;
    if(el){
        //// you must think about the width(height) of the dom.
        const x = Math.floor(position.x) - (el).offsetWidth / 2;
        const y = Math.floor(position.y) - (el).offsetHeight;
        const css= `translate3d(${x}px,${y}px,0)`;
        setStyle(el as HTMLDivElement,"transform",css);
    }

}

