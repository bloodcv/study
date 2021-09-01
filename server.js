const express = require('express')
const path = require('path')
const app = express()
app.use(express.static(path.resolve(__dirname, 'dist'), { maxAge: 3600000 }))
app.use(require('webpack-dev-middleware')(compiler, {
  quiet: true,
  publicPath: config.output.publicPath,
}));

app.use(require('webpack-hot-middleware')(compiler, {
  log: () => {}
}));
app.listen(6061)