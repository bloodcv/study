<template>
  <div class="detail">
    <h3>id: {{ id }}</h3>
    <router-link to="/list">list</router-link>
    <br />
    <router-link to="/">home</router-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class Detail extends Vue {
  get id() {
    return (this as any).$route.params.id
  }
}
</script>

<style lang="scss">
.detail {
  width: 100%;
  background-color: cornsilk;
}
</style>
