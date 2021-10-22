// noinspection JSCheckFunctionSignatures

const {exec} = require("child_process");
const chalk = require("chalk");
// const fs = require("fs");

function run(cmd) {
  return new Promise(r => {
    const o = exec(cmd,);
    o.stdout.on("data", (e) => {
      process.stdout.write(e.toString())
    });
    o.stderr.on("data", (e) => {
      process.stdout.write(e.toString())
    });

    o.on("exit", e => {
      console.log(chalk`{green EXIT ${e}}`);
      r();
    })
    o.on("error", (e) => {
      console.log(chalk`{red ERROR ${e}}`);
    })
  })

}

run("yarn generate").then(() => {
  run("yarn build").then(() => {
    console.log("done")
  })
})
