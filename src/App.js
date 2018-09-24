import React from 'react'
import { Router } from './components'
import routes from './pages/routes'
import './styles/index.less'

import { Header } from './components'

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div id="app">
        {/* <Header></Header> */}
        <p className="fs-24">App is ok</p>
        <hr />
        <Router routes={routes} />
      </div>
    )
  }

} // class App end

// global.ipcFunction = {
//   router(val) {
//     location.hash = `#${val}`
//   }
// }


// ipcRenderer.on('common', (e, data) => {
//   const { }
// })