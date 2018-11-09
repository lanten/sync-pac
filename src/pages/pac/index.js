import React from 'react'

import { Router, AsyncImport } from '../../components'

export default {
  path: '/pac',
  component: () => <Router routes={[
    {
      exact: true,
      path: '/pac/',
      params: { key: 'pac' },
      component: AsyncImport(() => import('./pac')),
    },
  ]} />,
}