const fs = require('fs')

/**
 * 通过路径读取文件
 * @param {String} path 文件路径
 * @returns {Promise} data,err
 */
export function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, data) => {
      if (err) {
        reject(err, data)
      } else {
        resolve(data)
      }
    })
  })
}

