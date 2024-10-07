import {Entries} from "type-fest";
import {Viewer} from "cesium"
import {App} from "vue"

export type PopViewer = Viewer & {movePositionEventListener:((()=>void) |null)};
export  type PopApp =App & {handleClose:(()=>void)}
export type Point={
    x:number,
    y:number,
    height?:number
}
export const entriesOf = <T>(arr: T) => Object.entries(arr as Array<T>) as Entries<T>

export type WGS84_POSITION= {
    lon: number;
    lat: number;
    height?: number
}
