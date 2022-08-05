process.env.NODE_ENV = "development"
const chalk = require("chalk")
const configFactory = require("../config/webpack.config")
const config = configFactory(process.env.NODE_ENV)
const webpack = require("webpack")
const compiler = webpack(config)
const WebpackDevServer = require("webpack-dev-server")
const serverConfig = require("../config/webpackDevServer.config")()
const devServer = new WebpackDevServer(compiler,serverConfig)
devServer.listen(3000,() => {
  console.log(chalk.cyan("Starting the development server"))
})