<template class="app">
    <div tabindex="1" ref="topDiv" @keydown="keyAlias($event)" style="outline:none">
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
                    <el-button
                        slot="trigger"
                        size="small"
                        type="primary"
                        icon="el-icon-document-add"
                        >选取视频文件</el-button
                    >
                </el-upload>
            </el-col>
            <el-col :span="8" type="flex" justify="center">
                <div style="text-align: center">
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
                            :icon="doublePlay.icon"
                            @click="play()"
                            >{{doublePlay.text}}</el-button
                        >
                    </el-button-group>
                </div>
            </el-col>
            <el-col :span="8" type="flex" justify="end">
                <div class="right">
                    <el-radio-group
                        v-model="overlapRadio"
                        size="small"
                        @change="overlap"
                    >
                        <el-radio-button label="0" :disabled="disabledBtn"
                            >分离</el-radio-button
                        >
                        <el-radio-button label="1" :disabled="disabledBtn"
                            >重叠</el-radio-button
                        >
                    </el-radio-group>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <div class="video-box" ref="videoBox">
                    <div
                        ref="leftDiv"
                        id="leftDiv"
                        :style="{ width: playerWidth }"
                    >
                        <video
                            ref="leftPlayer"
                            id="leftPlayer"
                            class="video-player"
                            controls="true"
                            autoplay="false"
                            preload="false"
                        >
                            <source src="" type="" />
                        </video>
                    </div>
                    <div
                        class="img-comp-line"
                        ref="overlapLine"
                        v-show="overlapBtnShow"
                    >
                        <div class="img-comp-slider" ref="overlapBtn"></div>
                    </div>
                    <div
                        ref="rightDiv"
                        id="rightDiv"
                        :style="{ width: playerWidth }"
                    >
                        <video
                            ref="rightPlayer"
                            id="rightPlayer"
                            class="video-player"
                            controls="true"
                            autoplay="false"
                            preload="false"
                        >
                            <source src="" type="" />
                        </video>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="5">
            <el-col :span="12">
                <div class="video-title small">&nbsp;{{ leftTitle }}</div>
            </el-col>
            <el-col :span="12">
                <div class="video-title small">&nbsp;{{ rightTitle }}</div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
