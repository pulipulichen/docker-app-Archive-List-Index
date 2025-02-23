const path = require('path')
const fs = require('fs')

module.exports = function (file, isBig5 = false) {
  let filename = path.basename(file)
  let dirname = path.dirname(file)

  let templateFilename = 'docker-compose-template.yml'
  if (isBig5) {
    templateFilename = 'docker-compose-big5-template.yml'
  }

  let template = fs.readFileSync(path.join(__dirname, '../../' + templateFilename), 'utf8')
  
  template = template.replace(/\[SOURCE\]/, `${dirname}`)
  // template = template.replace(/\[CMD\]/, `node /app/split-pdf.js "/input/${filename}"`)
  template = template.replace(/\[INPUT\]/, filename)

  // console.log(template)

  fs.writeFileSync(path.join(__dirname, '../../docker-compose.yml'), template, 'utf8')
}