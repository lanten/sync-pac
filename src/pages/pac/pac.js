import React from 'react'

import { Card, message, Button, Modal, Icon, Tooltip } from 'antd'

import { SiderMenu } from '../../components'
import './pac.less'

export default class pac extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      pacList: [],
      siderMenus: [
        {
          name: 'default',
          path: '',
          action(e, itemData) {
            console.log(e, itemData)
          }
        }
      ],
      modalPacVisible: false,
    }
  }

  componentDidMount() {
    $app.getPacList().then(pacList => {
      this.setState({ pacList })
      console.log(pacList)
    }).catch(err => {
      message.error('读取PAC文件出错,请查看日志!')
      console.error(err)
    })
  }

  // 渲染 pac 元素
  renderPacListItem({ url }, rowIndex) {
    return (
      <div>{url}</div>
    )
  }

  // 渲染行 (分组)
  renderPacListRow({ group, name, url, domain, active }, rowIndex) {
    const itemProps = group ? {
      children: (
        <div>group</div>
      )
    } : {
        children: this.renderPacListItem(...arguments)
      }
    return <div className="pac-list-item" key={rowIndex} {...itemProps} />
  }

  render() {
    const { pacList = [], siderMenus, modalPacVisible } = this.state

    return (
      <div className="flex-1 flex row page-pac">
        <div>
          <SiderMenu menus={siderMenus} />
        </div>

        <div className="flex-1 flex column">
          <div className="action-bar">
            <Button size="small" icon="plus" onClick={() => this.setState({ modalPacVisible: true })}></Button>
            {/* <Icon type="plus-circle" theme="twoTone" style={{ fontSize: 24 }}></Icon> */}
          </div>
          <div className="flex-1 container padding scroll-y pac-list">
            {pacList.map(this.renderPacListRow.bind(this))}
          </div>
        </div>

        <Modal
          destroyOnClose
          className="modal-pac"
          title={'新增规则'}
          visible={modalPacVisible}
          cancelText="仅保存"
          okText="保存并同步"
          footer={this.renderModalFooter()}
          onCancel={() => this.setState({ modalPacVisible: false })}
        >
        </Modal>
      </div>
    )
  }

  renderModalFooter(e) {
    console.log(e)
    return <div>123</div>
  }

} // class pac end