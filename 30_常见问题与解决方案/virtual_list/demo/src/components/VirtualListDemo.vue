<template>
  <div class="virtual_list">
    <div class="virtual_list_wrap" @scroll="scrollHandle" :style="`height: ${visibleHeight}vh`">
      <div class="virtual_list_phantom" :style="`height: ${listHeight}px`"></div>
      <div class="virtual_list_content" :style="`transform: translate3d(0, ${startOffset}px, 0)`">
        <div class="virtual_list_item" v-for="item in visibleData" :key="item.id" :data-content="item.idx" :style="`height: ${itemSize}px`">
          <div class="title" :style="`width: ${itemSize}px`">{{ item.title }}</div>
          <div class="content">{{ item.content }}</div>
        </div>
      </div>
    </div>
    <div v-if="startIndex > pageSize" class="scrollToTop" @click="scrollToTop">↑</div>
  </div>
</template>

<script>
import { faker as Faker } from '@faker-js/faker';
import { ref, reactive, watch, watchEffect } from 'vue';

export default {
  setup(props) {
    // 起始索引
    let startIndex = ref(0);
    // 结束索引
    let endIndex = ref(0);
    // 总的列表
    let listData = reactive([]);
    // 可视区域列表
    let visibleData = reactive([]);
    // 单项高度
    let itemSize = ref(100);
    // 可视区域高度
    let visibleHeight = ref(70);
    // 可视区域条数
    let visibleCount = ref(0);
    // 总高度
    let listHeight = ref(0);
    // 滚动距离
    let scrollTop = ref(0);
    // 可视容器偏移距离
    let startOffset = ref(0);
    // 每页的条数
    let pageSize = ref(7);

    // 防抖
    const debounce = (fn, time) => {
      let timeInterVal = null;
      return function () {
        clearInterval(timeInterVal);
        let args = arguments;
        setTimeout(() => {
          fn.apply(this, args);
        }, time);
      }
    }
    
    // 节流
    const throttle = (fn, time) => {
      let timeInterVal = null;
      return function () {
        if (!timeInterVal) {
          let args = arguments;
          timeInterVal = setTimeout(() => {
            fn.apply(this, args);
            timeInterVal = null;
          }, time);
        }
      }
    }

    // 获取数据
    const getListData = () => {
      const n = listData.length;
      const newList = new Array(pageSize.value).fill({}).map((c, idx) => ({
        id: Faker.random.numeric(5),
        idx: n + idx,
        title: Faker.random.alpha(),
        content: `i am ${n + idx}`
      }))
      listData.push(...newList);
      listHandle();
    }

    watchEffect(() => {
      visibleCount.value = Math.ceil((visibleHeight.value * document.documentElement.clientHeight / 100) / itemSize.value);
    })
    watchEffect(() => {
      endIndex.value = startIndex.value + visibleCount.value - 1;
    })

    const listHandle = () => {
      console.log('listData-change', listData)
      listHeight.value = listData.length * itemSize.value;
      visibleData.length = 0;
      console.log('newListData', [...listData])
      visibleData.push(...listData.slice(startIndex.value, endIndex.value + 1))
    }

    const scrollHandle = debounce((e) => {
      scrollTop.value = document.querySelector('.virtual_list_wrap').scrollTop;
    
      startIndex.value = Math.floor(scrollTop.value / itemSize.value);
      // endIndex.value = startIndex.value + visibleCount.value - 1;
      startOffset.value = scrollTop.value - scrollTop.value % itemSize.value;
      // console.log('scrollTop-watch', endIndex.value, listData.length)
      if (endIndex.value + 1 > listData.length) {
        getListData();
      } else {
        listHandle();
      }
    }, 100)

    const scrollToTop = () => {
      document.querySelector('.virtual_list_wrap').scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }

    /* watchEffect(() => {
      console.log('listData-change', listData)
      listHeight.value = listData.length * itemSize.value;
      visibleData = listData.slice(startIndex.value, endIndex.value + 1);
    }) */
    // scrollHandle();
    getListData();

    return {
      listData,
      visibleData,
      scrollTop,
      itemSize,
      visibleHeight,
      listHeight,
      startOffset,
      visibleCount,
      itemSize,
      startIndex,
      endIndex,
      pageSize,
      scrollHandle,
      scrollToTop,
    };
  },
}
</script>

<style>
  .virtual_list {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: antiquewhite;
  }
  .scrollToTop {
    position: absolute;;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    right: 20px;
    bottom: 100px;
    background-color: rgb(155, 239, 124);
    font-size: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .virtual_list_wrap {
    width: 50vw;
    position: relative;
    overflow: auto;
  }
  .virtual_list_phantom {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
  }
  .virtual_list_content {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
  }
  .virtual_list_item {
    margin: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border: 1px solid rgb(214, 213, 213);
    border-radius: 10px;
    overflow: hidden;
  }
  .title {
    font-weight: bold;
    font-size: 20px;
    line-height: 1;
    background-color: rgb(56, 234, 234);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .content {
    font-size: 22px;
    line-height: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    color: #000;
  }
</style>