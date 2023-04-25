/**
 * 创建文本节点
 * @param {字符串类型节点的文本} text
 * @returns 字符串类型的节点
 */
function createTextVDom(text) {
  return {
    type: "TEXT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

/**
 * 创建虚拟Dom
 * @param {节点类型} type
 * @param {节点属性} props
 * @param  {子节点集合} children
 * @returns
 */
function createElement(type, props, ...children) {
  debugger
  return {
    type,
    props: {
      ...props,
      // 对 children 类型进行判断处理  如果是字符串就处理成字符节点 如果是对象就正常返回
      children: children?.map((child) =>
        typeof child === "object" ? child : createTextVDom(child)
      ),
    },
  };
}

/**
 * 创建真实Dom
 * @param {虚拟Dom} vDom
 */
function createDom(vDom) {
  // 根据节点类型 创建对应的真实dom节点
  const dom =
    vDom.type === "TEXT"
      ? document.createTextNode("")
      : document.createElement(vDom.type);

  // 给生成的dom节点挂载当前虚拟节点的属性 过滤掉children属性
  if (vDom.props) {
    const isProperty = (key) => key !== "children";
    Object.keys(vDom.props)
      .filter(isProperty)
      .forEach((key) => {
        if (key.indexOf("on") === 0) {
          dom.addEventListener(
            key.substring(2).toLowerCase(),
            vDom.props[key],
            false
          );
        } else {
          dom[key] = vDom.props[key];
        }
      });
  }

  return dom;
}

/**
 * 更新dom
 * 1. 新的没 老的有，移除属性
 * 2. 新的有，新增/更新 属性
 * 3. 对事件属性做单独处理，有'on'打头的属性
 * 4. 需要过滤掉children属性
 * @param {当前需要更新的DOM} dom
 * @param {老的dom属性} prevProps
 * @param {新的dom属性} nextProps
 */
function updateDom(dom, prevProps, nextProps) {
  const eventName = (key) => key.substring(2).toLowerCase();
  const isEvent = (key) => key.startsWith("on");
  const isProperty = (key) => key !== "children";
  const isGone = (prev, next) => (key) => !(key in next);
  const isNew = (prev, next) => (key) => next[key] !== prev[key];

  // 移除 属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((key) => {
      // 事件属性处理
      if (isEvent(key)) {
        dom.removeEventListener(eventName(key), prevProps[key], false);
      } else {
        dom[key] = "";
      }
    });

  // 新增 属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((key) => {
      // 事件属性处理
      if (isEvent(key)) {
        dom.addEventListener(eventName(key), nextProps[key], false);
      } else {
        dom[key] = nextProps[key];
      }
    });
}

/**
 * 删除父节点下的某个节点
 * @param {当前要删除的节点} fiber
 * @param {父节点} parentDom
 */
function commitDeletion(fiber, parentDom) {
  if (fiber.dom) {
    // dom存在，是普通节点
    parentDom.removeChild(fiber.dom);
  } else {
    // dom不存在，是函数组件,向下递归查找真实DOM
    commitDeletion(fiber.child, parentDom);
  }
}

/**
 * 递归处理所有DOM
 * 增删改三种情况的处理，绑定事件的处理
 * @param {变化的fiber} fiber
 * @returns
 */
function commitRootImpl(fiber) {
  if (!fiber) {
    return;
  }

  // const parentDom = fiber.return.dom;
  // 对于函数式组件 存在节点没有dom 需要判断一下这种情况，向上查找真正的dom
  let parentFiber = fiber.return;
  while (!parentFiber.dom) {
    parentFiber = parentFiber.return;
  }
  const parentDom = parentFiber.dom;

  if (fiber.effectTag === "REPLACEMENT" && fiber.dom) {
    // 新增
    parentDom.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom) {
    // 更新
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    // 删除
    // parentDom.removeChild(fiber.dom);
    // 对于函数式组件 存在节点没有dom 需要判断一下这种情况，向下查找真正的dom
    commitDeletion(fiber, parentDom);
  }

  // 递归提交子节点，兄弟节点
  commitRootImpl(fiber.child);
  commitRootImpl(fiber.sibling);
}

