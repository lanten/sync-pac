import React from 'react'
import reactDom from 'react-dom'
import { ipcRenderer } from 'electron'

import App from './App'


reactDom.render(<App />, document.getElementById('root'))

// const route = remote.getGlobal('hashRoute')

ipcRenderer.on('router', (e, val) => {
  location.hash = val
})