import request from '@/api/api'
import to from 'await-to-js'

interface IVirtualItem {
  title: string
  id: number
}

const getVirtualData = (num: number) => {
  return to<APIResponse<IVirtualItem[]>>(
    request.post('/api/qqq/getVirtualData', {
      num,
    }),
  )
}

export class Test {
  public test: Ref<string>
  constructor(test: Ref<string>) {
    this.test = test
  }
  changeTest(val: string) {
    this.test.value = val
  }
  get tt() {
    return this.test.value
  }
}

export class VirtualList {
  public container: HTMLElement
  public listData: IVirtualItem[] = []
  public itemHeight: number = 0
  public phantomHeight: number = 0
  public visibleHieght: number = 0
  public visibleCount: number = 0
  public scrollTop: number = 0
  public visibleMove: number = 0
  public startIndex: number = 0
  public endIndex: number = 0
  public isInit: boolean = false
  public loading: boolean = false
  static times: number = 10
  constructor() {
    this.container = document.querySelector('html') as HTMLElement
  }

  initVirtualList(container: HTMLElement, itemHeight: number) {
    this.container = container
    this.itemHeight = itemHeight
    this.visibleHieght = container.clientHeight
    this.visibleCount = Math.ceil(this.visibleHieght / this.itemHeight) + 1
    this.endIndex = Math.min(this.startIndex + this.visibleCount, this.listData.length)
    this.isInit = true
    this.getListData()
  }

  get showList() {
    return this.listData.slice(this.startIndex, this.endIndex)
  }

  async getListData() {
    if (!VirtualList.times) return
    try {
      this.loading = true
      const [err, res] = await getVirtualData(this.listData.length)
      if (!err && res.rc === 0) {
        this.listData.push(...res.data)
        this.phantomHeight = this.listData.length * this.itemHeight
        this.endIndex = Math.min(this.startIndex + this.visibleCount, this.listData.length)
        VirtualList.times--
      }
    } finally {
      this.loading = false
    }
  }

  handleScroll() {
    if (this.loading) return
    this.scrollTop = this.container.scrollTop
    this.startIndex = Math.floor(this.scrollTop / this.itemHeight)
    this.endIndex = Math.min(this.startIndex + this.visibleCount, this.listData.length)
    this.visibleMove = Math.floor(this.scrollTop / this.itemHeight) * this.itemHeight
    if (this.endIndex === this.listData.length) {
      this.getListData()
    }
  }

  toTop() {
    this.container.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }
}
