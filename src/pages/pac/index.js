import React from 'react'

import { Router, AsyncImport } from '../../components'

export default {
  path: '/pac',
  component: () => <Router routes={[
    {
      exact: true,
      path: '/pac/',
      params: { config: 'home' },
      component: AsyncImport(() => import('./pac')),
    },
  ]} />,
}