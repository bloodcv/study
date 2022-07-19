/**
 * 五大原则：
 *  接口隔离 ISP
 *  单一职责 SRP
 *  里氏替换原则 LSP
 *  依赖倒置 DIP
 *  开闭原则 OCP
 * 
 * 三大模式：
 *  创建型：
 *    工厂模式
 *    建造者模式
 *    单例模式
 *  结构型：
 *    装饰器
 *    适配器
 *    代理模式
 *  行为型：
 *    命令模式
 *    观察者模式
 *    职责链模式
 *    模板模式
 */

// 创建型

// 工厂模式
// 隐藏创建过程 暴露共同接口

class Shop1 {
  create(name) {
    this.name = new Game1(name);
  }
}

class Game1 {
  constructor(name) {
    this.name = name;
  }
  init() { console.log(`init game [${this.name}]`) }
  run() { console.log(`run game [${this.name}]`) }
}

// 建造者
// 拆分独立模块 建造者负责串联整个系统

class Product1 {
  constructor(name) {
    this.name = name;
  }
  init() {
    console.log(`init product [${this.name}]`)
    return `init product success`;
  }
}

class Skin1 {
  constructor(name) {
    this.name = name;
  }
  init() {
    console.log(`init skin [${this.name}]`)
    return `init skin success`;
  }
}

class ProductBuilder {
  constructor(param) {
    this.product = new Product1(param.product);
    this.skin = new Skin1(param.skin);
  }
  getPackage() {
    console.log(`${this.product.init()}\n${this.skin.init()}`)
  }
}

class Shop2 {
  create(param) {
    this.product = new ProductBuilder(param);
  }
}

/* let a = new Shop2();
a.create({product: '宝宝巴士', skin: 'pink' });
a.product.getPackage(); */

// 单例模式
// 全局只有一个实例
class GameBox {
  constructor() {
    this.status = 'off';
  }
  open() {
    if (this.status === 'off') {
      this.status = 'on';
      console.log(`开机操作成功 状态 ${this.status}`);
    } else {
      console.log(`游戏已开机 状态 ${this.status}`);
    }
  }
  close() {
    if (this.status === 'on') {
      this.status = 'off';
      console.log(`关机操作成功 状态 ${this.status}`);
    } else {
      console.log(`关机中 状态 ${this.status}`);
    }
  }
}

GameBox.instance = undefined;

// 每次获取实例都会执行内部逻辑
/* GameBox.getInstance = (function() {
  console.log('执行获取单例')
  if (!GameBox.instance) {
    GameBox.instance = new GameBox();
  }
  return GameBox.instance;
})()
const g1 = GameBox.getInstance;
g1.open();
g1.close();
const g2 = GameBox.getInstance;
g2.close();
g2.open();
g1.open(); */

// 内部逻辑只会执行一次
/* GameBox.getInstance = function() {
  console.log('执行获取单例');
  if (!GameBox.instance) {
    GameBox.instance = new GameBox();
  }
  return GameBox.instance;
}
const g1 = GameBox.getInstance();
g1.open();
g1.close();
const g2 = GameBox.getInstance();
g2.close();
g2.open();
g1.open(); */

// 结构型

// 适配器模式
// 模块间独立解耦，同过适配器实现调用

class Game2 {
  constructor(name, size, type) {
    this.name = name;
    this.size = size;
    this.type = type;
  }
  init() {
    console.log(`game2 init \n name: ${this.name} \n size: ${this.size} \n type: ${this.type}`);
  }
}

class AdapterGame2 {
  constructor(param) {
    const {name, size, type} = param;
    this[name] = new Game2(name, size, type);
  }
}

/* const adapterGame2 = new AdapterGame2({
  name: 'game2',
  size: 12345,
  type: 'music'
})
adapterGame2.game2.init(); */

// 装饰器模式
// 将动态责任附加到对象上 如 设备升级

class Device {
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }
}

class DecoratorWrap {
  constructor(device) {
    this.device = device;
  }
  update() {
    this.device.type = 'Pro'
    console.log('升级成功')
  }
}

/* const device = new Device('iphone11', 'normal');
console.log(device.type);

const newDevice = new DecoratorWrap(device);
newDevice.update();
console.log(newDevice.device.type); */

// 代理模式
// 使用代理人来替代原始对象

