import React from 'react'
import fs from 'fs'
import { shell } from 'electron'

import {
  Form, Input, Icon, Button, message
} from 'antd'

import './setting.less'

export default class SettingPath extends React.Component {
  constructor(props) {
    super(props)
    const { params: { key } } = this.props
    this.win = $api.windowList[key]
    const { token = '', gistId = '' } = $api.getConfig()
    this.state = {
      path: '',
      inputPathState: '',
      inputPathMessage: '请填写一个有效路径 , 或将文件拖放至此',
      token,
      inputTokenState: token ? 'success' : '',
      inputTokenMessage: <p>Token 是用于上传配置到 Gist 的秘钥 <a onClick={() => shell.openExternal('https://github.com/lanten/sync-pac/wiki/1.%E5%A6%82%E4%BD%95%E8%8E%B7%E5%8F%96-token')}>如何获取 Token</a></p>,
      gistId: gistId ? 'success' : '',
      inputGistIdState: '',
      inputGistIdMessage: <p>GistId 如果不填写,系统将自动创建 <a onClick={() => shell.openExternal('https://github.com/lanten/sync-pac/wiki/2.%E5%A6%82%E4%BD%95%E8%8E%B7%E5%8F%96-gistId')}>如何获取 GistId</a></p>,
    }

  }

  componentDidMount() {
    this.getDefaultPath()

    global.$root.ondrop = e => {
      e.preventDefault()
      if (e.dataTransfer.files.length) {
        const { path } = e.dataTransfer.files[0]
        this.inputPath(path)
      } else {
        message.error('错误的操作!')
      }
      return false
    }
  }


  render() {
    const {
      path, inputPathState, inputPathMessage,
      token, inputTokenState, inputTokenMessage,
      gistId, inputGistIdState, inputGistIdMessage,
    } = this.state
    return (
      <>
        <div className="page-setting-path">
          <Form>
            <Form.Item
              label="用户规则文件路径"
              hasFeedback
              help={inputPathMessage}
              validateStatus={inputPathState}
            >
              <Input
                addonBefore={<Icon type="file-text" />}
                placeholder="用户规则 user-rule.text 文件路径"
                value={path}
                onChange={({ target: { value } }) => this.inputPath(value)}
                onBlur={() => this.inputPath(path)}
              />
            </Form.Item>

            <Form.Item
              label="Token"
              hasFeedback
              help={inputTokenMessage}
              validateStatus={inputTokenState}
            >
              <Input
                addonBefore={<Icon type="safety-certificate" />}
                placeholder="请输入 Token"
                value={token}
                onChange={({ target: { value } }) => this.inputToken(value)}
                onBlur={() => this.inputToken(token)}
              />
            </Form.Item>

            <Form.Item
              label="GistId"
              hasFeedback
              help={inputGistIdMessage}
              validateStatus={inputGistIdState}
            >
              <Input
                addonBefore={<Icon type="github" />}
                placeholder="请输入 GistId (可空)"
                value={gistId}
                onChange={({ target: { value } }) => this.inputGistId(value)}
              />
            </Form.Item>
          </Form>
        </div>
        <div className="app-footer">
          {!this.props.params.disableClose && <Button onClick={() => this.win.close()}>取消</Button>}
          <Button type="primary" disabled={!path || inputPathState === 'error' || !token || inputTokenState === 'error'} onClick={this.saveSetting}>保存</Button>
        </div>
      </>
    )
  }

  saveSetting = () => {
    const { path, token, gistId } = this.state
    $api.setConfig({ userRulePath: path, token, gistId })

    if (this.win.from) $api.createWindow(this.win.from)
    this.win.close()
  }

  inputPath(path) {
    let inputPathState = '', inputPathMessage = ''
    if (!/^.*(user-rule\.txt)$/.test(path)) {
      inputPathState = 'error'
      inputPathMessage = '请输入或拖放正确的 user-rule.text 文件 (路径)'
    } else if (fs.existsSync(path)) {
      inputPathState = 'success'
      inputPathMessage = '路径正确,已找到文件'
    } else {
      inputPathState = 'error'
      inputPathMessage = '找不到对应的文件'
    }
    this.setState({ path, inputPathState, inputPathMessage })
  }

  inputToken(token) {
    let inputTokenState = token ? 'success' : 'error'
    this.setState({ token, inputTokenState })
  }

  inputGistId(gistId) {
    let inputGistIdState = gistId ? 'success' : 'error'
    this.setState({ gistId, inputGistIdState })
  }

  getDefaultPath() {
    $api.getUserRulePath().then(path => {
      if (path) this.inputPath(path)
    })
  }

} // class SettingPath end