const fs = require('fs');
const path = require('path');

const ListFiles = require('../lib/ListFiles')

const isIndexFile = function (file) {
  // console.log(file)
  return file.endsWith('.note.xlsx') || 
    file.endsWith('.note.docx') ||
    file.startsWith('cluster-windows')
}

const CopyIndexFiles = function (directoryPath, ENABLE_GDRIVE = false) {
    let fileList = ListFiles(path.join(directoryPath + ".bak"))

    for (let file of fileList) {
      if (isIndexFile(file)) {
        // console.log(noteFilePath, fs.existsSync(noteFilePath))
        let filePath = path.join(directoryPath + '.bak', file)
        if (fs.existsSync(filePath)) {
          if (ENABLE_GDRIVE) {
            fs.copyFileSync(filePath, path.join(gdriveArchiveDir, path.basename(filePath)))
          }
          fs.renameSync(filePath, path.join(directoryPath, path.basename(filePath)))
        }
      }
    }
}

module.exports = CopyIndexFiles