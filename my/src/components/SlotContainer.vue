<template>
  <div class="slot_container">
    <div class="top_sec slot_sec">
      <slot name="topSec">这是slot头部</slot>
    </div>
    <div class="center_sec slot_sec">
      <div class="left_sec slot_sec">
        <slot name="leftSec"></slot>
      </div>
      <div class="right_sec slot_sec">
        <slot name="rightSec" :count="count"></slot>
      </div>
    </div>
    <div class="bottom_sec slot_sec">
        <slot name="bottomSec" :count="count">这是slot底部</slot>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class SlotContainer extends Vue {
  public count = 10000;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.slot_container {
  height: 100vh;
  width: 100%;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  color: #000;
  font-weight: bold;
}
.slot_sec {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.top_sec,
.bottom_sec {
  height: 100px;
}
.top_sec {
  background-color: cornsilk;
}
.center_sec {
  // height: 100%;
  flex: 1;
  background-color: rgb(237, 255, 220);
  .left_sec,
  .right_sec {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .left_sec {
    flex: 1;
    background-color: rgb(120, 98, 243);
  }
  .right_sec {
    flex: 2;
    background-color: rgb(131, 246, 137);
  }
}
.bottom_sec {
    background-color: rgb(238, 220, 255);
}
</style>
