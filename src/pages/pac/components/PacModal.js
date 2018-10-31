import React from 'react'
import {
  Button, Modal, Form, Input, Select,
} from 'antd'

const formItemProps = {
  labelCol: {
    xs: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 21 },
  },
}

export default class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
    }
  }

  render() {
    const { modalVisible } = this.state
    const { modifyData = {} } = this.props
    const { domain, hosts } = modifyData
    console.log(modifyData)
    return (
      <Modal
        destroyOnClose
        mask={false}
        className="modal-pac"
        title={domain ? domain : '新增规则'}
        visible={modalVisible}
        footer={this.renderModalFooter()}
        onCancel={() => this.setState({ modalVisible: false })}
      >
        <Form>
          <Form.Item label="域名" {...formItemProps}
            help="域名不包含子域 如: google.com"
          >
            <Input placeholder="template.com" defaultValue={domain} />
          </Form.Item>
          <Form.Item label="子域" {...formItemProps}
            help="@表示空 *表示全部 用逗号隔开 如: @,*,www"
          >
            <Select
              mode="tags"
              placeholder="@,*"
              defaultValue={hosts ? hosts.map(val => val.host) : ['@', '*']}
              tokenSeparators={[',']}
            >
              <Select.Option key="@">@</Select.Option>
              <Select.Option key="*">*</Select.Option>
              <Select.Option key="www">www</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="注释" {...formItemProps}
            help="规则的注释,如: 谷歌首页"
          >
            <Input placeholder="/**/" />
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  // 渲染弹框页脚
  renderModalFooter() {
    const { modifyData } = this.state
    return (
      <div className="flex row modal-footer">
        <Button onClick={() => this.setState({ modalVisible: false })}>取消</Button>
        <span className="flex-1"></span>
        <Button icon="sync">{`${modifyData ? '保存' : '添加'}并同步`}</Button>
        <Button icon={modifyData ? 'save' : 'plus-circle'} type="primary" >{modifyData ? '保存' : '添加'}</Button>
      </div>
    )
  }

  show() {
    this.setState({ modalVisible: true })
  }

  hide() {
    this.setState({ modalVisible: false })
  }


} // class Main end