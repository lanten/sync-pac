import React from 'react'

import { Card } from 'antd'

import { SiderMenu } from '../../components'
import './pac.less'

export default class pac extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      pacList: [],
    }
  }

  componentDidMount() {
    $app.getPacList().then(pacList => {
      this.setState({ pacList })
    })
  }

  render() {
    const { pacList } = this.state

    return (
      <div className="flex-1 flex row page-pac">
        <div>
          <SiderMenu />
        </div>

        <div className="flex-1 container padding scroll-y pac-list">
          {pacList && pacList.length && pacList.map(this.renderPacListRow)}
        </div>
      </div>
    )
  }

  renderPacListRow({ group, name, url, domain, active }, rowIndex) {
    const itemProps = group ? {
      title: name,
      children: (
        <div>group</div>
      )
    } : {
        children: <div>{url}</div>
      }
    return <Card className="pac-list-item" key={rowIndex} {...itemProps} />
  }

} // class pac end