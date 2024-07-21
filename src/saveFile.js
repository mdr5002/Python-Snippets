"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
// Define the local OneDrive directory
var oneDriveDir = path.join('C:', 'Users', 'mrice', 'OneDrive - Kalas Manufacturing Inc', 'Apps');
// Function to save a file
function saveFile(filePath, content) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("File saved to ".concat(filePath));
}
// Main function
function main() {
    var fileName = 'example.txt';
    var fileContent = 'This is a test file content.';
    var filePath = path.join(oneDriveDir, fileName);
    saveFile(filePath, fileContent);
}
main();
