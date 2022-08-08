import chokidar from "chokidar";
import express from "express";
import { readFileSync } from "fs";
import { createServer } from "http";
import { extname, join, posix } from "path";
import WebSocket from "ws";
import { transformCode, transformCss, transformJSX } from "./transform";

const targetRootPath = join(__dirname, "../target");

//
function createWebSocketServer(server) {
  const wss = new WebSocket.Server({
    noServer: true,
  });

  server.on("upgrade", (req, socket, head) => {
    if (req.headers["sec-websocket-protocol"] === "vite-hmr") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    }
  });

  wss.on("connection", (socket) => {
    socket.send(JSON.stringify({ type: "connected" }));
  });

  wss.on("error", (e) => {
    if (e.code !== "EADDRINUSE") {
      console.error(
        chalk.red(`WebSocket server error:\n${e.stack || e.message}`)
      );
    }
  });

  return {
    send(payload) {
      const stringified = JSON.stringify(payload);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(stringified);
        }
      });
    },

    close() {
      wss.close();
    },
  };
}

// 监听文件变更
function watch() {
  return chokidar.watch(targetRootPath, {
    ignored: ["**/node_modules/**", "**/.cache/**"],
    ignoreInitial: true,
    ignorePermissionErrors: true,
    disableGlobbing: true,
  });
}

function getShortName(file, root) {
  return file.startsWith(root + "/") ? posix.relative(root, file) : file;
}

function handleHMRUpdate(opts) {
  const { file, ws } = opts;
  const shortFile = getShortName(file, targetRootPath);
  const timestamp = Date.now();

  let updates;
  if (shortFile.endsWith(".css") || shortFile.endsWith(".jsx")) {
    updates = [
      {
        type: "js-update",
        timestamp,
        path: `/${shortFile}`,
        acceptedPath: `/${shortFile}`,
      },
    ];
  }

  ws.send({
    type: "update",
    updates,
  });
}

/**
 * 1. 起一个服务  express、koa、golang
 * 2. 拦截入口请求：localhost: post --> 返回他的html
 * 3. 加一些操作  例如： 热更新-hmr
 */
export async function dev() {
  // 起一个服务
  const app = express();

  // 拦截入口请求
  app.get("/", (req, res) => {
    res.set("Content-Type", "text/html");

    // 可改成配置化
    const htmlPath = join(__dirname, "../target", "index.html"); // html文件的绝对路径
    let html = readFileSync(htmlPath, "utf-8"); // 根据路径获取文件，获取到文件的字符串
    // 塞入客户端代码，包括热更新等等
    html = html
      .replace(
        "<head>",
        `<head>\n  <script type="module" src="/@vite/client"></script>`
      )
      .trim();

    // 返回html
    res.send(html);
  });

  // 客户端
  app.get("/@vite/client", (req, res) => {
    res.set("Content-Type", "application/javascript");
    res.send(
      // 这里返回的才是真正的客户端内置代码
      transformCode({
        code: readFileSync(join(__dirname, "client.js"), "utf-8"),
      }).code
    );
  });

  // 静态文件的处理, 返回给浏览器能认识的文件
  app.get("/target/*", (req, res) => {
    // console.log(`path >>>>> ${req.path}`);
    // 完整的文件路径
    const filePath = join(__dirname, "..", req.path.slice(1));

    // 静态资源给一个 flag
    if ("import" in req.query) {
      res.set("Content-Type", "application/javascript");
      res.send(`export default "${req.path}"`);
      return;
    }

    switch (extname(req.path)) {
      case ".svg":
        res.set("Content-Type", "image/svg+xml");
        res.send(readFileSync(filePath, "utf-8"));
        break;
      case ".css":
        res.set("Content-Type", "application/javascript");
        res.send(
          transformCss({
            path: req.path,
            code: readFileSync(filePath, "utf-8"),
          })
        );
        break;
      /* case '.jsx':
        res.set('Content-Type', 'application/javascript');
        res.send(
          transformJSX({
            appRoot: join(__dirname, '../target'),
            path: req.path,
            code: readFileSync(filePath, 'utf-8')
          }).code
        )
        break; */
      default:
        res.set("Content-Type", "application/javascript");
        res.send(
          transformJSX({
            appRoot: join(__dirname, "../target"),
            path: req.path,
            code: readFileSync(filePath, "utf-8"),
          }).code
        );
        break;
    }
  });

  const server = createServer(app);

  const ws = createWebSocketServer(server);

  watch().on("change", async (file) => {
    // 执行通知的方法
    handleHMRUpdate({
      file,
      ws,
    });
  });

  const post = 3002;
  server.listen(post, () => {
    console.log(`app is runing at 127.0.0.1:${post}`);
  });
}
