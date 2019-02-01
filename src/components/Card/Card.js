import React from 'react'

export default class Card extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { children } = this.props
    return (
      <div>
        Card is ok
        {children}
      </div>
    )
  }

} // class Card end