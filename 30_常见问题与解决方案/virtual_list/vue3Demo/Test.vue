<script lang="ts" setup>
import { VirtualList, Test } from './virtualList'
interface IVirtualItem {
  title: string
  id: number
}
const itemHeight: number = 50
/* const a = ref('aaa')
const b = new Test(a)
b.changeTest('bbb')
console.log(b.tt, b.test, a.value, b) */
const virtualList = reactive<{
  container: HTMLElement
  listData: IVirtualItem[]
  itemHeight: number
  phantomHeight: number
  visibleHieght: number
  visibleCount: number
  scrollTop: number
  visibleMove: number
  startIndex: number
  endIndex: number
  showList: IVirtualItem[]
  handleScroll: () => void
  initVirtualList: (container: HTMLElement, itemHeight: number) => void
  toTop: () => void
  isInit: boolean
  loading: boolean
}>(new VirtualList())

const pageInit = () => {
  if (virtualList.isInit) return
  const container = document.getElementById('virtualList')
  if (container) {
    virtualList.initVirtualList(container, itemHeight)
    console.log(virtualList)
  } else {
    pageInit()
  }
}
onMounted(() => pageInit())
</script>

<template>
  <h1>Test</h1>
  <h1>scrollTop: {{ virtualList.scrollTop }}</h1>
  <h1>startIndex: {{ virtualList.startIndex }}</h1>
  <h1>endIndex: {{ virtualList.endIndex }}</h1>
  <h1>virtualList.listData.length: {{ virtualList.listData.length }}</h1>
  <div class="wrap">
    <div
      id="virtualList"
      class="virtual-list-wrap"
      @scroll="virtualList.handleScroll"
      v-loading="virtualList.loading"
    >
      <div
        class="virtual-list-phantom"
        id="phantom"
        :style="`height:${virtualList.phantomHeight}px`"
      ></div>
      <div class="content" :style="`transform: translateY(${virtualList.visibleMove}px);`">
        <!-- <div class="content"> -->
        <div
          class="item"
          :style="`height: ${itemHeight}px`"
          v-for="item in virtualList.showList || []"
          :key="item.id"
        >
          <div class="left-p">{{ item.id }}_</div>
          <div class="right-p">
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
    <div class="to-top" v-if="virtualList.endIndex > 50" @click="virtualList.toTop">↑</div>
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  position: relative;
  .to-top {
    cursor: pointer;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: antiquewhite;
    border: 1px solid #2b2a2a;
    position: absolute;
    right: 50px;
    bottom: 10px;
  }
}
.virtual-list-wrap {
  margin: 10px;
  height: 300px;
  overflow-y: auto;
  position: relative;
  border: 1px solid #eee;
  .content {
    width: 100%;
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    .item {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #eee;
      width: 100%;
    }
  }
}
</style>
