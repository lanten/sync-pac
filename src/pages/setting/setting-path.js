import React from 'react'
import fs from 'fs'
import {
  Form, Input, Icon, Button, message
} from 'antd'

import './setting-path.less'

export default class SettingPath extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      path: '',
      inputState: '',
      inputMessage: '请填写一个有效路径 , 或将文件拖放至此',
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
    const { path, inputState, inputMessage } = this.state
    return (
      <div className="page-setting-path">
        <Form>
          <Form.Item label="用户规则文件路径"
            hasFeedback
            help={inputMessage}
            validateStatus={inputState}
          >
            <Input.Search
              addonBefore={<Icon type="link" />}
              enterButton={<Button type="primary" disabled={inputState === 'error'}>确认</Button>}
              placeholder="用户规则 user-rule.text 文件路径"
              value={path}
              onChange={({ target: { value } }) => this.inputPath(value)}
              onSearch={() => this.saveSetting()}
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
    let inputState = '', inputMessage = ''
    if (!/^.*(user-rule\.txt)$/.test(path)) {
      inputState = 'error'
      inputMessage = '请输入或拖放正确的 user-rule.text 文件 (路径)'
    } else if (fs.existsSync(path)) {
      inputState = 'success'
      inputMessage = '已找到对应的文件'
    } else {
      inputState = 'error'
      inputMessage = '找不到对应的文件'
    }
    this.setState({ path, inputState, inputMessage })
  }

  getDefaultPath() {
    $api.getUserRulePath().then(path => {
      if (path) this.inputPath(path)
    })
  }

} // class SettingPath end