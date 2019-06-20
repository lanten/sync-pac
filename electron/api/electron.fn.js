
const fs = require('fs')
const path = require('path')
const { app } = require('electron')

const { createWindow, windowList } = require('../window')

// 不同系统中的换行符
const BREAK = process.platform === 'win32' ? '\r\n' : '\n'

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
 * 获取用户规则源文件
 * @returns {Promise} Array
 */
function getPacSource() {
  return getUserRulePath().then(readFile)
}

/**
 * 写入用户规则源文件
 * @param {String} pacData
 * @returns {Promise} Array
 */
function setPacSource(pacData) {
  return getUserRulePath().then(p => writeFile(p, pacData))
}

/**
 * 获取 pac 列表
 * @returns {Promise} Array
 */
function getPacList() {
  return getPacSource().then(parsePacList)
}

/**
 * 写入 pac 列表
 * @param {String} data
 * @returns {Promise} Array
 */
function setPacList(pacList) {
  return setPacSource(parsePacListToString(pacList))
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
  const REG_MEMO = /!#\smemo-(.+):\s?(.*)/
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

    if (obj.hasOwnProperty(domain)) {
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

  // 获取备注
  str.replace(REG_MEMO, (_, domain, memo) => {
    if (obj.hasOwnProperty(domain)) {
      arr[obj[domain]].memo = memo
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
      itemStr = `${BREAK}! ## [${name}-start]${BREAK}${list.map(parsePacItemToString).join('')}! ## [${name}-end]${BREAK}${BREAK}`
    } else {
      itemStr = parsePacItemToString(val)
    }
    resStr += itemStr
  })

  return `${memoStr}${BREAK}${resStr}`
}

/**
 * 将单个 pac 规则转换成字符串
 * @param {Object} pacData 
 */
function parsePacItemToString(pacData) {
  const { domain, hosts, memo } = pacData

  let resStr = ''
  hosts.forEach(({ host, active }) => {
    resStr += `${active ? ' ' : '! '}||${host === '@' ? '' : host + '.'}${domain}^${BREAK}`
  })
  return `!# memo-${domain}: ${memo || ''}\n${resStr}\n`
}

const $api = {
  app,
  createWindow, windowList,
  readFile, getConfig, setConfig, getUserRulePath,

  getPacSource, setPacSource,
  getPacList, setPacList, parsePacList, parsePacListToString, parsePacItemToString,
}

module.exports = $api