class Game3 {
  play() {
    console.log('playing')
  }
}

class Player {
  constructor(age) {
    this.age = age;
  }
}

class GameProxy {
  constructor(player) {
    this.player = player;
  }
  play() {
    if (this.player.age > 16) {
      new Game3().play()
    } else {
      console.log('age not enough')
    }
  }
}

/* const player1 = new Player(15);
const player2 = new Player(18);
const gameProxy1 = new GameProxy(player1);
const gameProxy2 = new GameProxy(player2);
gameProxy1.play()
gameProxy2.play() */

// 行为型

// 命令模式
// 请求以命令的形式包裹在对象中 传递给调用对象
// 一般分为 接收器(执行命令)  触发者(下发命令)  指令器(命令处理中心)
// 流程  触发者 -->  指令器 --> 接收器

// 接收器 
class Receiver {
  excute(command) {
    if (this[command]) {
      return this[command]();
    } else {
      return `${command} 行为有误`
    }
  }
  run() {
    return 'run 起来了'
  }
  eat() {
    return 'eat 起来了'
  }
}

// 指令器
class Command {
  constructor(receiver) {
    this.receiver = receiver;
  }
  excute(command) {
    return this.receiver.excute(command);
  }
}

// 触发者
class Operator {
  constructor(name, command) {
    this.name = name;
    this.command = command;
  }
  excute(command) {
    console.log(`${this.name} ${this.command.excute(command)}`);
  }
}

/* const receiver = new Receiver();
const command = new Command(receiver);
const operator = new Operator('小明', command);

operator.excute('run')
operator.excute('fly')
operator.excute('eat') */

// 模板模式
// 模板中定义好每个步骤的顺序  每个步骤方法只关注自己事

class TemplateMode {
  constructor(excutePipLine) {
    this.excutePipLine = excutePipLine || []
  }
  setExcutePipLine(newExcutePipLine) {
    this.excutePipLine = [...newExcutePipLine];
  }
  play() {
    if (this.excutePipLine.length === 0) {
      console.log('请输入执行顺序')
    } else {
      this.excutePipLine.forEach(c => {
        if (this[c]) {
          this[c]();
        } else {
          console.log('无此行为');
        }
      });
    }
  }
  open() {
    console.log('开机')
  }
  left() {
    console.log('向左移动一步')
  }
  right() {
    console.log('向右移动一步')
  }
  top() {
    console.log('向上移动一步')
  }
  bottom() {
    console.log('向下移动一步')
  }
  close() {
    console.log('关机')
  }
}

/* const templateMode = new TemplateMode();
templateMode.play()
templateMode.setExcutePipLine(['open', 'top', 'right', 'close'])
templateMode.play()
templateMode.setExcutePipLine(['open', 'top', 'kk', 'close'])
templateMode.play()
templateMode.setExcutePipLine(['open', 'left', 'bottom', 'close'])
templateMode.play() */

// 观察者模式
// 当一个属性改变时  观察者会连续引发相关状态的变更

class AICenter {
  constructor() {
    this.state = 'off';
    this.observers = [];
  }
  attach(observe) {
    this.observers.push(observe)
  }
  setState(newState) {
    this.state = newState;
    this.notifyObservers();
  }
  notifyObservers() {
    this.observers.forEach(ob => {
      ob.update(this.state);
    })
  }
}

class Device2 {
  constructor(name, center) {
    this.name = name;
    this.center = center;
    this.center.attach(this);
  }
  update(state) {
    console.log(`${this.name} 状态 ${state}`)
  }
}

/* const aiCenter = new AICenter();
const ps = new Device2('ps', aiCenter);
const door = new Device2('door', aiCenter);

aiCenter.setState('on');
aiCenter.setState('off'); */

// 职责链模式
// 链式调用 职责独立 顺序执行

class Action {
  constructor(name) {
    this.name = name;
    this.nextAction = null;
  }
  setNext(action) {
    this.nextAction = action;
  }
  handle() {
    console.log(`${this.name} 批准`);
    if (this.nextAction) {
      this.nextAction.handle();
    }
  }
}

const dad = new Action('dad');
const mom = new Action('mom');
const wife = new Action('wife');

dad.setNext(mom);
mom.setNext(wife);
wife.setNext();

dad.handle()
