## 高阶组件(HOC, High Order Component)
`定义: 把组件作为参数，返回（高阶）组件的函数，称为高阶组件`

### 优
- 代码复用，状态/逻辑抽象
- 可以对 state/event/props 劫持/操作
- 向被修饰组件注入额外的状态和方法，返回的值是个组件（react中返回类组件或者函数组件均可）
- 自定义注入内容可以实现组件的增强
- 高阶组件可以嵌套使用

### 缺
- HOC 支持层级嵌套，过多的时候会影响渲染的性能
- HOC 中 对 ref displayName 的问题容易被忽略，虽然不建议用 ref ， 但是在一些时候不得不用，类似构建组件库的时候，在一些 DevTool 中也会增加一些不必要的 UI 组件嵌套
- 对于一些已经使用了 HOC 的组件 不便于拓展
- 对于一些逻辑相似的 HOC ，容易造成顺序混乱，功能覆盖的风险

### 注意点
- react props 中，key 和 ref 是两个特殊的 property，不会被转发到下层的组件，一旦高阶组件没有处理好 ref ，那么被装饰的组件就会失去与上层组件的联系
  - 使用 forwardRef 处理  见 Base/RefTest
  - 原因：函数式组件除了 props 外  还支持 ref 传参，通过 forwardRef 将 ref 当做 props 继续往后传， 再在 class 中转成 ref