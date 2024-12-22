
# 插件打包

> 一个HBuilderX的IDE插件打包扩展

## 使用方式

在项目根目录下，右键，点击 **IDE插件打包**，即可。

支持忽略打包文件列表，以下为默认配置：

```
# Git
.git/
.gitignore

# HBuilderX Ignore
.hbxignore

# Node Modules
node_modules/

# HBuilderX Package
*.zip
```

文件名为：`.hbxignore`

## 说明

打包后的zip文件名为项目根目录下的package.json文件中的id字段

