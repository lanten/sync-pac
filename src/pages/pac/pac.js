import React from 'react'
import os from 'os'

export default class pac extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // const api = remote.getGlobal('api')
    // api.test(v => {
    //   console.log(v)
    // })
    // console.log()

    // console.log($api)
    const path = `${os.homedir()}/.ShadowsocksX-NG/user-rule.txt`
    $api.electron('readFile', path).then(res => {
      this.parsePAC()
    })

  }

  render() {
    return (
      <div>
        pac is ok
      </div>
    )
  }

  parsePAC(pacStr) {

  }

} // class pac end