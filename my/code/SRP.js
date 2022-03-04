// SRP - 通过解耦让每一个职责更加的独立
// 目标 - 一个功能模块只做一件事

class PUBGManager {
  openDialog() {
    // 弹框
    // 计算金额
    setPrice()
  }
}

const game = new PUBGManager();
game.openDialog(); // 弹框 -- 计算金额 两个模块耦合

// 重构

class PUBGManager {
  constructor(command) {
    this.command = command;
  }
  openDialog(price) {
    // 设置金额
    this.command.setPrice(price)
    // 弹框
  }
}

// 操作模块独立 解耦
class priceManager {
  setPrice(price) {
    // 配置金额
  }
}

const exe = new priceManager();
const game = new PUBGManager(exe);
game.openDialog(15)
