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
                        >选取视频或图片</el-button
                    >
                </el-upload>
            </el-col>
            <el-col :span="8" type="flex" justify="center">
                <div style="text-align: center">
                    <el-button-group>
                        <el-button
                            :disabled="playBtnDisabled"
                            size="small"
                            type="primary"
                            icon="el-icon-refresh"
                            @click="replay"
                            >重播</el-button
                        >
                        <el-button
                            :disabled="playBtnDisabled"
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
                        <el-radio-button label="0" :disabled="overlapBtnDisabled"
                            >分离</el-radio-button
                        >
                        <el-radio-button label="1" :disabled="overlapBtnDisabled"
                            >重叠</el-radio-button
                        >
                    </el-radio-group>
                    <el-button style="margin-left:8px;" type="info" size="small" icon="el-icon-info" @click="help()"></el-button>
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
                        v-show="leftView.isVideo===true"
                            ref="leftPlayer"
                            class="video-player"
                            controls="true"
                            autoplay="false"
                            preload="false"
                        >
                            <source src="" type="" />
                        </video>
                         <img
                         v-show="leftView.isVideo===false"
                         ref="leftImage"
                         class="image-player"
                         src=""/>
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
                            v-show="rightView.isVideo===true"
                            ref="rightPlayer"
                            class="video-player"
                            controls="true"
                            autoplay="false"
                            preload="false"
                        >
                            <source src="" type="" />
                        </video>
                        <img
                         v-show="rightView.isVideo===false"
                         ref="rightImage"
                         class="image-player"
                         src="" />
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="5">
            <el-col :span="12">
                <div class="video-title small">&nbsp;{{ leftContent.title }}</div>
            </el-col>
            <el-col :span="12">
                <div class="video-title small">&nbsp;{{ rightContent.title }}</div>
            </el-col>
        </el-row>
        <el-row :gutter="5">
            <el-col :span="12">
                    
                <div class="video-title small" v-show="leftContent.show">
                    <vue-json-pretty :data="leftContent.probe" :show-length="true" :deep="0" > </vue-json-pretty>
                </div>
            </el-col>
            <el-col :span="12">
                    <div class="video-title small" v-show="rightContent.show">
                        <vue-json-pretty :data="rightContent.probe" :show-length="true" :deep="0" > </vue-json-pretty>
                    </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
//fluent-ffmpeg是针对ffmpeg命令的封装 https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#readme
const fluentFfmpeg = require('fluent-ffmpeg');
const shell = require('electron').shell;

import ffmpeg from "./components/Ffmpeg";
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

export default {
    name: "App",
    data() {
        return {
            leftContent: {
                show:false,
                title:" ",
                probe:" "
            },
            rightContent: {
                show:false,
                title:" ",
                probe:" "
            },
            leftView:{
                isVideo: true,//video true,image false
                player:null,
            },
            rightView:{
                isVideo: true,
                player:null,
            },
            currPlayer: "left", //left|right
            fileList: [],
            playBtnDisabled: true,
            overlapBtnDisabled: true,
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
            },
        };
    },
    components: {
        VueJsonPretty
    },
    mounted() {
        this.leftView.player = this.$refs.leftPlayer;
        this.rightView.player = this.$refs.rightPlayer;

        //初始化二进制文件的路经
        fluentFfmpeg.setFfprobePath(ffmpeg.ffprobePath);
    },
    methods: {
        handleChange(file, fileList) {
            console.log("===file===", file);

            //如果一次选择两个视频，则leftplayer开始loading
            if (fileList.length == 2) {
                this.currPlayer = "left";
            }
            let count = 0;
            fileList.forEach((element) => {
                if (count > 1) return; //最多一次处理2个文件
                console.log(element);
                
                //类型检查,如image/jpeg
                let fileTypes = element.raw.type.split('/');
                let isVideo = fileTypes[0] == 'video' ? true : false;
                console.log(fileTypes);
                
                var that = this;
                if (this.currPlayer == "left") {
                    this.leftContent.show = true;
                    this.leftContent.title = element.name;
                    
                    fluentFfmpeg.ffprobe(element.raw.path, function(err, metadata) {
                        console.log("==metadata==",metadata);
                        //console.log("leftprobe",this.leftProbe);
                        that.leftContent.probe = metadata
                    });
                    //this.leftProbe = fluentFfmpeg.ffprobe(element.raw.path);
                    this.leftView.isVideo = isVideo;

                    if(isVideo){
                        this.leftView.player = this.$refs.leftPlayer; 
                    }else{
                        this.leftView.player = this.$refs.leftImage;
                    }
                                       
                    this.loadPlay(element, this.leftView.player);
                    this.currPlayer = "right";
                } else {
                    this.rightContent.show = true;
                    this.rightContent.title = element.name;
                    fluentFfmpeg.ffprobe(element.raw.path, function(err, metadata) {
                        that.rightContent.probe = metadata;
                    });
                    this.rightView.isVideo = isVideo;
                    if(isVideo){
                        this.rightView.player = this.$refs.rightPlayer;
                    }else{
                        this.rightView.player = this.$refs.rightImage;
                    }
                    
                    this.loadPlay(element, this.rightView.player);
                    this.currPlayer = "left";
                }
                console.log(this.currPlayer, element.name);
                count++;
            });
            
            //分离按钮
            if (this.leftView.player.src != "" && this.rightView.player.src != "") {
                this.overlapBtnDisabled = false;
            }

            //播放按钮
            if (this.leftView.isVideo && this.rightView.isVideo){
                this.playBtnDisabled = false;
            }
            this.fileList = [];
        },
        loadPlay(file, player) {
            var fileURL = URL.createObjectURL(file.raw);
            console.log("==fileUrl==",fileURL);
            player.src = fileURL;
            console.log("==player===",player);
            if(player.isVideo){
                player.pause();
            }
            
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
                
                this.leftView.player.play();
                this.rightView.player.play();
            }else{
                this.doublePlay.status = false;
                this.doublePlay.text = "播放";
                this.doublePlay.icon = "el-icon-video-play";
                
                this.leftView.player.pause();
                this.rightView.player.pause();
            }
            console.log(this.doublePlay)

            
        },
        replay() {
            this.leftView.player.currentTime = 0;
            this.rightView.player.currentTime = 0;
            this.play(false);
        },
        pause() {
            
        },
        overlap() {
            console.log(this.overlapRadio);
            if (this.overlapRadio == 1) {
                //重叠
                this.playerWidth = "100%";
                this.leftView.player.controls = false;
                this.rightView.player.controls = false;
                this.leftView.player.style.clipPath = "inset(0px 50% 0px 0px)";
                this.overlapBtnHandle(true);
            } else {
                //分离
                this.playerWidth = "50%";
                this.leftView.player.controls = true;
                this.leftView.player.style.clipPath = "inset(0px 0px 0px 0px)";
                this.rightView.player.controls = true;
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
            this.leftView.player.style.clipPath = "inset(0px " + pos + "px 0px 0px )";            
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
            e.preventDefault();
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
        },
        help(){
            shell.openExternal("https://github.com/bergkamp/video-comparison-player#readme");
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
.image-player{
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
    /* background: url(./assets/video.svg) center center no-repeat; */
}
#rightDiv {
    width: 100%;
    float: right;
    object-fit: contain;
    /* background: url(./assets/video.svg) center center no-repeat; */
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
    /* width:800px;*/
  /* height:600px;  */
    object-fit: contain;
}
.outline-none{
    outline:none;
}
</style>
