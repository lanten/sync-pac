import React from 'react'

import { message, Button, Modal, Icon, Tooltip, Checkbox, Tag, Popconfirm } from 'antd'

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
  renderPacListItem({ domain, hosts }, rowIndex) {
    return (
      <div className="pac-list-item" key={rowIndex}>
        <div className="flex row center-v">
          <h3><Checkbox>{domain}</Checkbox></h3>
          <span className="flex-1"></span>
          <div className="flex row actions">
            <Button size="small" icon="edit"></Button>
            <Popconfirm title="Are you sure delete this rule ?" placement="topRight" arrowPointAtCenter onConfirm={this.deletePacItem} okText="Yes" cancelText="No">
              <Button size="small" icon="delete" type="danger" ghost></Button>
            </Popconfirm>
          </div>
        </div>
        <div className="host-list">
          {hosts.map(({ active, host }, i) => {
            console.log(host)
            return <Tag.CheckableTag className="no-touch tag" checked={active} key={i}>{host}</Tag.CheckableTag>
          })}

        </div>

      </div>
    )
  }

  // 渲染行 (分组)
  renderPacListRow({ group, name = '未命名分组', list }, rowIndex) {
    const itemProps = group ? {
      children: (
        <div className="pac-list-group">
          <h2 className="group-title">{name}</h2>
          {list.map(this.renderPacListItem.bind(this))}
        </div>
      )
    } : {
        children: this.renderPacListItem(...arguments)
      }
    return <div className="pac-list-card" key={rowIndex} {...itemProps} />
  }

  deletePacItem() {

  }

  // 
  render() {
    const { pacList = [], siderMenus, modalPacVisible } = this.state

    return (
      <div className="flex-1 flex row page-pac">
        <div className="sider-panel">
          <SiderMenu menus={siderMenus} />
          <Button ghost className="add-btn" type="dashed" icon="plus">添加副本</Button>
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

  renderModalFooter() {
    return <div>123</div>
  }

} // class pac end