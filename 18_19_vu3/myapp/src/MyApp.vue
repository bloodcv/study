<template>
  <h1>myapp</h1>
  <AsyncCom />
  <Composition />
  <CompositionVue />
</template>

<script>
import Composition from './components/Composition.js'
import CompositionVue from './components/Composition.vue'

export default {
  name: 'MyApp',
  components: {
    Composition,
    CompositionVue
  }
}
</script>
