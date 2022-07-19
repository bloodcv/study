// DIP
// 目标：面向抽象进行coding，而不是对实现进行coding，降低需求与实现的耦合

// 需求
// sprint 1
// 分享功能
class Store {
  constructor() {
    this.share = new Share()
  }
}

class Share {
  shareTo() {
    // 分享到...
  }
}

const store = new Store()
store.share.shareTo('wx')

// sprint 2
// 评分功能
class Store {
  constructor() {
    this.share = new Share()
    this.rate = new Rate()
  }
}

class Share {
  shareTo() {
    // 分享到...
  }
}
class Rate {
  star() {
    // 评分
  }
}

const store = new Store()
store.share.shareTo('wx')
store.rate.star(5)

// 重构
// 目标：增加功能不会影响到底层的代码 新增的底层逻辑不会影响到顶层的实现
// 暴露挂载  ==> 动态挂载

class Store {
  static modules = new Map();
  constructor() {
    // 遍历名单做初始化挂载
    for (const module of Store.modules.values()) {
      module.init(this)
    }
  }

  // 注入功能模块
  static inject(module) {
    Store.modules.set(module.constructor.name, module)
  }
}

class Rate {
  init(store) {
    store.rate = this
  }
  star(s) {
    // 评分
  }
}

class Share {
  init(store) {
    store.share = this
  }
  shareTo(s) {
    // 分享至s
  }
}

const rate = new Rate();
const share = new Share();
//  依次注册完所有模块
Store.inject(rate);
Store.inject(share);

// 初始化
const store = new Store();
// 调用执行
store.rate.star(5)
store.share.shareTo('wx')
