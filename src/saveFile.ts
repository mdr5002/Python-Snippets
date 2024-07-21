import * as fs from 'fs';
import * as path from 'path';

// Define the local OneDrive directory
const oneDriveDir = path.join('C:', 'Users', 'mrice', 'OneDrive - Kalas Manufacturing Inc', 'Apps');

// Function to save a file
function saveFile(filePath: string, content: string) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`File saved to ${filePath}`);
}

// Main function
function main() {
  const fileName = 'example.txt';
  const fileContent = 'This is a test file content.';
  const filePath = path.join(oneDriveDir, fileName);

  saveFile(filePath, fileContent);
}

main();
