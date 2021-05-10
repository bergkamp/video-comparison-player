# video-comparison-player

## 环境设置
electron https://www.electronjs.org/docs/tutorial/quick-start

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
