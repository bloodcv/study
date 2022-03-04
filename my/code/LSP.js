// 里氏替换原则-LSP
// 子类能够覆盖父类
// 父类能出现的地方子类就能出现

// sprint 1 实现一个游戏平台 能开机、关机、游戏
class Game {
  star() {
    // 开机
  }
  shutdown() {
    // 关机
  }
  play() {
    // 游戏
  }
}
const game = new Game()
game.play()

// sprint 2 实现一个移动版
class MobileGame extends Game {
  tombStone() {
    // 移动端热启
  }
  play() {
    // 移动端游戏
  }
}
const mobile = new MobileGame()
mobile.play()

// 重构

class Game {
  star() {
    // 开机
  }
  shutdown() {
    // 关机
  }
  // paly下放  子类不覆盖父类
}

class MobileGame extends Game {
  tombStone() {
    // 移动端热启
  }
  play() {
    // 移动端游戏
  }
}
const mobile = new MobileGame()
mobile.play()

class PCGame extends Game {
  speed() {
    // 加速
  }
  play() {
    // pc端游戏
  }
}
const pc = new PCGame()
pc.play()