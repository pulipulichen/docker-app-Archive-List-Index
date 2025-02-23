const ShellSpawn = require('./lib/ShellSpawn')
const ShellExec = require('./lib/ShellExec')
const GetExistedArgv = require('./lib/GetExistedArgv')

const path = require('path')
const fs = require('fs')

// convert a.tif -thumbnail 64x64^ -gravity center -extent 64x64 b.ico

let main = async function () {
  await ShellSpawn(`locale`)
  let files = GetExistedArgv()
  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    
    let filename = path.basename(file)
    let dirname = path.dirname(file)
    
    let isCompress = true
    let filenameNoExt

    let cmd
    if (fs.lstatSync(file).isDirectory()) {
      let folderPath = file
      let noFiles = false
      while (true) {
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
        continue
      }

      cmd = `cd "${folderPath}"; 7z a -t7z "${path.resolve(dirname, filename + '.7z')}" -mx9 -aoa -ms=on -m0=lzma2 *`
    }
    else {
      let ext
      filenameNoExt = filename
      if (filenameNoExt.indexOf('.') > -1) {
        ext = filename.slice(filename.lastIndexOf('.') + 1).toLowerCase()
        filenameNoExt = filenameNoExt.slice(0, filenameNoExt.lastIndexOf('.'))
      }

      if (ext === '7z' || ext === 'zip' || ext === 'rar') {
        let dotPos = filenameNoExt.lastIndexOf('.')
        let filenameNoExt2 = filenameNoExt
        if (filenameNoExt.length < 6 || dotPos > filenameNoExt.length - 5) {
          filenameNoExt2 = filenameNoExt.slice(0, dotPos)
        }
        cmd = `unzip -O big5 "${file}" -d "${path.resolve(dirname, filenameNoExt2)}"`
        isCompress = false
      }
      else {
        cmd = `7z a -t7z "${path.resolve(dirname, filename + '.7z')}" -mx9 -aoa -ms=on -m0=lzma2 "${file}"`
      }
    }

    await ShellExec(cmd)
    
    if (isCompress === false) {
      let targetFolder = path.resolve(dirname, filenameNoExt)
      while (true) {
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
    }
  }
}

main()