/**
 * jsdoc-vue 配置文件
 */
module.exports = {
  "tags": {
    "allowUnknownTags": true,
    // 指定所用词典
    "dictionaries": [
      "jsdoc"
    ]
  },
  // 查找文件的深度 需要用 -r 参数
  "recurseDepth": 10,
  "source": {
    "include": [
      // 需要编译的文件路径 使用时请替换
      "."
    ],
    "includePattern": ".+\\.(vue)$",
    "excludePattern": "(^|\\/|\\\\)_"
  },
  // 使用插件
  "plugins": [
    // 插件路径
    "./jsdoc-vue"
  ],
  "templates": {
    "cleverLinks": false,
    "monospaceLinks": true,
    "useLongnameInNav": false,
    "showInheritedInNav": true
  },
  "opts": {
    // 文档输出路径
    "destination": "./doc",
    "encoding": "utf8",
    "private": true,
    "recurse": true,
    // 使用模板 minami
    "template": "./node_modules/minami"
  }
}