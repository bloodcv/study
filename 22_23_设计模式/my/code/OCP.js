// 开闭原则（OCP：open close prinsiple）对拓展开放 对修改关闭
// 目标：在已有的场景下对于需要拓展的功能进行开放；拒绝直接的功能修改

// sprint 1: 青年节活动 吃鸡要高亮  LOL要弹出折扣

// render
if (game === 'PUBG') {
  // 高亮
} else {
  // --
}

// event
if (game === 'LOL') {
  // 弹出折扣
} else {
  // 付款
}

// sprint 2: 要对部分的游戏置灰 + 其付款界面要显示停止发售（MHW）

// render
if (game === 'PUBG') {
  // 高亮
} else if (game === 'MHW') {
  // 置灰
} else {
  // --
}

// event
if (game === 'LOL') {
  // 弹出折扣
} else if (game === 'MHW') {
  // break + 显示停止发售
} else {
  // 付款
}

// 以上每次修改都要动整个逻辑 开  但是没有  闭

// 重构1

// render
gameManager(game).setColor()

// event
gameManager(game).openDialog()

// game库
function gameManager(game) {
  return `${game}Maneger`;
}

// 导引
const LOLManeger = {
  setColor() {
    // 正常
  },

  openDialog() {
    // 弹出折扣
  }
}

const PUBGManager = {
  setColor() {
    // 高亮
  },

  openDialog() {
    // 付款
  }
}

// 重构2

// 默认逻辑
class game {
  constructor(name) {
    this.name = name;
  }

  setColor() {
    console.log('正常')
  }

  openDialog() {
    console.log('付款')
  }
}

class LOL extends game {
  // 覆盖
  openDialog() {
    console.log('折扣')
  }
}

class PUBG extends game {
  setColor() {
    console.log('高亮')
  }
}
