import React from 'react'
import reactDom from 'react-dom'

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        App is ok
      </div>
    )
  }

} // class App end



reactDom.render(<App />, document.getElementById('root'))