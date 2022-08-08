#!/usr/bin/env node

const webpack = require('webpack');
const minimist = require('minimist');
const path = require('path');

const buildInWebpackConfig = require('../webpack.config')

const args = minimist(process.argv.slice(2));
console.log(args);
const cname = 'myc.config.js';

// 存储命令
const __commands = {};

// 插件中间件
const api = {
  registCommand: (name, impl) => {
    const command = __commands[name];
    if (!command) {
      __commands[name] = impl;
    }
  }
}

const runWebpackConfig = () => {
  webpack(buildInWebpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log('err', err)
      console.log('stats.hasErrors', stats.hasErrors)
      return false;
    }
    console.log('build success')
  })
}

const realLocalOption = () => new Promise((resolve, reject) => {
  console.log(process.cwd())
  const config = require(path.join(process.cwd(), cname)) || {};
  const { plugins: { commands = [] } = {} } = config;
  commands.forEach(command => {
    command(api);
  });
  resolve(__commands);
})

realLocalOption().then((commands) => {
  const command = args._[0];
  console.log('args_0', command);
  if (commands[command]) {
    commands[command]();
  } else {
    runWebpackConfig();
  }
})
