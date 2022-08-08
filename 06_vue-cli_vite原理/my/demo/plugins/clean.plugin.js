module.exports = (options) => (api) => {
  api.registCommand('clean', () => {
    console.log('执行clean命令拉', options.msg);
  })
}