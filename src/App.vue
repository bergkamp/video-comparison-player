<template class="app">
  <div>
    <el-row>
      <el-col :span="8">
        <el-upload
          class="upload-demo"
          ref="upload"
          action=""
          :show-file-list="false"
          :file-list="fileList"
          :on-change="handleChange"
          :multiple="true"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary" icon="el-icon-document-add"
            >选取2个视频文件</el-button
          >
        </el-upload>
      </el-col>
      <el-col :span="8" type="flex" justify="center">
        <div style="text-align:center">
        <el-button-group>
          <el-button
            :disabled="disabledBtn"
            size="small"
            type="primary"
            icon="el-icon-refresh"
            @click="replay"
            >重播</el-button
          >
          <el-button
            :disabled="disabledBtn"
            size="small"
            type="primary"
            icon="el-icon-video-play"
            @click="play"
            >播放</el-button
          >
          <el-button
            :disabled="disabledBtn"
            size="small"
            type="primary"
            icon="el-icon-video-pause"
            @click="pause"
            >暂停</el-button
          >
        </el-button-group>
        </div>
      </el-col>
      <el-col :span="8" type="flex" justify="end">
        <div class="right">
          <el-radio-group v-model="overlapRadio" size="small" @change="overlap">
            <el-radio-button label="0" :disabled="disabledBtn">分离</el-radio-button>
            <el-radio-button label="1" :disabled="disabledBtn">重叠</el-radio-button>
          </el-radio-group>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div id="videoBox" ref="videoBox">
        <div ref="leftDiv" id="leftDiv" :style="{ width: playerWidth }">
          <video
            ref="leftPlayer"
            id="leftPlayer"
            class="video-player"
            controls="true"
            autoplay="false"
            preload="false"
          >
            <source src="" type="video/mp4" />
          </video>
        </div>
        <div class="img-comp-line" ref="overlapLine" v-show="overlapBtnShow">
          <div class="img-comp-slider" ref="overlapBtn"></div>
        </div>
        <div ref="rightDiv" id="rightDiv" :style="{ width: playerWidth }">
          <video
            ref="rightPlayer"
            id="rightPlayer"
            class="video-player"
            controls="true"
            autoplay="false"
            preload="false"
          >
            <source src="" type="video/mp4" />
          </video>
        </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="12">
        <div class="video-title">&nbsp;{{ leftTitle }}</div>
      </el-col>
      <el-col :span="12">
        <div class="video-title">&nbsp;{{ rightTitle }}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// https://www.w3schools.com/howto/howto_js_image_comparison.asp
