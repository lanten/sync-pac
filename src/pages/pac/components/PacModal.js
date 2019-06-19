import React from 'react'
import {
  Button, Modal, Form, Input, Select, message,
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

    this.hostsValue = []
    this.domainRef = React.createRef()
    this.memoRef = React.createRef()
  }


  render() {
    const { modalVisible } = this.state
    const { modifyData = {} } = this.props
    const { domain, hosts } = modifyData

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
            <Input ref={this.domainRef} placeholder="template.com" defaultValue={domain} />
          </Form.Item>
          <Form.Item label="子域" {...formItemProps}
            help="@表示空; *表示全部"
          >
            <Select
              mode="tags"
              placeholder="@,*"
              defaultValue={hosts ? hosts.map(val => val.host) : ['@', '*']}
              tokenSeparators={[',']}
              onChange={res => {
                this.hostsValue = res
              }}
            >
              <Select.Option key="@">@</Select.Option>
              <Select.Option key="*">*</Select.Option>
              <Select.Option key="www">www</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="描述" {...formItemProps}
            help="规则的注释,如: 谷歌首页"
          >
            <Input ref={this.memoRef} placeholder="随便什么描述 (可空)" />
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  // 渲染弹框页脚
  renderModalFooter() {
    const { modifyData: { domain: isModify } = {} } = this.props
    return (
      <div className="flex row modal-footer">
        <Button onClick={() => this.setState({ modalVisible: false })}>取消</Button>
        <span className="flex-1"></span>
        <Button onClick={e => this.confirm(isModify ? 'modify-sync' : 'add-sync', e)} icon="sync" >{`${isModify ? '保存' : '添加'}并同步`}</Button>
        <Button onClick={e => this.confirm(isModify ? 'modify' : 'add', e)} icon={isModify ? 'save' : 'plus-circle'} type="primary" >{isModify ? '保存' : '添加'}</Button>
      </div>
    )
  }

  confirm(type) {
    const { confirm, modifyData = {} } = this.props

    const { hosts: hostsDefault } = modifyData
    const domain = this.domainRef.current.input.value
    const memo = this.memoRef.current.input.value

    if (!domain) return message.error('请输入域名')

    console.log({ hostsValue: this.hostsValue })
    const hosts = this.hostsValue.map(val => {
      const newVal = { active: true, host: val }
      if (['add', 'add-sync'].includes(type)) return newVal
      const defaultIndex = hostsDefault.findIndex(v => v.host === val)
      return defaultIndex > -1 ? hostsDefault[defaultIndex] : newVal
    })

    if (!hosts.length) return message.error('至少添加一个子域')

    confirm(type, Object.assign(modifyData, { domain, memo, hosts }))
  }

  show() {
    const { modifyData: { hosts = [{ host: '@' }, { host: '*' }] } = {} } = this.props
    if (hosts) this.hostsValue = hosts.map(v => v.host)
    this.setState({ modalVisible: true })
  }

  hide() {
    this.setState({ modalVisible: false })
  }


} // class Main end