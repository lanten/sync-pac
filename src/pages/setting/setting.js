import React from 'react'
import fs from 'fs'
import {
  Form, Input, Icon, Button, message
} from 'antd'

import './setting.less'

export default class SettingPath extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      path: '',
      inputPathState: '',
      inputPathMessage: '请填写一个有效路径 , 或将文件拖放至此',
      token: '',
      inputTokenState: '',
      inputTokenMessage: <p>Token 是用于上传配置到 Github 的秘钥 <a>如何获取 Token</a></p>,
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
      GistId, inputGistIdState, inputGistIdMessage,
    } = this.state
    return (
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
              enterButton={<Button type="primary" disabled={inputPathState === 'error'}>确认</Button>}
              placeholder="用户规则 user-rule.text 文件路径"
              value={path}
              onChange={({ target: { value } }) => this.inputPath(value)}
              onSearch={() => this.saveSetting()}
            />
          </Form.Item>

          <Form.Item
            label="Token"
            hasFeedback
            help={inputTokenMessage}
            validateStatus={inputTokenState}
          >
            <Input
              addonBefore={<Icon type="key" />}
              placeholder="请输入 Token"
              value={token}
              onChange={({ target: { value } }) => this.inputPath(value)}
            />
          </Form.Item>
        </Form>
      </div>
    )
  }

  saveSetting() {
    const { path } = this.state
    const { params: { key } } = this.props
    $api.setConfig({ userRulePath: path })
    const win = $api.windowList[key]

    if (win.from) $api.createWindow(win.from)
    win.close()
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

  getDefaultPath() {
    $api.getUserRulePath().then(path => {
      if (path) this.inputPath(path)
    })
  }

} // class SettingPath end