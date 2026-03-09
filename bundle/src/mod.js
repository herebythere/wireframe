"use strict";
// cli
// lightningcss --minify --bundle --targets \">= 0.25%\" input.css -o output.css
//
// dist/wireframe.css
Object.defineProperty(exports, "__esModule", { value: true });
console.log(process.argv);
var bundlePath = process.argv[0];
console.log(bundlePath);
// let { code, map } = bundle({
//   filename: 'style.css',
//   minify: true
// });
console.log(import.meta.url);
// try {
//   fs.writeFileSync('./wireframe.css', code);
//   // file written successfully
// } catch (err) {
//   console.error(err);
// }
// save code somewhere
// ../dist/wireframe.css
// ../dist/wireframe.min.css
//
// one big ass css file
