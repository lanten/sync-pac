
import React from 'react'
import { AsyncImport } from '../components'

import demo from './demo'
import pac from './pac'

const routes = [
  { path: '/', exact: true, component: AsyncImport(() => import('./home')), params: { test: 'ok' } },
  demo,
  pac,
]


module.exports = routes
