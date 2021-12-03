<template>
  <SlotContainer class="page1">
    <template v-slot:topSec>
      <h5>this is Page2</h5>
    </template>
    <template v-slot:leftSec><span>3456789</span></template>
    <template v-slot:rightSec>
      <router-link to="/page1">Page1</router-link>
    </template>
    <template v-slot:bottomSec></template>
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
export default class Page2 extends Mixins(ComMixins) {
  mounted() {
    console.log(`Page2 - mounted - ${ this.mixinsName }`)
  }

  beforeDestroy() {
    console.log(`Page2 - beforeDestroy - ${ this.enterTime }`)
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
