import fs from 'node:fs'
import { join } from 'node:path'

export function writeFile({ path, time, content }) {
  const filePath = join(path, `${time}.txt`)
  fs.writeFileSync(filePath, content, function (err) {
    if (err) {
      console.log('err', err)
    } else {
      console.log('file success')
    }
  })
}

export function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, res) => {
      if (err) {
        reject(new Error(err))
      } else {
        resolve(res)
      }
    })
  })
}
