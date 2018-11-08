import React from 'react'

import { Router, AsyncImport } from '../../components'

export default {
  path: '/setting',
  component: () => <Router routes={[
    {
      // exact: true,
      path: '/setting/path',
      params: { config: 'path' },
      component: AsyncImport(() => import('./setting-path')),
    },
  ]} />,
}