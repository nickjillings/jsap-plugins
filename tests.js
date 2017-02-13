/*
    Unit tests for JSAP Plugins library
*/

var fs = require("fs");
console.log("\n *START* \n");
var plugins = JSON.parse(fs.readFileSync("plugins.json"));

var i;
for (i = 0; i < plugins.plugins.length; i++) {
    jshint plugins[i];
}
