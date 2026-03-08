// lightningcss --minify --bundle --targets \">= 0.25%\" input.css -o output.css

import * as fs from "fs";
import * as path from "path";
import { bundle } from 'lightningcss';

let originCssPathInput = process.argv[2];
let targetCssPathInput = process.argv[3];

let cwd = process.cwd();

// odd way of handling this ../../../ for two dirs / and a file
let originCssPath = path.join(cwd, originCssPathInput);
let targetCssPath = path.join(cwd, targetCssPathInput);

console.log(originCssPath);
console.log(targetCssPath);


let { code, map } = bundle({
  filename: originCssPath,
//   minify: true
});


// console.log(import.meta.url);
let cssText = new TextDecoder().decode(code);
console.log(cssText);


try {
  fs.writeFileSync(targetCssPath, code);
  // file written successfully
} catch (err) {
  console.error(err);
}
