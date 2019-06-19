import React from 'react'
import { clipboard } from 'electron'

import {
  message, Button, Icon, Modal,
  Checkbox, Popconfirm, Popover,
} from 'antd'

// import { SideMenu } from '../../components'
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

    this.config = $api.getConfig()

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
            <Popconfirm title="确定删除本条规则吗? (删除操作不会自动同步)" placement="topRight" arrowPointAtCenter onConfirm={() => this.deletePacItem(...arguments)}>
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
    const {
      pacList = [], sideMenus, modifyData,
      downloadingGist = false, uploadingGist = false,
    } = this.state

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
            <Popover placement="bottomRight" title="分享 GistId 给你的小伙伴" content={
              this.config.gistId
                ? <div>
                  <span style={{ marginRight: '14px' }}>{this.config.gistId}</span>
                  <Button size="small" icon="copy" onClick={() => {
                    clipboard.writeText(this.config.gistId, 'selection')
                    message.success('已复制到剪辑板')
                  }}></Button>
                </div>
                : <p className="text-gray">没有 gistId</p>
            }>
              <Button size="small" icon="share-alt"></Button>
            </Popover>

            <Popconfirm placement="bottomRight" title="下载,此操作将会覆盖本地数据" onConfirm={() => this.downloadPacData()} icon={<Icon type="cloud-download" />}>
              <Button size="small" icon="cloud-download" loading={downloadingGist}></Button>
            </Popconfirm>

            <Popconfirm placement="bottomRight" title="上传,此操作将会覆盖云端数据" onConfirm={() => this.uploadPacData()} icon={<Icon type="cloud-upload" />}>
              <Button size="small" icon="cloud-upload" loading={uploadingGist}></Button>
            </Popconfirm>
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

    this.refreshPacList(pacList)
  }

  // 刷新本地 PAC 数据
  refreshPacList(pacList) {
    return $api.setPacList(pacList).then(() => this.setState({ pacList }))
  }

  /**
   * 新增/修改 回调
   * @param {String} type [添加:add,修改:modify,添加并同步:add-sync,修改并同步:modify-sync,]
   */
  modalConfirm = (type, newData) => {
    const { pacList } = this.state

    if (['add', 'add-sync'].includes(type)) {
      pacList.unshift(newData)
    } else if (['modify', 'modify-sync'].includes(type)) {
      const { rowIndex, groupIndex } = newData
      if (typeof groupIndex === 'number') {
        pacList[groupIndex].list[rowIndex] = newData
      } else {
        pacList[rowIndex] = newData
      }
    }

    this.refreshPacList(pacList).then(() => {
      this.pacModalRef.current.hide()
      if (['add-sync', 'modify-sync'].includes(type)) {
        this.uploadPacData()
      }
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
    this.refreshPacList(pacList)
  }

  // 下载云端数据
  downloadPacData(autoCreate = false) {
    this.setState({ downloadingGist: true })
    $api.getGistData(autoCreate).then(res => {
      const pacDataCloud = res.files['user-rule.txt']
      if (!pacDataCloud) return message.warn('暂无云端数据,请先上传!')
      const pacList = $api.parsePacList(pacDataCloud.content)
      if (pacList.length) {
        this.refreshPacList(pacList)

      } else {
        Modal.confirm({
          title: '提示',
          content: '云端列表为空,是否继续?',
          onOk: () => {
            this.refreshPacList(pacList)
          }
        })
      }
    }).catch(err => {
      console.log(err)
      if (err.errorCode === '101') {
        Modal.confirm({
          title: '提示',
          content: err.message,
          onOk: () => {
            this.downloadPacData(true)
          }
        })
      } else {
        message.error(err.message)
      }
    }).finally(() => {
      this.setState({ downloadingGist: false })
    })
  }

  // 上传到云端
  async uploadPacData() {
    this.setState({ uploadingGist: true })
    const pacSource = await $api.getPacSource()
    return $api.uploadToGists(pacSource).then(res => {
      message.success('上传成功')
      this.setState({ uploadingGist: false })
    })
  }

} // class pac end