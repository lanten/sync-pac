import React from 'react'
import reactDom from 'react-dom'

import App from './App'

global.$root = document.getElementById('root')

// 屏蔽默认拖放事件
global.$root.ondragover = () => false
global.$root.ondragleave = global.$root.ondragend = () => false
global.$root.ondrop = () => false

global.$root.className = process.platform === 'darwin' ? 'macos' : 'windows'

reactDom.render(<App />, global.$root)
