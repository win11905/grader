import { brotliCompress } from 'zlib'

export default async function (code: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    brotliCompress(code, (err, res) => {
      if (err) reject(err)
      resolve(res)
    })
  })
}