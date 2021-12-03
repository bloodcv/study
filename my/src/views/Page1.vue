<template>
  <SlotContainer class="page1">
    <template v-slot:topSec>
      <h5>this is Page1</h5>
    </template>
    <template v-slot:leftSec>
      <span>1234额</span>
    </template>
    <template v-slot:rightSec="slotProps">
      <div class="content_right">
        <router-link to="/page2">Page2</router-link>
        <router-link to="/">Home</router-link>
        <router-link to="/list">List</router-link>
      </div>
      <p>count: {{ slotProps.count }}</p>
    </template>
    <template v-slot:bottomSec="slotProps">
      <h5>这是page1尾</h5>
      <p>count: {{ slotProps.count }}</p>
    </template>
  </SlotContainer>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import SlotContainer from '../components/SlotContainer.vue';
import ComMixins from '../mixins';

@Component({
  components: {
    SlotContainer
  },
})
export default class Page1 extends Mixins(ComMixins) {
  mounted() {
    console.log(`Page1 - mounted - ${ this.mixinsName }`)
  }

  beforeDestroy() {
    console.log(`Page1 - beforeDestroy - ${ this.enterTime }`)
  }
}
</script>

<style scoped lang="scss">
/* .page1 {
  width: 100%;
  background-color: rgb(255, 220, 238);
} */
.content_right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
