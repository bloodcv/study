class VirtualList {
  constructor({pageSize, itemSize, visibleHeight}) {
    // 起始索引
    this.startIndex = 0;
    // 结束索引
    this.endIndex = 0;
    // 总的列表
    this.listData = [];
    // 可视区域列表
    this.visibleData = [];
    // 单项高度
    this.itemSize = itemSize;
    // 可视区域高度
    this.visibleHeight = visibleHeight;
    // 可视区域条数
    this.visibleCount = 0;
    // 总高度
    this.listHeight = 0;
    // 滚动距离
    this.scrollTop = 0;
    // 可视容器偏移距离
    this.startOffset = 0;
    // 每页的条数
    this.pageSize = pageSize;

    this.init();
  }
  init() {
    // 创建 占位容器
    // 创建 可视容器
  }
}