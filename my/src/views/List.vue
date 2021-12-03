<template>
  <div class="list">
    <h3>List Page</h3>
    <div class="list_wrap">
      <router-link class="item" to="/">home</router-link>
      <router-link class="item" v-for="item in list" :key="item" :to="item">{{ item }}</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class List extends Vue {
  get list():Array<string> {
    return new Array(100).fill('').map((item, idx) => `/detail/${idx}`)
  }
}
</script>

<style lang="scss" scoped>
  .list {
    background-color: rgb(255, 230, 220);
    width: 100%;
  }
  .list_wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    .item {
      font-size: 20px;
      margin-bottom: 20px;
    }
  }
</style>
