// const ShellSpawn = require('./lib/ShellSpawn')
const ShellExec = require('./lib/ShellExec')
const GetExistedArgv = require('./lib/GetExistedArgv')

const path = require('path')
const fs = require('fs')

const CheckDirecotry = require('./archive-list/CheckDirectory')
const DirectoryToList = require('./archive-list/DirectoryToList')
const DirectoryTo7z = require('./archive-list/DirectoryTo7z')

const ArchiveToDirectory = require('./archive-list/ArchiveToDirectory')
const RemoveList = require('./archive-list/RemoveList')

const CopyIndexFiles = require('./archive-list/CopyIndexFiles')

// convert a.tif -thumbnail 64x64^ -gravity center -extent 64x64 b.ico

// -------------------------------------------------------------

const ENABLE_GDRIVE = true

// -------------------------------------------------------------


let main = async function () {
  await ShellExec('id -u')
  await ShellExec('id -g')
  
  let files = GetExistedArgv()
  for (let i = 0; i < files.length; i++) {
    let directoryPath = files[i]
    const stats = fs.statSync(directoryPath);
    if (stats.isDirectory(directoryPath) === false) {
      // directoryPath = path.dirname(directoryPath)
      continue
    }

    // throw new Error(CheckDirecotry(directoryPath))
    // return console.log(CheckDirecotry(directoryPath))
    if (CheckDirecotry(directoryPath) === false) {
      
      let archiveFilePath = await DirectoryTo7z(directoryPath, false)
      
      // console.log(listFilePath, archiveFilePath)
      // throw new Error(archiveFilePath)

      let gdriveDir = path.join(path.dirname(directoryPath), 'gdrive')
      if (ENABLE_GDRIVE && fs.existsSync(gdriveDir) === false) {
        fs.mkdirSync(gdriveDir)
      }

      let gdriveArchiveDir = path.join(gdriveDir, path.basename(directoryPath))
      if (ENABLE_GDRIVE && fs.existsSync(gdriveArchiveDir) === false) {
        fs.mkdirSync(gdriveArchiveDir)
      }

      if (archiveFilePath !== false) {
        let listFilePath = await DirectoryToList(directoryPath)

        fs.renameSync(directoryPath, directoryPath + '.bak')
        fs.mkdirSync(directoryPath)

        // fs.copyFileSync(listFilePath, path.join(directoryPath, path.basename(listFilePath)));
        fs.renameSync(listFilePath, path.join(directoryPath, path.basename(listFilePath)));
        listFilePath = path.join(directoryPath, path.basename(listFilePath))
        fs.renameSync(archiveFilePath, path.join(directoryPath, path.basename(archiveFilePath)));

        // =========

        CopyIndexFiles(directoryPath, gdriveArchiveDir, ENABLE_GDRIVE)

        // =========

        // Remove the backup directory
        // fs.rmdirSync(directoryPath + '.bak', { recursive: true });
        
        // Move the archive to gdrive directory
        // fs.renameSync(archiveFilePath, path.join(gdriveDir, path.basename(archiveFilePath)));

        // Move the list to gdrive directory
        // fs.renameSync(listFilePath, path.join(gdriveDir, path.basename(listFilePath)));

        // Remove the backup directory

        // =========

        fs.rmdirSync(directoryPath + '.bak', { recursive: true });
      
        let gdriveArchiveFile = path.join(gdriveArchiveDir, path.basename(listFilePath))
        if (ENABLE_GDRIVE && fs.existsSync(gdriveArchiveFile) === false) {
          console.log({listFilePath, gdriveArchiveFile})
          fs.copyFileSync(listFilePath, gdriveArchiveFile)
        }
      }
      else {

        // Read all files and directories in the given path
        const items = fs.readdirSync(directoryPath);
        // Filter only `.xlsx` files
        const xlsxFiles = items.filter(item => {
            const itemPath = path.join(directoryPath, item);
            return fs.statSync(itemPath).isFile() && path.extname(item).toLowerCase() === '.xlsx';
        });

        if (ENABLE_GDRIVE) {
          const itemPath = path.join(directoryPath, xlsxFiles[0]);
          fs.copyFileSync(itemPath, path.join(gdriveArchiveDir, path.basename(itemPath)))
        }
      } 
    }
    else {
      // RemoveList(directoryPath)
      let tmpDirectory = await ArchiveToDirectory(directoryPath, false)
      if (!tmpDirectory) {
        console.error('tmp directory does not exist')
        continue
      }

      fs.rmdirSync(directoryPath, { recursive: true });
      fs.renameSync(tmpDirectory, directoryPath);
    }
  }
}

main()