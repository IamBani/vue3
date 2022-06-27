import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json'
import ts from '@rollup/plugin-typescript'


const packageDir = path.resolve(__dirname, 'package');

const dir = path.resolve(packageDir,process.env.TARGET)


const packageJson = require(path.resolve(dir, 'package.json'))
const buildOption = packageJson.buildOption
let name = path.basename(dir)

let outputConfig = {
  'esm-bundler': {
    file: path.resolve(dir, `dist/${name}.esm.js`),
    format: "esm",
  },
  cjs: {
    file: path.resolve(dir, `dist/${name}.cjs.js`),
    format: "cjs",
  },
  global: {
    file: path.resolve(dir, `dist/${name}.global.js`),
    format: "umd",
  },
};


export default buildOption.formats.map((format) => {
  let output = outputConfig[format];
  output.name = buildOption.name;
  output.sourcemap = true;
    return {
      input: path.resolve(dir, "src/index.ts"),
      output,
      plugins: [
        json(),
        ts({
          tsconfig: path.resolve(__dirname, "tsconfig.json"),
        }),
        resolve(),
      ],
    };
});