/**
 * 统一提交 Dom 操作
 */
function commitRoot() {
  // 执行真正的节点删除
  deletions.forEach(commitRootImpl);
  // 递归提交变化
  commitRootImpl(workInProgressRoot.child);
  // 记录commit的fiber树,用于下次的diff比较
  currentRoot = workInProgressRoot;
  // 处理dom更新后置空fiber树，等待下次更新
  workInProgressRoot = null;
}

/**
 * 创建一个新的 fiber
 * @param {当前虚拟节点} fiber
 * @param {父节点fiber对象} workInProgressFiber
 * @returns
 */
function buildNewFiber(fiber, workInProgressFiber) {
  return {
    type: fiber.type,
    props: fiber.props,
    dom: null, // 构建 fiber 时没有dom, 等当前 fiber 进入 performUnitOfWork 的时候才创建dom
    return: workInProgressFiber,
    alternate: null, // 因为是新增的节点 所以没有老的状态
    effectTag: "REPLACEMENT", // 添加操作标记
  };
}

/**
 * 调和元素，添加操作标识，构建fiber节点关系(diff就在这里进行的, 这里直接用单节点对比，真正的diff会存在单节点多节点分别处理并根据key进行复用)
 * @param {当前需要调和的fiber} workInProgressFiber
 * @param {当前fiber的子元素集合} elements
 */
function reconcileChildren(workInProgressFiber, elements) {
  // 取上次记录的树
  let oldFiber =
    workInProgressFiber.alternate && workInProgressFiber.alternate.child;

  let index = 0;
  let prevSibling = null;
  if (elements && elements.length) {
    // 第一次没有oldFiber,全都是新增  REPLACEMENT
    if (!oldFiber) {
      elements.forEach((element, index) => {
        let newFiber = buildNewFiber(element, workInProgressFiber);

        if (index === 0) {
          workInProgressFiber.child = newFiber;
        } else {
          prevSibling.sibling = newFiber;
        }

        prevSibling = newFiber;
      });
    }

    // 后续更新
    // A: 节点类型一样，复用节点，更新props
    // B: 节点类型不一样 + 新的存在，用新节点覆盖老节点
    // C: 节点类型不一样 + 新的不存在 + 老的存在，删除老节点
    while (!!oldFiber || index < elements.length) {
      let element = elements[index];
      let newFiber = null;
      // 检测节点类型是不是一样的
      let sameType = element && oldFiber && element.type === oldFiber.type;

      if (sameType) {
        // A: 节点类型一样，复用节点，更新props
        newFiber = {
          type: oldFiber.type,
          props: element.props,
          return: workInProgressFiber,
          dom: oldFiber.dom,
          alternate: oldFiber,
          effectTag: "UPDATE",
        };
      } else if (!sameType && element) {
        // B: 节点类型不一样 + 新的存在，用新节点覆盖老节点
        newFiber = buildNewFiber(element, workInProgressFiber);
      } else if (!sameType && oldFiber) {
        // C: 节点类型不一样 + 新的不存在 + 老的存在，删除老节点
        // 删除节点，做一个记录，统一删除
        oldFiber.effectTag = "DELETION";
        deletions.push(oldFiber);
      }

      // 处理下一个元素的时候把oldFiber对应上
      if (oldFiber) {
        oldFiber = oldFiber.sibling;
      }

      if (index === 0) {
        workInProgressFiber.child = newFiber;
      } else {
        prevSibling.sibling = newFiber;
      }

      prevSibling = newFiber;
      index++;
    }
  }
}

// 下一个任务单元（fiber-vDom）
let nextUnitOfWork = null;
// fiber 树（因为是对象赋值，所以更新操作全都会同步到这棵树上）
let workInProgressRoot = null;
// 记录commit的fiber树,用于下次的diff比较
let currentRoot = null;
// 需要删除的节点集合
let deletions = [];
/**
 * react 挂载/更新 dom 时候的工作流
 * @param {通过调度获取到的剩余时间对象} deadline
 */
