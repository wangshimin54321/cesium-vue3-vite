<template>
    <transition name="Dialog">
        <div class="trackPopUp" v-if="visible">
            <div ref="contentRef" class="trackPopUpContent">
                <div class="close" @mouseover="closeIcon = overIcon" @mouseleave="closeIcon = leaveIcon" @click="handleClose">
                    <img :src="closeIcon" alt="" />
                </div>
                <div class="dialog">
                    <slot></slot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="tsx" setup>
import { computed, ref,PropType } from 'vue';
import overIcon from '@/assets/img/popWindow/icon_guanbi_click.png';
import leaveIcon from '@/assets/img/popWindow/icon_guanbi.png';

const contentRef=ref();

const props = defineProps({
    left: {
        type: Number,
        default: 10
    },
    top: {
        type: Number,
        default: 10
    },
    height: {
        type: Number
    },
    width: {
        type: Number
    },
    remove: {
        type: Function,
        default: () => { }
    },
    list:Object
});

const visible = ref(true);
const despData = ref(props.list);

const closeIcon = ref(leaveIcon);

function handleClose() {
    props?.remove?.();
    visible.value = false
};

function handleOpen() {
    visible.value = true
}

function handleUpdate(data) {
    despData.value = data
}

function setPosition(top:number,left:number){
    const css= `translate3d();`
}

const styleTop = computed(()=>props.top + 'px');
const styleLeft = computed(()=> props.left + 'px');
const styleWidth = computed(() => props.width ? props.width + 'px' : '');
const styleHeight = computed(() => props.height ? props.height + 'px' : '');
defineExpose({
    handleClose,
    handleOpen,
    handleUpdate,
    setPosition,
    visible
})
</script>

<style lang="scss" scoped>
.trackPopUp {
  width: 100%;
  height: 100%;
  color: #fff;
  user-select: none;
}

.trackPopUpContent {
  position: absolute;
  z-index: 9999;
  background: url("@/assets/img/popWindow/bg_tanchuang.png") no-repeat;
  background-size: cover;

  .close {
    position: absolute;
    right: 5px;
    top: 5px;
    cursor: pointer;
  }

  .title {
    background: url("@/assets/img/popWindow/title_qipao.png") no-repeat;
    display: flex;

    &>div {
      height: 20px;
      line-height: 20px;
      color: white;
      font-size: 18px;
      margin-left: 10px;
    }
  }

  top:v-bind(styleTop);
  left:v-bind(styleLeft);
  width:v-bind(styleWidth);
  height: v-bind(styleHeight);
}

.trackPopUpContent {
  .content {
    padding-top: 10px
  }

  .dialog {
    min-width: 200px;
    min-height: 50px;
    padding: 20px;
  }
}

:deep(.el-descriptions) {
  .el-descriptions__body {
    background-color: transparent;
  }

  .el-descriptions__label,
  .el-descriptions__content {
    color: #fff;
  }

  background-color: transparent;
}</style>
