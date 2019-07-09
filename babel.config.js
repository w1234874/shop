const productPlugin = [] 
//如果运行环境是production时,给这个数组配置transform-remove-console
// 如果运行环境不是,则不执行
if(process.env.NODE_ENV ==='production'){
  productPlugin.push("transform-remove-console")
}

module.exports = {
  "presets": [
    "@vue/app"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    ...productPlugin,
  //  'syntax-dynamic-import'
  ]
}