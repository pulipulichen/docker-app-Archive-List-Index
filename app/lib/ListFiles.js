const fs = require('fs');
const path = require('path');

const ListFiles = function (dirPath) {
  let fileList = [];

  try {
      const files = fs.readdirSync(dirPath);

      fileList = files.filter(file => {
          const fullPath = path.join(dirPath, file);
          return fs.statSync(fullPath).isFile();
      });

      // console.log(fileList); // Output the list of files
  } catch (err) {
      // console.error('Error reading directory:', err);
  }

  return fileList
}

module.exports = ListFiles