// https://www.w3schools.com/howto/howto_js_image_comparison.asp
//const ffprobe = require("@ffprobe-installer/ffprobe");
//const os = require('os');
//import Ffprobe from "./components/Ffprobe";
//const ffprobe = require('electron').remote.getGlobal('ffprobe');
export default {
    name: "App",
    data() {
        return {
            leftTitle: " ",
            rightTitle: " ",
            leftPlayer: null,
            rightPlayer: null,
            currPlayer: "left", //left|right
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
            doublePlay:{
                status:false,//true表示播放中，false表示暂停中
                text:'播放',
                icon:'el-icon-video-play'
            }
        };
    },
    components: {
        //Files
    },
    mounted() {
        this.leftPlayer = this.$refs.leftPlayer;
        this.rightPlayer = this.$refs.rightPlayer;
        
        // window.addEventListener("keydown", e => {
        //     this.moveLineByKey(e);
        // });
        //console.log(os.platform);
        //console.log(Ffprobe);
        //console.log(ffprobe.path, ffprobe.version);
    },
    methods: {
        handleChange(file, fileList) {
            console.log("===", fileList.length);

            //如果一次选择两个视频，则leftplayer开始loading
            if (fileList.length == 2) {
                this.currPlayer = "left";
            }
            let count = 0;
            fileList.forEach((element) => {
                if (count > 1) return; //最多一次处理2个文件
                console.log(element);
                if (this.currPlayer == "left") {
                    this.leftTitle = element.name;
                    this.loadPlay(element, this.leftPlayer);
                    this.currPlayer = "right";
                } else {
                    this.rightTitle = element.name;
                    this.loadPlay(element, this.rightPlayer);
                    this.currPlayer = "left";
                }
                console.log(this.currPlayer, element.name);
                count++;
            });
            //播放按钮
            if (this.leftPlayer.src != "" && this.rightPlayer.src != "") {
                this.replayBtn = false;
                this.disabledBtn = false;
            }
            this.fileList = [];
        },
        loadPlay(file, player) {
            var fileURL = URL.createObjectURL(file.raw);
            player.src = fileURL;
            player.pause();
            // var playPromise = player.play();

            // //解决这个报错https://www.jackpu.com/jie-jue-xin-ban-ben-chrome-ti-shi-domexception-the-play-request-was-interrupted/
            // if (playPromise !== undefined) {
            //     playPromise
            //         .then(() => {
            //             // 这个时候可以安全的暂停
            //             //player.pause();
            //         })
            //         .catch(() => {});
            // }
        },
        play(status) {
            console.log(this.doublePlay)
            let nowStatus = this.doublePlay.status;
            
            if(typeof(status) !== 'undefined'){
                nowStatus = status;
                console.log(status);
            }
            
            if(nowStatus == false){
                this.doublePlay.status = true;
                this.doublePlay.text = "暂停";
                this.doublePlay.icon = "el-icon-video-pause";
                
                this.leftPlayer.play();
                this.rightPlayer.play();
            }else{
                this.doublePlay.status = false;
                this.doublePlay.text = "播放";
                this.doublePlay.icon = "el-icon-video-play";
                
                this.leftPlayer.pause();
                this.rightPlayer.pause();
            }
            console.log(this.doublePlay)

            
        },
        replay() {
            this.play(false)
        },
        pause() {
            
        },
        overlap() {
            console.log(this.overlapRadio);
            if (this.overlapRadio == 1) {
                //重叠
                this.playerWidth = "100%";
                this.leftPlayer.controls = false;
                this.rightPlayer.controls = false;
                this.leftPlayer.style.clipPath = "inset(0px 50% 0px 0px)";
                this.overlapBtnHandle(true);
            } else {
                //分离
                this.playerWidth = "50%";
                this.leftPlayer.controls = true;
                this.leftPlayer.style.clipPath = "inset(0px 0px 0px 0px)";
                this.rightPlayer.controls = true;
                this.overlapBtnHandle(false);
            }
            //清除掉按钮组的focus，否则方向键会变成重叠/分离按钮的切换
            this.$refs.topDiv.focus();
        },
        overlapBtnHandle(show) {
            if (this.videoBox == null) {
                this.videoBox = this.$refs.videoBox;
            }
            if (this.overlapBtn == null) {
                this.overlapBtn = this.$refs.overlapBtn;
            }
            if (this.overlapLine == null) {
                this.overlapLine = this.$refs.overlapLine;
            }

            //close overlap button
            if (show == false) {
                this.overlapBtnShow = false;
                return;
            }

            //open overlap button
            var videoBoxRect = this.videoBox.getBoundingClientRect();
            console.log(this.videoBoxRect);
            this.overlapLine.style.left = videoBoxRect.width / 2 - 2 + "px";
            this.overlapBtnShow = true;

            this.overlapBtn.addEventListener("mousedown", this.overlapBtnReady);
            window.addEventListener("mouseup", this.overlapBtnFinish);
        },
        overlapBtnReady(e) {
            e.preventDefault(); //stop default action
            this.overlapBtnClicked = true;
            window.addEventListener("mousemove", this.overlapBtnMove);
        },
        overlapBtnFinish() {
            this.overlapBtnClicked = false;
        },
        overlapBtnMove(e) {
            if (this.overlapBtnClicked == false) return;
            var pos;
            pos = this.getCursorPos(e);
            this.overlapMove(pos);
        },
        //pos=center时回中，否则按照参数移动
        overlapMove(pos){

            var videoBoxWidth =this.videoBox.getBoundingClientRect().width;

            //回中
            if(pos == 'center'){
                pos = videoBoxWidth/2 -2;
            }

            //限制移动边界
            if (pos < 10) pos = 10;
            var maxPos = videoBoxWidth - 10;
            if (pos > maxPos) pos = maxPos;

            this.overlapLine.style.left = pos + "px";
            pos = pos + 1;
            pos = videoBoxWidth - pos;
            this.leftPlayer.style.clipPath = "inset(0px " + pos + "px 0px 0px )";
        },
        getCursorPos(e) {
            var a,
                x = 0;
            e = e || window.event;
            /* Get the x positions of the image: */
            a = this.videoBox.getBoundingClientRect();
            /* Calculate the cursor's x coordinate, relative to the image: */
            x = e.pageX - a.left;
            /* Consider any page scrolling: */
            x = x - window.pageXOffset;
            return x;
        },
        
        //键盘快捷方式
        keyAlias(e){
            this.$refs.topDiv.focus();
            if(this.disabledBtn == true) return;
            
            console.log(e);
            //一次移动的距离，按住shift加速一倍
            let movePos = 20;
            if(e.shiftKey==true){
                movePos = movePos*4;
            }

            if(e.key == 'ArrowLeft'){
                if(this.overlapBtnShow == false) return;
                let pos = parseInt(this.overlapLine.style.left);
                console.log(pos,e.shiftKey);
                this.overlapMove(pos-movePos);
            }

            if(e.key == 'ArrowRight'){
                if(this.overlapBtnShow == false) return;
                let pos = parseInt(this.overlapLine.style.left);
                this.overlapMove(pos+movePos);
            }

            if(e.key == 'ArrowUp'){//回中
                if(this.overlapBtnShow == false) return;
                this.overlapMove('center');
            }

            if(e.code == 'Space'){//播放暂停
                this.play();
            }
        }
    },
};
</script>

<style>

@media (prefers-color-scheme: dark) {
  body{ background:  #333;}
}
@media (prefers-color-scheme: light) {
  body{ background: white;}
}
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
    margin-bottom: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    color: #ccc;
}
#leftDiv {
    width: 100%;
    float: left;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 9;
    overflow: hidden;
    object-fit: contain;
}
#rightDiv {
    width: 100%;
    float: right;
    object-fit: contain;
}
#videoDiv {
    display: flex;
}
.img-comp-slider {
    position: absolute;
    cursor: ew-resize;
    width: 20px;
    height: 20px;
    background-color: #2196f3;
    opacity: 1;
    border-radius: 50%;
    right: -9px;
    top: 10px;
}
.img-comp-line {
    width: 2px;
    height: 100%;
    position: absolute;
    background: #fff;
    z-index: 10;
    top: 0px;
    text-align: center;
}
video {
    object-fit: contain;
}
.video-box {
    /* width:800px;
  height:600px; */
    object-fit: contain;
}
.outline-none{
    outline:none;
}
</style>