function workLoop(deadline) {
  // 当存在下一个执行单元 并且 浏览器存在空闲时间 的时候执行下一个任务单元
  // 这个循环会在任务执行完毕或者时间到了的时候结束
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  // workInProgressRoot 有，说明当前在做任务
  // nextUnitOfWork 没有，说明任务做完了
  // 判断： 当前的任务集合做完了 已经收集了所有的dom变动 此时一次性提交Dom更新
  if (!nextUnitOfWork && workInProgressRoot) {
    commitRoot();
  }

  // react 中采用的是 自己写的一套 schedule 调度器 这里使用 requestIdleCallback 替代 效果一样 但这个api兼容性不好
  // 如果还有下一个任务单元，但是时间到了，我们需要继续注册requestIdleCallback
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

// 当前函数式组件的fiber节点
let wipFiber = null;
// 当前函数式组件内部 useState 的状态计数
let hookIndex = 0;
/**
 * useState 实现
 * @param {初始值} init
 */
function useState(init) {
  // 取出上一次的hook
  const oldHook =
    wipFiber && wipFiber.alternate && wipFiber.alternate.hooks[hookIndex];

  // hook 数据结构
  const hook = {
    // state 是每个具体的值
    state: oldHook ? oldHook.state : init,
  };

  wipFiber.hooks.push(hook);
  hookIndex++;

  const setState = (value) => {
    hook.state = value;

    // 只要修改了 state  我们就需要重新处理这个节点
    workInProgressRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    };

    // 修改nextUnitOfWork指向workInProgressRoot，这样下次requestIdleCallback就会处理这个节点了
    nextUnitOfWork = workInProgressRoot;
    deletions = [];
  };

  return [hook.state, setState];
}

/**
 * 函数式组件处理
 * @param {当前任务分片fiber} fiber
 */
function updateFunctionComponent(fiber) {
  // 支持 useState ,初始化变量
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = []; // hooks 用来存储具体的state序列

  // 函数组件的type就是个函数，直接拿来执行可以获得DOM元素
  const children = [fiber.type(fiber.props)];

  reconcileChildren(fiber, children);
}

/**
 * 正常组件处理
 * @param {当前任务分片fiber} fiber
 */
function updateHostComponent(fiber) {
  // 为当前fiber 创建真实的dom
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 将vDom转换成fiber结构
  // 创建当前fiber子节点的fiber
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);
}

/**
 * 执行每个任务，返回下一个任务
 * 1. 创建真实的dom
 * 2. 创建当前fiber的子节点的fiber
 * 3. 返回下一个任务单元
 * @param {虚拟节点-vDom-每个切片任务} fiber
 */
function performUnitOfWork(fiber) {
  // 检测函数式组件
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // 返回下一任务单元
  // 1. dfs 先序遍历
  // 2. 先找子元素，有子元素就返回，没有子元素了就找兄弟元素，有兄弟元素就返回
  // 3. 兄弟元素也没有就回到父元素
  // 4. 找父元素的兄弟元素
  // 5. 一直找到根节点最后返回空，结束
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
}

/**
 * 创建初始化任务分片，创建 fiber 树(workInProgressRoot)
 * @param {要渲染的虚拟Dom} vDom
 * @param {当前要渲染的Dom的父级} container
 */
function render(vDom, container) {
  debugger
  workInProgressRoot = {
    dom: container,
    props: {
      children: [vDom],
    },
    alternate: currentRoot,
  };

  deletions = [];

  nextUnitOfWork = workInProgressRoot;
}

class Component {
  constructor(props) {
    this.props = props;
  }
}

function transfer(Component) {
  return function(props) {
    const component = new Component(props);
    let [state, setState] = useState(component.state);
    component.props = props;
    component.state = state;
    component.setState = setState;

    return component.render();
  }
}

export default {
  createElement,
  render,
  useState,
  Component,
  transfer
};
