const fs = require('fs')

const execa = require('execa') //子进程打包

const targets = fs.readdirSync('package').filter(ele => {
  return fs.statSync(`package/${ele}`).isDirectory()
})

console.log(targets)

function build (target) {
   execa('rollup',['-c','--environment',`TARGET:${target}`],{stdio:'inherit'})
}

function run (targets, iteratorFn) {
  const res = []
  for (const iterator of targets) {
    const p = iteratorFn(iterator)
    res.push(p)
  }
  return Promise.all(res)
}

run(targets,build)