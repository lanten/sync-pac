/**
 * 挂在主进程的函数,提供给渲染进程使用: $api.electron(key<函数名>)
 * 定义尽可能少的函数有助于减少内存占用
 */

const apis = {
  test(){
    console.log('test function!')
  }
}

module.exports = apis