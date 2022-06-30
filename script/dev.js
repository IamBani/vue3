const fs = require("fs");

const execa = require("execa"); //子进程打包
 
const targets = fs.readdirSync("package").filter((ele) => {
  return fs.statSync(`package/${ele}`).isDirectory();
});



function build(target) {
  execa("rollup", ["-c","-w", "--environment", `TARGET:${target}`], {
    stdio: "inherit",
  });
}



build('reactive');
