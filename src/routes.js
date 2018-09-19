import React from 'react'
import AsyncImport from './components/AsyncImport'

const routes = [
  { path: '/', component: AsyncImport(() => import('./pages/page-1')), params: { test: 'ok' } },

  // {
  //   path: '/page1', component: props => props.children, children: [
  //     { path: '/', component: () => <div>page1/home</div> },
  //     { path: '/2', component: () => <div>page1/page3</div> },
  //   ]
  // },
  { path: '/page2', component: () => <div>page2</div> },

]


module.exports = routes
