# video-comparison-player
[Electron](https://www.electronjs.org/docs/tutorial/quick-start)
[Vue](https://cn.vuejs.org/v2/guide/)
[ElementUI](https://element.eleme.cn/#/zh-CN)

## 环境设置
node & npm https://nodejs.org/en/download/

设置npm源
```bash
npm config set registry https://registry.npm.taobao.org
npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
```
### 设置
```bash
npm install
```
### 开发环境运行
```bash
#浏览器调试
npm serve
#客户端调试
npm run electron:serve
```
### 打包
```bash
npm run electron:build
```


## 参考
https://itnext.io/electron-application-with-vue-js-and-vuetify-f2a1f9c749b8 

https://element.eleme.cn/#/zh-CN/component/installation

https://github.com/SavageCore/node-ffprobe-installer#readme

ffprobe 安装问题  https://stackoverflow.com/questions/41292559/could-not-find-a-declaration-file-for-module-module-name-path-to-module-nam

进程间通信 https://juejin.cn/post/6844903873237221384 
