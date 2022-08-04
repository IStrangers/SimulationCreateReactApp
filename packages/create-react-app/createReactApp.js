const { Command } = require("commander")
const chalk = require("chalk")
const path = require("path")
const fs = require("fs-extra")
const packageJSON = require("./package.json")
const { spawn } = require("cross-spawn")

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
  await run(packageInfo,root,originalDirectory)
}

async function run(packageInfo,root,originalDirectory) {
  const { name } = packageInfo
  const scriptName = "react-scripts"
  const templateName = "cra-template"
  const allDependencies = ["react","react-dom",scriptName,templateName]
  console.log("Installing packages This might take a couple of minutes")
  console.log(`
    Installing ${chalk.cyan("react")}, ${chalk.cyan("react-dom")}, 
    and ${chalk.cyan(scriptName)} with ${chalk.cyan(templateName)}...
  `)
  await install(root,allDependencies)
  await executeNodeScript(
    [root,name,true,originalDirectory,templateName],
    `
      var init = require("${scriptName}/scripts/init.js")
      init.apply(null,JSON.parse(process.argv[1]))
    `
  )
  console.log("Done")
  process.exit()
}

async function install(root,allDependencies) {
  return new Promise(resolve => {
    const command = "yarnpkg"
    const args = ["add","--exact",...allDependencies,"--cwd",root]
    const child = spawn(command,args,{stdio: "inherit"})
    child.on("close",resolve)
  })
}

async function executeNodeScript(data,scriptCode) {
  return new Promise(resolve => {
    const child = spawn(
      process.execPath,
      ["-e",scriptCode,"--",JSON.stringify(data)],
      {
        cwd: process.cwd(),
        stdio: "inherit"
      }
    )
    child.on("close",resolve)
  })
}

module.exports = {
  init
}