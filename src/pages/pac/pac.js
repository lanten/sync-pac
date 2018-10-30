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
  renderPacListItem({ domain, hosts }, rowIndex, groupIndex) {
    const checkBoxOptions = []
    const checkBoxValues = []
    hosts.forEach(({ active, host }) => {
      checkBoxOptions.push(host)
      if (active) checkBoxValues.push(host)
    })
    const allChecked = checkBoxOptions.length === checkBoxValues.length
    const indeterminate = checkBoxValues.length && (checkBoxOptions.length !== checkBoxValues.length)
    return (
      <div className="pac-list-item" key={rowIndex}>
        <div className="flex row center-v">
          <h3>
            <Checkbox checked={allChecked} indeterminate={indeterminate} onChange={({ target: { checked } }) => {
              this.setPacHosts(checked ? 'all' : [], rowIndex, groupIndex)
            }}>{domain}</Checkbox>
          </h3>

          <span className="flex-1"></span>

          <div className="flex row actions">
            <Button shape="circle" size="small" icon="edit"></Button>
            <Popconfirm title="Are you sure delete this rule ?" placement="topRight" arrowPointAtCenter onConfirm={this.deletePacItem} okText="Yes" cancelText="No">
              <Button shape="circle" size="small" icon="delete" type="danger" ghost></Button>
            </Popconfirm>
          </div>
        </div>
        <div className="host-list">
          <Checkbox.Group options={checkBoxOptions} value={checkBoxValues} onChange={(e) => {
            this.setPacHosts(e, rowIndex, groupIndex)
          }} />
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
          {list.map((v, i) => this.renderPacListItem(v, i, rowIndex))}
        </div>
      )
    } : {
        children: this.renderPacListItem(...arguments)
      }
    return <div className="pac-list-card" key={rowIndex} {...itemProps} />
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

  // 渲染弹框页脚
  renderModalFooter() {
    return <div>123</div>
  }

  // 删除 pac 规则
  deletePacItem() {

  }

  /**
   * 设置 host
   * @param {Array} newValue 
   * @param {Number} rowIndex 
   * @param {Number} groupIndex 
   */
  setPacHosts(newValue, rowIndex, groupIndex) {
    const { pacList } = this.state
    if (typeof groupIndex === 'number') {
      pacList[groupIndex].list[rowIndex].hosts = pacList[groupIndex].list[rowIndex].hosts.map(({ host }) => {
        return { host: host, active: newValue === 'all' ? true : newValue.indexOf(host) > -1 }
      })
    } else {
      pacList[rowIndex].hosts = pacList[rowIndex].hosts.map(({ host }) => {
        return { host: host, active: newValue === 'all' ? true : newValue.indexOf(host) > -1 }
      })
    }
    this.setState({ pacList })
  }

} // class pac end