const fs = require('fs')

/**
 * 通过路径读取文件
 * @param {String} params 文件路径
 */
module.exports.readFile = ({ resolve, params }) => {
  fs.readFile(params, 'utf-8', (err, data) => {
    if (err) {
      reject(err, data)
    } else {
      resolve(data)
    }
  })
}