<template>
  <div @click="increment">
    compositionVue: {{ data.count }}
  </div>
  <p>data.obj.f: {{ data.obj.f }}</p>
  <p>f: {{ f }}</p>
  <p>j: {{ j }}</p>
</template>

<script>
import { reactive, toRefs } from 'vue'

export default {
  setup() {
    const data = reactive({ count: 0, obj: { f: 2 }, obj2: { j: 1 } })

    const increment = () => {
      data.count++
      data.obj.f++
      data.obj2.j++
    }

    const { obj: { f } } = data
    const { j } = toRefs(data.obj2)

    return {
      data, increment, f, j
    }
  }
}
</script>