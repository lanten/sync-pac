import React from 'react'
import { Menu, Icon } from 'antd'

import './SiderMenu.less'

export default class SiderMenu extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Menu
        className="sider-menu"
        mode="inline"
      >
          <Menu.Item key="1">PAC 管理</Menu.Item>
          <Menu.Item key="2">Option 2</Menu.Item>
          <Menu.Item key="3">Option 3</Menu.Item>

        {/* <Menu.SubMenu title="okkk1">
          <Menu.Item key="1">Option 1</Menu.Item>
        </Menu.SubMenu> */}
      </Menu>
    )
  }

} // class SiderMenu end