/**
 * 挂在主进程的函数,提供给渲染进程使用: $api.electron(key<函数名>)
 */

const apis = {
  test(){
    console.log('test function!')
  }
}

module.exports = apis