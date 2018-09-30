import React from 'react'
import { Router } from './components'
import routes from './pages/routes'
import './styles/index.less'

import { SiderMenu, Header } from './components'

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <Header></Header>
        <div className="flex-1 flex row">
          <SiderMenu></SiderMenu>
          <div className="flex-1 main-container">
            <Router routes={routes} />
          </div>
        </div>
      </React.Fragment>
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