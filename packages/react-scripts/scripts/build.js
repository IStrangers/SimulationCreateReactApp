
const fs = require("fs-extra")
const chalk = require("chalk")
const configFactory = require("../config/webpack.config")
const paths = require("../config/paths")
const config = configFactory("production")
const webpack = require("webpack")

function copyPublicFolder() {
    fs.copySync(paths.appPublic,paths.appBuild,{
        filter: file => file != paths.appHtml
    })
}

function build() {
    const compiler = webpack(config)
    compiler.run((err,stats) => {
        console.log(err)
        console.log(chalk.green("Compiled successfully!"))
    })
}

fs.emptyDirSync(paths.appBuild)
copyPublicFolder()
build()
