/**
 * 元素创建型
 * 功能：创建元素
 * 目的：规范创建步骤
 */

/**
 * 工厂模式
 * 隐藏创建过程、暴露共同接口
 */

// 需求：在游戏商店里下载初始化游戏，并且可以运行游戏

class Shop {
  create(name) {
    return new Game(name)
  }
}

class Game {
  constructor(name) {
    this.name = name
  }
  init() {
    console.log('init')
  }
  run() {
    console.log('run')
  }
}


// 创建商店时 快速生产了游戏
const shop = new Shop() 
const pubg = new Game('pubg')

pubg.init()
pubg.run()

/**
 * 建造者模式
 * 拆分简单模块、独立执行 => 注重过程与搭配
 * 
 * 
 * 每个模块独立解耦，而建造者负责串联整个系统
 */
// 需求：优惠套餐单元   商品 + 皮肤 打折售卖

class Product {
  constructor(name) {
    this.name = name
  }
  init() {
    return 'product init'
  }
}

class Skin {
  constructor(name) {
    this.name = name
  }
  init() {
    return 'skin init'
  }
}

class Shop2 {
  constructor() {
    this.package = '';
  }
  create() {
    this.package = new PackageBuilder();
  }
  getGamePackage() {
    return this.package.getPackage()
  }
}

class PackageBuilder {
  constructor(name) {
    this.product = new Product(name)
    this.skin = new Skin(name)
  }
  getPackage() {
    return this.product.init() + this.skin()
  }
}

/**
 * 单例模式
 * 全局只有一个实例
 */

class PlayStation {
  constructor() {
    this.state = 'off'
  }
  play() {
    if (this.state === 'on') {
      console.log('已经是开机状态了')
      return;
    }
    this.state = 'on'
    console.log('开机成功')
  }
  shutdown() {
    if (this.state === 'off') {
      console.log('已经是关机状态了')
      return
    }
    this.state = 'off'
    console.log('关机成功')
  }
}

PlayStation.instance = undefined;
/* PlayStation.getInstance = function () {
  console.log(123) // 这种调用几次就执行几次
  if (!PlayStation.instance) {
    PlayStation.instance = new PlayStation()
  }
  return PlayStation.instance
} */
PlayStation.getInstance = (function () {
  console.log(123) // 验证只执行一次
  if (!PlayStation.instance) {
    PlayStation.instance = new PlayStation()
  }
  return PlayStation.instance
})()

const ps1 = PlayStation.getInstance
ps1.play()

const ps2 = PlayStation.getInstance
ps2.play()
ps2.shutdown()



/**
 * 场景说明
 * 1. 批量生产同类型应用满足频繁使用同一种类型需求 - 工厂模式
 * 2. 需要模块化拆分一个大模块，使模块间独立解耦分工 - 创建者模式
 * 3. 全局只需要一个实例，注重统一一体化 - 单例模式
 * 
 * 实际应用举例
 * 1. Button Producer：生产多个不同类型的按钮 => 生产多个本质相同，通过传参区分不同属性的元素 => 工厂模式
 * 2. 全局应用 router store => 只需要一个实例 => 单例模式
 * 3. 页头组件Header => 包含了 title、button、breadcrumb => 生产多种不同类型的元素，通过一个建造者串联所有元素 => 创建者模式
 */
