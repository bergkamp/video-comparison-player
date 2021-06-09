# Video Comparison Player 视频对比播放器
![video-comparison](https://user-images.githubusercontent.com/36283/121299328-d3d82f00-c927-11eb-9ff8-7009ee6f566e.gif)

[下载最新版](https://github.com/bergkamp/video-comparison-player/releases/tag/v0.2.1)

功能说明
* 支持windows与mac
* 可以分开或一次性选择两个视频
* 支持暗黑模式
* 支持快捷键
  * `左右方向`控制分割线
  * `上方向`控制方向键回中
  * `空格`控制播放暂停

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

https://pietropassarelli.com/ffmpeg-electron.html

ffprobe 安装问题  https://stackoverflow.com/questions/41292559/could-not-find-a-declaration-file-for-module-module-name-path-to-module-nam

进程间通信 https://juejin.cn/post/6844903873237221384 

定制关于面板 https://stackoverflow.com/questions/54170269/electron-and-macos-how-to-customize-the-about-app-display-panel-that-pops-u