// 转换模块  全转成esm
import { transformSync } from 'esbuild';
import { extname, dirname, join } from 'path';
import { existsSync } from 'fs';

// js转esm
export function transformCode(opts) {
  return transformSync(opts.code, {
    loader: opts.loader || 'js',
    sourcemap: true,
    format: 'esm'
  })
}

// css转js
export function transformCss(opts) {
  return `
    import { updateStyle } from '/@vite/client';

    const id = "${opts.path}";
    const css = "${opts.code.replace(/\n/g, '')}"

    updateStyle(id, css)

    export default css;
  `.trim();
}

// jsx转js
export function transformJSX(opts) {
  const ext = extname(opts.path).slice(1); // 'jsx'
  const ret = transformCode({
    loader: ext,
    code: opts.code
  })

  let { code } = ret;
  /**
   * 分析代码字符串的 import
   * 区分本地引入的文件 和  nodemodule 依赖包里面引入的文件
   * 
   * import type {xxx} from 'xxx.ts'
   * import React from 'react'
   */
  code = code.replace(
    /\bimport(?!\s+type)(?:[\w*{}\n\r\t, ]+from\s*)?\s*("([^"]+)"|'([^']+)')/gm,
    (a, b, c) => {
      let from;
      if (c.charAt(0) === '.') { // 本地文件
        from = join(dirname(opts.path), c);
        const filePath = join(opts.appRoot, from);
        if (!existsSync(filePath)) {
          if (existsSync(`${filePath}.js`)) {
            from = `${from}.js`
          }
        }
        if (['svg'].includes(extname(from).slice(1))) {
          from = `${from}?import`
        }
      } else { // 从 node_modules 依赖包里面来的
        from = `/target/.cache/${c}/cjs/${c}.development.js`
      }
      return a.replace(b, `"${from}"`)
    }
  )
  return {
    ...ret,
    code
  }
}
