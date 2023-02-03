# Video Comparison Player
[EN](README.md)|中文

视频对比播放器，是为视频增强、视频修复开发者提供的对比播放桌面工具，从 [这里](https://github.com/bergkamp/video-comparison-player/releases/latest) 下载最新版Mac与Windows安装包

![v050](https://user-images.githubusercontent.com/36283/125411809-d9c2a380-e3f0-11eb-8b05-d59b7a0c8fbe.gif)

主要功能：
* 支持windows与mac（M1 & Intel）
* 支持两个视频或图片左右同步对比播放
* 支持同步控制视频播放进度
* 支持暗黑模式
* 支持快捷键
  * `左右方向`控制分割线
  * `上方向`控制方向键回中
  * `空格`控制播放暂停
* 支持ffprobe读取视频文件参数



## 环境设置
node & npm https://nodejs.org/en/download/

V1.0.0 node v16.15.0 npm 8.5.5

V0.5.0 node v14.16.0 npm 6.14.11

设置npm源
https://www.electronjs.org/zh/docs/latest/tutorial/installation#%E8%87%AA%E5%AE%9A%E4%B9%89%E9%95%9C%E5%83%8F%E5%92%8C%E7%BC%93%E5%AD%98

### 设置
```bash
npm install
```
### 开发环境运行
```bash
#客户端调试
npm run dev
```
### 打包
```bash
npm run build
```
