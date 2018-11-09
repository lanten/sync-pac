import React from 'react'

import {
  message, Button,
  Checkbox, Popconfirm,
} from 'antd'

import { SiderMenu } from '../../components'
import PacModal from './components/PacModal'
import './pac.less'

export default class pac extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      pacList: [],
      modifyData: {},
      siderMenus: [
        {
          name: 'default',
          path: '',
          action(e, itemData) {
            console.log(e, itemData)
          }
        }
      ],
    }

    this.pacModalRef = React.createRef()
  }

  componentDidMount() {

    $api.request('getGist/5808e3011d41a4acb55ecd3c92d69696').then(res => {
      console.log('123123123', res)
    }).catch(err => {
      console.log('22222', err)
    })

    // console.log(a)

    console.log($api)
    $api.getPacList().then(pacList => {
      this.setState({ pacList })
    }).catch(err => {
      message.error('读取PAC文件出错,请查看处理日志!')
      console.error(err)
    })
  }

  // 渲染 pac 元素
  renderPacListItem({ domain, hosts, showDetail }, rowIndex, groupIndex) {
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
          <Checkbox className="flex-1" checked={allChecked} indeterminate={indeterminate} onChange={({ target: { checked } }) => {
            this.setPacHosts(checked ? 'all' : [], rowIndex, groupIndex)
          }}>
            <h3 className="text-gray item-title">
              {domain}
            </h3>
          </Checkbox>

          <div className="flex row actions">
            <Button shape="circle" size="small" icon={showDetail ? 'caret-up' : 'caret-down'} onClick={() => {
              if (typeof groupIndex === 'number') {
                this.state.pacList[groupIndex].list[rowIndex].showDetail = !showDetail
              } else {
                this.state.pacList[rowIndex].showDetail = !showDetail
              }
              this.setState({ pacList: this.state.pacList })
            }}></Button>
            <Button shape="circle" size="small" icon="edit" onClick={() => this.modifyPacItem(...arguments)}></Button>
            <Popconfirm title="确定删除本条规则吗?" placement="topRight" arrowPointAtCenter onConfirm={() => this.deletePacItem(...arguments)} okText="是" cancelText="否">
              <Button shape="circle" size="small" icon="delete" type="danger" ghost></Button>
            </Popconfirm>
          </div>
        </div>
        {
          showDetail && (
            <div className="host-list">
              <Checkbox.Group className="text-light" options={checkBoxOptions} value={checkBoxValues} onChange={(e) => {
                this.setPacHosts(e, rowIndex, groupIndex)
              }} />
            </div>
          )
        }
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
        children: this.renderPacListItem(arguments[0], arguments[1])
      }
    return <div className="pac-list-card" key={rowIndex} {...itemProps} />
  }

  // 
  render() {
    const { pacList = [], siderMenus, modifyData } = this.state

    return (
      <div className="flex-1 flex row page-pac">
        <div className="sider-panel">
          <SiderMenu menus={siderMenus} />
          <Button ghost className="add-btn" type="dashed" icon="plus">添加副本</Button>
        </div>

        <div className="flex-1 flex column">
          <div className="flex row action-bar">
            <Button size="small" icon="plus" onClick={() => this.addPacItem()}></Button>
            <span className="flex-1"></span>
            <Button size="small" icon="share-alt"></Button>
            <Button size="small" icon="sync"></Button>
            {/* <Icon type="plus-circle" theme="twoTone" style={{ fontSize: 24 }}></Icon> */}
          </div>
          <div className="flex-1 container padding scroll-y pac-list">
            {pacList.map(this.renderPacListRow.bind(this))}
          </div>
        </div>

        <PacModal ref={this.pacModalRef} modifyData={modifyData} confirm={this.modalConfirm} />
      </div>
    )
  }

  // 添加新规则
  addPacItem() {
    this.setState({ modifyData: undefined }, () => {
      this.pacModalRef.current.show()
    })
  }

  // 修改规则
  modifyPacItem(data, rowIndex, groupIndex) {
    console.log(data, rowIndex, groupIndex)
    this.setState({ modifyData: Object.assign(data, { rowIndex, groupIndex }) }, () => {
      this.pacModalRef.current.show()
    })
  }

  // 删除规则
  deletePacItem(data, rowIndex, groupIndex) {
    const { pacList } = this.state
    if (typeof groupIndex === 'number') {
      const listArr = pacList[groupIndex].list
      listArr.splice(rowIndex, 1)
      pacList[groupIndex].list = listArr
    } else {
      pacList.splice(rowIndex, 1)
    }

    $api.setPacList(pacList).then(() => this.setState({ pacList }))
  }

  //  新增/修改 回调
  modalConfirm = (type, newData) => {
    const { pacList } = this.state

    if (type === 'add') {
      pacList.unshift(newData)
    } else if (type === 'modify') {
      const { rowIndex, groupIndex } = newData
      if (typeof groupIndex === 'number') {
        pacList[groupIndex].list[rowIndex] = newData
      } else {
        pacList[rowIndex] = newData
      }
    }


    $api.setPacList(pacList).then(() => {
      this.setState({ pacList }, () => {
        this.pacModalRef.current.hide()
      })
    })
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
        return { host: host, active: newValue === 'all' ? true : newValue.includes(host) }
      })
    } else {
      pacList[rowIndex].hosts = pacList[rowIndex].hosts.map(({ host }) => {
        return { host: host, active: newValue === 'all' ? true : newValue.includes(host) }
      })
    }
    $api.setPacList(pacList).then(() => this.setState({ pacList }))
  }

} // class pac end