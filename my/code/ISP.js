// ISP
// 目标  多个专业的接口比单个胖接口好用

// 需求
// 已经可以开发游戏了，但是实现游戏中台 - 快速生产游戏
// PUBG、LOL run shot mega

class Game {
  constructor(name) {
    this.name = name
  }
  run() {
    // 跑
  }
  shot() {
    // 射
  }
  mega() {
    // 开大
  }
}

class PUBG extends Game {
  constructor() {
    // pubg 的 constructor
  }
}

class LOL extends Game {
  constructor() {
    // lol 的 constructor
  }
}

const pubg = new PUBG('pubg')
pubg.run()
pubg.shot()
pubg.mega()
// lol 同理

// 重构 - 用多个接口替代，每个接口服务于一个子模块
// 瘦身

class Game {
  constructor(name) {
    this.name = name
  }
  run() {
    // 跑
  }
}

class PUBG extends Game {
  constructor() {
    // pubg 的 constructor
  }
  shot() {
    // 射
  }
}

class LOL extends Game {
  constructor() {
    // lol 的 constructor
  }
  mega() {
    // 开大
  }
}

const pubg = new PUBG('pubg')
const lol = new LOl('lol')
pubg.run()
pubg.shot()
lol.run()
lol.mega()