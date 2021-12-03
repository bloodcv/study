<template>
  <SlotContainer class="page1">
    <template v-slot:topSec></template>
    <template v-slot:leftSec><span>3456789</span></template>
    <template v-slot:rightSec>
      <router-link to="/page1">Page1</router-link>
    </template>
    <template v-slot:bottomSec></template>
  </SlotContainer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SlotContainer from '../components/SlotContainer.vue';

@Component({
  components: {
    SlotContainer
  },
})
export default class Page2 extends Vue {
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
