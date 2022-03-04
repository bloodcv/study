/**
 * 某停车场，分3层，每层100车位。每个车位都能监控到车辆的驶入和离开，
 * 车辆进入前，显示每层的空余车位数量。
 * 车辆进入时，摄像头可识别车牌号和时间，
 * 车辆出来时，出口显示器显示车牌号和停车时长。
 * 设计一套系统。
 */
/* 
 *  100 <-  ->
 *  ----
 *  100 <-  ->
 *  ----
 *  100 <-  ->
 *  ---
 *  显示每层空余车位数量
 *  <-  识别车牌号、时间
 *  ->  显示车牌号、停车时长
 */

/**
 * 停车场
 *  定义：层级集合
 *  注入层信息
 *  识别车牌号、时间 写入层
 *  显示车牌号、停车时长更新层信息
 *  
 *
 * 层级 
 *  定义：层号 层总车位数 层空余车位数
 *  初始化层信息
 *  获取层空余车位数+层号
 *  停车进这一层记录车辆信息
 * 
 */

function strSet(s) {
  return `0${s}`.slice(-2)
}

function diffStamp(tampIn, tampleave) {
  let timeDiff = tampleave - tampIn;  // 时间差的毫秒数
  let days = Math.floor(timeDiff / (24 * 3600 * 1000)); // 计算出天数
  let d = days > 0 ? `${strSet(days)}天` : ''
  let leavel1 = timeDiff % (24 * 3600 * 1000); // 计算天数后剩余的时间
  let hours = Math.floor(leavel1 / (3600 * 1000)); // 计算天数后剩余的小时数
  let h = hours > 0 ? `${strSet(hours)}小时` : ''
  let leavel2 = timeDiff % (3600 * 1000); // 计算剩余小时后剩余的毫秒数
  let minutes = Math.floor(leavel2 / (60 * 1000)); // 计算剩余的分钟数
  let m = minutes > 0 ? `${strSet(minutes)}分钟` : ''
  let leavel3 = timeDiff % (60 * 1000); // 计算剩余分钟后剩余的秒数
  let seconds = Math.floor(leavel3 / 1000); // 计算剩余的秒数
  let s = seconds > 0 ? `${strSet(seconds)}秒` : '00秒'
  return d + h + m + s
}

class Park {
  static levels = new Map();
  constructor() {
    this.carInfo = {
      carName: '',
      inStamp: ''
    };
    this.carStore = [];
    for (const level of Park.levels.values()) {
      level.init(this)
    }
  }

  static inject(level) {
    Park.levels.set(level.name, level)
  }

  showLeft() {
    const leftPosition = []
    for (const level of Park.levels.values()) {
      leftPosition.push(level.getLeft())
    }
    return leftPosition.join('\n')
  }
  beforeIn(carName) {
    this.carInfo = {
      carName,
      inStamp: new Date().getTime()
    }
    return `车牌号：${this.carInfo.carName}  进入时间：${new Date(this.carInfo.inStamp).toLocaleString('chinese', { hour12: false}) }`
  }
  carStop(level) {
    const res = Park.levels.get(level).add()
    if (res) {
      this.carStore.push({
        ...this.carInfo,
        level
      })
    }
  }
  carLeave(name) {
    const { level, inStamp, num, carName } = this.carStore.filter((c, idx) => {
      if (c.carName === name) {
        c.num = idx
        return true
      }
    })[0];
    // 车位空出来
    Park.levels.get(level).cut()
    // 去掉库存中的这辆车
    this.carStore.splice(num, 1)
    console.log('this.carStore', this.carStore)
    // 返回停车时间
    return `车牌号：${carName}  停车时长：${diffStamp(inStamp, new Date().getTime())}`
  }
}

class Level {
  constructor(name, num) {
    this.name = name
    this.num = num
    this.leftNum = num
  }
  init(park) {
    park[this.name] = this
  }
  getLeft() {
    return `层号 ${this.name} 剩余车位数 ${this.leftNum}`
  }
  add() {
    if (this.leftNum > 0) {
      this.leftNum--
      return true
    }
    console.log(`车库：${this.name} 车位已满`)
    return false
  }
  cut() {
    this.leftNum++
  }
}

const level1 = new Level('level1', 100);
const level2 = new Level('level2', 100);
const level3 = new Level('level3', 100);
Park.inject(level1)
Park.inject(level2)
Park.inject(level3)
const park = new Park();

function carTest(name, time, level) {
  // 模拟车辆进入
  // 车辆进入前 展示层空余车位数
  const leftNum = park.showLeft()
  console.log(leftNum)

  // 车辆进入时 展示车辆信息和进入时间
  const beforeInInfo = park.beforeIn(name);
  console.log(beforeInInfo)

  // 停车到某一层
  park.carStop(level)
  // 车子开出去
  setTimeout(() => {
    const leaveInfo = park.carLeave(name)
    console.log(leaveInfo)
  }, time);
}

carTest('A111', 17000, 'level1') // 100
setTimeout(() => {
  carTest('A222', 11000, 'level2') // 99 100 100
}, 1000);
setTimeout(() => {
  carTest('A333', 13000, 'level1') // 99 99 100
}, 3000);
setTimeout(() => {
  carTest('A444', 15000, 'level1') // 98 99 100
}, 5000);
setTimeout(() => {
  carTest('A555', 4000, 'level1') // 97 99 100
}, 5000);
