import { faker } from 'https://cdn.skypack.dev/@faker-js/faker';

/* const randomName = faker.name.findName();
const randomEmail = faker.internet.email();

console.log(randomName, randomEmail) */

// 起始索引
let startIndex = null;
// 结束索引
let endIndex = null;
// 总的列表
let listData = [];
// 单项高度
let itemSize = null;
// 可视区域高度
let visibleHeight = null;
// 总高度
let listHeight = null;
// 滚动距离
let scrollTop = null;
// 可视容器偏移距离
let startOffset = null;
// 每页的条数
let pageSize = 10;

const getListData = () => {
  const n = listData.length;
  const newList = new Array(pageSize).fill({}).map((c, idx) => ({
    id: faker.random.numeric(5),
    title: `i am ${n + idx}`,
    content: faker.name.findName()
  }))
  listData.concat(newList);
}
getListData()