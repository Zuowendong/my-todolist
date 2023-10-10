import fs from 'node:fs'
import { join } from 'node:path'

export function writeFile({ fileUrl, time, content }) {
  const filePath = join(fileUrl, `${time}.txt`)
  fs.writeFileSync(filePath, content, function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log('file success')
    }
  })
}
