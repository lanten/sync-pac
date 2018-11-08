import React from 'react'
import './setting-path.less'
import {
  Form, Input, message
} from 'antd'


export default class SettingPath extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      path: '',
    }

  }

  componentDidMount() {
    this.getDefaultPath()

    global.$root.ondrop = e => {
      e.preventDefault()
      if (e.dataTransfer.files.length) {
        const { path } = e.dataTransfer.files[0]
        this.setState({ path })
      } else {
        message.error('错误的操作!')
      }
      return false
    }
  }


  render() {
    const { path } = this.state
    return (
      <div className="page-setting-path">
        <Form>
          <Form.Item label="用户规则文件路径" help="请填写一个有效路径 , 或将文件拖放至此">
            <Input.Search enterButton="确认" placeholder="用户规则 user-rule.text 文件路径" value={path} onInput={({ target: { value } }) => this.setState({ path: value })} />
          </Form.Item>
        </Form>
      </div>
    )
  }

  getDefaultPath() {
    $api.getUserRulePath().then(path => {
      if (path) this.setState({ path })
    })
  }

} // class SettingPath end