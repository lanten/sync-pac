import React from 'react'

import { Card, message, Button, Icon, Tooltip } from 'antd'

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
    }).catch(err => {
      message.error('读取PAC文件出错,请查看日志!')
      console.error(err)
    })
  }

  render() {
    const { pacList = [] } = this.state

    return (
      <div className="flex-1 flex row page-pac">
        <div>
          <SiderMenu />
        </div>

        <div className="flex-1 flex column">
          <div className="action-bar">
            <Button size="small" icon="plus"></Button>
            {/* <Icon type="plus-circle" theme="twoTone" style={{ fontSize: 24 }}></Icon> */}
          </div>
          <div className="flex-1 container padding scroll-y pac-list">
            {pacList.map(this.renderPacListRow)}
          </div>
        </div>
      </div>
    )
  }

  renderPacListRow({ group, name, url, domain, active }, rowIndex) {
    const itemProps = group ? {
      children: (
        <div>group</div>
      )
    } : {
        children: <div>{url}</div>
      }
    return <div className="pac-list-item" key={rowIndex} {...itemProps} />
  }

} // class pac end