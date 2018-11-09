const fetch = require('node-fetch')

const gistsApis = {
  getGist: '/gists',
}

function request(key, params = {}, options = {}) {
  const {
    method = 'GET',
    baseURL = 'https://api.github.com',
    Accept = 'application/vnd.github.v3+json',
    needAuth = false, // 需要认证
    from = '' // 来源页
  } = options



  const keys = key.split('/')
  let url = gistsApis[keys.shift()]
  let urlParams = keys.join('/')


  if (urlParams) url += '/' + urlParams

  const requestHead = {
    method,
    headers: {
      Accept,
    },
  }


  if (method === 'GET') {
    const getParams = Object.keys(params).map(k => {
      return `${k}=${params[k]}`
    })
    if (getParams.length) url += `?${getParams.join('&')}`
  } else {
    requestHead.body = JSON.stringify(params)
  }


  const { token } = global.$api.getConfig()
  if (token) {
    requestHead.headers.Authorization = `token ${token}`
  } else {
    if (needAuth) global.$api.createWindow('setting', { from })
  }

  console.log(url, requestHead)

  return fetch(`${baseURL}${url}`, requestHead).then(res => res.json())

}

module.exports = {
  gistsApis,
  request,
}