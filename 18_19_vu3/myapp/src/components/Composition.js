import { h, reactive } from 'vue'

export default {
  setup() {
    const data = reactive({ count: 0 })

    const increment = () => data.count++

    return () => h('div',  {
      onClick: increment
    }, 'composition: ', data.count)
  }
}