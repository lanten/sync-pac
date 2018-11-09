
const fs = require('fs')
const path = require('path')
const { app } = require('electron')

const { createWindow, windowList } = require('../window/createWindow')

/**
 * 获取全局用户设置
 * @returns {Object} config
 */
function getConfig() {
  const configPath = path.join(app.getAppPath(), 'app.config.json')
  let config = {}
  if (fs.existsSync(configPath)) {
    const configStr = fs.readFileSync(configPath, 'utf-8')
    try {
      config = JSON.parse(configStr)
    } catch (error) {
      throw new Error(error)
    }
  } else {
    fs.writeFileSync(configPath, '{}', 'utf-8')
    config = {}
  }
  return config
}

/**
 * 写入全局用户设置
 * @param {Object} config 
 */
function setConfig(config) {
  const configPath = path.join(app.getAppPath(), 'app.config.json')
  const defaultConfig = getConfig()
  try {
    const configStr = JSON.stringify(Object.assign({}, defaultConfig, config))
    return fs.writeFileSync(configPath, configStr, 'utf-8')
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * 读取文件 (文本)
 * @param {String} path 文件路径
 * @returns {Promise}
 */
function readFile(path) {
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
 * 写入文件 (文本)
 * @param {String} path 
 * @param {String} data 
 * @returns {Promise}
 */
function writeFile(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, 'utf-8', (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

/**
 * 获取用户规则路径
 * @param {Boolean} setConfig default:true
 * @returns {Promise}
 */
function getUserRulePath(setConfig) {
  return new Promise((resolve, reject) => {
    let path = getConfig().userRulePath

    if (path) return resolve(path)
    // macOS 尝试自动获取路径
    if (process.platform === 'darwin') path = `${app.getPath('home')}/.ShadowsocksX-NG/user-rule.txt`

    if (path && fs.existsSync(path)) {
      if (setConfig) setConfig({ userRulePath: path })
      resolve(path)
    } else {
      reject()
    }
  })
}

/**
 * 获取 pac 列表
 * @returns {Promise} Array
 */
function getPacList() {
  return getUserRulePath().then(path => readFile(path).then(res => parsePacList(res)))
}

/**
 * 写入 pac 列表
 * @returns {Promise} Array
 */
function setPacList(pacList) {
  return getUserRulePath().then(path => writeFile(path, parsePacListToString(pacList)))
}


/**
 * 格式化 pac
 * @param {String} data
 * @param {Boolean} hasGroup 是否包含分组
 * @returns {Array}
 */
function parsePacList(data, hasGroup = true) {
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
      const hostsArr = arr[obj[domain]].hosts
      const hostIndex = hostsArr.findIndex(val => host === val.host)
      // 相同域名下重复的 host 将会被忽略
      if (hostIndex < 0) hostsArr.push({ active: !active, host })
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

/**
 * 将 pac 列表转换成字符串
 * @param {Array} listData 
 */
function parsePacListToString(listData) {
  let resStr = ''
  let memoStr = ''
  listData.forEach((val) => {
    const { group, name, list } = val
    let itemStr = ''
    if (group) {
      itemStr = `\n! ## [${name}-start]\n${list.map(parsePacItemToString).join('')}! ## [${name}-end]\n\n`
    } else {
      itemStr = parsePacItemToString(val)
    }
    resStr += itemStr
  })

  return `
    ${memoStr}
    ${resStr}
  `
}

/**
 * 将单个 pac 规则转换成字符串
 * @param {Object} pacData 
 */
function parsePacItemToString({ domain, hosts }) {
  let resStr = ''
  hosts.forEach(({ host, active }) => {
    resStr += `${active ? '' : '! '}||${host === '@' ? '' : host + '.'}${domain}^\n`
  })
  return resStr
}


module.exports = {
  app,
  createWindow, windowList,
  readFile, getConfig, setConfig, getUserRulePath,

  getPacList, setPacList, parsePacList, parsePacListToString, parsePacItemToString,
}