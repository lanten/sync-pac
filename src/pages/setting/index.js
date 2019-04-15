import React from 'react'

import { Router, AsyncImport } from '../../components'

export default {
  path: '/setting',
  component: () => <Router routes={[
    {
      // exact: true,
      path: '/setting',
      params: { key: 'setting' },
      component: AsyncImport(() => import('./setting')),
    },
  ]} />,
}