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
 * @param {Boolean} hasGroup 是否包含分组
 * @returns {Array}
 */
export function parsePacList(data, hasGroup = true) {
  const REG_RULE = /(!\s*)?\|\|(.*\.)?(.+)(\..+)\^/g
  const REG_GROUP = /!\s*##\s*\[(.+)-start\]([\s\S]*)!\s*##\s*\[(.+)-end\]/g
  const arr = []

  let str = hasGroup ? data.replace(REG_GROUP, (res, $1 = '', $2 = '', $3 = '') => {
    if ($1 !== $3) return $2
    arr.push({
      group: true,
      name: $1,
      list: parsePacList($2, false)
    })
    return ''
  }) : data

  // 同域名下的多条记录将会被合并
  const obj = {}
  str.replace(REG_RULE, (res, active, $1 = '', $2 = '', $3 = '') => {
    const domain = `${$2}${$3}`
    const host = $1 ? $1.replace('.', '') : '@'
    if (obj[domain]) {
      arr[obj[domain]].hosts.push({ active: !active, host })
    } else {
      obj[domain] = arr.length
      arr.push({
        domain,
        hosts: [{ active: !active, host }],
      })
    }
  })

  return arr
}
