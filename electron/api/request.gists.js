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
function getGistData(gistId) {
  if (!gistId) gistId = global.$api.getConfig().gistId

  return request('/gists/' + gistId)
}

//  获取全部 gist
function getGistList() {
  return request('/gists')
}

// 创建 gist
function createGist(sendData) {
  return request('/gists', sendData, { method: 'POST' })
}

function initPacGist() {
  return new Promise(async (resolve, reject) => {
    let { gistId } = global.$api.getConfig()
    let gistData
    if (gistId) {
      gistData = await $api.getGistData(gistId).catch(() => undefined)
    } else {
      gistData = await $api.getGistList().then((res = {}) => {
        if (res.message) {
          message.error(res.message)
        }
        return res.find(v => v.description === gistDescription)
      }).catch(() => false)

      if (!gistData) {
        console.log('创建')
        gistData = await $api.createGist({
          files: {
            config: { content: `{createTime:${Date.now()}}` }
          },
          description: gistDescription,
          public: true,
        }).catch(() => undefined)
      }
    }
    if (gistData) {
      resolve(gistData)
    } else {
      reject()
    }
  })

}

module.exports = {
  gistsApis,
  request,

  getGistList, getGistData, createGist, initPacGist,
}