import React from 'react'
import AsyncImport from './components/AsyncImport'

const routes = [
  { path: '/', component: AsyncImport(() => import('./pages/page-1')), params: { test: 'ok' } },

  { path: '/page2', component: () => <div>page2</div> },

]


module.exports = routes
