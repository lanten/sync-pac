import React from 'react'

import { Router, AsyncImport } from '../../components'

export default {
  path: '/about',
  component: () => <Router routes={[
    {
      exact: true,
      path: '/about/',
      params: { config: 'home' },
      component: AsyncImport(() => import('./about')),
    },
  ]} />,
}