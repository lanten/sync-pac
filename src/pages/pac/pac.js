import React from 'react'

import {
  message, Button, Icon,
  Checkbox, Popconfirm, Popover,
} from 'antd'

import { SideMenu } from '../../components'
import PacModal from './components/PacModal'
import './pac.less'

export default class pac extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      pacList: [],
      gitData: {},
      modifyData: {},
      sideMenus: [
        {
          name: 'default',
          path: '',
          action(e, itemData) {
            console.log(e, itemData, $api.getConfig())
          }
        }
      ],
    }

    this.pacModalRef = React.createRef()
  }

  componentDidMount() {
    // this.downloadPacData()

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
            <Popconfirm title="确定删除本条规则吗?" placement="topRight" arrowPointAtCenter onConfirm={() => this.deletePacItem(...arguments)}>
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
    const { pacList = [], sideMenus, modifyData, loadingGist = false } = this.state

    return (
      <div className="flex-1 flex row page-pac">
        {/* <div className="side-panel">
          <SideMenu menus={sideMenus} />
          <Button ghost className="add-btn" type="dashed" icon="plus" onClick={() => alert('开发中。。。')} >添加副本</Button>
        </div> */}

        <div className="flex-1 flex column">
          <div className="flex row action-bar">
            <Button size="small" icon="plus" onClick={() => this.addPacItem()}></Button>
            <span className="flex-1"></span>
            <Popover placement="bottomRight" title="分享 GistId 给你的小伙伴" onConfirm={this.downloadPacData}>
              <Button size="small" icon="share-alt"></Button>
            </Popover>

            <Popconfirm placement="bottomRight" title="下载,此操作将会覆盖本地数据" onConfirm={this.downloadPacData} icon={<Icon type="cloud-download" />}>
              <Button size="small" icon="cloud-download"></Button>
            </Popconfirm>

            <Popconfirm placement="bottomRight" title="上传,此操作将会覆盖云端数据" onConfirm={this.uploadPacData} icon={<Icon type="cloud-upload" />}>
              <Button size="small" icon="cloud-upload"></Button>
            </Popconfirm>

            <Button size="small" icon="cloud-sync" loading={loadingGist}></Button>
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

  // 下载云端数据
  downloadPacData = () => {
    this.setState({ loadingGist: true })
    $api.getGistData().then(res => {
      console.log(res)
    }).finally(() => {
      this.setState({ loadingGist: false })
    })
  }

  // 上传到云端
  uploadPacData = async () => {
    const pacSource = await $api.getPacSource()
    $api.uploadToGists(pacSource)
  }

} // class pac end