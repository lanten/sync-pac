import fs from 'fs'
import os from 'os'

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


/**
 * 获取 pac 列表
 * @returns {Promise} Array
 */
export function getPacList() {
  let path
  if (process.platform === 'darwin') {
    path = `${os.homedir()}/.ShadowsocksX-NG/user-rule.txt`
  }
  return readFile(path).then(res => parsePacList(res))
}

/**
 * 格式化 pac
 * @param {String} data 
 * @returns {Array}
 */
export function parsePacList(data, hasGroup = true) {
  const REG_RULE = /(!\s*)?\|\|(.*\.)?(.+)(\..+)\^/g
  const REG_GROUP = /! #-#-#-#-#-# \[(.*)\]\n(.*)\n! #-#-#-#-#-#/g
  const arr = []

  let str = hasGroup ? data.replace(REG_GROUP, (res, $1 = '', $2 = '') => {
    arr.push({
      group: true,
      name: $1,
      list: parsePacList($2, false)
    })
    return ''
  }) : data

  str.replace(REG_RULE, (res, active, $1 = '', $2 = '', $3 = '') => {
    arr.push({
      active: !active,
      url: `${$1}${$2}${$3}`,
      domain: `${$2}${$3}`,
      host: $1.replace('.', ''),
    })
  })

  return arr
}
