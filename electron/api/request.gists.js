const fetch = require('node-fetch')

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

  return fetch(`${baseURL}${url}`, requestHead).then(res => res.json())

}

function getGistData(gistId) {
  if (!gistId) gistId = global.$api.getConfig().gistId

  return request('/gists/' + gistId)

}

module.exports = {
  gistsApis,
  request,
  getGistData,
}