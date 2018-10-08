import React from 'react'

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
    console.log($api)
  }

  render() {
    return (
      <div>
        pac is ok
      </div>
    )
  }

} // class pac end