export default {
  name: "App",
  data() {
    return {
      leftTitle: " ",
      rightTitle: " ",
      leftPlayer: null,
      rightPlayer: null,
      fileList: [],
      disabledBtn: true,
      overlapRadio: 0,
      playerWidth: "50%",
      clipPath: "clip-path:inset(0px 0px 0px 0px)",
      videoBox: null,
      overlapBtn: null,
      overlapLine: null,
      overlapBtnShow: false,
      overlapBtnClicked: false,

    };
  },
  components: {
    //Files
  },
  methods: {
    handleChange(file, fileList) {
      console.log(fileList);

      var count = 0;
      fileList.forEach((element) => {
        if (count > 1) return;
        var player;
        if (count == 0) {
          player = this.$refs.leftPlayer;
          this.leftTitle = element.name;
          this.leftPlayer = player;
        } else {
          player = this.$refs.rightPlayer;
          this.rightTitle = element.name;
          this.rightPlayer = player;
        }

        this.loadPlay(element, player);
        count++;
      });
      //播放按钮
      if (count >= 1) {
        this.replayBtn = false;
        this.playBtn = false;
        this.pauseBtn = false;
        this.disabledBtn = false;
        this.fileList = [];
      }
    },
    loadPlay(file, player) {
      var fileURL = URL.createObjectURL(file.raw);
      player.src = fileURL;
      player.play();
    },
    play() {
      this.leftPlayer.play();
      this.rightPlayer.play();
    },
    replay() {
      this.leftPlayer.currentTime = 0;
      this.rightPlayer.currentTime = 0;
      this.play();
    },
    pause() {
      this.leftPlayer.pause();
      this.rightPlayer.pause();
    },
    overlap() {
      console.log(this.overlapRadio);
      if (this.overlapRadio == 1) { //重叠
        this.playerWidth = "100%";
        this.leftPlayer.controls = false;
        this.rightPlayer.controls = false;
        this.leftPlayer.style.clipPath = "inset(0px 50% 0px 0px)";
        this.overlapBtnHandle(true);
      } else { //分离
        this.playerWidth = "50%";
        this.leftPlayer.controls = true;
        this.leftPlayer.style.clipPath = "inset(0px 0px 0px 0px)";
        this.rightPlayer.controls = true;
        this.overlapBtnHandle(false);
      }
    },
    overlapBtnHandle(show){
      if(this.videoBox == null){
        this.videoBox = this.$refs.videoBox;
      }
      if(this.overlapBtn == null){
        this.overlapBtn = this.$refs.overlapBtn
      }
      if(this.overlapLine == null){
        this.overlapLine = this.$refs.overlapLine
      }

      //close overlap button
      if(show == false){
        this.overlapBtnShow = false;
        return;
      }

      //open overlap button
      var videoBoxRect = this.videoBox.getBoundingClientRect();
      console.log(this.videoBoxRect);
      this.overlapLine.style.left = videoBoxRect.width/2 - 2 + "px";
      this.overlapBtnShow = true;

      this.overlapBtn.addEventListener("mousedown", this.overlapBtnReady);
      window.addEventListener("mouseup", this.overlapBtnFinish);
    },
    overlapBtnReady(e){
      e.preventDefault();//stop default action
      this.overlapBtnClicked = true;
      window.addEventListener("mousemove", this.overlapBtnMove);
    },
    overlapBtnFinish(){
      this.overlapBtnClicked = false;
    },
    overlapBtnMove(e){
      if(this.overlapBtnClicked == false) return;
      var pos;
      pos = this.getCursorPos(e);

      //限制移动边界
      if(pos<10) pos =10;
      var maxPos = this.videoBox.getBoundingClientRect().width-10;
      if(pos > maxPos) pos = maxPos; 
      
      this.overlapLine.style.left = pos + "px";
      pos = pos +1;
      this.leftPlayer.style.clipPath = "inset(0px 0px 0px " + pos  + "px)";
      /* If the slider is no longer clicked, exit this function: */
      //if (clicked == 0) return false;
    },
    getCursorPos(e) {
      var a, x = 0;
      e = e || window.event;
      /* Get the x positions of the image: */
      a = this.videoBox.getBoundingClientRect();
      /* Calculate the cursor's x coordinate, relative to the image: */
      x = e.pageX - a.left;
      /* Consider any page scrolling: */
      x = x - window.pageXOffset;
      return x;
    }
  },
};
</script>

<style>
.app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  background: black;
}
.el-row {
  margin-bottom: 10px;
  /* &:last-child {
      margin-bottom: 0;
    } */
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.right {
  float: right;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.video-player {
  width: 100%;
}
.video-title {
  width: 100%;
  margin-bottom: 5px;
  color: #CCC;
}
#leftDiv {
  width: 100%;
  float: left;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9;
  overflow: hidden;
}
#rightDiv {
  width: 100%;
  float: right;
}
#videoDiv {
  display: flex;
}
.img-comp-slider {
  position: absolute;
  cursor: ew-resize;
  width: 20px;
  height: 20px;
  background-color: #2196F3;
  opacity: 1;
  border-radius: 50%;
  right: -9px;
  top:10px;
}
.img-comp-line {
  width: 2px;
  height: 100%;
  position: absolute;
  background:#fff;
  z-index: 10;
  top: 0px;
  text-align: center;
}
</style>
