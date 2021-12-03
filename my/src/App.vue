<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>|
      <router-link to="/list">List</router-link>
    </div> -->
    <transition :name="transitionName">
      <router-view/>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'

@Component({})
export default class App extends Vue {
  public transitionName = '';

  @Watch("$route")
  onRouteChange(to: Route, from: Route) {
    this.transitionName = to!.meta!.depth >= from!.meta!.depth ? 'slide-left' : 'slide-right'
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

body, html, * {
  padding: 0;
  margin: 0;
}
body, html {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
}

// name-enter 开始进入:(开始 进入阶段的第1帧)
// name-enter-active 进入过程中:(默认属性值 的过渡阶段)
// name-enter-active-to 进入结束:(移除enter动画)

// name-leave 开始离开:(开始 离开阶段的第1帧)
// name-leave-active 离开过程中:(默认属性值 的过渡阶段)
// name-leave-active-to 离开结束:(移除leave动画)

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  will-change: transfrom;
  transition: transform 350ms;
  position: absolute;
  overflow: hidden;
}

.slide-right-enter,
.slide-left-leave-active {
    transform: translate(-100%, 0);
}

.slide-left-enter,
.slide-right-leave-active {
    transform: translate(100%, 0);
}


</style>
