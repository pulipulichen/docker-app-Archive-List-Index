const path = require('path')
const fs = require('fs')
const ShellSpawn = require('./../lib/ShellSpawn')

let RemoveList = function (directoryPath) {
  let folderName = path.basename(directoryPath)
  let listPath = path.join(directoryPath, folderName + '.list.xlsx')

  fs.unlinkSync(listPath)
}

module.exports = RemoveList;