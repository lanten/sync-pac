import React from 'react'

import { Router, AsyncImport } from '../../components'

export default {
  path: '/setting',
  component: () => <Router routes={[
    {
      exact: true,
      path: '/setting/',
      params: { config: 'home' },
      component: AsyncImport(() => import('./setting')),
    },
  ]} />,
}