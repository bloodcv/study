/**
 * 结构型
 * 功能：优化结构的实现方式
 */

/**
 * 适配器模式 - adapter
 * 适配独立模块，保证模块间的独立解耦并且连接兼容
 */

// 需求：买了一个 港行PS 插座是国标

class HKDevice {
  getPlug() {
    return '港行双圆柱插头'
  }
}

class Target {
  constructor() {
    this.plug = new HKDevice()
  }
  getPlug() {
    return this.plug.getPlug() + ' + 港行双圆柱转换器'
  }
}

const target = new Target()
target.getPlug()

/**
 * 装饰器模式
 * 动态将责任附加到对象上
 * 例如：设备升级
 */
class Device {
  create() {
    console.log('PS4')
  }
}

class Phone {
  create() {
    console.log('phone')
  }
}

class Decorator {
  constructor(device) {
    this.device = device
  }
  create() {
    this.device.create()
    this.update(device)
  }
  update(device) {
    console.log(device + 'pro')
  }
}

// 普通创建
const device = new Device()
device.create()

// 通过装饰器增加功能
const newDevice = new Decorator(device)
newDevice.create()

/**
 * 代理模式
 * 使用代理人来替代原始对象
 */

// 游戏防沉迷

class Game {
  play() {
    return 'playing'
  }
}

class Player {
  constructor(age) {
    this.age = age
  }
}

class GameProxy {
  constructor(player) {
    this.player = player
  }
  play() {
    return this.player.age < 16 ? 'too young to play' : new Game().play()
  }
}

const player = new Player(12)
const game = new GameProxy(player)
game.play()

/**
 * 场景说明
 * 1. 中间转换参数，保持模块间独立 -- 适配器模式
 * 2. 附着于多个组件上，批量动态添加功能 -- 装饰器模式
 * 3. 将代理对象与目标对象分离，不直接调用目标对象 -- 代理模式
 * 
 * 实际应用
 * 1. 两个模块：筛选器和表格，需要做一个联动，但是筛选器的数据不能直接传入表格，需要做数据结构的转换 => 
 * 模块之间独立，需要做数据结构的转换 --> 适配器模式
 * 
 * 2. 目前有按钮、title、icon 三个组件，需要开发一个模块，让三个组件能同时具备相同的功能 => 
 * 套一层装甲，有统一的能力提升，并且可以动态添加功能进行拓展 --> 装饰器模式
 * 
 * 3. ul中有多个li，每个li上的点击事件 => 
 * 利用冒泡事件做委托，事件绑定在ul上 --> 代理模式
 */

