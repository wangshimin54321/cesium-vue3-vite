import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx"
import {viteExternalsPlugin} from "vite-plugin-externals"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),viteExternalsPlugin({
    cesium:'Cesium'
  }),vueJsx()],
  server:{
    hmr:true
  },
  resolve:{
    alias:{
      "@":path.resolve(__dirname,"src")
    },
    extensions:['.ts','.tsx','.vue','.json']
  },
})
