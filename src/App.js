import React from 'react'
import Router from './components/Router'
import routes from './routes'

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        App is ok
        <hr />
        <Router routes={routes} />
      </div>
    )
  }

} // class App end