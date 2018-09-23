import React from 'react'
import reactDom from 'react-dom'
import { remote } from 'electron';

import App from './App'


reactDom.render(<App />, document.getElementById('root'))


// const route = remote.getGlobal('route')

// console.log(route)