import fs from 'node:fs'
import { join } from 'node:path'

export function writeFile({ path, time, content }) {
  const filePath = join(path, `${time}.txt`)
  fs.writeFileSync(filePath, content, function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log('file success')
    }
  })
}

export function getAllFileName(folderPath) {
  if (fs.existsSync(folderPath)) {
    return fs.readdirSync(folderPath)
  }
}

export function readFile(filePath) {
  return new Promise((resolve) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, res) => {
      if (err) {
        console.log(err)
      } else {
        resolve(res)
      }
    })
  })
}
