
const path = require('path')
const fs = require('fs')
const ShellSpawn = require('./../lib/ShellSpawn')
const ShellExec = require('./../lib/ShellExec')

let ArchiveToDirectory = async (directoryPath, recursive = true) => {
  let folderName = path.basename(directoryPath)
  let archiveFilePath = path.join(directoryPath, folderName + '.list.7z')


  // =================================================================


  let filename = path.basename(archiveFilePath)
  let dirname = path.dirname(archiveFilePath)

  // =================================================================

  let ext
  filenameNoExt = filename
  if (filenameNoExt.indexOf('.') > -1) {
    ext = filename.slice(filename.lastIndexOf('.') + 1).toLowerCase()
    filenameNoExt = filenameNoExt.slice(0, filenameNoExt.lastIndexOf('.'))
  }

  let outputFolderPath
  let cmd

  let filenameNoExt2
  if (ext === '7z' || ext === 'zip' || ext === 'rar') {
    let dotPos = filenameNoExt.lastIndexOf('.')
    filenameNoExt2 = filenameNoExt
    if (filenameNoExt.length < 6 || dotPos > filenameNoExt.length - 5) {
      filenameNoExt2 = filenameNoExt.slice(0, dotPos)
    }
    filenameNoExt2 = filenameNoExt2 + '.tmp'
    outputFolderPath = path.resolve(path.dirname(dirname), filenameNoExt2)
    cmd = `7z x "${archiveFilePath}" -o"${outputFolderPath}" -aoa`
    isCompress = false
  }
  else {
    return false
  }

  // ==================
  
  await ShellSpawn(cmd)

  // ==================
  
  let targetFolder = outputFolderPath
  while (recursive) {
    if (targetFolder && fs.existsSync(targetFolder) && fs.lstatSync(targetFolder).isDirectory()) {
      let list = fs.readdirSync(targetFolder)
      if (list.length > 1) {
        break
      }
      else if (list.length === 1) {
        if (fs.lstatSync(path.resolve(targetFolder, list[0])).isDirectory()) {
          let folderPath = path.resolve(targetFolder, list[0])
          let subList = fs.readdirSync(folderPath)
          if (subList.length > 1) {
            break
          }

          await ShellExec(`cd "${folderPath}"; mv * ../; cd ../; rm -rf "${list[0]}"`)
        }
        else {
          await ShellExec(`cd "${targetFolder}"; cp -f * ../; cd ../; rm -rf "${path.basename(targetFolder)}"`)
        }
      }
      else {
        break
      }
    }
    else {
      break
    }
  } 

  console.log(outputFolderPath)
  return outputFolderPath
}

module.exports = ArchiveToDirectory