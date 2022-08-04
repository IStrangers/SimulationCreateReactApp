const { Command } = require("commander")
const chalk = require("chalk")
const path = require("path")
const fs = require("fs-extra")
const packageJSON = require("./package.json")

async function init() {
  let projectName;
  new Command(packageJSON.name)
  .version(packageJSON.version)
  .arguments("<project-directory>")
  .usage(`${chalk.green("<project-directory>")}`)
  .action(name => {
    projectName = name
  })
  .parse(process.argv)
  await createApp(projectName)
}

async function createApp(projectName) {
  const root = path.resolve(projectName)
  fs.ensureDirSync(projectName)
  console.log(`Creating a new React app in ${chalk.green(root)}`)
  const packageInfo = {
    name: projectName,
    version: "0.0.0",
    private: true,
    description: "> TODO: description",
    author: "",
    license: "ISC",
    main: "index.js",
    scripts: {
      serve : ""
    }
  }
  fs.writeFileSync(path.join(root,"package.json"),JSON.stringify(packageInfo,null,2))
  const originalDirectory = process.cwd()
  process.chdir(root)
}

module.exports = {
  init
}