var autoprefixer = require('autoprefixer')

module.exports = {
  plugins: [
    autoprefixer({
      overrideBrowserslist: [
        'Android >= 4.0',
        'iOS >= 6',
        'last 5 QQAndroid versions',
        'last 5 UCAndroid versions'
      ],
      cascade: true
    }),
    require("postcss-px-to-viewport")({
      unitToConvert: 'px',
      viewportWidth: 1875,
      unitPrecision: 5,
      propList: ['*'],
      viewportUnit: 'rem',
      fontViewportUnit: 'rem',
      selectorBlackList: [],
      minPixelValue: 1,
      mediaQuery: false,
      replace: true,
      include: 'src/**',
    }),
    require("postcss-px-to-viewport")({
      unitToConvert: 'wpx',
      viewportWidth: 750,
      unitPrecision: 5,
      propList: ['*'],
      viewportUnit: 'vw',
      fontViewportUnit: 'vw',
      selectorBlackList: [],
      minPixelValue: 1,
      mediaQuery: false,
      replace: true,
      include: 'src/**',
    })
  ]
};
