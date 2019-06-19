const fetch = require('node-fetch')
const { gistDescription } = require('../../config/app.config')

const gistsApis = {
  getGist: '/gists',
}

function request(url, params = {}, options = {}) {
  const {
    method = 'GET',
    baseURL = 'https://api.github.com',
    Accept = 'application/vnd.github.v3+json',
    needAuth = false, // 需要认证
    from = '' // 来源页
  } = options

  const { token } = global.$api.getConfig()

  // const keys = key.split('/')
  // let url = gistsApis[keys.shift()]
  // let urlParams = keys.join('/')


  // if (urlParams) url += '/' + urlParams

  const requestHead = {
    method,
    headers: {
      Accept,
    },
  }


  if (method === 'POST') {
    requestHead.body = JSON.stringify(params)
  }

  if (token) {
    requestHead.headers.Authorization = `token ${token}`
  } else {
    if (needAuth) global.$api.createWindow('setting', { from })
  }

  return fetch(`${baseURL}${url}`, requestHead).then(async res => {
    const json = await res.json()
    if (json.message) {
      return Promise.reject(json, res)
    } else {
      return json
    }
  }).catch((err, res) => {
    console.error(err, res)
    return Promise.reject(err, res)
  })

}

// 获取 gist
function getGistDataByGistId(gistId) {
  if (!gistId) gistId = global.$api.getConfig().gistId

  return request('/gists/' + gistId)
}

//  获取全部 gist
function getGistList() {
  return request('/gists')
}

// 创建 gist
function createGist(sendData) {
  const DEFAULT_SAND_DATA = {
    files: {
      'config.json': {
        content: JSON.stringify({
          version: '1.0',
          createTime: Date.now(),
        })
      }
    },
    description: gistDescription,
    public: true, // 是否公开
  }
  return request('/gists', Object.assign(DEFAULT_SAND_DATA, sendData), { method: 'POST' }).then(res => {
    if (res.id) {
      console.warn('重置 gistId', res.id)
      global.$api.setConfig({ gistId: res.id })
    }
    return res
  })
}

/**
 * 获取云端数据
 * @param {*} autoCreate 是否自动创建
 */
function getGistData(autoCreate) {
  return new Promise(async (resolve, reject) => {
    let { gistId } = global.$api.getConfig()
    let gistData, errorInfo = {}
    if (gistId) {
      console.log(gistId)
      gistData = await getGistDataByGistId(gistId).catch((err) => {
        errorInfo = err
        errorInfo.errorCode = '101'
        errorInfo.message = '未找到对应的 gist,是否重新创建?'
        return void 0
      })
    } else {
      gistData = await getGistList().then((res = {}) => {
        if (res.message) {
          errorInfo = err
        }
        const pacGist = res.find(v => v.description === gistDescription)
        if (!pacGist || !pacGist.id) return void 0
        return getGistDataByGistId(gistId).catch((err) => {
          errorInfo = err
          errorInfo.errorCode = '101'
          errorInfo.message = '未找到对应的 gist,是否重新创建?'
          return void 0
        })
      }).catch(() => {
        return false
      })

      if (!gistData) {
        errorInfo.errorCode = '101'
        errorInfo.message = '未找到对应的 gist,是否自动创建?'
      }
    }

    if (!gistData) {
      if (autoCreate) {
        console.log('自动创建 gist')
        gistData = await createGist().catch(() => {
          errorInfo = err
          return void 0
        })
      }
    }

    if (gistData) {
      if (!gistId) {
        global.$api.setConfig({ gistId: gistData.id })
      }
      resolve(gistData)
    } else {
      reject(errorInfo)
    }
  })
}

/**
 * 将本地规则同步到云端
 * @param {*} pacData 
 */
function uploadToGists(pacData) {
  console.log('upload ready', pacData)
  let { gistId } = global.$api.getConfig()

  const sandData = {
    files: {
      'config.json': {
        content: JSON.stringify({
          version: '1.0',
          createTime: Date.now(),
        })
      },
      'user-rule.txt': {
        content: pacData,
      }
    },
    description: gistDescription,
  }
  return request(`/gists/${gistId}`, sandData, { method: 'POST' })
}

module.exports = {
  gistsApis,
  request,

  getGistList, getGistDataByGistId, createGist, getGistData, uploadToGists,
}