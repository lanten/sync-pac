const fixedConfig = { resizable: false, maximizable: false, minimizable: false }

const urls = {
  home: '/',

  pac: { url: '/pac', config: { title: 'pac-sync', minWidth: 600, minHeight: 400 } },

  settingPath: {
    url: '/setting/path',
    config: {
      title: '路径设置',
      width: 560, height: 180,
      ...fixedConfig,
    }
  },

  about: {
    url: '/about',
    config: {
      title: ' 关于',
      width: 300, height: 240,
      ...fixedConfig,
    }
  },

}


module.exports = urls