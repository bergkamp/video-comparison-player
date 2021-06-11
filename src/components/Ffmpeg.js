'use strict';
var os = require('os');
var path = require('path')

var platform = os.platform()
if (platform == "darwin") {
    platform = "mac";
} else if (platform == "win32") {
    platform = "win";
}

//ffprobe不支持mac m1
var arch = os.arch()
if (platform === 'mac' && arch !== 'x64') {
    console.error('Unsupported architecture.')
    process.exit(1)
}

//bin文件目录，开发环境是node_modules
const isDevelopment = process.env.NODE_ENV === 'development';
var baseDir = isDevelopment ? 'node_modules/' : __dirname.replace(/Resources\/electron\.asar$/, 'static');
//ffprobe
var ffprobePath = isDevelopment ?
    path.join(
        baseDir,
        'ffprobe-static-electron',
        'bin',
        platform,
        arch,
        platform === 'win' ? 'ffprobe.exe' : 'ffprobe'
    ) :
    path.join(
        baseDir,
        platform === 'win' ? 'ffprobe.exe' : 'ffprobe'
    );
console.log(ffprobePath);

//ffmpeg
var ffmpegPath = isDevelopment ?
    path.join(
        baseDir,
        'ffmpeg-static',
        platform === 'win' ? 'ffmpeg.exe' : 'ffmpeg'
    ) :
    path.join(
        baseDir,
        platform === 'win' ? 'ffmpeg.exe' : 'ffmpeg'
    );

module.exports.ffprobePath = ffprobePath;
module.exports.ffmpegPath = ffmpegPath;

//const electron = require("electron");
// var ffmpegStatic = electron.remote.require('ffmpeg-static');
// var ffprobeStatic = electron.remote.require('ffprobe-static-electron');

// //fluent-ffmpeg是针对ffmpeg命令的封装 https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#readme
// const fluentFfmpeg = require('fluent-ffmpeg');
// fluentFfmpeg.setFfmpegPath(ffmpegStatic);
// fluentFfmpeg.setFfprobePath(ffprobeStatic.path);

// var ffmpeg = {

// }
// const ffmpeg = {
//     //读取视频信息
//     probe: function(filePath){
//         var r;
//         fluentFfmpeg.ffprobe(filePath, function(err, metadata) {
//             console.log(metadata);
//             r = metadata;
//         });
//         console.log('====ffmpeg====',r);
//         //return r;
//     }
// }


// module.exports = ffmpeg;