console.log('[vite] is connecting...');

const host = location.host;

// 客户端 -- 服务端  建立一个通信
const socket = new WebSocket(`ws://${host}`, 'vite-hmr');

// 监听通讯 拿数据 然后做处理
socket.addEventListener('message', async ({ data }) => {
  handleMessage(JSON.parse(data)).catch(console.error);
})

async function handleMessage(payload) {
  switch (payload.type) {
    case 'connected':
        console.log(`[vite] is connected`);

        // 心跳包 防止中断
        setInterval(() => socket.send('ping'), 30000);
      break;
    case 'update':
      payload.updates.forEach( async (update) => {
        if (update.type === 'js-update') {
          console.log('[vite] js update....');
          await import(`/target/${update.path}?t=${update.timestamp}`);

          // mock
          location.reload();
        }
      })
      break;
    default:
      break;
  }
}

const sheetsMap = new Map();

export function updateStyle(id, content) {
  let style = sheetsMap.get(id);
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = content;
    document.head.appendChild(style);
  } else {
    style.innerHTML = content;
  }

  sheetsMap.set(id, style);
}

export function rmStyle(id) {
  let style = sheetsMap.get(id);
  if (style) {
    document.head.removeChild(style);
  }
  sheetsMap.delete(id);
}