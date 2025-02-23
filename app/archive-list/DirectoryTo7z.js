
const path = require('path')
const fs = require('fs')
const ShellSpawn = require('./../lib/ShellSpawn')

let DirectoryTo7z = async (folderPath, recursive = true) => {

  // Read all files and directories in the given path
  const items = fs.readdirSync(folderPath);
  // Filter only `.xlsx` files
  const xlsxFiles = items.filter(item => {
      const itemPath = path.join(folderPath, item);
      return fs.statSync(itemPath).isFile() && path.extname(item).toLowerCase() === '.xlsx';
  });
  if (items.length === 1 && xlsxFiles.length === 1) {
      return false
  }

  let noFiles = false
  while (recursive) {
    let list = fs.readdirSync(folderPath)
    if (list.length > 1) {
      break
    }
    else if (list.length === 1) {
      let nextPath = path.join(folderPath, list[0])
      if (fs.statSync(nextPath).isDirectory()) {
        folderPath = nextPath
        continue
      }
      else {
        break
      }
    }
    else {
      noFiles = true
      break
    }
  }

  if (noFiles) {
    return false
  }

  // ==================
  let filename = path.basename(folderPath)
  let dirname = path.dirname(folderPath)

  let outputFilePath = path.resolve(dirname, filename + '.list.7z')

  let cmd = `cd "${folderPath}"; 7z a -t7z "${outputFilePath}" -mx9 -mmt=off -aoa -ms=on -m0=lzma2 *`
  await ShellSpawn(cmd)

  return outputFilePath
}

module.exports = DirectoryTo7z